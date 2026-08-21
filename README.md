# AbleSpace Task Management System

Full-stack task management app ("Pyramid") built for the AbleSpace Full Stack Developer (Fresher) technical assessment, implementing the provided [Figma design](https://www.figma.com/design/obONCFmoTFN27V5H9PHS2X/Assessment-Task?node-id=0-1).

**Live demo:** _[add your deployed URL here]_
**Video walkthrough (optional):** _[add link if applicable]_

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Database:** _[Postgres / MongoDB / SQLite — fill in what you used]_
- **Deployment:** Frontend on _[Vercel]_, Backend on _[Railway/Render]_

## Features

- Guest login (`Continue as Guest`) and Google login on the landing screen
- Task Board (Kanban: To Do, Doing, Completed, On Hold) with drag-and-drop
- Task List view with collapsible status groups and a Fields toggle (show/hide Priority, Members, Due Date, Labels, Status, Reporter)
- Task detail panel: description, properties, labels, resources, subtasks, comments, activity log, and a Details sidebar (Status, Priority, Members, Dates, Labels, Teams, Reporter)
- Priority levels (No Priority / Low / Medium / High / Urgent) with colored indicators
- Projects table (same pattern as Tasks)
- Two independent theming controls, both persisted across refresh:
  - **Theme mode:** Light / Dark
  - **Accent color:** Amber / Blue / Pink / Rose / Emerald / Black
- Profile settings (avatar, email, full name, title, username) with a Leave Workspace danger action
- Fully responsive across desktop, tablet, and mobile

## Project Structure

```
/frontend   → Next.js app (App Router, Tailwind)
/backend    → NestJS API (modules: auth, tasks, subtasks, comments, projects, labels, users, preferences)
```

## Getting Started

### Prerequisites
- Node.js 18+
- _[Database]_ running locally or a connection string

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DB connection + secrets
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set NEXT_PUBLIC_API_URL
npm run dev
```

App runs at `http://localhost:3000`, API at `http://localhost:3001` (adjust to your actual ports).

## Data Model

`User` · `Workspace` · `Project` · `Task` (with `TaskAssignee`, `Label`/`TaskLabel`, `Team`/`TaskTeam` joins) · `Subtask` · `Comment` · `UserPreference` (theme mode + accent color)

See `IMPLEMENTATION_GUIDE.md` for full field-level detail.

## API Overview

| Method | Endpoint                       | Description                       |
|--------|---------------------------------|------------------------------------|
| POST   | `/auth/guest`                   | Start a guest session              |
| GET    | `/tasks`                        | List tasks (filter by project/status) |
| POST   | `/tasks`                        | Create a task                       |
| PATCH  | `/tasks/:id`                    | Update a task                       |
| PATCH  | `/tasks/:id/status`             | Update task status (board drag-drop) |
| DELETE | `/tasks/:id`                    | Delete a task                       |
| GET/POST | `/tasks/:id/subtasks`         | List/create subtasks                |
| GET/POST | `/tasks/:id/comments`         | List/post comments                  |
| GET    | `/projects`                     | List projects                       |
| GET/PUT | `/users/me/preferences`        | Get/set theme mode + accent color   |

_(Update this table to match what you actually built.)_

## Design Fidelity Notes / Known Deviations

_List anything you intentionally implemented differently from the Figma design, and why — e.g. Google OAuth stubbed, Team entity simplified to a single workspace, etc._

- 

## Part 2 — Product Understanding

See [`PART_2_WALKTHROUGH.md`](./PART_2_WALKTHROUGH.md) (or linked video) for the Take Data / Caseload workflow write-up and suggested improvements.

## Testing

```bash
cd backend
npm run test
```

## Notes on AI Tool Usage

_[Per the assignment's note: briefly state how AI tools were used, since you should be able to explain every line during the interview.]_
"# AbleSpace-Task-Management" 
