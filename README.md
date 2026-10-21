# Heiki

<p align="center">
  <strong>English</strong> · <a href="README.it.md">Italiano</a>
</p>

<p align="center">
  <strong>High-performance open-source analytical platform and developer tooling for gacha games.</strong><br>
  Decrypted game-client data, deterministic combat mechanics, real-time stat calculators, interactive tier list maker, and automated maintainer pipelines.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Next.js-15.5+-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.44+-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM">
  <img src="https://img.shields.io/badge/Vitest-780_Passed-729B1B?style=for-the-badge&logo=vitest" alt="Vitest Tests">
  <img src="https://img.shields.io/badge/DB_Smoke-71_Checks-success?style=for-the-badge" alt="DB Smoke Tests">
</p>

---

## Project Overview

**Heiki** is an open-source, full-stack analytical platform and data engineering framework built to solve the systemic reliability and freshness problems found in competitive gaming wikis and theorycrafting tools.

In contemporary gacha games, mechanics, formulas, and balance patches are frequently undocumented or obfuscated. Most community resources depend on manual wiki entry, leading to delayed updates, transcription errors, and missing damage ceilings.

Heiki bridges this gap by integrating a **reproducible client decryption and extraction pipeline** directly from game packages and client databases (dynamically-keyed encrypted SQLite databases, obfuscated Unity asset bundles). It transforms over 194,000 localized strings and hundreds of raw entity tables into certified, deterministic mathematical formulas and real-time interactive tools.

The reference implementation targets **The Seven Deadly Sins: Grand Cross (7DSGC)**, with a modular domain architecture designed to expand to HoYoverse titles (*Genshin Impact*, *Honkai: Star Rail*, *Zenless Zone Zero*) and *Wuthering Waves*.

---

## Open Source Mission & The Maintainer Bottleneck

Maintaining high-fidelity game data across live-service titles poses a massive operational workload:

1. **Weekly Patch Velocity**: Live gacha games receive weekly or bi-weekly game client updates. Each release alters dozens of internal SQLite tables, adjusts undocumented skill coefficients, and introduces new characters with novel mechanical interactions.
2. **Ambiguous Natural Language Descriptions**: In-game skill tooltips (often translated across Korean, Japanese, and English) frequently contradict raw underlying client logic or hide critical stacking limits.
3. **High Maintenance Overhead for Small Teams**: Core maintainers must parse raw diffs, draft schema migrations, reverse-engineer ambiguous damage rules, and verify hundreds of mathematical test cases.

### AI-Assisted Maintainer Pipeline & Codex Integration (Roadmap)

To sustain and scale this infrastructure without burning out maintainers, Heiki is architecting an **AI-assisted maintainer pipeline** leveraging OpenAI Codex:

- **Natural Language to Deterministic AST**: Using Codex reasoning to parse ambiguous multi-paragraph skill texts into formal, typed TypeScript AST definitions, extracting exact buff categories, trigger conditions, and damage scaling formulas.
- **Automated Client Patch Triage**: Running automated diff analysis on decrypted SQLite databases between patch releases. Codex generates human-readable patch notes, flags stealth balance adjustments, and drafts initial Drizzle ORM schema migrations.
- **Automated Unit Test Generation**: Automatically producing Vitest test fixtures whenever new characters or skills are staged, comparing damage formula outputs against empirical boundary conditions.
- **Semantic Theorycrafting Query Layer**: Providing developers and players with an embedding-powered natural language query interface over 194,000+ data points (e.g., *"Find characters with AOE debuff removal that scale defense on critical resistance"*).

---

## Key Features

### 1. Certified Hero Database & Real-Time Stat Calculator
- **Comprehensive Roster**: Over 373 heroes with client-decrypted data (194,000+ localized text entries).
- **Dynamic Calculator**: Real-time evaluation of hero stats across Level, Awakening (1-6 stars), Super Awakening, Ultimate Move rank, True Awakening (Demon King / Supreme Deity), and gear/costume combinations.
- **Contextual Term Parser ("Blue Words")**: Automated lexical parser linking skill mechanics directly to verified rule explanations, tooltips, and stacking limits.
- **Automated Patch Diffs**: Versioning engine tracking textual and mechanical balance changes introduced by game updates.

### 2. Interactive Tier List Maker
- **Responsive HTML5 Drag & Drop**: Native desktop drag & drop combined with quick-tap mobile assignment.
- **Customizable Structure**: 6 default tiers (S+, S, A, B, C, D) with Persona-inspired 13-color palettes, inline label editing, row reordering, and combined attribute/rarity filtering.
- **Cloud Persistence & Local Backups**: Multi-list user storage via PostgreSQL (`user_tier_lists`), non-volatile JSON export/import, and shareable permalinks with one-click cloning.
- **High-DPI Retina (2x) Canvas Rendering**: Instant high-resolution PNG export with composite watermark and dark theme layout.

### 3. Community Hero Ratings & Mode Insights
- **Dual PvE & PvP Scoring**: 1-to-5 star rating system utilizing original in-game awaken star assets.
- **Content Excellence Analysis**: Aggregated percentage metrics identifying where each unit excels (Demonic Beasts, Demon King, PvP, Death Match, etc.).
- **Idempotent Upsert & Abuse Prevention**: Composite unique keys `(game_id, hero_id, user_id)` protected by sliding-window rate limiting.

### 4. Local-First Hero Box Tracking
- **Hybrid Synchronization**: Zero-latency client reads powered by `useSyncExternalStore` with transparent `localStorage` fallback and asynchronous background synchronization with PostgreSQL for authenticated users.
- **Bulk Box Actions**: Instant 1-click batch additions (*"Add all shown"*) and safe total wipe (*"Remove all"* with confirmation dialog).

### 5. Verified Endgame Guides with Automatic Expiration
- **Patch Validity Verification**: Strategy guides are tied to the verified patch version (`verifiedPatch`). When the game version advances, the system automatically flags guides as *"Needs Review"*, preventing stale meta information.
- **Formation Integrity**: Automatic validation enforcing game-specific roster restrictions (unique associate heroes, allowed attributes, and artifact set compatibility).

### 6. Transparent Moderation & Immutable Audit Logging
- **Soft-Hiding Policy**: Content is never destroyed; flagged posts are hidden with author and operator metadata preserved in a transactional audit log.
- **5-Tier Role-Based Access Control (RBAC)**: Fine-grained permissions (`USER`, `COLLABORATOR`, `EDITOR`, `MODERATOR`, `ADMIN`).

---

## Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 15 App Router                         │
│   (React 19 Server Components · Streaming SSR · Client Components)     │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
         Server Actions & API                   Local-First State
       (Zod Validation, Auth.js)            (useSyncExternalStore)
                   │                                  │
         ┌─────────┴─────────┐                        │
         ▼                   ▼                        ▼
┌──────────────────┐ ┌──────────────┐       ┌──────────────────┐
│   PostgreSQL 16  │ │ In-Memory    │       │ Browser Storage  │
│   (Drizzle ORM)  │ │ Rate Limiter │       │  (localStorage)  │
└──────────────────┘ └──────────────┘       └──────────────────┘
```

### Architectural Highlights
1. **Next.js 15.5+ App Router with React 19**: Extensive usage of React Server Components (RSC) to minimize client-side JavaScript, maintaining a compact shared First Load JS bundle (~103 kB).
2. **PostgreSQL 16 & Drizzle ORM**: End-to-end type safety from schema to UI. Declarative schemas, reproducible SQL migrations, and strict referential integrity.
3. **Zero-Downtime Resilience**: Seamless in-memory fallback activated if the database becomes temporarily unreachable, allowing full read-only catalog browsing without errors.
4. **Enterprise-Grade Security**:
   - Dynamic **Content Security Policy (CSP)** with per-request cryptographic nonces enforced at middleware level.
   - Sliding-window in-memory **Rate Limiting** protecting mutation and authentication routes.
   - XSS prevention via an abstract syntax tree Markdown parser without `dangerouslySetInnerHTML`.
   - Secure cookies with `SameSite=Lax`, `HttpOnly`, and `__Secure-` prefixes in production.
5. **Persona 5 Visual Identity**:
   - Editorial dark UI (`#0b0a0a` / `#151313`) featuring `.p5-cut` angular borders, `.p5-btn` dynamic buttons, and brand crimson `#e61421`.
   - 5 user-selectable dark color schemes certified for WCAG AAA contrast ratios (≥ 7:1 for body text, ≥ 4.5:1 for UI elements).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Web Framework** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Phosphor Icons](https://phosphoricons.com/) |
| **Database & ORM** | [PostgreSQL 16](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [Auth.js v5 (NextAuth)](https://authjs.dev/) (Credentials, Discord OAuth, Google OAuth) |
| **Testing Suite** | [Vitest](https://vitest.dev/), custom `smoke-db.mts` database verifier |
| **Containerization** | [Docker](https://www.docker.com/), Docker Compose |

---

## Engineering Rigor & Verification

Every build and modification is verified through an extensive automated testing suite:

- **780 Unit & Integration Tests (Vitest)**:
  - Combat damage formula accuracy, stat scaling, Monte Carlo simulations, and RNG entropy tests.
  - Cryptographic session verification, password reset tokens, and sanitized Markdown AST parsing.
  - Theme color tokens and WCAG contrast validation.
- **71 Live Database Smoke Verifications (`npm run db:smoke`)**:
  - Live PostgreSQL verification testing real database operations: schema migrations, cascade deletions, user suspension lifecycles, and rate limiter bounds.
- **Strict Static Typing & Linting**:
  - `npm run typecheck` (`tsc --noEmit`): **0 errors**.
  - `npm run lint` (`eslint`): **0 errors** across all source files and automation scripts.

---

## Repository Structure

```text
Heiki/
├── src/
│   ├── app/                      # Next.js App Router (Layouts, Pages, API Routes)
│   │   ├── [game]/               # Contextual game routes (heroes, tierlist, guides, etc.)
│   │   ├── u/[username]/         # Public user profiles, saved tier lists, badges
│   │   └── api/                  # Route handlers (auth callbacks, healthcheck)
│   ├── components/               # Persona-styled UI components (filters, grids, modals)
│   │   ├── tier-list/            # Tier List Maker (canvas renderer, drag & drop)
│   │   ├── ratings/              # Community rating modals and facts badges
│   │   └── game-account/         # Hero box management and synchronization
│   ├── lib/
│   │   ├── db/                   # Drizzle schema, PostgreSQL client, migrations
│   │   ├── games/                # Game modules, client-extracted data, calculators
│   │   ├── tier-list/            # Server actions and persistence logic for tier lists
│   │   ├── ratings/              # Server actions and aggregated scoring calculations
│   │   ├── auth/                 # Auth.js setup, permissions, role hierarchy
│   │   └── security/             # Content Security Policy, rate limiter, sanitizers
├── scripts/                      # Setup scripts, database seeders, smoke tests
├── drizzle/                      # SQL migration files generated by Drizzle Kit
└── docker-compose.yml            # PostgreSQL container configuration
```

---

## Getting Started

### Prerequisites
- **Node.js** v20.x or higher
- **Docker Desktop** (for local PostgreSQL database)

### One-Command Setup
The setup script automatically initializes dependencies, launches PostgreSQL, applies all database migrations, and seeds essential initial data:

```bash
# 1. Clone the repository
git clone https://github.com/DGF-Tech-Solutions/Heiki.git
cd Heiki

# 2. Run automated setup
npm run setup

# 3. Start development server
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## CLI Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js Turbopack dev server on `:3000` |
| `npm run build` | Produces an optimized standalone production build |
| `npm run test` | Runs the full Vitest test suite (780 tests) |
| `npm run typecheck` | Validates TypeScript types across the entire codebase |
| `npm run lint` | Runs ESLint on `src/` and `scripts/` |
| `npm run db:smoke` | Runs 71 live end-to-end integration checks against PostgreSQL |
| `npm run db:migrate` | Applies pending database migrations via Drizzle Kit |
| `npm run db:reset` | Wipes and rebuilds the local database from scratch |
| `npm run db:studio` | Launches Drizzle Studio GUI for database inspection |
| `npm run promote -- <email> ADMIN` | Promotes a user account to system administrator |

---

## Roadmap

- [x] Client data decryption and extraction pipeline.
- [x] Complete interactive hero roster and stat calculator for The Seven Deadly Sins: Grand Cross.
- [x] High-DPI Canvas Tier List Maker with cloud sync and JSON backup.
- [x] Real-time community PvE & PvP hero rating system.
- [x] Local-first hero box management with transparent offline support.
- [ ] Integration of OpenAI Codex for automated upstream patch triage and mechanics AST extraction.
- [ ] Integration of the first deterministic HoYoverse module (*Genshin Impact* / *Honkai: Star Rail*).
- [ ] Dynamic Open Graph image generation for social profile cards.
- [ ] Public REST / GraphQL API for third-party developer integrations.

---

## Contributing

We welcome community contributions! Please adhere to our code quality standards:
1. Ensure all TypeScript types are strictly verified: `npm run typecheck`.
2. Ensure linting passes: `npm run lint`.
3. Add or update tests for new formulas and features: `npm run test`.
4. Run live database smoke verifications: `npm run db:smoke`.

---

## License

This project is licensed under the [MIT License](LICENSE). All game assets, trademarks, and logos belong to their respective publishers and copyright holders.
