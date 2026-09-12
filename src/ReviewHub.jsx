import React from "react";
import WeeklyReview from "./WeeklyReview.jsx";
import ScheduleReview from "./ScheduleReview.jsx";

function currentTab() {
  if (typeof window === "undefined") return "weekly";
  const url = new URL(window.location.href);
  return url.searchParams.get("tab") === "schedule" ? "schedule" : "weekly";
}

function tabHref(tab) {
  if (typeof window === "undefined") return `/review?tab=${tab}`;
  const url = new URL(window.location.href);
  url.pathname = "/review";
  url.searchParams.set("tab", tab);
  return `${url.pathname}${url.search}`;
}

export default function ReviewHub() {
  const tab = currentTab();
  const tabs = [
    { id:"weekly", label:"Weekly Update" },
    { id:"schedule", label:"Schedule Cards" },
  ];
  return (
    <>
      <nav aria-label="Review workflow tabs" style={{ position:"sticky", top:0, zIndex:10, background:"#080f1e", borderBottom:"1px solid rgba(91,138,240,0.22)", padding:"12px 32px", display:"flex", gap:10, fontFamily:"Georgia,'Times New Roman',serif" }}>
        {tabs.map((item) => {
          const selected = tab === item.id;
          return <a key={item.id} href={tabHref(item.id)} aria-current={selected ? "page" : undefined} style={{ color:selected ? "#7ee0aa" : "#5b8af0", background:selected ? "rgba(76,175,125,0.13)" : "rgba(91,138,240,0.08)", border:`1px solid ${selected ? "rgba(76,175,125,0.45)" : "rgba(91,138,240,0.2)"}`, borderRadius:999, padding:"8px 12px", textDecoration:"none", fontSize:13, fontWeight:700 }}>{item.label}</a>;
        })}
      </nav>
      {tab === "schedule" ? <ScheduleReview /> : <WeeklyReview />}
    </>
  );
}
