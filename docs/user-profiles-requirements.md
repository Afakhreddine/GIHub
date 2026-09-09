# User Profiles & Personalization — Requirements

**Status:** Draft for review
**Author:** csleiman
**Last updated:** 2026-05-09

## 1. Context

GIHub is currently a fully anonymous educational hub. All content (guidelines, articles, news, lectures, quizzes) is fetched once by Claude-driven cron jobs and served identically to every visitor. Per-user state is limited to a small `localStorage` quiz history (20 entries, last device only).

We want to layer **authenticated user profiles** on top of the existing content pipeline so that each fellow can:

- track which articles in the weekly feed they've already read
- accumulate a real quiz history across devices and over time
- (later) carry personalized state for lectures, news, guidelines

The cron-driven content pipeline does not change shape. It still produces one global list per week. The personalization is purely additive: per-user pointers into the global content.

This document specifies the requirements and the architecture decisions that follow from them. It does **not** prescribe pixel-level UI or final SQL — those happen in the implementation PRs.

## 2. Goals

### Functional
1. **Sign in with Google.** A "Sign in with Google" button on the header. After consent, the user returns to the page they were on with a session established.
2. **Sign out.** A user menu in the header exposing the user's name/avatar and a sign-out action.
3. **Per-user article "read" tracking.** On the Articles tab, each card gets a "Mark as read" / "Mark as unread" affordance. The list shows an unread badge (e.g. `3 unread`) for signed-in users.
4. **Persistent quiz history.** Free-form quiz attempts (Quiz tab) and per-lecture quiz attempts (LectureDetailPanel) are stored server-side for signed-in users. Aggregate stats (overall score, per-topic score, per-lecture score) are visible to the user.
5. **One-time migration on first sign-in.** If a user has anonymous `localStorage` quiz history on the device they sign in from, it's imported into their server-side history once, then `localStorage` is cleared on that device.
6. **Anonymous access stays.** Unauthenticated visitors continue to see all content (guidelines, articles, news, lectures, the live quiz tab). Quiz history for anonymous users continues to use `localStorage`. Article read-tracking is unavailable to them.

### Non-functional
7. **Be efficient about cost.** No new always-on services. Free-tier hosting and identity service. No extra Anthropic calls.
8. **Be efficient about latency.** Auth check is non-blocking — anonymous and signed-in users both see content immediately. Personalization layers in once the session loads.
9. **Be efficient about code.** Reuse the existing dedup-identity pattern from `api/cron-guidelines.js` (PR #1) for stable article IDs. Reuse Redis for global content. Do not add a parallel Postgres copy of the article list.
10. **Privacy-respecting by default.** OAuth scopes minimized to `email` and `profile`. User can delete their own account and data.
11. **Survives the freshness refactor.** Whatever PR follows on the rolling/incremental articles design (currently pending the maintainer's input) must not invalidate stored per-user read state. Stable article IDs are the contract.

## 3. Non-goals (out of scope for this work)

- Adding identity providers beyond Google (institutional SSO, GitHub, etc.) — can be enabled later from the same provider config without code change.
- Role-based access control (admin, fellow, attending). Everyone signed in has the same permissions for now.
- Multi-tenant / per-institution data isolation. The whole repo serves one fellowship today.
- Social features (sharing reading lists, leaderboards, comments).
- Spaced-repetition / adaptive recommendations on top of quiz history. Future work.
- Migrating the global Redis caches (`gihub:guidelines:repo`, `gihub:articles`, etc.) to Postgres.

## 4. User stories

1. *As a GI fellow*, I sign in once on my work laptop and once on my phone. The same quiz history shows up on both.
2. *As a fellow prepping for Tuesday's IBS lecture*, I open the LectureDetailPanel, complete the 5-question quiz, and see those results in my quiz history alongside my free-form practice attempts.
3. *As a fellow checking the Articles tab weekly*, I see "3 unread" in the header. The three new articles since my last visit are visually distinguished. I click "Mark as read" on each as I work through them.
4. *As an attending visiting the site to look up a guideline*, I do not sign in. Everything works exactly as before. The Articles tab does not nag me to authenticate.
5. *As a fellow who used the anonymous Quiz tab for a month before signing in*, my prior 20 attempts show up in my server-side history after sign-in.
6. *As a fellow leaving the program*, I delete my account from a profile settings page. My quiz history and read-state are erased. The global content is unaffected.

## 5. Architecture decisions

### 5.1 Identity provider: Supabase

**Recommendation: Supabase** (auth + Postgres in one service).

Rationale:
- **Free tier matches the workload.** 50k MAU, 500MB Postgres, 5GB egress. Fellowship size is in the tens.
- **Google OAuth is one config toggle** in the Supabase dashboard; no manual OAuth dance to maintain.
- **Postgres + Row-Level Security (RLS)** lets the React app call Supabase directly with a session JWT — no new Vercel functions needed for user-data CRUD. RLS enforces "users can only see/modify their own rows" at the database, not application code.
- **One vendor for both concerns** (auth + relational user data). Cleaner than Clerk-for-auth + Redis-for-data, which forces us to invent a per-user index in Redis just to answer "show me what user X has read."
- **No vendor lock-in on auth tokens** — Supabase emits standard JWTs. If we migrate later, the React side is a swap of one client library.

Alternatives considered:
- **Clerk + Redis.** Clerk has the slickest React integration. But Redis is poorly shaped for "give me all read entries for user X" queries (would need per-user sets, manual cleanup), and Clerk's free tier is more constrained (10k MAU then pricing tiers).
- **Firebase Auth + Firestore.** Workable but heavier; pulls in Google Cloud project setup. Firestore's query model is less ergonomic than Postgres for the joins we'll want for stats.
- **NextAuth / Auth.js.** Optimized for SSR frameworks. Awkward in a Vite SPA — would need to either move auth handling into Vercel functions or use a less-supported SPA adapter.
- **Institutional SAML/OIDC.** Most fellowship programs have SSO. Real option for later — Supabase supports SAML on its paid tier. Out of scope for v1.

### 5.2 Anonymous-first architecture

Sign-in is **additive**, not gating. The implications:

- The React app renders content the same way for both audiences. The auth state is a `null | session` value read from a Supabase hook (`useSession()`).
- Components that need personalization (read state, quiz history) read from Supabase only when `session !== null`. When null, they fall back to existing behavior (no read state shown; quiz uses `localStorage`).
- This means **no Vercel function changes** for the auth gate — the existing public `/api/claude`, `/api/cron-*`, `/api/debug` keep their current contracts (`/api/claude` still public, the rest still behind `CRON_SECRET` per PR #2).
- New per-user reads/writes flow directly from the SPA → Supabase (over HTTPS, JWT-authenticated). No new endpoints on our side.

### 5.3 Where the global content still lives

Unchanged: Upstash Redis. The cron pipeline (PR #2) keeps writing:

- `gihub:guidelines:repo` (full guidelines repo)
- `gihub:articles` (this week's article feed)
- `gihub:news` (this week's news feed)
- `gihub:lecture:<slug>` (per-topic bundle)

Supabase is **only** for user-scoped data. We deliberately do not duplicate article content into Postgres. The per-user "read" rows hold an article *ID*, not the article body.

## 6. Article identity

**Per-user read state is meaningless without stable article IDs.** The current `cron-articles.js` flow replaces `gihub:articles` wholesale each Sunday with whatever Sonnet returns. If a user marks an article "read" on Monday and the next Sunday's refresh returns a slightly different title for the same paper, the read pointer is orphaned.

This work depends on stable IDs being embedded in the cached articles. Two pieces:

### 6.1 ID derivation (reuses PR #1's pattern)

For each article, compute an identity token list in priority order:
1. **PII / DOI fragment** (`S0016-5085(25)06013-5`) if the URL is a journal article URL
2. **PubMed ID** if the URL is `pubmed.ncbi.nlm.nih.gov/<digits>/`
3. **Canonical URL + year** otherwise (with `www.` stripped, query/fragment removed, trailing slash removed)
4. **Title fallback**: SHA-1 of `journal|year|month|normalized-title-prefix-80-chars`

Hash the strongest available token to a 16-char hex ID. Article entries gain an `id` field. Same conceptual scheme as `identityTokens()` in `cron-guidelines.js` post-PR #1.

### 6.2 Where the ID gets stamped

In `cron-articles.js`, before writing to Redis: enrich each item with `id` derived as above. Same change in `cron-schedule.js` for the per-lecture articles.

This is a small refactor on top of PR #1's `cron-auth.js` and `cron-guidelines.js` work — same pattern, different data shape.

**This refactor is a prerequisite for the user-profile feature and should land before or with the user-data schema migration.**

## 7. Data model

### 7.1 Supabase schema

```sql
-- Auth is handled by Supabase; auth.users.id (uuid) is the canonical user ref.

-- Article read state
create table public.article_reads (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  article_id text        not null,                  -- the stable ID computed in §6
  read_at    timestamptz not null default now(),
  primary key (user_id, article_id)
);

-- Quiz attempts (free-form Quiz tab AND per-lecture quizzes)
create table public.quiz_attempts (
  id            bigserial   primary key,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  attempted_at  timestamptz not null default now(),
  quiz_type     text        not null check (quiz_type in ('topic', 'lecture')),
  topic         text,                               -- 'IBD', 'Motility' for type='topic'
  lecture_slug  text,                               -- 'irritable-bowel-syndrome' for type='lecture'
  question_idx  smallint,                           -- 0..4 within a lecture quiz; null for type='topic'
  question_hash text        not null,               -- sha1(question text), stable identity
  selected      char(1)     not null check (selected in ('A','B','C','D')),
  correct       boolean     not null
);

create index quiz_attempts_user_time on public.quiz_attempts (user_id, attempted_at desc);
create index quiz_attempts_user_topic on public.quiz_attempts (user_id, topic);
create index quiz_attempts_user_lecture on public.quiz_attempts (user_id, lecture_slug);

-- RLS: users can only see/write their own rows
alter table public.article_reads enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "own reads"    on public.article_reads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Why these shapes:
- `article_reads`: composite primary key on `(user_id, article_id)`. Idempotent — marking the same article read twice is a no-op upsert. `read_at` is metadata only.
- `quiz_attempts`: append-only. Lets us show history, recompute stats, support the maintainer revisiting question quality. `question_hash` lets us aggregate stats per question even when the question text is regenerated by Claude.

### 7.2 Aggregate views

For stats, create simple views — keeps the SPA from doing heavy aggregation client-side:

```sql
create view public.user_quiz_stats as
select
  user_id,
  count(*)                                              as total_attempts,
  count(*) filter (where correct)                       as correct_count,
  round(100.0 * count(*) filter (where correct) / count(*), 1) as pct_correct
from public.quiz_attempts
group by user_id;
```

Per-topic and per-lecture views follow the same shape. The SPA queries the views with `select * from user_quiz_stats where user_id = auth.uid()`.

### 7.3 What does NOT go in Postgres

- Article bodies, titles, summaries, URLs. Those stay in `gihub:articles` (Redis), keyed by ID.
- Question text, options, correct answer, explanation. Those stay in `gihub:lecture:<slug>` (Redis). We only persist the user's answer + correctness in Postgres.
- Anything the cron writes weekly. Postgres mirrors of Redis would invite drift.

## 8. UI changes

Concrete enough to scope, not so concrete that they prescribe pixels.

### 8.1 Header (always visible)

When signed out: a `Sign in with Google` button on the right side of the top bar (where the date currently sits).
When signed in: an avatar + dropdown with the user's email, a `Settings` link (account deletion), and `Sign out`.

### 8.2 Articles tab (`ContentSection type="articles"`)

- Above the grid, a small status row: `3 unread of 10` (signed-in only).
- Each `ContentCard`: a small `eye` / `eye-off` toggle in the top-right corner. Click toggles read state. Optimistically updates UI, persists via Supabase.
- Unread cards get a subtle left-border accent (reuse the existing `ac` hover color) so they're visually scannable.
- A new "Mark all as read" link in the status row.

### 8.3 Quiz tab (`QuizSection`)

- Behavior for signed-out users unchanged (writes to `localStorage`).
- Signed-in users: every `submit()` writes a row to `quiz_attempts`. The on-screen "Score History" panel pulls from Postgres instead of `localStorage`.
- "AVG SCORE" pill in the header reads from `user_quiz_stats`.
- On first sign-in (detected via Supabase's `INITIAL_SESSION` event + a `has_imported` flag in `localStorage`), if `localStorage` contains the legacy quiz history, write each entry as a quiz_attempt (with `attempted_at` preserved from the legacy `date+time` strings) and set the flag.

### 8.4 LectureDetailPanel quiz

- `QuizDisplay` currently keeps answers in `useState` only. For signed-in users, every answer write also persists as a `quiz_attempts` row with `quiz_type='lecture'`, `lecture_slug=event.slug`, `question_idx=quizIndex`.
- The dots indicator (the existing colored circles below the question) can be derived from the user's prior attempts on those exact `question_hash`es — so revisits highlight which they got right last time.

### 8.5 Account settings (new, small page)

A minimal `/settings` route reachable from the header dropdown. Shows the user's email, a "Delete my account and all data" button with a confirm step. Deletion calls `supabase.rpc('delete_my_account')` which executes `delete from auth.users where id = auth.uid()` — the `on delete cascade` on `article_reads` and `quiz_attempts` does the rest.

(For v1 we don't need full export-my-data; we just need delete.)

## 9. API surface

No new Vercel functions. All user-data access from the SPA goes directly to Supabase:

| Operation | How |
|---|---|
| Sign in / sign out | `supabase.auth.signInWithOAuth({ provider: 'google' })` / `supabase.auth.signOut()` |
| List my read article IDs | `supabase.from('article_reads').select('article_id').eq('user_id', uid)` — RLS-scoped |
| Mark article read | `supabase.from('article_reads').upsert({ article_id: id })` — RLS fills `user_id` |
| Mark article unread | `supabase.from('article_reads').delete().eq('article_id', id)` |
| Record quiz attempt | `supabase.from('quiz_attempts').insert({ ... })` |
| Read history | `supabase.from('quiz_attempts').select('*').order('attempted_at', { ascending: false }).limit(50)` |
| Read aggregate stats | `supabase.from('user_quiz_stats').select('*').single()` |
| Delete account | `supabase.rpc('delete_my_account')` (one Postgres function the SPA invokes) |

Authentication is via the Supabase JS client's automatic JWT attachment. RLS enforces ownership.

## 10. Migration plan

### 10.1 localStorage import

One-time on first authenticated session per device:

1. SPA detects `session.user.id` is set AND `localStorage['gihub_quiz_history']` exists AND `localStorage['gihub_history_imported_for'] !== session.user.id`.
2. Parse the legacy history (`[{topic, correct, date, time}]`).
3. Bulk insert into `quiz_attempts` with `quiz_type='topic'`, `question_hash='legacy:'+sha1(topic+date+time)` (so legacy entries can never collide with a real question hash).
4. Set `localStorage['gihub_history_imported_for'] = session.user.id`.
5. Clear `localStorage['gihub_quiz_history']` on that device.

This is idempotent: re-running the import does nothing because the flag stays set. Multi-device users get their primary-device history imported; secondary devices' `localStorage` is just dropped (we don't merge histories from multiple devices because the timestamps would be approximate and we'd risk double-counting).

### 10.2 Article ID backfill

The cron writes IDs forward (§6.2) starting from its first post-deploy run. No retroactive backfill is needed — anonymous users had no read state to preserve, and the first signed-in user can only mark articles read from that point forward.

### 10.3 Phased rollout

Each phase is a separate PR; phases can ship independently.

| Phase | PR scope |
|---|---|
| **A** | Add stable IDs to the article cron output (`cron-articles.js`, `cron-schedule.js`). No UI change. **Prerequisite, valuable in isolation.** |
| **B** | Supabase project setup + schema migrations + RLS policies + `delete_my_account()` function. No UI change. |
| **C** | Supabase JS client + auth context in `App.jsx`. Header gets sign-in/sign-out UI. Nothing personalized yet, but the session plumbing is live. |
| **D** | Articles tab: mark-as-read toggle, unread badge. Reads from Supabase when signed in, no-ops when signed out. |
| **E** | Quiz tab: server-side history for signed-in users. localStorage import. Aggregate stats via `user_quiz_stats`. |
| **F** | LectureDetailPanel quiz persistence. |
| **G** | Settings page with account deletion. |

Phases C–G can ship in any order after B. Phase A must land first.

## 11. Privacy & data handling

- **Scopes requested from Google**: `openid email profile` only. No Drive, Calendar, etc.
- **What we store about a user**: their Supabase `auth.users` row (email, display name, avatar URL — populated by the Google OAuth flow), their `article_reads` rows, their `quiz_attempts` rows.
- **What we never store**: real names beyond what Google returns (display name), institutional affiliation, anything HIPAA-relevant.
- **Deletion**: user-initiated from settings page. Hard-deletes the row in `auth.users`; cascades remove all linked rows.
- **Data retention**: indefinite while the account exists; no automatic expiration of old quiz attempts.
- **Export**: not in v1. If a fellow wants their history before deletion, they can ask the maintainer to run a one-shot SQL select. Real export endpoint is a future enhancement.
- **Audit log**: not in v1. Supabase's built-in `auth.audit_log_entries` table is sufficient for "who signed in when."

## 12. Efficiency: explicit ledger

Where we save vs spend, since the brief emphasized this:

- **No new Vercel function invocations.** All personalization writes/reads go SPA → Supabase. Vercel function budget unchanged.
- **No new Anthropic calls.** Personalization is a presentation layer over content the existing cron already produced.
- **One additional vendor, free tier.** Supabase. We do not add another database / cache.
- **One additional dependency in the SPA.** `@supabase/supabase-js`. Adds ~30 KB gzipped; acceptable for the ~70 KB current bundle.
- **Idempotent / upsert-based writes.** `article_reads` uses a composite primary key and upserts; no duplicate-row hygiene needed. `quiz_attempts` is append-only and indexed for the queries we run.
- **Aggregates computed in Postgres** via views, not in the SPA.
- **No N+1 patterns.** The Articles tab fetches the user's full read-ID set once on mount (one query, returns a few hundred rows max ever) and checks set membership client-side.

## 13. Open questions (for decision before implementation starts)

1. **Identity provider** — Supabase recommended above. Confirm before we lock the schema and the JS client to it. If institutional SAML is on the near horizon, we should know now so we pick the right Supabase tier.
2. **First-device-wins for localStorage import** — accepted in §10.1. If preserving every device's history matters, we need a deduping merge instead. Probably not worth it; flagging in case.
3. **Account deletion confirmation strength** — typed-confirm ("type DELETE to confirm") vs simple modal. I'd default to typed-confirm given this is educational performance data.
4. **Anonymous read-state in localStorage?** Should anonymous users be able to mark articles read on their device, with no server roundtrip? Adds a small bit of UX consistency but creates the question "what happens when they sign in later." Default: **no anonymous read state** — keep the gate simple.
5. **Lecture quiz: pin questions or accept regeneration?** The per-lecture quiz is pre-generated by the cron and re-runs (currently) whenever the cron fires. If the cron regenerates the 5 questions, prior `question_hash` rows orphan. Two paths:
   - (a) Don't regenerate — once a lecture has questions, the cron skips quiz regen for that slug. Stable history.
   - (b) Regenerate freely — stats become "attempts on questions that no longer exist." Still informative but messier.
   - I lean toward (a). Confirm.
6. **Pin to one fellowship?** Today GIHub serves one cohort. If we expect a second program to use this, we'd want `institution_id` on every user row from day one to avoid a future migration. Adds maybe 30 minutes of upfront work.

## 14. Acceptance criteria (when is this done?)

- [ ] A signed-out visitor sees the site exactly as it works today, with the addition of a sign-in button.
- [ ] A signed-in user can mark and unmark articles as read. The state is consistent across devices and persists across cron refreshes.
- [ ] A signed-in user's quiz attempts (free-form + per-lecture) are visible in their history. Aggregate score reflects their actual performance.
- [ ] A signed-in user with prior `localStorage` quiz history sees their old attempts after their first sign-in.
- [ ] A signed-in user can delete their account, and after they do so they appear as a brand-new signed-out visitor.
- [ ] No new unauthenticated endpoints on the Vercel side.
- [ ] The article ID embedded by the cron is stable across cron runs for the same underlying paper.
- [ ] All tests pass; phase A and the schema migrations have their own tests.

## 15. References

- PR #1 — guideline dedup, source of the `identityTokens()` pattern reused for article IDs: <https://github.com/Afakhreddine/GIHub/pull/1>
- PR #2 — cron auth + scheduling: <https://github.com/Afakhreddine/GIHub/pull/2>
- PR #3 — article impactLevel taxonomy: <https://github.com/Afakhreddine/GIHub/pull/3>
- Pending: rolling vs incremental article refresh design (awaiting maintainer input). The user-profile feature is robust to either outcome **as long as stable article IDs land first**.
