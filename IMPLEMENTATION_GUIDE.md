# AbleSpace Task Management System — Implementation Guide

This is your working plan, now filled in with the actual screens from the Figma export ("Pyramid" workspace app). Follow it top to bottom.

## 0. Design inventory (from the Figma screens)

### Screens / routes
| # | Screen | Route (suggested) |
|---|--------|--------------------|
| 1 | Login (Guest / Google) | `/login` |
| 2 | Tasks — Board view (Kanban: To Do, Doing, Completed, On Hold) | `/tasks` |
| 3 | Tasks — List view (grouped by status, collapsible sections) | `/tasks?view=list` |
| 4 | Task detail panel (opens over list/board) | `/tasks/[id]` (modal or slide-over) |
| 5 | Projects (same table pattern, project-scoped) | `/projects` |
| 6 | Profile / Settings | `/settings/profile` |

Theme menu, Color Mode menu, Priority dropdown, Fields dropdown, and the date picker are **overlays**, not separate routes — build them as shared popover/dropdown components.

### Design system observed
- **Buttons:** solid black primary (`Continue as Guest`, `+ Add Task`), white/outlined secondary (`Login with Google`)
- **Due dates:** rendered as a red pill/badge
- **Priority:** small colored bar-chart icon + label — No Priority (gray), Low, Medium (amber), High (red/orange), Urgent (red, filled)
- **Labels/tags:** light-gray rounded chips (e.g. "Deployment", "Research", "Design")
- **Avatars:** circular, gradient-filled placeholder images
- **Cards:** light-gray background, rounded corners, subtle border, used for both Kanban cards and the login card
- **Two independent theme axes** — this is the detail most people miss:
  1. **Mode**: Light / Dark
  2. **Accent color**: Amber, Blue, Pink, Rose, Emerald, Black
  Both must be selectable independently and both must persist across refresh.

### Components to build (reusable library)
- `Sidebar` (workspace switcher, `Tasks`/`Projects` nav items)
- `KanbanColumn` + `TaskCard` + `AddTaskButton`
- `ViewToggle` (List / Board)
- `FieldsDropdown` (checkboxes: Priority, Members, Due Date, Labels, Status, Reporter — controls visible columns)
- `TaskTable` + `TaskRow` + `StatusGroupHeader` (collapsible)
- `SearchBar`
- `TaskDetailPanel`: header + description, `PropertiesRow` (assignee, date), `LabelChip` list, `ResourceUploader` ("Add document or link"), `SubtaskTable`, `CommentThread`, right-hand `DetailsSidebar` (Status, Priority, Members, Dates, Labels, Teams, Reporter), `ActivityLog` ("You changed priority from... — posted an update")
- `PriorityDropdown` (5 options with colored bar icons)
- `DueDatePill`, `DatePickerPopover`
- `ProjectsTable` (same shape as TaskTable)
- `ThemeMenu` (Light/Dark radio list)
- `ColorModeMenu` (6 color swatches)
- `Avatar` (gradient placeholder + initials fallback)
- `ProfileForm` (avatar, email w/ edit icon, full name, title, username) + `DangerZoneAction` (Leave Workspace, red)

## 1. Data model

Based on the fields visible in the task detail panel and tables:

```
User
  id, email, fullName, title, username, avatarUrl, isGuest, createdAt

Workspace
  id, name, ownerId

Project
  id, name, priority, leadId (-> User), dueDate, workspaceId

Task
  id, title, description, status (Backlog|ToDo|Doing|Completed|OnHold)
  priority (NoPriority|Low|Medium|High|Urgent)
  dueDate, reporterId (-> User), projectId (-> Project, nullable)

TaskAssignee   -- join table: task <-> user ("Members")
  taskId, userId

Label
  id, name
TaskLabel      -- join table: task <-> label

Subtask
  id, taskId (-> Task), title, priority, assigneeId, dueDate

Comment
  id, taskId (-> Task), authorId (-> User), body, createdAt

Team
  id, name
TaskTeam       -- join table: task <-> team

UserPreference
  userId, themeMode (light|dark), accentColor (amber|blue|pink|rose|emerald|black)
```

Keep it simpler if time is tight: `Team` and `Project` can be stubbed with a single hardcoded workspace if you're short on days — just document that scope cut in the README.

## 2. Repo & project setup

- One repo, two folders: `/frontend` (Next.js) and `/backend` (NestJS). A root `README.md` ties them together.
- Init frontend: `npx create-next-app@latest frontend --typescript --tailwind --app`
- Init backend: `nest new backend`, add `class-validator`, `class-transformer`, `@nestjs/config`, and your DB driver (e.g. `@nestjs/typeorm` + `pg`, or `@prisma/client`).
- Commit immediately after each of these.

## 3. Backend

- **Modules** (one per resource): `auth`, `tasks`, `subtasks`, `comments`, `projects`, `labels`, `users`, `preferences`.
- **Guest Login**: `POST /auth/guest` creates a guest `User` row (`isGuest: true`, no email required) and returns a signed cookie/JWT so their tasks persist for the session.
- **Google login**: stub is fine for the assessment — OAuth wiring is a nice-to-have, not the focus; note in README if you mock it.
- **DTOs + validation**: every write endpoint (`CreateTaskDto`, `UpdateTaskDto`, `CreateCommentDto`, etc.) uses `class-validator` decorators; enable a global `ValidationPipe` in `main.ts`.
- **Structure**: controllers thin, services hold logic, repositories isolated.
- **Endpoints to plan for**: task CRUD + status/priority patch endpoints (board drag-and-drop needs a fast `PATCH /tasks/:id/status`), subtask CRUD nested under task, comment create/list under task, label CRUD, project CRUD, `GET/PUT /users/me/preferences` for theme mode + accent color.
- A few unit tests on the `tasks` service (create, update status, list-by-project) shows good practice.

## 4. Frontend

- Build the component library (step 0 list) in isolation first — Storybook-style pages or just a `/dev/components` route — before wiring full screens.
- **Board view**: drag-and-drop between columns (e.g. `@dnd-kit/core`); optimistic update + `PATCH /tasks/:id/status` on drop.
- **List view**: collapsible status groups, `FieldsDropdown` toggling visible columns via local component state.
- **Task detail panel**: slide-over or modal — don't build it as a separate full-page route if the design shows it layered over the list (screen 6 clearly overlays the table).
- **Theme system**: two independent contexts/providers — `ThemeModeProvider` (light/dark, drives `dark:` Tailwind classes or a `data-theme` attribute) and `AccentColorProvider` (sets a CSS custom property like `--accent`, consumed by buttons/badges/links). Persist both to `localStorage` (or a cookie if you want the correct theme on first server render, avoiding flash).
- **Data fetching**: React Query for server state (tasks, subtasks, comments, projects); local UI state (which dropdown is open, drag state) in component state.
- **Responsiveness**: sidebar should collapse to a drawer/hamburger below `md`; Kanban columns should become horizontally scrollable (not squished) on mobile; the task detail panel should go full-screen on mobile rather than a fixed-width side panel.

## 5. Wire frontend to backend

- Centralize API calls (`lib/api.ts` or per-resource hooks: `useTasks`, `useTask(id)`, `useProjects`, `useUserPreferences`).
- Handle loading/error/empty states for every list and the detail panel.
- Match the interactions you saw: dropdown-driven priority changes, inline column-visibility toggling, calendar popover for due dates, activity log auto-appending on changes ("You changed priority from No priority to Urgent").

## 6. Deploy

- Frontend → Vercel. Backend → Railway or Render (with Postgres add-on).
- Point the frontend's API base URL at the deployed backend via env var.
- Test the live URL yourself in an incognito window before submitting.

## 7. Git hygiene

- Commit per logical unit: "add task entity + migration," "add TaskCard + KanbanColumn," "wire guest login flow," "add theme mode + accent color providers" — not one giant commit.

## 8. Part 2 — Product understanding

- Log into AbleSpace, go to the Caseload tab, open the Take Data screen.
- Walk through the flow yourself: what's clicked first, what data is entered, what happens on submit, what states/errors appear.
- Write it up in your own words with screenshots at each step (or record a short walkthrough).
- Add a "Suggestions" section: 2–4 concrete UX/functionality improvements, each with a one-line reason.

## 9. Final checklist before submitting

- [ ] Board view, list view, and view-toggle all match the design
- [ ] Theme mode (light/dark) AND accent color both work and persist on refresh
- [ ] Guest login works end-to-end
- [ ] Task detail panel matches: properties, labels, resources, subtasks, comments, details sidebar, activity log
- [ ] Priority dropdown and due-date picker match design
- [ ] Responsive at mobile/tablet/desktop, including sidebar collapse and Kanban scroll behavior
- [ ] NestJS APIs validated, modular, documented
- [ ] README complete with setup steps + any documented deviations (e.g. Google OAuth stubbed, Team entity simplified)
- [ ] Live URL tested in incognito
- [ ] Repo is public, commit history is meaningful
- [ ] Part 2 doc/video attached
- [ ] Repo + deployment will stay live 45+ days
