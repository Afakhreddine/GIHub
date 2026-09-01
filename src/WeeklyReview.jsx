import React, { useState } from "react";
import weekly from "./data/weekly.js";
import { buildApprovalSummary, filterWeeklyItems, loadDecisions, saveDecisions, weeklyItemId } from "./weeklyReviewModel.js";

export default function WeeklyReview({ items = weekly }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [decisions, setDecisions] = useState(() => loadDecisions(typeof window === "undefined" ? null : window.localStorage));
  const [copyStatus, setCopyStatus] = useState("");
  const visibleItems = filterWeeklyItems(items, { query, type, decision:decisionFilter, decisions });
  const types = ["All", ...new Set(items.map((item) => item.type))];

  function markDecision(item, decision) {
    const next = { ...decisions, [weeklyItemId(item)]:decision };
    setDecisions(next);
    saveDecisions(window.localStorage, next);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildApprovalSummary(items, decisions));
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed");
    }
  }

  return (
    <main style={{ minHeight:"100vh", background:"#080f1e", color:"#d0e0ff", fontFamily:"Georgia,'Times New Roman',serif", padding:"32px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <p style={{ fontSize:11, color:"#5b8af0", fontFamily:"monospace", letterSpacing:1.2 }}>GIHUB · REVIEW SANDBOX</p>
        <h1 style={{ fontSize:28, fontWeight:700, color:"#e0eeff", margin:"8px 0" }}>📰 Weekly Update Review</h1>
        <p style={{ fontSize:13, color:"#5a6a88", marginBottom:24 }}>Review repo-managed study and news cards before publication.</p>
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
          <span style={{ fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>{visibleItems.length} of {items.length} cards</span>
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
          <span style={{ fontSize:12, color:"#5a6a88", fontFamily:"monospace" }}>{Object.keys(decisions).length}/{items.length} reviewed</span>
          <button type="button" onClick={copySummary} style={{ background:"rgba(91,138,240,0.14)", border:"1px solid rgba(91,138,240,0.45)", color:"#90b8ff", borderRadius:8, padding:"9px 14px", cursor:"pointer", fontWeight:700 }}>{copyStatus || "Copy approval summary"}</button>
        </div>
      </div>
    </main>
  );
}