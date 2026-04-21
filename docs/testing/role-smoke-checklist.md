# Role smoke checklist (local Supabase + seeded users)

Use this after `supabase start`, `npm run seed:dev-users`, and `npm run dev` with `.env` / `.env.local` configured.

**Auth note:** When Supabase env vars are set, **`/` requires sign-in** (dashboard is behind `ProtectedRoute`). Without env vars, the app stays in anonymous preview mode.

For each seeded account (`docs/testing/test-accounts.md`):

1. Sign in (dev switcher on `/sign-in` or manual).
2. Confirm **sidebar** shows **real** `profiles.full_name` (or email local-part) — not Sarah / Emma mock names.
3. Open **Settings → Account** and confirm **database `app_role`** matches the seed row.
4. Confirm **no “Preview as” / role dropdown** appears in the header while signed in; role comes only from the profile.
5. **Dashboard**
   - All families share **`useDashboardLessons`** (RLS on **`public.lessons`**, single query path). The select embeds **`teachers → profiles (full_name)`** and **`lesson_participants → students → profiles (full_name)`**; the client maps names when RLS returns nested rows (otherwise **Teacher** / no student line).
   - **Learner**: next + upcoming lesson lists from Supabase; assignments / streak / sidebar practice & billing cards are still **mock**.
   - **Household / parent**: **Student overview** (first linked student + optional “Also linked” from `students` + `profiles` when RLS allows), **lessons this month** count from visible lessons; attendance & practice tiles are **not tracked** (—); progress snapshot, activity, messages, resources still **mock**; billing card is a **placeholder**.
   - **Instructor / teacher-manager**: today + upcoming lessons from Supabase; **active student count** from **`teacher_student_assignments`** (distinct `student_id`, `status = active`); **lessons this week** from visible lessons in the current Monday-start week; student activity, tasks, messages, manager team stats, payout **copy** still **mock/placeholder** (payouts not in DB).
   - **Operations / admin**: today’s lesson list + **this month’s visible lesson count** from Supabase; top student/teacher counts, growth %, activity feed, financial dollar amounts, system status, tasks are still **mock/placeholder**.
   - **Executive / leadership**: **Lessons this month** count from Supabase; revenue, students, churn, charts, departments, financial summary, goals remain **mock**.
6. **Navigation**: only routes allowed for that role family appear (plus Dashboard + Settings while profile is loading).
7. **Route guard**: open a URL your role **cannot** use (e.g. learner → `/users`) — expect **Access Restricted**.
8. **Students** (`/students`, signed-in only): roster is **real Supabase** (RLS-scoped), not inline mock names.
   - **Household / parent / family**: rows from **`students` + `profiles`** (same visibility idea as the household dashboard student list). **Summary:** roster count is real; **Lessons today** uses **`useDashboardLessons`** + today filter (same family of data as the dashboard). Attendance, makeup credits, and follow-up summary tiles stay **—** (not in DB yet). Per-student contact, scheduling, attendance %, makeup counts, and action buttons are still **layout placeholders** (— / non-functional).
   - **Teacher / teacher-manager**: rows from **`teacher_student_assignments`** (active) → **`students` + `profiles`**; manager scope follows **existing TSA RLS** (no extra client-side scope beyond what the query returns). Same summary rules as household for wired vs placeholder tiles.
   - **Admin / executive**: roster from **`students` + `profiles`** with a **200-row cap** (operations/leadership); summary tiles same as above. **Empty states** should explain no rows vs search/filter mismatch.
9. **Calendar** (`/calendar`, signed-in): list + week + month views use **`useDashboardLessons`** (same RLS-scoped **`public.lessons`** select as dashboards — no second query pattern).
   - **Household / parent / family / learner**: **Upcoming** = open future lessons (`filterUpcomingOpenLessons`); **Completed** = history complement. **Empty states** when the hook returns no rows.
   - **Instructor / teacher-manager**: **My Schedule** = same upcoming/open filter (scoped by RLS like the instructor dashboard). **Requests** tab = **placeholder** (no API). Week/month grids plot real lesson times; **teacher** and **student** labels come from embedded **`profiles.full_name`** when policies allow (else fall back to **Teacher** / omit student).
   - **Operations / leadership**: **Schedule** = all visible lessons sorted by start time; **Operations** tab = **placeholder** (no API).
   - **Lesson detail (list row click, week, month):** same **`useDashboardLessons`** row via **`dashboardRowToCalendarEventDetails`** — read-only **teacher / student** lines (— when embeds missing), **schedule** from **`starts_at`–`ends_at`**, **database status** label, **modality** + raw DB value, **focus** and **notes** when present, **lesson id**, **participant ids** from embedded **`lesson_participants`**. **Local preview** pill only appears after unsaved modal actions vs real **`dbStatus`**.
   - **Persisted student intents (learner + household only):** one **`useLessonIntentEvents`** query (by embedded **`lesson_participant`** ids) feeds **NML** (`student.nml_requested`) and **teacher-assisted reschedule** (`student.reschedule_requested`) panels. Status for each pipeline is **none / pending / addressed** from append-only rows (pending until matching **`teacher.nml_handled`** or **`teacher.reschedule_handled`**). Intent reschedule stays blocked under **24h** (`RESCHEDULE_TOO_LATE`); **NML** remains the path when under 24h.
   - **Immediate self-reschedule (learner + household):** emerald **Reschedule now** calls RPCs **`list_lesson_self_reschedule_candidates`** / **`commit_student_lesson_self_reschedule`** (not a raw client `lessons` update). Slots come from **`teacher_availability_segments`** minus overlapping **`lessons`** for the same teacher and minus **`teacher_availability_exceptions`** (time off / blocks); commit **updates the existing lesson row** in place and appends **`lesson_self_reschedule_audit`**. Requires migrations applied; local **`seed.sql`** inserts a default availability window per teacher when teachers exist.
   - **Make-up credit conversion (learner + household, 24h+ only):** violet **Save as make-up credit** calls **`commit_student_lesson_to_makeup_credit`**: inserts **`makeup_credits`** (one per **`original_lesson_id`**) and sets **`lessons.status`** to **`cancelled`** in one transaction — no extra active lesson row. Under **24h** the RPC rejects (use **NML**). **Redeeming** a credit into a replacement lesson is **not** implemented yet.
   - **Settings → Make-up credits:** learner + household signed-in see a **read-only** list from **`useMakeupCredits`** (`public.makeup_credits` via RLS).
   - **Still placeholder / mock:** calendar **list-row** **Confirm / NML / Reschedule** (`LessonActions`); modal footer **Confirm / Cancel** (local preview only; **Reschedule** footer button omitted for learner/household where persisted panels exist); **Watch recording** disabled; **Requests / Operations** tabs; **make-up credit redemption** (booking the replacement lesson).
10. **Teacher availability** (`/teacher-availability`, signed-in): **Instructor** (`teacher` / `teacher-manager` with a **`teachers`** row) manages their own **`teacher_availability_segments`** and **`teacher_availability_exceptions`** (CRUD via Supabase + RLS). **Admin / executive** choose a teacher from the dropdown and manage that teacher’s rows. No separate scheduling product — this is the operational source for student self-reschedule slots. Learner/household cannot open this route (expect **Access Restricted**).
11. **Sign out** (dev header button) → returns to `/sign-in`.

## Quick matrix (expected route families)

| `app_role`        | Role family   | Example denied route |
|-------------------|---------------|----------------------|
| adult-student     | learner       | `/users`             |
| child-student     | learner       | `/users`             |
| parent, family    | household     | `/practice`          |
| teacher           | instructor    | `/users`             |
| teacher-manager   | instructor    | `/users`             |
| admin             | operations    | `/practice`          |
| executive         | leadership    | `/practice`          |

Adjust expectations if `ROUTE_PERMISSIONS` or role families change.

## Profile missing

If you see **Profile not ready** after sign-in: the auth user has no readable `profiles` row or `app_role` is invalid. Re-run **`npm run seed:dev-users`** for that email.
