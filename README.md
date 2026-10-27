# Raider Robotics Website (msoe-vex/website)

Official web site for **Raider Robotics**, the competitive collegiate VEX U robotics team at the **Milwaukee School of Engineering (MSOE)**.

Built with [Next.js](https://nextjs.org) (App Router, Turbopack), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

---

## Quick Start & Development Setup

### Prerequisites
- **Node.js**: v18.18+ or v20+ ([Download Node.js](https://nodejs.org/))
- **pnpm**: This project strictly uses `pnpm` as its package manager.
  ```bash
  npm install -g pnpm
  ```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/msoe-vex/website.git
   cd website
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running Locally
Start the development server with automatic prebuild feature generation:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Code Quality & Smoke Testing
```bash
pnpm lint          # Run ESLint
pnpm type-check    # Verify TypeScript compilation (tsc --noEmit)
pnpm test          # Run Playwright smoke test (verifies site compiles, runs & is usable)
```

### Continuous Integration & Deployment (CI/CD)
* **Pull Requests**: Every PR against `main` automatically triggers the **CI Smoke & Quality Gate** workflow (`.github/workflows/ci.yml`), verifying that the codebase passes ESLint, compiles TypeScript, starts up and passes the usability smoke test, and builds the production static export.
* **Production Deployment**: Pushes/merges to `main` automatically run verification and publish the static export to GitHub Pages (`.github/workflows/deploy.yml`) on `msoevex.com`.

---

## Content & Static Data Architecture

All static website content, rosters, project catalogs, and UI copy are centralized in `app/data/` for simple updates without touching component logic:

| File | Purpose | What to Edit |
| :--- | :--- | :--- |
| [`app/data/locales.ts`](app/data/locales.ts) | **UI Text & Copy** | Section titles, mission statement, engineering pillars, contact buttons, and footer copyright text. |
| [`app/data/projects.ts`](app/data/projects.ts) | **Project Catalog** | Robot platform builds, season tags, technical highlights, awards won, and GitHub repo links. |
| [`app/data/members.ts`](app/data/members.ts) | **Team Roster** | Current & alumni member profiles, roles, subsystems (`Controls`, `Design`, `Eboard`), graduation year, GitHub, and LinkedIn links. |
| [`app/data/events.ts`](app/data/events.ts) | **Calendar & Schedule** | Recurring weekly meetings, competition dates, workshop sessions, and room locations. |
| [`app/data/announcements.ts`](app/data/announcements.ts) | **Meeting Banner** | Top announcement bar logic computing the next meeting day (Tuesday/Thursday) and location. |
| [`app/data/donors.ts`](app/data/donors.ts) | **Donors Marquee** | Organization and company names, logo image filenames in `public/donors/`, and external donor URLs. |

---

#### Created by Avery Benjamin ([@Akiisqt](https://github.com/Akiisqt))