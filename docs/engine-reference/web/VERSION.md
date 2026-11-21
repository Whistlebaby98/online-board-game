# Web Engine Reference & Version Pin

> **Created**: 2026-11-21
> **Engine**: `Web` (`Vite 8.3.4`, `TypeScript 7.0.2`, `Canvas 2D` + Web Audio, starter: `none`, physics: `none`)
> **Primary Authority**: `package.json`, `package-lock.json`, `project.yaml`, `vite.config.ts`, `tsconfig.json`, `playwright.config.ts`

---

## Pinned Toolchain Table

Exact pinned versions enforced by root `package.json` and `package-lock.json` (all packages use exact version pins without `^`/`~`, except the Node.js engine range):

| Package / Runtime | Pinned / Required Version | Installed at Pin Time | Role in Project |
|---|---|---|---|
| **Node.js** (`engines.node`) | `^22.12 \|\| ^24 \|\| >=26` | `v22.20.0` | Build, dev server, Vitest, Playwright runtime (and planned `server/` WS runtime) |
| **`vite`** | `8.3.4` | `8.3.4` | Frontend dev server, TypeScript bundling, production code-split output (`dist/`) |
| **`typescript`** | `7.0.2` | `7.0.2` | Strict static type checking (`tsc --noEmit`) across pure logic & client UI |
| **`vitest`** | `5.0.5` | `5.0.5` | Pure-TS unit tests (`tests/unit/**/*.test.ts`, Node runtime) |
| **`@playwright/test`** | `1.64.1` | `1.64.1` | Integration & browser smoke E2E runner (`tests/integration/`) |
| **`vite-plugin-singlefile`** | `2.3.3` | `2.3.3` | Single-HTML bundling in `--mode single` (`dist-single/index.html`) for offline disk E2E checks only |

> **Version Change Rule**: Do not upgrade pinned dependency versions or introduce runtime dependencies casually. Check bundle impact against Pillar 1's critical-path budget (`≤ 200KB gzip`) and update `package-lock.json` deliberately via ADR if a major bump or new dependency is approved.

---

## Post-Cutoff Version Timeline & Knowledge Gap (`HIGH`)

Per `.claude/skills/setup-engine/references/web.md` (Section W4):

- **Knowledge Gap**: **`HIGH`** — All five pinned packages (`vite 8.3.4`, `typescript 7.0.2`, `vitest 5.0.5`, `@playwright/test 1.64.1`, `vite-plugin-singlefile 2.3.3`) postdate typical LLM training cutoffs.
- **Mandatory Verification Rule for Agents**:
  1. Never guess config flags, TypeScript 7 compiler options, Vite 8 rollup/bundler hooks, Vitest 5 matchers, or Playwright 1.64 selectors from memory.
  2. Verify exact APIs against installed `.d.ts` declarations inside `node_modules/` and run `npm.cmd run build` + `npm.cmd test` after every config or harness change.
  3. On Windows PowerShell shells, invoke `.sh` helper scripts through Git Bash (`& 'C:\Program Files\Git\bin\bash.exe' .claude/scripts/<script>.sh`) and npm via `npm.cmd`.

---

## Verified Workspace Config & Build Contracts

1. **Bundling & Assets (`vite.config.ts` & `.claude/engines/web/README.md`)**:
   - `base: './'` (relative URLs for subpath/static hosting flexibility).
   - `publicDir: false` — **`public/` is disabled**; any static image/SVG/data asset needed by client code must live in `assets/` and be imported explicitly via ES `import` or `new URL('../assets/...', import.meta.url)` so Vite hashes/bundles it.
   - `assets/provenance.yaml` tracks asset origin/licensing and is never imported by code or shipped in builds.
   - **Production Deploy (`npm run build`)**: Runs `tsc --noEmit && vite build` into `dist/` with dynamic `import()` chunk splitting (mandatory for keeping initial load `≤ 200KB gzip` when pluggable `GameViewAdapter` modules are added).
   - **Single-File Self-Check (`npm run build:single`)**: Runs `tsc --noEmit && vite build --mode single` into `dist-single/index.html` (~33% base64 overhead). Used ONLY for disk-based Playwright E2E/smoke (`npm test` / `npm run smoke`); **never ship `dist-single/` to online users**.

2. **TypeScript Isolation (`tsconfig.json`)**:
   - Root scaffold currently pins `"target": "ES2023"`, `"lib": ["ES2023", "DOM", "DOM.Iterable"]`, `"module": "ESNext"`, `"moduleResolution": "bundler"`, `"strict": true`, `"allowJs": true`, `"resolveJsonModule": true`, `"isolatedModules": true`, `"noEmit": true`, `"include": ["src"]`.
   - **Technical Setup (`ADR-001`) Requirement**: Because `src/` currently grants global `DOM` types, splitting into `shared/`, `client/`, and `server/` in `/create-architecture` MUST carve out a DOM-free `tsconfig` (e.g., `lib: ["ES2023"]` without `DOM`) covering `shared/` and pure game rules so TypeScript fails compilation if a game module imports `window`, `document`, `canvas`, or `localStorage`.

3. **Playwright E2E Runner (`playwright.config.ts`)**:
   - Currently discovers the Chromium/Chrome executable via `.claude/scripts/page-shot.sh --which` and runs `tests/integration/` at `1280×720` with software WebGL flags (`--use-gl=angle --use-angle=swiftshader-webgl --enable-unsafe-swiftshader`) against `dist-single/index.html`.
   - **Multiplayer / Mobile Expansion Note**: Online multiplayer integration tests (`#3`, `#5`) and mobile `375×540px dvh` visual assertions (`#9`, `#10`) will require adding a server-backed Playwright project/dev-or-test-server fixture and portrait viewport projects during Technical Setup (`#3` / `/test-setup`).

---

## Explicitly Unverified Runtime & WebView Behaviors (`unverified`)

Until measured on target hardware during **Milestone 0 (`Week 1 443 WSS Spike`)** and real-device profiling, the following platform behaviors are tracked as **`unverified`**:

- **Browser / WebView Canvas 2D GPU Memory & Offscreen Caching**: Exact GPU texture eviction thresholds for `DPR ≤ 2` offscreen `<canvas>` buffers across iOS Safari WebKit and WeChat X5 / Android Chromium WebViews.
- **`ctx.shadowBlur` Soft-Raster Cost Curves**: Exact per-frame millisecond penalties on entry-level Android WebViews (`art-bible.md` §8.2 avoids runtime `ctx.shadowBlur` preemptively via layered geometric contact shadows).
- **WeChat Built-In Browser Networking & Background Suspend**: Exact 35s background WebSocket TCP half-open behavior, active ping probe timing (`1.5–2s` on `visibilitychange`), and TLS 443 handshake latency over real 4G (verified in Milestone 0).
