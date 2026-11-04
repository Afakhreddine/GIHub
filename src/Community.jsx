import { useEffect, useState } from 'react';
import './Community.css';

async function requestCommunity(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { Accept: 'application/json', ...options.headers } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Please try again later.');
  return result;
}

export function ContributionBar({ account }) {
  const [destination, setDestination] = useState('weekly');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  if (!account) return null;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      await requestCommunity('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'submission', destination, description }) });
      setDescription('');
      setNotice('Saved for editorial review. We will look up the source; this does not publish it.');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  return <form className="community-contribution" onSubmit={submit} aria-label="Contribute an article">
    <label htmlFor="community-article">Have an article for the Weekly Update or Schedule?</label>
    <div className="community-contribution__fields">
      <div className="community-contribution__choices" role="group" aria-label="Contribution destination">
        <button type="button" aria-pressed={destination === 'weekly'} onClick={() => setDestination('weekly')}>Weekly Update</button>
        <button type="button" aria-pressed={destination === 'schedule'} onClick={() => setDestination('schedule')}>Schedule</button>
      </div>
      <input id="community-article" required minLength={8} maxLength={1500} value={description} onChange={event => setDescription(event.target.value)} placeholder="PMID, DOI, or describe the article and journal — we’ll find it!" />
      <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Contribute'}</button>
    </div>
    {notice && <p role="status">{notice}</p>}
  </form>;
}

export function Discussion({ target, account, label = 'Discuss' }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [body, setBody] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!open || !target) return;
    const controller = new AbortController();
    requestCommunity(`/api/community?target=${encodeURIComponent(target)}`, { signal: controller.signal })
      .then(data => setItems(data.items || []))
      .catch(error => { if (error.name !== 'AbortError') setNotice(error.message); });
    return () => controller.abort();
  }, [open, target]);
  if (!target) return null;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      await requestCommunity('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'comment', target, body }) });
      setBody('');
      setNotice('Comment received. It will appear after editorial review.');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  return <div className="community-discussion" onClick={event => event.stopPropagation()}>
    <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? 'Hide discussion' : label}</button>
    {open && <div className="community-discussion__thread">
      <h3>Discussion</h3>
      {items.length ? <ol>{items.map(item => <li key={item.id}><strong>{item.authorName}</strong> <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time><p>{item.body}</p></li>)}</ol> : <p>No published comments yet.</p>}
      {account ? <form onSubmit={submit}><label>Join the discussion<textarea required minLength={3} maxLength={2000} value={body} onChange={event => setBody(event.target.value)} placeholder="Share a question or insight. Please don't include patient-identifying details." /></label><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Post comment'}</button></form> : <p>Sign in through Profile to comment.</p>}
      {notice && <p role="status">{notice}</p>}
    </div>}
  </div>;
}
