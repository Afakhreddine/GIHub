import React, { useEffect, useState } from "react";
import weekly from "./data/weekly.js";
import { buildApprovalSummary, buildPublishPayload, canPublishWeeklyReview, filterWeeklyItems, loadDecisions, saveDecisions, weeklyItemId, weeklyReviewSourceFromLocation } from "./weeklyReviewModel.js";

export default function WeeklyReview({ items = weekly }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [decisions, setDecisions] = useState(() => loadDecisions(typeof window === "undefined" ? null : window.localStorage));
  const [reviewItems, setReviewItems] = useState(items);
  const [sourceStatus, setSourceStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [publishStatus, setPublishStatus] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);
  const visibleItems = filterWeeklyItems(reviewItems, { query, type, decision:decisionFilter, decisions });
  const publishReady = canPublishWeeklyReview(reviewItems, decisions);
  const types = ["All", ...new Set(reviewItems.map((item) => item.type))];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { pr } = weeklyReviewSourceFromLocation(window.location.href);
    if (!pr) return;
    let cancelled = false;
    setSourceStatus(`Loading PR #${pr} weekly cards…`);
    fetch(`/api/weekly-review-data?pr=${encodeURIComponent(pr)}`)
      .then((response) => response.json().then((body) => ({ response, body })))
      .then(({ response, body }) => {
        if (cancelled) return;
        if (!response.ok || !Array.isArray(body.items)) throw new Error(body.error || "Could not load PR weekly cards");
        setReviewItems(body.items);
        setSourceStatus(`Reviewing PR #${body.pr} · ${body.items.length} cards`);
      })
      .catch((error) => {
        if (!cancelled) setSourceStatus(error.message || "Could not load PR weekly cards");
      });
    return () => { cancelled = true; };
  }, []);

  function markDecision(item, decision) {
    const next = { ...decisions, [weeklyItemId(item)]:decision };
    setDecisions(next);
    saveDecisions(window.localStorage, next);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildApprovalSummary(reviewItems, decisions));
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed");
    }
  }

  async function publishApprovedWeeklyUpdate() {
    if (!publishReady || publishBusy) return;
    const token = window.prompt("Enter Weekly Review publish code");
    if (!token) return;
    setPublishBusy(true);
    setPublishStatus("Publishing…");
    try {
      const response = await fetch("/api/weekly-review-publish", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ ...buildPublishPayload(reviewItems, decisions), token }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || result.reason || "Publish failed");
      setPublishStatus(result.published ? `Published PR #${result.pullNumber}` : result.message || "Updated PR to approved cards");
    } catch (error) {
      setPublishStatus(error.message || "Publish failed");
    } finally {
      setPublishBusy(false);
    }
  }

  return (
    <main style={{ minHeight:"100vh", background:"#080f1e", color:"#d0e0ff", fontFamily:"Georgia,'Times New Roman',serif", padding:"32px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <p style={{ fontSize:11, color:"#5b8af0", fontFamily:"monospace", letterSpacing:1.2 }}>GIHUB · REVIEW SANDBOX</p>
        <h1 style={{ fontSize:28, fontWeight:700, color:"#e0eeff", margin:"8px 0" }}>📰 Weekly Update Review</h1>
        <p style={{ fontSize:13, color:"#5a6a88", marginBottom:8 }}>Review repo-managed study and news cards before publication.</p>
        {sourceStatus && <p style={{ fontSize:12, color:"#5b8af0", margin:"0 0 24px", fontFamily:"monospace" }}>{sourceStatus}</p>}
        {!sourceStatus && <div style={{ marginBottom:24 }} />}
        <label style={{ display:"block", color:"#6a8aaa", fontSize:12, marginBottom:22 }}>
          Search weekly updates
          <input aria-label="Search weekly updates" value={query} onChange={(event) => setQuery(event.target.value)} style={{ display:"block", marginTop:7, width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#c8d8f0" }}/>
        </label>
        <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Type {" "}
            <select aria-label="Filter by type" value={type} onChange={(event) => setType(event.target.value)}>{types.map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Decision {" "}
            <select aria-label="Filter by decision" value={decisionFilter} onChange={(event) => setDecisionFilter(event.target.value)}>{["All", "Approve", "Hold", "Reject"].map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <span style={{ fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>{visibleItems.length} of {reviewItems.length} cards</span>
        </div>
        <div style={{ display:"grid", gap:14 }}>
          {visibleItems.map((item) => (
            <article key={weeklyItemId(item)} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderLeft:"3px solid #e09a2a", borderRadius:12, padding:"20px 22px" }}>
              <div style={{ fontSize:11, color:"#5a6a88", fontFamily:"monospace" }}>{item.type} · {item.topic} · {item.date}</div>
              <h2 style={{ fontSize:16, color:"#c8d8f0", margin:"8px 0" }}>{item.title}</h2>
              {item.authors && <p style={{ fontSize:11.5, color:"#445570", fontStyle:"italic", marginBottom:8 }}>{item.authors}</p>}
              <p style={{ fontSize:13, color:"#6a7a90", lineHeight:1.7 }}>{item.summary}</p>
              <div style={{ display:"flex", gap:12, marginTop:12, flexWrap:"wrap" }}>
                {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color:"#5b8af0", fontSize:12, textDecoration:"none" }}>Open source ↗</a>}
                {item.studyUrl && <a href={item.studyUrl} target="_blank" rel="noreferrer" style={{ color:"#4caf7d", fontSize:12, textDecoration:"none" }}>Open study ↗</a>}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                {["Approve", "Hold", "Reject"].map((decision) => {
                  const selected = decisions[weeklyItemId(item)] === decision;
                  const color = { Approve:"#4caf7d", Hold:"#e09a2a", Reject:"#e05252" }[decision];
                  return <button key={decision} type="button" aria-pressed={selected} onClick={() => markDecision(item, decision)} style={{ border:`1px solid ${selected ? color : "rgba(255,255,255,0.1)"}`, background:selected ? `${color}22` : "rgba(255,255,255,0.03)", color:selected ? color : "#5a6a88", borderRadius:7, padding:"7px 12px", cursor:"pointer" }}>{decision}</button>;
                })}
              </div>
            </article>
          ))}
          {visibleItems.length === 0 && <p style={{ color:"#3a5878", padding:"32px 0", textAlign:"center" }}>No weekly updates match these filters.</p>}
        </div>
        <div style={{ position:"sticky", bottom:16, marginTop:24, padding:"14px 16px", border:"1px solid rgba(91,138,240,0.25)", borderRadius:12, background:"rgba(10,20,40,0.96)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", boxShadow:"0 8px 30px rgba(0,0,0,0.35)" }}>
          <span style={{ fontSize:12, color:"#5a6a88", fontFamily:"monospace" }}>{Object.keys(decisions).length}/{reviewItems.length} reviewed</span>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            {publishStatus && <span style={{ fontSize:12, color:publishStatus.startsWith("Published") ? "#4caf7d" : "#e09a2a", fontFamily:"monospace" }}>{publishStatus}</span>}
            <button type="button" onClick={publishApprovedWeeklyUpdate} disabled={!publishReady || publishBusy} style={{ background:publishReady ? "rgba(76,175,125,0.16)" : "rgba(255,255,255,0.04)", border:`1px solid ${publishReady ? "rgba(76,175,125,0.55)" : "rgba(255,255,255,0.08)"}`, color:publishReady ? "#7ee0aa" : "#42546f", borderRadius:8, padding:"9px 14px", cursor:publishReady ? "pointer" : "not-allowed", fontWeight:700 }}>{publishBusy ? "Publishing…" : "Publish approved"}</button>
            <button type="button" onClick={copySummary} style={{ background:"rgba(91,138,240,0.14)", border:"1px solid rgba(91,138,240,0.45)", color:"#90b8ff", borderRadius:8, padding:"9px 14px", cursor:"pointer", fontWeight:700 }}>{copyStatus || "Copy approval summary"}</button>
          </div>
        </div>
      </div>
    </main>
  );
}