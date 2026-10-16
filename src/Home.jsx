import guidelines from "./data/guidelines.js";
import weekly from "./data/weekly.js";
import weeklyPodcasts from "./data/weeklyPodcasts.js";
import scheduleResources from "./data/scheduleResources.js";
import { CALENDAR_MONTH, CALENDAR_EVENTS } from "./scheduleConfig.js";
import { isPublicApprovedResource, sanitizeScheduleResourceForPublic } from "./scheduleResourcesModel.js";
import "./Home.css";

const publishedWeekly = weekly.filter(isPublicApprovedResource);
const recentWeekly = [...publishedWeekly]
  .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
  .slice(0, 3);
const featuredGuidelines = [...guidelines]
  .filter(item => item.title && item.url)
  .sort((a, b) => (Date.parse(`${b.month} 1, ${b.year}`) || 0) - (Date.parse(`${a.month} 1, ${a.year}`) || 0))
  .slice(0, 3);
const latestPodcast = [...weeklyPodcasts].filter(item => item.audioUrl).sort((a, b) => b.date.localeCompare(a.date))[0];

function sourceUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function SectionButton({ id, children, onNavigate, className = "" }) {
  return <button type="button" className={className} onClick={() => onNavigate(id)}>{children}</button>;
}

export default function Home({ onNavigate }) {
  // Compare calendar dates in local time so an event does not disappear early in western time zones.
  const today = new Date();
  const localDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const upcoming = CALENDAR_EVENTS
    .filter(event => event.date >= localDay && event.topic && event.slug && !/cancel(?:led|ed)?|no conference/i.test(event.label || ""))
    .sort((a, b) => a.date.localeCompare(b.date));
  const teaching = upcoming.slice(0, 3);

  return (
    <main className="coastal-home">
      <div className="coastal-home__body">
          <section className="coastal-home__section" aria-labelledby="coastal-guidelines-title">
            <div className="coastal-home__heading"><div><p className="coastal-home__eyebrow">Clinical guidelines</p><h2 id="coastal-guidelines-title">Grounded in the source.</h2></div><SectionButton id="guidelines" onNavigate={onNavigate} className="coastal-home__text-link">Browse all guidelines <span aria-hidden="true">↗</span></SectionButton></div>
            <div className="coastal-home__card-grid">
              {featuredGuidelines.map(item => <article className="coastal-home__card" key={`${item.org}-${item.title}`}>
                <div className="coastal-home__card-meta"><span className="coastal-home__pill">{item.org}</span><span>{item.month} {item.year}</span></div>
                <h3>{item.title}</h3><p>{item.summary}</p>
                <div className="coastal-home__card-footer"><span>{item.topic}</span>{sourceUrl(item.url) && <a href={sourceUrl(item.url)} target="_blank" rel="noopener noreferrer" aria-label={`View source for ${item.title} (opens in new tab)`}>View source <span aria-hidden="true">↗</span></a>}</div>
              </article>)}
            </div>
          </section>

          <div className="coastal-home__split">
            <section className="coastal-home__section" aria-labelledby="coastal-weekly-title">
              <div className="coastal-home__heading"><div><p className="coastal-home__eyebrow">Weekly update</p><h2 id="coastal-weekly-title">On the reading list.</h2></div><SectionButton id="weekly" onNavigate={onNavigate} className="coastal-home__text-link">See all updates <span aria-hidden="true">↗</span></SectionButton></div>
              <div className="coastal-home__weekly-list">
                {recentWeekly.map(item => <article className="coastal-home__weekly-item" key={`${item.title}-${item.date}`}>
                  <div className="coastal-home__card-meta"><span className="coastal-home__pill coastal-home__pill--green">{item.type}</span><span>{item.date}</span></div>
                  <h3>{item.title}</h3><p>{item.source}{item.topic ? ` · ${item.topic}` : ""}</p>
                  {sourceUrl(item.studyUrl || item.url) && <a href={sourceUrl(item.studyUrl || item.url)} target="_blank" rel="noopener noreferrer" aria-label={`Read source for ${item.title} (opens in new tab)`}>Read source <span aria-hidden="true">↗</span></a>}
                </article>)}
              </div>
            </section>

            <section className="coastal-home__section coastal-home__schedule" aria-labelledby="coastal-schedule-title">
              <div className="coastal-home__heading"><div><p className="coastal-home__eyebrow">{CALENDAR_MONTH} · Teaching calendar</p><h2 id="coastal-schedule-title">Coming up next.</h2></div></div>
              {teaching.length ? <ol className="coastal-home__timeline">{teaching.map(event => {
                const resources = sanitizeScheduleResourceForPublic(scheduleResources[event.slug]);
                const count = resources.guidelines.length + resources.newsAndArticles.length;
                return <li key={`${event.date}-${event.slug}`}>
                  <time dateTime={event.date}><strong>{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-US", { day: "numeric" })}</strong><span>{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</span></time>
                  <div><h3>{event.topic}</h3><p>{event.label}</p><small>{count ? `${count} public reading resources` : "View schedule for details"}</small></div>
                </li>;
              })}</ol> : <p className="coastal-home__empty">No upcoming lectures in the published {CALENDAR_MONTH} calendar. Check the schedule for updates.</p>}
              <SectionButton id="schedule" onNavigate={onNavigate} className="coastal-home__schedule-link">View full schedule <span aria-hidden="true">→</span></SectionButton>
            </section>
          </div>

          {latestPodcast && <section className="coastal-home__podcast" aria-labelledby="coastal-podcast-title">
            <div className="coastal-home__podcast-symbol" aria-hidden="true">♫</div>
            <div><p className="coastal-home__eyebrow">Listen & learn · {latestPodcast.displayDate}</p><h2 id="coastal-podcast-title">The Weekly Update, in your ears.</h2><p>{latestPodcast.title} · {latestPodcast.duration}</p></div>
            <SectionButton id="weekly" onNavigate={onNavigate} className="coastal-home__secondary">Listen in Weekly Update <span aria-hidden="true">→</span></SectionButton>
          </section>}
          <footer className="coastal-home__footer">GIHub is an educational reference. Verify guidance against original sources; not a substitute for clinical judgment.</footer>
      </div>
    </main>
  );
}
