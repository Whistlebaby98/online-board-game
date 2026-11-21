# Technical Preferences

<!-- project.yaml at the repo root is the machine-readable source of truth for
     engine, specialists, naming, performance, platform, and testing.framework.
     This file is the human-readable LEGACY FALLBACK: agents and skills resolve
     each key from project.yaml first and fall back here only when the
     project.yaml key is absent. /setup-engine dual-writes both.
     Forbidden patterns and allowed libraries are NOT migrated — they live only
     in this file. Populated by /setup-engine; updated as decisions are made. -->

## Engine & Language

- **Engine**: Web (Vite 8.3.4)
- **Language**: TypeScript (7.0.2)
- **Rendering**: Canvas 2D
- **Physics**: none

## Input & Platform

<!-- Written by /setup-engine. Read by /ux-design, /ux-review, /test-setup, /team-ui, and /dev-story -->
<!-- to scope interaction specs, test helpers, and implementation to the correct input methods. -->

- **Target Platforms**: Web (Mobile portrait-first + Desktop browser)
- **Input Methods**: Touch, Keyboard/Mouse
- **Primary Input**: Touch (Mobile portrait-first; Mouse/Click parity on Desktop)
- **Gamepad Support**: None
- **Touch Support**: Full
- **Platform Notes**: 375px 手机竖屏单手易点（触控热区 ≥44px），无 hover-only 交互，兼容微信内置浏览器 / iOS Safari / Android Chrome 切后台重连。

## Naming Conventions

- **Classes**: PascalCase (e.g., `GameHook`)
- **Variables**: camelCase (e.g., `newState()`)
- **Signals/Events**: TypeScript callback handlers `on<Event>` (camelCase, e.g., `onTurnTimeout`); event bus / protocol event keys `snake_case` matching `project.yaml` (`naming.signals: on_event_name`, e.g., `on_turn_timeout`)
- **Files**: kebab-case (e.g., `rules.ts`)
- **Scenes/Prefabs**: snake_case
- **Constants**: SCREAMING_SNAKE (e.g., `STEP`)

## Performance Budgets

- **Target Framerate**: 60fps
- **Frame Budget**: 16.6ms
- **Draw Calls**: Minimal (lightweight DOM/SVG + Canvas 2D transform-only animation; no real-time SVG filter animation)
- **Memory Ceiling**: First-load critical path ≤ 200KB gzip, 4G interactive ≤ 2.0s; lightweight mobile browser memory footprint

## Testing

- **Framework**: Vitest (unit) + Playwright (e2e)
- **Minimum Coverage**: Pure game-rule state machine deterministic unit tests + boot/e2e smoke tests (`npm test`)
- **Required Tests**: Balance formulas, gameplay systems, networking (if applicable)

## Forbidden Patterns

<!-- Add patterns that should never appear in this project's codebase -->
- [None configured yet — add as architectural decisions are made]

## Allowed Libraries / Addons

<!-- Add approved third-party dependencies here -->
- [None configured yet — add as dependencies are approved]

## Architecture Decisions Log

<!-- Quick reference linking to full ADRs in docs/architecture/ -->
- [No ADRs yet — use /architecture-decision to create one]

## Engine Specialists

<!-- Written by /setup-engine when engine is configured. -->
<!-- Read by /code-review, /architecture-decision, /architecture-review, and team skills -->
<!-- to know which specialist to spawn for engine-specific validation. -->

- **Primary**: lead-programmer (Web has no dedicated engine specialist agent; engine work and API checks go to `lead-programmer`)
- **Language/Code Specialist**: lead-programmer
- **Shader Specialist**: lead-programmer
- **UI Specialist**: lead-programmer
- **Additional Specialists**: None
- **Routing Notes**: Web has no engine specialist agent (W7). Route TypeScript, Vite, Canvas 2D, and Web API checks to `lead-programmer`.

### File Extension Routing

<!-- Skills use this table to select the right specialist per file type. -->
<!-- If a row says [TO BE CONFIGURED], fall back to Primary for that file type. -->

| File Extension / Type | Specialist to Spawn |
|-----------------------|---------------------|
| Game code (primary language) | lead-programmer |
| Shader / material files | lead-programmer (Canvas 2D / CSS gradients — no GLSL shaders) |
| UI / screen files | lead-programmer |
| Scene / prefab / level files | lead-programmer (board layout & GameModule scenes) |
| Native extension / plugin files | N/A (Web target; general architecture review -> Primary) |
| General architecture review | Primary |
