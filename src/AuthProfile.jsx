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
  const [passwordMessage, setPasswordMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (skipSessionCheck || initialAccount !== undefined) return;
    const controller = new AbortController();
    authRequest('me', { signal: controller.signal })
      .then(data => { setAccount(data); setProfile(data.profile); setEditingProfile(false); })
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
      setEditingProfile(false);
      formElement.reset();
      window.dispatchEvent(new window.Event('gihub:auth-changed'));
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
      setEditingProfile(false);
      setMessage('Profile saved.');
      window.dispatchEvent(new window.Event('gihub:auth-changed'));
    } catch (error) {
      if (error.status === 401) setAccount(null);
      setMessage(error.status === 409 ? 'Profile could not be saved. Please try again.' : error.status === 400 ? 'Please check the profile field lengths.' : 'Profile could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const currentPassword = formElement.elements.namedItem('currentPassword').value;
    const newPassword = formElement.elements.namedItem('newPassword').value;
    const confirmPassword = formElement.elements.namedItem('confirmPassword').value;
    if (newPassword !== confirmPassword) {
      formElement.reset();
      setPasswordMessage('New passwords must match.');
      return;
    }
    setBusy(true);
    setPasswordMessage('');
    try {
      await authRequest('change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordMessage('Password changed. You remain signed in.');
    } catch (error) {
      setPasswordMessage(error.status === 400 ? 'Check your current password and use at least 6 characters for the new password.' :
        error.status === 401 ? 'Current password is incorrect or your session expired. Check it and try again; if expired, sign out and sign in again.' :
          error.status === 403 ? 'Password change is unavailable for this account. Contact EndoEval support.' :
            'Could not change password. Please try again; if it changed on EndoEval, sign in again.');
    } finally {
      formElement.reset();
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
      setEditingProfile(false);
      window.dispatchEvent(new window.Event('gihub:auth-changed'));
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
    {editingProfile ? <form key="signed-in" className="auth-profile__card auth-profile__form" onSubmit={saveProfile}>
      <label>Email<input type="email" value={account.user.email} readOnly aria-describedby="email-help" /></label>
      <small id="email-help">Email remains your sign-in on GIHub and EndoEval.</small>
      <label>Display name<input value={profile.displayName} maxLength={200} onChange={event => setProfile({ ...profile, displayName: event.target.value })} /></label>
      <label>Bio<textarea value={profile.bio} maxLength={4000} rows={6} onChange={event => setProfile({ ...profile, bio: event.target.value })} /></label>
      <div className="auth-profile__actions"><button className="auth-profile__primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button><button className="auth-profile__secondary auth-profile__cancel" type="button" disabled={busy} onClick={() => { setProfile(account.profile); setMessage(''); setEditingProfile(false); }}>Cancel</button></div>
      {message && <p className="auth-profile__message" role={message === 'Profile saved.' ? 'status' : 'alert'}>{message}</p>}
    </form> : <div className="auth-profile__card auth-profile__summary">
      <p>Your profile details are saved. Select Edit profile to update them.</p>
      <button className="auth-profile__primary auth-profile__edit" type="button" disabled={busy} onClick={() => { setMessage(''); setEditingProfile(true); }}>Edit profile</button>
      {message && <p className="auth-profile__message" role={message === 'Profile saved.' ? 'status' : 'alert'}>{message}</p>}
    </div>}
    <form data-password-change="" className="auth-profile__card auth-profile__form auth-profile__password" onSubmit={changePassword}>
      <h2>Change your EndoEval password</h2>
      <p>This changes the password for the same account on GIHub and EndoEval.</p>
      <label>Current password<input name="currentPassword" type="password" autoComplete="current-password" maxLength={1024} required /></label>
      <label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={6} maxLength={1024} required /></label>
      <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={6} maxLength={1024} required /></label>
      <button className="auth-profile__primary" type="submit" disabled={busy}>{busy ? 'Changing…' : 'Change password'}</button>
      {passwordMessage && <p className="auth-profile__message" role={passwordMessage.startsWith('Password changed') ? 'status' : 'alert'}>{passwordMessage}</p>}
    </form>
  </section>;
}
