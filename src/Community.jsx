import { useEffect, useState } from 'react';
import { articleTarget } from './communityTargets.js';
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
      <input id="community-article" required minLength={5} maxLength={1500} value={description} onChange={event => setDescription(event.target.value)} placeholder="PMID, DOI, or describe the article and journal — we’ll find it!" />
      <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Contribute'}</button>
    </div>
    <small>Article leads go to editorial review, not directly to the site. Do not include patient-identifying information.</small>
    {notice && <p role="status">{notice}</p>}
  </form>;
}

export function WeeklyVote({ item, account, vote = { score: 0, myVote: 0 }, ready, onVote }) {
  const [busy, setBusy] = useState(false);
  const target = articleTarget(item);
  if (!target) return null;
  async function choose(value) {
    if (!account || !ready || busy) return;
    setBusy(true);
    try { await onVote(target, vote.myVote === value ? 0 : value); }
    finally { setBusy(false); }
  }
  return <div className="community-vote" data-vote-target={target} onClick={event => event.stopPropagation()}>
    <button type="button" aria-label={`Upvote ${item.title || item.headline}`} aria-pressed={vote.myVote === 1} title={account ? 'Upvote article' : 'Sign in to vote'} disabled={!account || !ready || busy} onClick={() => choose(1)}>▲ Upvote</button>
    <span aria-label={`Net score ${vote.score || 0}`}>{vote.score || 0}</span>
    <button type="button" aria-label={`Downvote ${item.title || item.headline}`} aria-pressed={vote.myVote === -1} title={account ? 'Downvote article' : 'Sign in to vote'} disabled={!account || !ready || busy} onClick={() => choose(-1)}>▼ Downvote</button>
  </div>;
}

export function Discussion({ target, account, label = 'Comment' }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [body, setBody] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [reason, setReason] = useState('privacy');
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
      const comment = await requestCommunity('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'comment', target, body }) });
      setItems(current => [comment, ...current]);
      setBody('');
      setNotice('Comment posted. It is visible to readers now.');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  async function report(event) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      await requestCommunity('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'report', commentId: reportId, reason }) });
      setNotice('Report sent to the editorial team.');
      setReportId(null);
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  return <div className="community-discussion" data-community-target={target} onClick={event => event.stopPropagation()}>
    <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? 'Hide comments' : label}</button>
    {open && <div className="community-discussion__thread">
      <h3>Discussion</h3>
      {items.length ? <ol>{items.map(item => <li key={item.id}><strong>{item.authorName}</strong> <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time><p>{item.body}</p>
        {account && <><button type="button" aria-label={`Report comment by ${item.authorName}`} onClick={() => { setReportId(reportId === item.id ? null : item.id); setNotice(''); }}>Report</button>
          {reportId === item.id && <form onSubmit={report}><label>Why are you reporting this comment?<select value={reason} onChange={event => setReason(event.target.value)}><option value="privacy">Patient privacy</option><option value="inaccurate">Clinical inaccuracy</option><option value="spam">Spam</option><option value="abuse">Abuse</option><option value="other">Other</option></select></label><button type="submit" disabled={busy}>Send report</button></form>}</>}
      </li>)}</ol> : <p>No comments yet.</p>}
      {account ? <form onSubmit={submit}><label>Join the discussion<textarea required minLength={3} maxLength={2000} value={body} onChange={event => setBody(event.target.value)} placeholder="Share a question or insight. Please don't include patient-identifying details." /></label><small>Comments are public immediately. Your display name will appear; you can report problematic comments for editorial review.</small><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Post comment'}</button></form> : <p>Use the Sign in tab to comment or report.</p>}
      {notice && <p role="status">{notice}</p>}
    </div>}
  </div>;
}
