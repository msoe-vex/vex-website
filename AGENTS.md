# Raider Robotics Website (msoe-vex/website)

Project documentation and architecture guide for engineering agents and contributors.

---

## Architecture Overview

This project is a [Next.js](https://nextjs.org) App Router application built with TypeScript and Tailwind CSS for **Raider Robotics**, the collegiate competitive VEX U robotics team at the Milwaukee School of Engineering (MSOE).

### Core Stack & Tools
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS & scoped component CSS modules
- **Package Manager**: `pnpm` (use `pnpm dev` for local development server)
- **Language**: TypeScript (`strict: true`)
- **Linting**: ESLint flat config (`eslint.config.mjs`)

---

## Key Design Patterns & Guidelines

### 1. Angular Brand Language (Negative Slope $y = -x$)
Every component, card, button, and banner uses sharp, technical chamfers matching the logo's angle:
- **Bottom-Left Chamfers**:
  ```css
  clip-path: polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  ```
- **Universal Brand Red**:
  - Primary Red: `#c5050c` (`rgb(197, 5, 12)`)
  - Darker Hover Red: `#a0040a`
  - Glow / Outline: `ring-[#c5050c]` and `shadow-[0_0_25px_rgba(197,5,12,0.6)]`
- **Navigation Buttons**:
  - Frosted dark glass: `rgba(28, 28, 34, 0.55)` with `backdrop-filter: blur(12px)`
  - Skewed with `transform: skewX(20deg)` and text upright `skewX(-20deg)`
  - Bleeds past left and right screen edges to eliminate gaps on ultra-wide viewports
- **Global Reusable Classes** (`app/globals.css`):
  - `.section-diamond`: Centered red rotated diamond indicator for section headers
  - `.clip-chamfer-btn`: Reusable button and container chamfer polygon
  - `.clip-chamfer-tag`: Reusable filter tag chamfer polygon
  - `.chamfer-card-outer` & `.chamfer-card-inner`: Double-layered pattern ensuring 1px borders wrap all 4 edges and the angled chamfer cut

### 2. Centralized Static Data & Copy
All static copy, project catalogs, and rosters live in `app/data/`:
- `app/data/locales.ts`: All UI text, mission pillars, headers, and footer disclaimers
- `app/data/projects.ts`: Historical robot catalog with `season`, `orderIndex` (descending), technical highlights, awards, and GitHub links
- `app/data/members.ts`: Current and alumni member directory filtered by subsystem (`Controls`, `Design`, `Eboard`)
- `app/data/events.ts`: Recurring weekly meetings (chronologically: Tuesday, Wednesday, Thursday) and upcoming competitions
- `app/data/announcements.ts`: Dynamic computation of the next upcoming meeting based on current day of week with deep link `/events#select#<id>`
- `app/data/sponsors.ts`: Sponsor logos and external company websites
- `app/data/seo.ts`: Centralized site config, keywords, and JSON-LD structured schemas (`getOrganizationSchema()`, `getEventsSchema()`)

### 3. Routing & Deep-Linking Architecture
- `/` redirects to `/home`
- `/home`:
  - **Meeting Banner**: Static top announcement bar scrolling with page flow and deep link to `/events#select#<id>`
  - **Hero Feature**: Time-synchronized double-buffered crossfade photos + interactive particle canvas (`HeaderBackground.tsx`) + logo red hover & click animation + Mission Statement overlay
  - **Sponsors**: Infinite horizontal marquee scroller with pause-on-hover
  - **Projects Showcase**: Displays the 3 most recent builds; clicking cards routes to `/projects#select#<id>`
  - **Member Preview**: Shuffles 3 active Eboard members; clicking cards routes to `/members#select#<id>`
  - **Contact Us**: Subfooter with centered Discord invite, club email, and GitHub links with `↗` external arrows
- `/projects`: Complete robot catalog with season filter buttons and smooth auto-scroll & glowing highlight on `#select#<id>`
- `/members`: Complete roster with subsystem and active/alumni tabs and `#select#<id>` highlight
- `/events`: Chronological calendar tables for weekly meetings and competitions with STEM Center directions and `#select#<id>` highlight

### 4. Hydration & SSR Safety
- Never call `Math.random()` or non-deterministic values during initial component evaluation or synchronous effects.
- Use `useSyncExternalStore` with deterministic server snapshots (`getServerSnapshot`) for randomized or client-time-dependent UI previews (e.g., [MemberPreview.tsx](app/home/components/MemberPreview.tsx), [featured_images.tsx](app/util/featured_images.tsx)).
- Always run `npx eslint --no-warn-ignored app/ scripts/` and `npx tsc --noEmit` before committing.
