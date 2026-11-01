import crypto from 'node:crypto';

const COOKIE_NAME = 'gihub_session';
const MAX_SESSION_SECONDS = 12 * 60 * 60;
const DEFAULT_ENDOEVAL_ORIGIN = 'https://endoeval.com';

function send(res, status, body) {
  res.status(status).json(body);
}

function validSecret(value) {
  return typeof value === 'string' && Buffer.byteLength(value, 'utf8') >= 32;
}

function authOrigin(value = DEFAULT_ENDOEVAL_ORIGIN) {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('ENDOEVAL_AUTH_ORIGIN must be an HTTPS origin');
  }
  return parsed.origin;
}

function sessionKey(secret) {
  return crypto.createHash('sha256').update('gihub-session-v1\0').update(secret).digest();
}

function encryptSession(payload, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

function decryptSession(value, key) {
  try {
    const packed = Buffer.from(value, 'base64url');
    if (packed.length < 29 || packed.length > 12_000) return null;
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, packed.subarray(0, 12));
    decipher.setAuthTag(packed.subarray(12, 28));
    const clear = Buffer.concat([decipher.update(packed.subarray(28)), decipher.final()]);
    return JSON.parse(clear.toString('utf8'));
  } catch {
    return null;
  }
}

function cookieValue(req, name) {
  const cookies = String(req.headers.cookie || '').split(';');
  for (const cookie of cookies) {
    const [key, ...parts] = cookie.trim().split('=');
    if (key === name) return parts.join('=');
  }
  return null;
}

function tokenExpiry(token) {
  // Keep the encrypted cookie comfortably below common 4 KiB per-cookie limits.
  if (typeof token !== 'string' || token.length > 2600) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || parts.some(part => !part || !/^[A-Za-z0-9_-]+$/.test(part))) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return Number.isSafeInteger(payload.exp) ? payload.exp : null;
  } catch {
    return null;
  }
}

function validUser(value) {
  return value && (typeof value.id === 'string' || Number.isSafeInteger(value.id)) &&
    typeof value.email === 'string' && value.email.length <= 320 &&
    typeof value.name === 'string' && value.name.length <= 200;
}

function validProfile(value) {
  return value && typeof value.username === 'string' && (value.username === '' || /^[a-z][a-z0-9_]{2,29}$/.test(value.username)) &&
    typeof value.displayName === 'string' && value.displayName.length <= 200 &&
    typeof value.specialty === 'string' && value.specialty.length <= 200 &&
    typeof value.institution === 'string' && value.institution.length <= 300 &&
    typeof value.bio === 'string' && value.bio.length <= 4000;
}

function publicAccount(data) {
  if (!validUser(data?.user) || !validProfile(data?.profile)) return null;
  return {
    user: { id: data.user.id, email: data.user.email, name: data.user.name },
    profile: {
      username: data.profile.username,
      displayName: data.profile.displayName,
      specialty: data.profile.specialty,
      institution: data.profile.institution,
      bio: data.profile.bio,
    },
  };
}

function sameOrigin(req, expected) {
  return req.headers.origin === expected;
}

export function createGihubAuthHandler({
  fetchImpl = globalThis.fetch,
  env = process.env,
  now = Date.now,
  publicOrigin = env.GIHUB_PUBLIC_ORIGIN || 'https://mygihub.com',
} = {}) {
  let origin;
  let acceptedOrigin;
  try {
    origin = authOrigin(env.ENDOEVAL_AUTH_ORIGIN);
    acceptedOrigin = authOrigin(publicOrigin);
  } catch {
    origin = null;
    acceptedOrigin = null;
  }
  const key = validSecret(env.GIHUB_SESSION_SECRET) ? sessionKey(env.GIHUB_SESSION_SECRET) : null;
  const loginAttempts = new Map();

  return async function gihubAuth(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    const action = req.params?.action || req.query?.action;
    if (!key || !origin || !acceptedOrigin) return send(res, 503, { error: 'Authentication is unavailable' });

    if (req.method === 'POST' && action === 'logout') {
      if (!sameOrigin(req, acceptedOrigin)) return send(res, 403, { error: 'Request origin not allowed' });
      res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`);
      return res.status(204).end();
    }

    if (req.method === 'POST' && action === 'change-password') {
      if (!sameOrigin(req, acceptedOrigin)) return send(res, 403, { error: 'Request origin not allowed' });
      const session = decryptSession(cookieValue(req, COOKIE_NAME), key);
      const nowSeconds = Math.floor(now() / 1000);
      if (!session || typeof session.token !== 'string' || !Number.isSafeInteger(session.exp) ||
          session.exp <= nowSeconds || !Number.isSafeInteger(session.expiresAt) || session.expiresAt <= nowSeconds ||
          tokenExpiry(session.token) !== session.exp) return send(res, 401, { error: 'Authentication required' });
      const { currentPassword, newPassword } = req.body || {};
      if (typeof currentPassword !== 'string' || currentPassword.length < 1 || currentPassword.length > 1024 ||
          typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 1024) {
        return send(res, 400, { error: 'Current password and a new password of at least 6 characters are required' });
      }
      let upstream;
      try {
        upstream = await fetchImpl(`${origin}/api/auth/change-password`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword, password: newPassword }),
          redirect: 'error',
          signal: AbortSignal.timeout(10_000),
        });
      } catch {
        return send(res, 502, { error: 'Password service unavailable. Please try again.' });
      }
      if (upstream.status === 400) return send(res, 400, { error: 'Check your current password and use a new password of at least 6 characters.' });
      if (upstream.status === 401) return send(res, 401, { error: 'Current password is incorrect or your session has expired.' });
      if (upstream.status === 403) return send(res, 403, { error: 'Password change is not available for this account.' });
      if (!upstream.ok) return send(res, 502, { error: 'Password service unavailable. Please try again.' });
      let data;
      try { data = await upstream.json(); } catch { return send(res, 502, { error: 'Password service unavailable. Please try again.' }); }
      const exp = tokenExpiry(data?.token);
      let tokenMatchesAccount = false;
      if (exp) {
        try {
          const [header, payload] = data.token.split('.');
          const algorithm = JSON.parse(Buffer.from(header, 'base64url').toString('utf8')).alg;
          const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
          tokenMatchesAccount = algorithm === 'HS256' && String(claims.id) === String(session.userId) &&
            claims.email === data.user?.email && claims.mustResetPassword !== true;
        } catch { /* Reject invalid JWT fields. EndoEval validates the signature server-side on every subsequent request. */ }
      }
      if (!exp || exp <= nowSeconds || data.token === session.token || !validUser(data?.user) ||
          !tokenMatchesAccount || data.user.mustResetPassword === true || String(data.user.id) !== String(session.userId)) {
        return send(res, 502, { error: 'Password service unavailable. Please sign in again on EndoEval if needed.' });
      }
      const maxAge = Math.min(MAX_SESSION_SECONDS, exp - nowSeconds, session.expiresAt - nowSeconds);
      const encrypted = encryptSession({ token: data.token, userId: data.user.id, exp, expiresAt: nowSeconds + maxAge }, key);
      res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encrypted}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`);
      return send(res, 200, { message: 'Password changed' });
    }

    if (req.method === 'PATCH' && action === 'profile') {
      if (!sameOrigin(req, acceptedOrigin)) return send(res, 403, { error: 'Request origin not allowed' });
      const session = decryptSession(cookieValue(req, COOKIE_NAME), key);
      const nowSeconds = Math.floor(now() / 1000);
      if (!session || typeof session.token !== 'string' || !Number.isSafeInteger(session.exp) || session.exp <= nowSeconds || !Number.isSafeInteger(session.expiresAt) || session.expiresAt <= nowSeconds) {
        return send(res, 401, { error: 'Authentication required' });
      }
      const profile = {
        username: req.body?.username,
        displayName: req.body?.displayName,
        specialty: req.body?.specialty,
        institution: req.body?.institution,
        bio: req.body?.bio,
      };
      if (!validProfile(profile)) return send(res, 400, { error: 'Invalid profile' });
      let upstream;
      try {
        upstream = await fetchImpl(`${origin}/api/auth/gihub-profile`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${session.token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
          redirect: 'error',
          signal: AbortSignal.timeout(10_000),
        });
      } catch {
        return send(res, 502, { error: 'Profile service unavailable' });
      }
      if (upstream.status === 401 || upstream.status === 403) return send(res, 401, { error: 'Authentication required' });
      if (upstream.status === 409) return send(res, 409, { error: 'Username is already taken' });
      if (!upstream.ok) return send(res, 502, { error: 'Profile service unavailable' });
      let data;
      try { data = await upstream.json(); } catch { return send(res, 502, { error: 'Profile service unavailable' }); }
      const account = publicAccount(data);
      if (!account) return send(res, 502, { error: 'Profile service unavailable' });
      return send(res, 200, account);
    }

    if (req.method === 'GET' && (action === 'me' || action === 'profile')) {
      const session = decryptSession(cookieValue(req, COOKIE_NAME), key);
      const nowSeconds = Math.floor(now() / 1000);
      if (!session || typeof session.token !== 'string' || !Number.isSafeInteger(session.exp) || session.exp <= nowSeconds || !Number.isSafeInteger(session.expiresAt) || session.expiresAt <= nowSeconds) {
        return send(res, 401, { error: 'Authentication required' });
      }
      let upstream;
      try {
        upstream = await fetchImpl(`${origin}/api/auth/gihub-profile`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${session.token}`, Accept: 'application/json' },
          redirect: 'error',
          signal: AbortSignal.timeout(10_000),
        });
      } catch {
        return send(res, 502, { error: 'Profile service unavailable' });
      }
      if (upstream.status === 401 || upstream.status === 403) return send(res, 401, { error: 'Authentication required' });
      if (!upstream.ok) return send(res, 502, { error: 'Profile service unavailable' });
      let data;
      try { data = await upstream.json(); } catch { return send(res, 502, { error: 'Profile service unavailable' }); }
      const account = publicAccount(data);
      if (!account) return send(res, 502, { error: 'Profile service unavailable' });
      return send(res, 200, account);
    }

    if (req.method !== 'POST' || action !== 'login') return send(res, 404, { error: 'Not found' });
    if (!sameOrigin(req, acceptedOrigin)) return send(res, 403, { error: 'Request origin not allowed' });

    const email = req.body?.email;
    const password = req.body?.password;
    if (typeof email !== 'string' || email.length < 3 || email.length > 320 ||
        typeof password !== 'string' || password.length < 1 || password.length > 1024) {
      return send(res, 400, { error: 'Invalid email or password' });
    }

    // Bound guesses per account even when a client can spoof X-Forwarded-For.
    const attemptKey = email.trim().toLowerCase();
    const windowMs = 15 * 60 * 1000;
    const timestamp = now();
    if (!loginAttempts.has(attemptKey) && loginAttempts.size >= 10_000) {
      for (const [keyName, value] of loginAttempts) {
        if (timestamp >= value.resetAt) loginAttempts.delete(keyName);
      }
      if (loginAttempts.size >= 10_000) loginAttempts.delete(loginAttempts.keys().next().value);
    }
    let attempts = loginAttempts.get(attemptKey);
    if (!attempts || timestamp >= attempts.resetAt) attempts = { count: 0, resetAt: timestamp + windowMs };
    if (attempts.count >= 5) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((attempts.resetAt - timestamp) / 1000))));
      return send(res, 429, { error: 'Too many login attempts' });
    }
    attempts.count += 1;
    loginAttempts.set(attemptKey, attempts);

    let upstream;
    try {
      upstream = await fetchImpl(`${origin}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
        redirect: 'error',
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      return send(res, 502, { error: 'Authentication service unavailable' });
    }
    if (!upstream.ok) {
      if ([400, 401, 403, 409].includes(upstream.status)) return send(res, 401, { error: 'Invalid email or password' });
      return send(res, 502, { error: 'Authentication service unavailable' });
    }

    let data;
    try { data = await upstream.json(); } catch { return send(res, 502, { error: 'Authentication service unavailable' }); }
    const exp = tokenExpiry(data?.token);
    const nowSeconds = Math.floor(now() / 1000);
    if (!exp || exp <= nowSeconds || !validUser(data?.user)) {
      return send(res, 502, { error: 'Authentication service unavailable' });
    }
    if (data.user.mustResetPassword === true) {
      return send(res, 401, { error: 'Invalid email or password' });
    }
    const maxAge = Math.min(MAX_SESSION_SECONDS, exp - nowSeconds);
    loginAttempts.delete(attemptKey);
    const encrypted = encryptSession({ token: data.token, userId: data.user.id, exp, expiresAt: nowSeconds + maxAge }, key);
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encrypted}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`);
    return send(res, 200, { user: { id: data.user.id, email: data.user.email, name: data.user.name } });
  };
}

export default createGihubAuthHandler();
