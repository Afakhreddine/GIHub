import React, { useEffect, useState } from "react";
import guidelineReviewCandidates from "./data/guidelineReviewCandidates.js";
import { buildGuidelinePublishPayload, canPublishGuidelineReview, filterGuidelineItems, guidelineItemId, guidelineReviewDataApiPath, guidelineReviewSourceFromLocation, loadGuidelineDecisions, saveGuidelineDecisions } from "./guidelineReviewModel.js";

async function saveServerDecisions(pullNumber, decisions) {
  if (!pullNumber) return null;
  const response = await fetch("/api/schedule-review-data?workflow=guidelines", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ pullNumber, decisions }),
  });
  const body = await response.json();
  if (!response.ok || !body.ok) throw new Error(body.error || "Could not save review decisions");
  return body;
}

export default function GuidelineReview({ items = guidelineReviewCandidates }) {
  const [query, setQuery] = useState("");
  const [org, setOrg] = useState("All");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [decisions, setDecisions] = useState(() => loadGuidelineDecisions(typeof window === "undefined" ? null : window.localStorage));
  const [reviewItems, setReviewItems] = useState(items);
  const [reviewPullNumber, setReviewPullNumber] = useState("");
  const [sourceStatus, setSourceStatus] = useState("");
  const [publishStatus, setPublishStatus] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);
  const visibleItems = filterGuidelineItems(reviewItems, { query, org, decision:decisionFilter, decisions });
  const publishReady = canPublishGuidelineReview(reviewItems, decisions);
  const orgs = ["All", ...new Set(reviewItems.map((item) => item.org).filter(Boolean))];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const source = guidelineReviewSourceFromLocation(window.location.href);
    let cancelled = false;
    setSourceStatus(source.pr ? `Loading PR #${source.pr} guideline candidates…` : "Loading latest guideline-candidate PR…");
    fetch(guidelineReviewDataApiPath(source))
      .then((response) => response.json().then((body) => ({ response, body })))
      .then(async ({ response, body }) => {
        if (cancelled) return;
        if (!response.ok || !Array.isArray(body.items)) throw new Error(body.error || "Could not load guideline review candidates");
        const pullNumber = String(body.pr || source.pr || "");
        setReviewItems(body.items);
        setReviewPullNumber(pullNumber);
        setSourceStatus(`Reviewing PR #${body.pr} · ${body.items.length} guideline candidate${body.items.length === 1 ? "" : "s"} · loading saved decisions…`);
        try {
          const saved = body.savedDecisions || {};
          if (saved && Object.keys(saved).length) {
            setDecisions(saved);
            saveGuidelineDecisions(window.localStorage, saved);
            setSourceStatus(`Reviewing PR #${body.pr} · ${body.items.length} guideline candidate${body.items.length === 1 ? "" : "s"} · saved decisions restored`);
          } else if (!cancelled) {
            setSourceStatus(`Reviewing PR #${body.pr} · ${body.items.length} guideline candidate${body.items.length === 1 ? "" : "s"}`);
          }
        } catch {
          if (!cancelled) setSourceStatus(`Reviewing PR #${body.pr} · ${body.items.length} guideline candidate${body.items.length === 1 ? "" : "s"} · using local decisions`);
        }
      })
      .catch((error) => {
        if (!cancelled) setSourceStatus(error.message || "Could not load guideline candidates");
      });
    return () => { cancelled = true; };
  }, []);

  function markDecision(item, decision) {
    const next = { ...decisions, [guidelineItemId(item)]:decision };
    setDecisions(next);
    saveGuidelineDecisions(window.localStorage, next);
    if (reviewPullNumber) {
      setSourceStatus(`Reviewing PR #${reviewPullNumber} · ${reviewItems.length} guideline candidates · saving decisions…`);
      saveServerDecisions(reviewPullNumber, next)
        .then(() => setSourceStatus(`Reviewing PR #${reviewPullNumber} · ${reviewItems.length} guideline candidates · decisions saved`))
        .catch(() => setSourceStatus(`Reviewing PR #${reviewPullNumber} · ${reviewItems.length} guideline candidates · local decision saved; server save failed`));
    }
  }

  async function publishApprovedGuidelines() {
    if (!publishReady || publishBusy) return;
    const token = window.prompt("Enter Guidelines Review publish code");
    if (!token) return;
    setPublishBusy(true);
    setPublishStatus("Publishing…");
    try {
      const { pr } = typeof window === "undefined" ? { pr:"" } : guidelineReviewSourceFromLocation(window.location.href);
      const pullNumber = reviewPullNumber || pr;
      const response = await fetch("/api/schedule-review-publish", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ ...buildGuidelinePublishPayload(reviewItems, decisions), workflow:"guidelines", pullNumber, token }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || result.reason || "Publish failed");
      setPublishStatus(result.published ? `Published PR #${result.pullNumber}` : result.message || "Updated PR with approved guidelines");
    } catch (error) {
      setPublishStatus(error.message || "Publish failed");
    } finally {
      setPublishBusy(false);
    }
  }

  return (
    <main style={{ minHeight:"100vh", background:"#080f1e", color:"#d0e0ff", fontFamily:"Georgia,'Times New Roman',serif", padding:"32px" }}>
      <div style={{ maxWidth:1120, margin:"0 auto" }}>
        <p style={{ fontSize:11, color:"#5b8af0", fontFamily:"monospace", letterSpacing:1.2 }}>GIHUB · GUIDELINES REVIEW SANDBOX</p>
        <h1 style={{ fontSize:28, fontWeight:700, color:"#e0eeff", margin:"8px 0" }}>⚕️ Guideline Candidate Review</h1>
        <p style={{ fontSize:13, color:"#5a6a88", marginBottom:8 }}>Approve verified new guidelines before they are appended to the Clinical Guidelines repository.</p>
        {sourceStatus && <p style={{ fontSize:12, color:"#5b8af0", margin:"0 0 24px", fontFamily:"monospace" }}>{sourceStatus}</p>}
        {!sourceStatus && <div style={{ marginBottom:24 }} />}
        <label style={{ display:"block", color:"#6a8aaa", fontSize:12, marginBottom:22 }}>
          Search guideline candidates
          <input aria-label="Search guideline candidates" value={query} onChange={(event) => setQuery(event.target.value)} style={{ display:"block", marginTop:7, width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#c8d8f0" }}/>
        </label>
        <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Society {" "}
            <select aria-label="Filter by society" value={org} onChange={(event) => setOrg(event.target.value)}>{orgs.map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <label style={{ fontSize:12, color:"#6a8aaa" }}>Decision {" "}
            <select aria-label="Filter by decision" value={decisionFilter} onChange={(event) => setDecisionFilter(event.target.value)}>{["All", "Approve", "Hold", "Reject"].map((value) => <option key={value}>{value}</option>)}</select>
          </label>
          <span style={{ fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>{visibleItems.length} of {reviewItems.length} candidates</span>
        </div>
        <div style={{ display:"grid", gap:14 }}>
          {visibleItems.map((item) => (
            <article key={guidelineItemId(item)} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderLeft:"3px solid #5b8af0", borderRadius:12, padding:"20px 22px" }}>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center", fontSize:11, color:"#5a6a88", fontFamily:"monospace" }}>
                <span>{item.org}</span><span>·</span><span>{item.month} {item.year}</span><span>·</span><span>{item.topic}</span><span>·</span><span style={{ color:"#e09a2a" }}>{item.status || "candidate-review"}</span>
              </div>
              <h2 style={{ fontSize:16, color:"#c8d8f0", margin:"8px 0" }}>{item.title}</h2>
              <p style={{ fontSize:13, color:"#6a7a90", lineHeight:1.7 }}>{item.summary}</p>
              {item.reviewReason && <p style={{ fontSize:11.5, color:"#445570", marginTop:8 }}>Review note: {item.reviewReason}</p>}
              <div style={{ display:"flex", gap:12, marginTop:12, flexWrap:"wrap" }}>
                {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color:"#5b8af0", fontSize:12, textDecoration:"none" }}>Open source ↗</a>}
                {item.pmid && <a href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`} target="_blank" rel="noreferrer" style={{ color:"#4caf7d", fontSize:12, textDecoration:"none" }}>PubMed {item.pmid} ↗</a>}
                {item.doi && <span style={{ color:"#3a5878", fontSize:11, fontFamily:"monospace" }}>DOI {item.doi}</span>}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                {["Approve", "Hold", "Reject"].map((decision) => {
                  const selected = decisions[guidelineItemId(item)] === decision;
                  const color = { Approve:"#4caf7d", Hold:"#e09a2a", Reject:"#e05252" }[decision];
                  return <button key={decision} type="button" aria-pressed={selected} onClick={() => markDecision(item, decision)} style={{ border:`1px solid ${selected ? color : "rgba(255,255,255,0.1)"}`, background:selected ? `${color}22` : "rgba(255,255,255,0.03)", color:selected ? color : "#5a6a88", borderRadius:7, padding:"7px 12px", cursor:"pointer" }}>{decision}</button>;
                })}
              </div>
            </article>
          ))}
          {visibleItems.length === 0 && <p style={{ color:"#3a5878", padding:"32px 0", textAlign:"center" }}>No guideline candidates match these filters.</p>}
        </div>
        <div style={{ position:"sticky", bottom:16, marginTop:24, padding:"14px 16px", border:"1px solid rgba(91,138,240,0.25)", borderRadius:12, background:"rgba(10,20,40,0.96)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", boxShadow:"0 8px 30px rgba(0,0,0,0.35)" }}>
          <span style={{ fontSize:12, color:"#5a6a88", fontFamily:"monospace" }}>{Object.keys(decisions).length}/{reviewItems.length} reviewed</span>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            {publishStatus && <span style={{ fontSize:12, color:publishStatus.startsWith("Published") ? "#4caf7d" : "#e09a2a", fontFamily:"monospace" }}>{publishStatus}</span>}
            <button type="button" onClick={publishApprovedGuidelines} disabled={!publishReady || publishBusy} style={{ background:publishReady ? "rgba(76,175,125,0.16)" : "rgba(255,255,255,0.04)", border:`1px solid ${publishReady ? "rgba(76,175,125,0.55)" : "rgba(255,255,255,0.08)"}`, color:publishReady ? "#7ee0aa" : "#42546f", borderRadius:8, padding:"9px 14px", cursor:publishReady ? "pointer" : "not-allowed", fontWeight:700 }}>{publishBusy ? "Publishing…" : "Publish approved"}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
