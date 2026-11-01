import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../app.js';
import { createGihubAuthHandler } from '../api/gihub-auth.js';

const SECRET = 'test-only-session-secret-that-is-at-least-thirty-two-characters';
const ORIGIN = 'https://mygihub.com';
const NOW_SECONDS = 1_800_000_000;

function jwt(exp = NOW_SECONDS + 3600) {
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode({ exp, id: 7, email: 'doctor@example.com' })}.signature`;
}

async function withServer(fetchImpl, run, options = {}) {
  const auth = createGihubAuthHandler({
    fetchImpl,
    env: options.env || { GIHUB_SESSION_SECRET: SECRET, ENDOEVAL_AUTH_ORIGIN: 'https://endoeval.com' },
    now: options.now || (() => NOW_SECONDS * 1000),
    publicOrigin: ORIGIN,
  });
  const app = createApp(undefined, { gihubAuthHandler: auth });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

async function request(base, path, options = {}) {
  return fetch(`${base}${path}`, {
    ...options,
    headers: { Origin: ORIGIN, Host: 'mygihub.com', 'X-Forwarded-Proto': 'https', ...options.headers },
  });
}

test('auth body parsing is bounded and returns a cache-disabled generic error', async () => {
  let calls = 0;
  await withServer(async () => { calls += 1; throw new Error('unexpected'); }, async base => {
    for (const path of ['/api/gihub-auth/login', '/api/gihub-auth?action=login']) {
      const response = await request(base, path, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'doctor@example.com', password: 'x'.repeat(9000) }),
      });
      assert.equal(response.status, 413);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.deepEqual(await response.json(), { error: 'Invalid request' });
    }
    assert.equal(calls, 0);
  });
});

test('login hides forced-reset details but distinguishes upstream service failures', async () => {
  for (const [status, expected] of [[403, 401], [409, 401], [500, 502]]) {
    await withServer(async () => new Response(JSON.stringify({ error: 'sensitive upstream detail' }), { status }), async base => {
      const response = await request(base, '/api/gihub-auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }),
      });
      assert.equal(response.status, expected);
      assert.doesNotMatch(JSON.stringify(await response.json()), /sensitive|reset/i);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    });
  }
});

test('login rate limits repeated attempts before contacting EndoEval again', async () => {
  let calls = 0;
  await withServer(async () => { calls += 1; return new Response('{}', { status: 401 }); }, async base => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await request(base, '/api/gihub-auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `203.0.113.${attempt + 1}` },
        body: JSON.stringify({ email: 'doctor@example.com', password: 'wrong-password' }),
      });
      assert.equal(response.status, 401);
    }
    const limited = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.99' },
      body: JSON.stringify({ email: 'doctor@example.com', password: 'wrong-password' }),
    });
    assert.equal(limited.status, 429);
    assert.match(limited.headers.get('retry-after'), /^\d+$/);
    assert.equal(calls, 5);
  });
});

test('logout requires same origin and expires the GIHub cookie without calling upstream', async () => {
  let calls = 0;
  await withServer(async () => { calls += 1; throw new Error('unexpected'); }, async base => {
    const response = await request(base, '/api/gihub-auth/logout', { method: 'POST' });
    assert.equal(response.status, 204);
    assert.match(response.headers.get('set-cookie'), /^gihub_session=;/);
    assert.match(response.headers.get('set-cookie'), /Max-Age=0/i);
    assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(response.headers.get('set-cookie'), /Secure/i);
    assert.equal(calls, 0);
  });
});

test('profile PATCH sends only editable bounded fields and returns the validated account', async () => {
  const upstreamCalls = [];
  const account = {
    user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' },
    profile: { username: 'dr_example', displayName: 'Dr. Example', specialty: 'Hepatology', institution: 'City Hospital', bio: 'Clinician educator.' },
  };
  const upstream = async (url, options) => {
    upstreamCalls.push({ url, options });
    return url.endsWith('/login') ? Response.json({ token: jwt(), user: account.user }) : Response.json(account);
  };

  await withServer(upstream, async base => {
    const login = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: account.user.email, password: 'secret' }),
    });
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    const profile = { ...account.profile, email: 'attacker@example.com', role: 'admin' };
    const response = await request(base, '/api/gihub-auth/profile', {
      method: 'PATCH', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(profile),
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), account);
    assert.deepEqual(JSON.parse(upstreamCalls[1].options.body), account.profile);
    assert.equal(upstreamCalls[1].options.method, 'PATCH');
  });
});

test('profile PATCH rejects invalid handles locally and reports an occupied handle as conflict', async () => {
  const calls = [];
  await withServer(async (url, options) => {
    calls.push({ url, options });
    return url.endsWith('/login')
      ? Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
      : Response.json({ error: 'private upstream details' }, { status: 409 });
  }, async base => {
    const login = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }),
    });
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    for (const username of ['ab', 'Ahandle', '_handle', 'sp ace', 'a'.repeat(31)]) {
      const invalid = await request(base, '/api/gihub-auth/profile', {
        method: 'PATCH', headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName: '', specialty: '', institution: '', bio: '' }),
      });
      assert.equal(invalid.status, 400);
    }
    assert.equal(calls.length, 1);
    const conflict = await request(base, '/api/gihub-auth/profile', {
      method: 'PATCH', headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'claimed', displayName: '', specialty: '', institution: '', bio: '' }),
    });
    assert.equal(conflict.status, 409);
    assert.deepEqual(await conflict.json(), { error: 'Username is already taken' });
  });
});

test('every upstream auth request refuses redirects before credentials or tokens can be forwarded', async () => {
  const calls = [];
  await withServer(async (url, options) => {
    calls.push({ url, options });
    return url.endsWith('/login')
      ? Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
      : Response.json({ user: { id: 7, email: 'doctor@example.com', name: 'Doctor' }, profile: { username: '', displayName: '', specialty: '', institution: '', bio: '' } });
  }, async base => {
    const login = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }),
    });
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    await request(base, '/api/gihub-auth/me', { headers: { Cookie: cookie } });
    await request(base, '/api/gihub-auth/profile', {
      method: 'PATCH', headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '', displayName: '', specialty: '', institution: '', bio: '' }),
    });
    assert.deepEqual(calls.map(call => call.options.redirect), ['error', 'error', 'error']);
  });
});

test('me decrypts the session server-side and revalidates the account through EndoEval', async () => {
  const token = jwt();
  const upstreamCalls = [];
  const upstream = async (url, options) => {
    upstreamCalls.push({ url, options });
    if (url.endsWith('/login')) {
      return Response.json({ token, user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' } });
    }
    return Response.json({
      user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' },
      profile: { username: '', displayName: 'Dr. Example', specialty: 'Interventional GI', institution: 'City Hospital', bio: 'Clinician educator.' },
    });
  };

  await withServer(upstream, async base => {
    const login = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@example.com', password: 'test-password-not-a-real-secret' }),
    });
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    const response = await request(base, '/api/gihub-auth/me', { headers: { Cookie: cookie } });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' },
      profile: { username: '', displayName: 'Dr. Example', specialty: 'Interventional GI', institution: 'City Hospital', bio: 'Clinician educator.' },
    });
    assert.equal(upstreamCalls[1].url, 'https://endoeval.com/api/auth/gihub-profile');
    assert.equal(upstreamCalls[1].options.headers.Authorization, `Bearer ${token}`);
  });
});

test('login authenticates server-side and sets an encrypted secure session cookie', async () => {
  const upstreamCalls = [];
  const upstream = async (url, options) => {
    upstreamCalls.push({ url, options });
    return Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' } });
  };

  await withServer(upstream, async base => {
    const response = await request(base, '/api/gihub-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@example.com', password: 'test-password-not-a-real-secret' }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' } });
    const cookie = response.headers.get('set-cookie');
    assert.match(cookie, /^gihub_session=[^.;]+;/);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Secure/i);
    assert.match(cookie, /SameSite=Lax/i);
    assert.match(cookie, /Path=\//i);
    assert.match(cookie, /Max-Age=3600/);
    assert.ok(cookie.length < 4096);
    assert.doesNotMatch(cookie, new RegExp(jwt().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.equal(upstreamCalls.length, 1);
    assert.equal(upstreamCalls[0].url, 'https://endoeval.com/api/auth/login');
    assert.deepEqual(JSON.parse(upstreamCalls[0].options.body), { email: 'doctor@example.com', password: 'test-password-not-a-real-secret' });
  });
});

test('login refuses an EndoEval account that must complete password reset', async () => {
  let calls = 0;
  await withServer(async () => {
    calls += 1;
    return Response.json({
      token: jwt(),
      user: { id: 7, email: 'reset@example.com', name: 'Reset User', mustResetPassword: true },
    });
  }, async base => {
    const response = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reset@example.com', password: 'valid-temporary-password' }),
    });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(calls, 1);
  });
});

test('GIHub session cannot be replayed after its 12-hour lifetime, even with a longer EndoEval token', async () => {
  let nowMs = NOW_SECONDS * 1000;
  let calls = 0;
  await withServer(async url => {
    calls += 1;
    return url.endsWith('/login')
      ? Response.json({ token: jwt(NOW_SECONDS + 7 * 86400), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
      : Response.json({ user: { id: 7, email: 'doctor@example.com', name: 'Doctor' }, profile: { displayName: '', specialty: '', institution: '', bio: '' } });
  }, async base => {
    const login = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@example.com', password: 'valid-password' }),
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    nowMs += 13 * 3600 * 1000;
    const response = await request(base, '/api/gihub-auth/me', { headers: { Cookie: cookie } });
    assert.equal(response.status, 401);
    assert.equal(calls, 1);
  }, { now: () => nowMs });
});

test('state-changing auth requests reject cross-origin callers before upstream access', async () => {
  let calls = 0;
  await withServer(async () => { calls += 1; throw new Error('unexpected'); }, async base => {
    for (const [path, method, body] of [
      ['/api/gihub-auth/login', 'POST', { email: 'doctor@example.com', password: 'secret' }],
      ['/api/gihub-auth/logout', 'POST', undefined],
      ['/api/gihub-auth/profile', 'PATCH', { displayName: '', specialty: '', institution: '', bio: '' }],
    ]) {
      const response = await fetch(`${base}${path}`, {
        method,
        headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' },
        body: body && JSON.stringify(body),
      });
      assert.equal(response.status, 403);
    }
    assert.equal(calls, 0);
  });
});

test('auth fails closed for missing or weak secrets and malformed upstream responses', async () => {
  for (const env of [{}, { GIHUB_SESSION_SECRET: 'too-short', ENDOEVAL_AUTH_ORIGIN: 'http://endoeval.com' }]) {
    await withServer(async () => { throw new Error('unexpected'); }, async base => {
      const response = await request(base, '/api/gihub-auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }),
      });
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('set-cookie'), null);
    }, { env });
  }

  await withServer(async () => Response.json({ token: `${jwt(NOW_SECONDS + 3600)}${'x'.repeat(3000)}`, user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } }), async base => {
    const response = await request(base, '/api/gihub-auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }),
    });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('set-cookie'), null);
  });
});

test('password rotation cannot extend original GIHub session lifetime', async () => {
  let nowMs = NOW_SECONDS * 1000;
  await withServer(async url => Response.json({ token: url.endsWith('/login') ? jwt(NOW_SECONDS + 7 * 86400) : jwt(NOW_SECONDS + 6 * 86400), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } }), async base => {
    const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    nowMs += 11 * 3600 * 1000;
    const changed = await request(base, '/api/gihub-auth/change-password', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'old-password', newPassword: 'new-password' }) });
    assert.equal(changed.status, 200);
    assert.match(changed.headers.get('set-cookie'), /Max-Age=3600;/);
    nowMs += 2 * 3600 * 1000;
    const me = await request(base, '/api/gihub-auth/me', { headers: { Cookie: changed.headers.get('set-cookie').split(';', 1)[0] } });
    assert.equal(me.status, 401);
  }, { now: () => nowMs });
});

test('change password rejects cross-origin, absent cookie and invalid fields without upstream access', async () => {
  let calls = 0;
  await withServer(async () => {
    calls += 1;
    return Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } });
  }, async base => {
    const cookie = (await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }) })).headers.get('set-cookie').split(';', 1)[0];
    for (const [headers, body, status] of [
      [{ Origin: 'https://evil.example', Cookie: cookie }, { currentPassword: 'old', newPassword: 'new-secret' }, 403],
      [{}, { currentPassword: 'old', newPassword: 'new-secret' }, 401],
      [{ Cookie: 'gihub_session=invalid' }, { currentPassword: 'old', newPassword: 'new-secret' }, 401],
      [{ Cookie: cookie }, { currentPassword: '', newPassword: 'new-secret' }, 400],
      [{ Cookie: cookie }, { currentPassword: 'old', newPassword: 'short' }, 400],
      [{ Cookie: cookie }, { currentPassword: 'x'.repeat(1025), newPassword: 'new-secret' }, 400],
      [{ Cookie: cookie }, { currentPassword: 'old', newPassword: 'x'.repeat(1025) }, 400],
    ]) {
      const response = await request(base, '/api/gihub-auth/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
      });
      assert.equal(response.status, status);
      assert.equal(response.headers.get('set-cookie'), null);
    }
    assert.equal(calls, 1);
  });
});

test('change password handles malformed success and upstream transport failure without replacing cookie', async () => {
  for (const failure of ['json', 'network', 'same-token', 'expired']) {
    let calls = 0;
    await withServer(async url => {
      calls += 1;
      if (url.endsWith('/login')) return Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } });
      if (failure === 'network') throw new Error('connection failed');
      if (failure === 'json') return new Response('not json', { status: 200 });
      return Response.json({ token: failure === 'same-token' ? jwt() : jwt(NOW_SECONDS - 1), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } });
    }, async base => {
      const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
      const response = await request(base, '/api/gihub-auth/change-password', { method: 'POST', headers: { Cookie: login.headers.get('set-cookie').split(';', 1)[0], 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'old-password', newPassword: 'new-password' }) });
      assert.equal(response.status, 502, failure);
      assert.equal(response.headers.get('set-cookie'), null);
      assert.equal(calls, 2);
    });
  }
});

test('wrong current password keeps cookie and maps upstream 400/401/403 without leaking details', async () => {
  for (const [upstreamStatus, status] of [[400, 400], [401, 401], [403, 403], [500, 502]]) {
    await withServer(async url => url.endsWith('/login')
      ? Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
      : Response.json({ error: 'sensitive upstream detail' }, { status: upstreamStatus }), async base => {
      const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
      const response = await request(base, '/api/gihub-auth/change-password', { method: 'POST', headers: { Cookie: login.headers.get('set-cookie').split(';', 1)[0], 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'wrong-password', newPassword: 'new-password' }) });
      assert.equal(response.status, status);
      assert.equal(response.headers.get('set-cookie'), null);
      assert.doesNotMatch(JSON.stringify(await response.json()), /sensitive|upstream detail/);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    });
  }
});

test('change password rejects replacement JWT claims for a different user', async () => {
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const wrongToken = `${encode({ alg: 'HS256' })}.${encode({ exp: NOW_SECONDS + 7200, id: 8, email: 'other@example.com' })}.signature`;
  await withServer(async url => url.endsWith('/login')
    ? Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
    : Response.json({ token: wrongToken, user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } }), async base => {
    const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
    const response = await request(base, '/api/gihub-auth/change-password', { method: 'POST', headers: { Cookie: login.headers.get('set-cookie').split(';', 1)[0], 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'old-password', newPassword: 'new-password' }) });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('set-cookie'), null);
  });
});

test('change password rejects malformed replacement JWT without replacing cookie', async () => {
  await withServer(async url => url.endsWith('/login')
    ? Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
    : Response.json({ token: `${jwt(NOW_SECONDS + 7200).split('.').slice(0, 2).join('.')}.`, user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } }), async base => {
    const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
    const response = await request(base, '/api/gihub-auth/change-password', { method: 'POST', headers: { Cookie: login.headers.get('set-cookie').split(';', 1)[0], 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'old-password', newPassword: 'new-password' }) });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('set-cookie'), null);
  });
});

test('change password rejects replacement token for a different account without replacing cookie', async () => {
  await withServer(async url => url.endsWith('/login')
    ? Response.json({ token: jwt(), user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } })
    : Response.json({ token: jwt(NOW_SECONDS + 7200), user: { id: 8, email: 'other@example.com', name: 'Other' } }), async base => {
    const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
    const response = await request(base, '/api/gihub-auth/change-password', { method: 'POST', headers: { Cookie: login.headers.get('set-cookie').split(';', 1)[0], 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'old-password', newPassword: 'new-password' }) });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('set-cookie'), null);
  });
});

test('change password rotates encrypted cookie using EndoEval replacement token', async () => {
  const oldToken = jwt(NOW_SECONDS + 3600);
  const newToken = jwt(NOW_SECONDS + 7200);
  const calls = [];
  await withServer(async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/login')) return Response.json({ token: oldToken, user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } });
    if (url.endsWith('/change-password')) return Response.json({ token: newToken, user: { id: 7, email: 'doctor@example.com', name: 'Doctor' } });
    return Response.json({ user: { id: 7, email: 'doctor@example.com', name: 'Doctor' }, profile: { username: '', displayName: '', specialty: '', institution: '', bio: '' } });
  }, async base => {
    const login = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'old-password' }) });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';', 1)[0];
    const changed = await request(base, '/api/gihub-auth/change-password', {
      method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'old-password', newPassword: 'new-password' }),
    });
    assert.equal(changed.status, 200);
    assert.deepEqual(await changed.json(), { message: 'Password changed' });
    const rotated = changed.headers.get('set-cookie');
    assert.match(rotated, /HttpOnly; Secure; SameSite=Lax/);
    assert.notEqual(rotated.split(';', 1)[0], cookie);
    assert.doesNotMatch(rotated, /new-password|old-password|signature/);
    assert.equal(calls[1].url, 'https://endoeval.com/api/auth/change-password');
    assert.equal(calls[1].options.headers.Authorization, `Bearer ${oldToken}`);
    assert.deepEqual(JSON.parse(calls[1].options.body), { currentPassword: 'old-password', password: 'new-password' });
    assert.equal(calls[1].options.redirect, 'error');
    assert.ok(calls[1].options.signal instanceof AbortSignal);
    const me = await request(base, '/api/gihub-auth/me', { headers: { Cookie: rotated.split(';', 1)[0] } });
    assert.equal(me.status, 200);
    assert.equal(calls[2].options.headers.Authorization, `Bearer ${newToken}`);
  });
});
