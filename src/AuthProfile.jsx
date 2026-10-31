import { useEffect, useState } from 'react';
import './AuthProfile.css';

const EMPTY_PROFILE = { username: '', displayName: '', specialty: '', institution: '', bio: '' };

async function authRequest(path, options = {}) {
  const response = await fetch(`/api/gihub-auth/${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return data;
}

export default function AuthProfile({ initialAccount, skipSessionCheck = false }) {
  const [account, setAccount] = useState(initialAccount || null);
  const [profile, setProfile] = useState(initialAccount?.profile || EMPTY_PROFILE);
  const [loading, setLoading] = useState(!skipSessionCheck && initialAccount === undefined);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (skipSessionCheck || initialAccount !== undefined) return;
    const controller = new AbortController();
    authRequest('me', { signal: controller.signal })
      .then(data => { setAccount(data); setProfile(data.profile); })
      .catch(error => { if (error.name !== 'AbortError' && error.status !== 401) setMessage('Profile service is temporarily unavailable.'); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [initialAccount, skipSessionCheck]);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await authRequest('login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const data = await authRequest('me');
      setAccount(data);
      setProfile(data.profile);
      formElement.reset();
    } catch (error) {
      setMessage(error.status === 401 ? 'Email or password not recognized. Check your EndoEval account.' : 'Sign-in is temporarily unavailable. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const data = await authRequest('profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setAccount(data);
      setProfile(data.profile);
      setMessage('Profile saved.');
    } catch (error) {
      if (error.status === 401) setAccount(null);
      setMessage(error.status === 409 ? 'Username is already taken. Please choose another.' : error.status === 400 ? 'Please check the username and profile field lengths.' : 'Profile could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setMessage('');
    try {
      await authRequest('logout', { method: 'POST' });
      setAccount(null);
      setProfile(EMPTY_PROFILE);
    } catch {
      setMessage('Could not sign out. You are still signed in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <section className="auth-profile" aria-busy="true"><div className="auth-profile__card"><p>Checking your GIHub session…</p></div></section>;

  if (!account) {
    return <section className="auth-profile" aria-labelledby="gihub-login-title">
      <div className="auth-profile__intro"><p className="auth-profile__eyebrow">GIHub profile</p><h1 id="gihub-login-title">Sign in with EndoEval</h1><p>Use the same credentials as your existing EndoEval account. Public GIHub educational content remains available without signing in.</p></div>
      <form key="signed-out" className="auth-profile__card auth-profile__form" onSubmit={login}>
        <p className="auth-profile__notice">Existing EndoEval users only. GIHub does not offer public registration.</p>
        <label>Email<input name="email" type="email" autoComplete="username" maxLength={320} required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" maxLength={1024} required /></label>
        <button className="auth-profile__primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a className="auth-profile__external" href="https://endoeval.com" rel="noopener noreferrer">Change or reset password on EndoEval <span aria-hidden="true">↗</span></a>
        {message && <p className="auth-profile__message" role="alert">{message}</p>}
      </form>
    </section>;
  }

  return <section className="auth-profile" aria-labelledby="gihub-profile-title">
    <div className="auth-profile__header"><div><p className="auth-profile__eyebrow">GIHub profile</p><h1 id="gihub-profile-title">Welcome, {profile.displayName || account.user.name}</h1><p>Your profile is stored with EndoEval and revalidated whenever GIHub loads it.</p></div><button className="auth-profile__secondary" type="button" onClick={logout} disabled={busy}>Sign out</button></div>
    <form key="signed-in" className="auth-profile__card auth-profile__form" onSubmit={saveProfile}>
      <label>Email<input type="email" value={account.user.email} readOnly aria-describedby="email-help" /></label>
      <small id="email-help">Email remains your sign-in on GIHub and EndoEval; a username does not replace it.</small>
      <label>Username (optional)<input name="username" pattern="[a-z][a-z0-9_]{2,29}" maxLength={30} value={profile.username} onChange={event => setProfile({ ...profile, username: event.target.value })} /></label>
      <small>Optional: 3–30 lowercase letters, digits, or underscores; start with a letter. Leave blank if you do not want a username.</small>
      <label>Display name<input value={profile.displayName} maxLength={200} onChange={event => setProfile({ ...profile, displayName: event.target.value })} /></label>
      <div className="auth-profile__row">
        <label>Specialty<input value={profile.specialty} maxLength={200} onChange={event => setProfile({ ...profile, specialty: event.target.value })} /></label>
        <label>Institution<input value={profile.institution} maxLength={300} onChange={event => setProfile({ ...profile, institution: event.target.value })} /></label>
      </div>
      <label>Bio<textarea value={profile.bio} maxLength={4000} rows={6} onChange={event => setProfile({ ...profile, bio: event.target.value })} /></label>
      <div className="auth-profile__actions"><button className="auth-profile__primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button><a className="auth-profile__external" href="https://endoeval.com" rel="noopener noreferrer">Change or reset password on EndoEval <span aria-hidden="true">↗</span></a></div>
      {message && <p className="auth-profile__message" role={message === 'Profile saved.' ? 'status' : 'alert'}>{message}</p>}
    </form>
  </section>;
}
