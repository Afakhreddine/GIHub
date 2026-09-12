import React, { useEffect, useState } from "react";
import scheduleResources from "./data/scheduleResources.js";
import {
  buildSchedulePublishPayload,
  canPublishScheduleReview,
  filterScheduleReviewItems,
  flattenScheduleReviewItems,
  loadScheduleDecisions,
  saveScheduleDecisions,
  scheduleReviewDataApiPath,
  scheduleReviewItemId,
  scheduleReviewSourceFromLocation,
} from "./scheduleReviewModel.js";

async function saveServerDecisions(pullNumber, decisions) {
  if (!pullNumber) return null;
  const response = await fetch("/api/schedule-review-data", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ pullNumber, decisions }),
  });
  const body = await response.json();
  if (!response.ok || !body.ok) throw new Error(body.error || "Could not save review decisions");
  return body;
}

export default function ScheduleReview({ resources = scheduleResources }) {
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState("All");
  const [kind, setKind] = useState("All");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [decisions, setDecisions] = useState(() => loadScheduleDecisions(typeof window === "undefined" ? null : window.localStorage));
  const [reviewResources, setReviewResources] = useState(resources);
  const [reviewPullNumber, setReviewPullNumber] = useState("");
  const [sourceStatus, setSourceStatus] = useState("");
  const [publishStatus, setPublishStatus] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);
  const reviewItems = flattenScheduleReviewItems(reviewResources);
  const visibleItems = filterScheduleReviewItems(reviewItems, { query, slug, kind, decision:decisionFilter, decisions });
  const publishReady = canPublishScheduleReview(reviewItems, decisions);
  const slugs = ["All", ...new Set(reviewItems.map((item) => item.slug))];
  const kinds = ["All", ...new Set(reviewItems.map((item) => item.kind))];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const source = scheduleReviewSourceFromLocation(window.location.href);
    let cancelled = false;
    setSourceStatus(source.pr ? `Loading PR #${source.pr} Schedule cards…` : "Loading latest Schedule PR cards…");
    fetch(scheduleReviewDataApiPath(source))
      .then((response) => response.json().then((body) => ({ response, body })))
      .then(async ({ response, body }) => {
        if (cancelled) return;
        if (!response.ok || !body.resources) throw new Error(body.error || "Could not load PR Schedule cards");
        const pullNumber = String(body.pr || source.pr || "");
        setReviewResources(body.resources);
        setReviewPullNumber(pullNumber);
        const itemCount = flattenScheduleReviewItems(body.resources);
        setSourceStatus(`Reviewing PR #${body.pr} · ${itemCount.length} new Schedule search-result cards · loading saved decisions…`);
        try {
          const saved = body.savedDecisions || {};
          if (saved && Object.keys(saved).length) {
            setDecisions(saved);
            saveScheduleDecisions(window.localStorage, saved);
            setSourceStatus(`Reviewing PR #${body.pr} · ${itemCount.length} new Schedule search-result cards · saved decisions restored`);
          } else if (!cancelled) {
            setSourceStatus(`Reviewing PR #${body.pr} · ${itemCount.length} new Schedule search-result cards`);
          }
        } catch {
          if (!cancelled) setSourceStatus(`Reviewing PR #${body.pr} · ${itemCount.length} new Schedule search-result cards · using local decisions`);
        }
      })
      .catch((error) => {
        if (!cancelled) setSourceStatus(error.message || "Could not load PR Schedule cards");
      });
    return () => { cancelled = true; };
  }, []);

  function markDecision(item, decision) {
    const next = { ...decisions, [scheduleReviewItemId(item)]:decision };
    setDecisions(next);
    saveScheduleDecisions(window.localStorage, next);
    if (reviewPullNumber) {
      setSourceStatus(`Reviewing PR #${reviewPullNumber} · ${reviewItems.length} new Schedule search-result cards · saving decisions…`);
      saveServerDecisions(reviewPullNumber, next)
        .then(() => setSourceStatus(`Reviewing PR #${reviewPullNumber} · ${reviewItems.length} new Schedule search-result cards · decisions saved`))
        .catch(() => setSourceStatus(`Reviewing PR #${reviewPullNumber} · ${reviewItems.length} new Schedule search-result cards · local decision saved; server save failed`));
    }
  }

  async function publishApprovedScheduleResources() {
    if (!publishReady || publishBusy) return;
    const token = window.prompt("Enter Schedule Review publish code");
    if (!token) return;
    setPublishBusy(true);
    setPublishStatus("Publishing…");
    try {
      const { pr } = typeof window === "undefined" ? { pr:"" } : scheduleReviewSourceFromLocation(window.location.href);
      const pullNumber = reviewPullNumber || pr;
      const response = await fetch("/api/schedule-review-publish", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ ...buildSchedulePublishPayload(reviewItems, decisions), pullNumber, token }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || result.reason || "Publish failed");
      setPublishStatus(result.published ? `Published PR #${result.pullNumber}` : result.message || "Updated PR to approved Schedule cards");
    } catch (error) {
      setPublishStatus(error.message || "Publish failed");
    } finally {
      setPublishBusy(false);
    }
  }

  return (
    <main style={{ minHeight:"100vh", background:"#080f1e", color:"#d0e0ff", fontFamily:"Georgia,'Times New Roman',serif", padding:"32px" }}>
      <div style={{ maxWidth:1180, margin:"0 auto" }}>
        <p style={{ fontSize:11, color:"#5b8af0", fontFamily:"monospace", letterSpacing:1.2 }}>GIHUB · SCHEDULE REVIEW SANDBOX</p>
        <h1 style={{ fontSize:28, fontWeight:700, color:"#e0eeff", margin:"8px 0" }}>📅 Schedule Search-Result Review</h1>
        <p style={{ fontSize:13, color:"#5a6a88", marginBottom:8 }}>Approve, hold, or reject only the new online-search article candidates. Existing guidelines and already-approved Weekly/Archive cards are preserved automatically.</p>
        {sourceStatus && <p style={{ fontSize:12, color:"#5b8af0", margin:"0 0 24px", fontFamily:"monospace" }}>{sourceStatus}</p>}
        {!sourceStatus && <div style={{ marginBottom:24 }} />}
        <label style={{ display:"block", color:"#6a8aaa", fontSize:12, marginBottom:22 }}>
          Search Schedule cards
          <input aria-label="Search Schedule cards" value={query} onChange={(event) => setQuery(event.target.value)} style={{ display:"block", marginTop:7, width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#c8d8f0" }}/>
        </label>
        <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Lecture {" "}
            <select aria-label="Filter by lecture" value={slug} onChange={(event) => setSlug(event.target.value)}>{slugs.map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Kind {" "}
            <select aria-label="Filter by kind" value={kind} onChange={(event) => setKind(event.target.value)}>{kinds.map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Decision {" "}
            <select aria-label="Filter by decision" value={decisionFilter} onChange={(event) => setDecisionFilter(event.target.value)}>{["All", "Approve", "Hold", "Reject"].map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <span style={{ fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>{visibleItems.length} of {reviewItems.length} cards</span>
        </div>
        <div style={{ display:"grid", gap:14 }}>
          {visibleItems.map((item) => (
            <article key={scheduleReviewItemId(item)} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderLeft:`3px solid ${item.kind === "Guideline" ? "#5b8af0" : "#00b8d4"}`, borderRadius:12, padding:"20px 22px" }}>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center", fontSize:11, color:"#5a6a88", fontFamily:"monospace" }}>
                <span>{item.slug}</span><span>·</span><span>{item.kind}</span><span>·</span><span>{item.source}</span>{item.date && <><span>·</span><span>{item.date}</span></>}
                {item.status && <span style={{ color:item.status === "approved" ? "#4caf7d" : "#e09a2a" }}>· {item.status}</span>}
              </div>
              <h2 style={{ fontSize:16, color:"#c8d8f0", margin:"8px 0" }}>{item.title}</h2>
              <p style={{ fontSize:13, color:"#6a7a90", lineHeight:1.7 }}>{item.summary}</p>
              {item.relevanceReason && <p style={{ fontSize:11.5, color:"#445570", marginTop:8 }}>Why matched: {item.relevanceReason}</p>}
              <div style={{ display:"flex", gap:12, marginTop:12, flexWrap:"wrap" }}>
                {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color:"#5b8af0", fontSize:12, textDecoration:"none" }}>Open source ↗</a>}
                {item.pmid && <a href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`} target="_blank" rel="noreferrer" style={{ color:"#4caf7d", fontSize:12, textDecoration:"none" }}>PubMed {item.pmid} ↗</a>}
                {item.doi && <span style={{ color:"#3a5878", fontSize:11, fontFamily:"monospace" }}>DOI {item.doi}</span>}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                {["Approve", "Hold", "Reject"].map((decision) => {
                  const selected = decisions[scheduleReviewItemId(item)] === decision;
                  const color = { Approve:"#4caf7d", Hold:"#e09a2a", Reject:"#e05252" }[decision];
                  return <button key={decision} type="button" aria-pressed={selected} onClick={() => markDecision(item, decision)} style={{ border:`1px solid ${selected ? color : "rgba(255,255,255,0.1)"}`, background:selected ? `${color}22` : "rgba(255,255,255,0.03)", color:selected ? color : "#5a6a88", borderRadius:7, padding:"7px 12px", cursor:"pointer" }}>{decision}</button>;
                })}
              </div>
            </article>
          ))}
          {visibleItems.length === 0 && <p style={{ color:"#3a5878", padding:"32px 0", textAlign:"center" }}>No Schedule cards match these filters.</p>}
        </div>
        <div style={{ position:"sticky", bottom:16, marginTop:24, padding:"14px 16px", border:"1px solid rgba(91,138,240,0.25)", borderRadius:12, background:"rgba(10,20,40,0.96)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", boxShadow:"0 8px 30px rgba(0,0,0,0.35)" }}>
          <span style={{ fontSize:12, color:"#5a6a88", fontFamily:"monospace" }}>{Object.keys(decisions).length}/{reviewItems.length} reviewed</span>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            {publishStatus && <span style={{ fontSize:12, color:publishStatus.startsWith("Published") ? "#4caf7d" : "#e09a2a", fontFamily:"monospace" }}>{publishStatus}</span>}
            <button type="button" onClick={publishApprovedScheduleResources} disabled={!publishReady || publishBusy} style={{ background:publishReady ? "rgba(76,175,125,0.16)" : "rgba(255,255,255,0.04)", border:`1px solid ${publishReady ? "rgba(76,175,125,0.55)" : "rgba(255,255,255,0.08)"}`, color:publishReady ? "#7ee0aa" : "#42546f", borderRadius:8, padding:"9px 14px", cursor:publishReady ? "pointer" : "not-allowed", fontWeight:700 }}>{publishBusy ? "Publishing…" : "Publish approved"}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
