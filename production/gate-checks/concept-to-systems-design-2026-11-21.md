## Gate Check: Concept → Systems Design

**Date**: 2026-11-21
**Checked by**: gate-check skill (`workflow: full` · `review_mode: full` · `qa.level: full` · `team.size: studio`)

### Required Artifacts: 3/3 present
- [x] `design/gdd/game-concept.md` — exists (`44,768` bytes at check time, zero `[To be designed]` / `[TBD]` / `TODO` placeholders; Core Loop, Target Player Profile, 4 Pillars, Tension Matrix, and Visual Identity Anchor all populated)
- [x] Game pillars defined (`design/gdd/game-concept.md`, Lines 144–183) — 4 falsifiable pillars (P1–P4), Tension Matrix, and Anti-Pillars (`CD-PILLARS: APPROVE`)
- [x] Visual Identity Anchor (`design/gdd/game-concept.md`, Lines 186–208) — **Sunlit Tabletop Craft**（「阳光纸木桌游箱」), 1-line visual rule + 3 supporting design-test principles + WCAG AA & colorblind calibration (`AD-CONCEPT-VISUAL`)

*Additional Concept-phase artifacts already completed (`artifact-check.sh --phase concept` shows **4/4** required Concept artifacts `PRESENT`):*
- [x] `project.yaml` & `CLAUDE.md` — Engine pinned to `Web` (`Vite 8.3.4`, `TypeScript 7.0.2`, `Canvas 2D`, `Vitest 5.0.5`, `Playwright 1.64.1`)
- [x] `design/art/art-bible.md` — `142,311` bytes, 9/9 sections complete, **`AD-ART-BIBLE: APPROVE`** (`dd2d44c`)
- [x] `design/gdd/systems-index.md` — `35,842` bytes, 14-System / 5-Layer acyclic DAG, **`TD-SYSTEM-BOUNDARY: APPROVE`**, **`PR-SCOPE: OPTIMISTIC`** (recalibrated per user approval), **`CD-SYSTEMS: APPROVE`** (`72629ff`)

### Recommended (Non-Blocking): 1/1
- [x] Concept prototype validated — `prototypes/pocket-table-hall/index.html` (`db976eb`, local Express Ludo one-shot playtested and iterated once by user; `PROCEED` logged in `production/session-logs/decision-log.md`; Web one-shot path writes no `REPORT.md`; `evidence/checklist.tsv` records `15/18` code checks passed with `F7`, `M3`, `C1` marked `not_assessed` for audio/live multi-minute pacing & touch confirmation)

### Quality Checks: 4/4 passing
- [x] Game concept reviewed — `design/gdd/reviews/game-concept-review-log.md` verdict `NEEDS REVISION` (not `MAJOR REVISION NEEDED`; 7/7 blocking items revised in `game-concept.md`, awaiting optional fresh re-review & post-prototype baseline sync)
- [x] Core loop described and understood (Moment-to-Moment 30s, Short-Term 5–15m, Session-Level 30–120m, Retention Hooks)
- [x] Target audience identified (18–38 friend groups, SDT/PENS & Bartle profile)
- [x] Visual Identity Anchor contains 1-line visual rule and 3 supporting visual principles (exceeds minimum of 2)

---

### Director Panel Assessment (4 of 4 · Complete Full Panel)

- **Creative Director (`CD-PHASE-GATE`)**: `CONCERNS`
  - Core Fantasy, MDA order (`Fellowship #1 → Sensation #2`), and Pillars P1–P4 align strongly across Concept, Art Bible, Prototype, and Systems Index with 0 blockers. Raises 3 non-blocking concerns: (1) `game-concept.md` has drifted behind prototype Iteration 1 (`5A` manual AI takeover, persistent rolled-die proof banner) and `systems-index.md` (`6–8 周` MVP & 3 VS deferrals); (2) `2`- vs `3`-plane Express Classic duration for 4-human online play (`10–15m`) needs mathematical + real-chat pacing lock inside `#4` GDD; (3) the 3 deferred VS items (live spectate, custom WeChat swipe-back JS intercept, reaction confetti & tilted stamps) must still uphold MVP guardrails in `#9/#11` (vermilion vs indigo rule tags + Toast, warm full-room / `5C` offline-seat-claim screen, and `8px` CSS edge margins).
- **Technical Director (`TD-PHASE-GATE`)**: `CONCERNS`
  - Stack choice (`Vite 8.3.4 / TS 7.0.2 / Canvas 2D Grounded Hybrid + authoritative WebSocket`) and budgets (`≤ 200KB gzip`, `Fast 4G ≤ 2.0s`, `60fps / 16.6ms`, `DPR ≤ 2`) are viable with 0 blockers. Raises 3 concerns: (1) missing `docs/engine-reference/web/VERSION.md` referenced by `CLAUDE.md` line 28; (2) highest technical risk (WeChat iOS/Android & iOS Safari 443 WSS connectivity, background reconnect, non-sleeping VPS) is not yet empirically tested while current scaffold targets single-client disk smoke tests; (3) minor hygiene drift between `project.yaml` and `.claude/docs/technical-preferences.md` (`naming.signals` phrasing and `[TO BE CONFIGURED]` placeholders in `File Extension Routing`).
- **Producer (`PR-PHASE-GATE`)**: `CONCERNS`
  - Acyclic 14-system / 5-layer plan and MVP-first sequence are well-ordered with 0 blockers. Raises 4 schedule/execution risks: (1) baseline divergence between `game-concept.md` (`5–7 周`) and `systems-index.md` (`6–8 周` + 3 VS deferrals); (2) Stage 2 GDD authoring in `workflow: full` needs an explicit time-box (`S` utilities streamlined, strict no early `#6/#7/#8/#13/#14` authoring); (3) Milestone 0 (`Week 1 443 WSS Spike`) domain/TLS/VPS procurement has multi-day external lead time and should start concurrently with early GDDs while keeping `#3` hosting-agnostic; (4) lock default `3`-plane rule + real-phone touch checklist in `#4/#9/#10`, and track `npm run build` (`dist/`) separation for production.
- **Art Director (`AD-PHASE-GATE`)**: `READY`
  - Visual Identity Anchor, approved 9-section `design/art/art-bible.md`, and `#9 / #10` split in `systems-index.md` are 100% aligned with zero visual rework blockers. Watchpoints: reserve corner slot clearance in `#9/#11` MVP layout for VS tilted stamps and include real-phone `375×540px dvh` screenshots + `CB-1..CB-7` filter checks in `#9/#10`/M0 validation.

---

### Blockers
- **None (0 Blockers)**.

### Recommendations (5 Consolidated Concerns)
1. **Sync `game-concept.md` Baseline (Concerns #1 · CD/TD/PR — *Closed immediately prior to stage advance*)**: Update `game-concept.md` header status, add post-prototype `5A` manual AI takeover & persistent rolled-die proof banner to Core Loop, synchronize recalibrated `6–8 周` MVP + 3 VS deferrals with `systems-index.md`, and mark completed Concept milestones.
2. **Create `docs/engine-reference/web/VERSION.md` (Concern #2 · TD — *Closed immediately prior to stage advance*)**: Author `docs/engine-reference/web/VERSION.md` pinned verbatim to `package.json` (`vite 8.3.4`, `typescript 7.0.2`, `vitest 5.0.5`, `@playwright/test 1.64.1`, `vite-plugin-singlefile 2.3.3`) and workspace config rules (`Knowledge Gap: HIGH`), resolving the dangling `@docs/...` import in `CLAUDE.md` and updating `art-bible.md` §8.2.
3. **Clean `.claude/docs/technical-preferences.md` Hygiene (Concern #5 Hygiene · TD — *Closed immediately prior to stage advance*)**: Align `Signals/Events` wording with `project.yaml` (`on_event_name` + TS `on<Event>` handlers) and replace remaining `[TO BE CONFIGURED]` placeholders in `File Extension Routing` with `lead-programmer`.
4. **Milestone 0 (`Week 1 443 WSS Spike`) Lead-Time & `shared/` Isolation *(Tracked for Systems Design `#1/#3`)* **: Begin domain/TLS/non-sleeping VPS prep alongside `#1–#4` GDDs; keep `#3` GDD hosting-agnostic (`ADR` chooses runtime) and declare strict `shared/` zero-DOM TypeScript boundary + `TestClock` injection + multi-client WS E2E requirements.
5. **10–15m Pacing Proof (`#4`) & Stage 2 Time-Box Guardrails *(Tracked for Systems Design `#4/#9/#10/#11`)* **: Lock `2`- vs `3`-plane Express Classic math simulation for 4 human online players in `#4` GDD; write only the 9 MVP GDDs first (streamlined depth for `S`-effort `#1/#2/#11/#12`); enforce `#9/#11` MVP safeguards (high-contrast `#B83227`/`#2D4E7E` corner rule badges + `2.5–3.5s` Toast, warm full-room / `5C` claim prompt, `8px` CSS WeChat edge margin, real-phone touch & colorblind filter verification in `/ux-design` / M0).

### Verdict: CONCERNS
- All 3 required artifacts and all 4 quality checks pass cleanly with 0 blockers; 3 of 4 Phase-Gate directors returned `CONCERNS` (`AD: READY`), resulting in an overall **`CONCERNS`** verdict.
- `Chain-of-Verification: 5 questions checked (including 2 [TOOL ACTION] checks: concept placeholder & artifact-check re-run + Visual Identity Anchor & checklist.tsv re-read) — verdict unchanged (CONCERNS)`

### Accepted Risks
- **Resolved Doc/Hygiene Concerns (`689a1cc`, closed prior to stage advance):**
  1. Concept baseline synchronized across `design/gdd/game-concept.md`, `design/art/art-bible.md`, and `design/gdd/systems-index.md` (`6–8 周` MVP scope, 3 deferred VS items, `5A` manual AI takeover, persistent die-result banner).
  2. Pinned Web toolchain reference created at `docs/engine-reference/web/VERSION.md` (`vite 8.3.4`, `typescript 7.0.2`, `vitest 5.0.5`, `@playwright/test 1.64.1`, `vite-plugin-singlefile 2.3.3`, `node v22.20.0`) and cross-referenced in `design/art/art-bible.md`.
  3. `.claude/docs/technical-preferences.md` cleaned of `[TO BE CONFIGURED]` placeholders (`lead-programmer` / `N/A (Web)` + `Signals/Events` naming clarified).
- **Remaining Tracked Concerns Explicitly Accepted by User (`2026-11-21`, carry forward into Systems Design):**
  1. **M0 443 WSS Hosting & Shared-Code Verification Boundary (`TD-PHASE-GATE`):** Procure/verify `Milestone 0` (`Week 1 443 WSS Spike`) domain, TLS, and non-sleeping VPS host before full networked implementation; enforce host-agnostic `#3` GDD declaring zero-DOM `shared/` boundary, `TestClock` injection, and multi-client WS E2E targets.
  2. **Express Classic Flight Math Lock & Real-Phone Checks (`CD/AD-PHASE-GATE`):** Run mathematical + real-chat turn-pacing simulation inside `#4` GDD to lock default `2`- vs `3`-plane Express Classic (10–15m target); validate `375×540px dvh` real-phone touch targets and `CB-1..CB-7` filters during `#9/#10` & M0.
  3. **Stage 2 Time-Box & MVP Playtest Safeguards (`PR/CD-PHASE-GATE`):** Author only the 9 MVP system GDDs first with streamlined depth for `S`-sized systems (`#1/#2/#11/#12`); include MVP safeguards in `#9/#11` (high-contrast `#B83227`/`#2D4E7E` house-rule badges + `2.5–3.5s` Toast, warm full-room / `5C` offline-seat-claim prompt, and `8px` CSS WeChat edge margin).

### Stage Update
- **Advanced:** `Concept` → **`Systems Design`** (`2026-11-21` via `.claude/scripts/set-stage.sh "Systems Design"` after explicit user acceptance of the 3 remaining tracked concerns above).
