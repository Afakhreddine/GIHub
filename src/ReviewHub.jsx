import React, { useState } from "react";
import WeeklyReview from "./WeeklyReview.jsx";
import ScheduleReview from "./ScheduleReview.jsx";

function initialTab() {
  if (typeof window === "undefined") return "weekly";
  const url = new URL(window.location.href);
  return url.searchParams.get("tab") === "schedule" ? "schedule" : "weekly";
}

export default function ReviewHub() {
  const [tab, setTab] = useState(initialTab);
  const tabs = [
    { id:"weekly", label:"Weekly Update" },
    { id:"schedule", label:"Schedule Cards" },
  ];
  return (
    <>
      <nav aria-label="Review workflow tabs" style={{ position:"sticky", top:0, zIndex:10, background:"#080f1e", borderBottom:"1px solid rgba(91,138,240,0.22)", padding:"12px 32px", display:"flex", gap:10, fontFamily:"Georgia,'Times New Roman',serif" }}>
        {tabs.map((item) => {
          const selected = tab === item.id;
          return <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-pressed={selected} style={{ color:selected ? "#7ee0aa" : "#5b8af0", background:selected ? "rgba(76,175,125,0.13)" : "rgba(91,138,240,0.08)", border:`1px solid ${selected ? "rgba(76,175,125,0.45)" : "rgba(91,138,240,0.2)"}`, borderRadius:999, padding:"8px 12px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{item.label}</button>;
        })}
        <span style={{ alignSelf:"center", color:"#3a5878", fontSize:12, fontFamily:"monospace" }}>gi-hub.vercel.app/review</span>
      </nav>
      {tab === "schedule" ? <ScheduleReview /> : <WeeklyReview />}
    </>
  );
}
