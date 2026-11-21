# Active Session State — 《口袋桌游厅》（Pocket Table Hall）

<!-- STATUS -->
Epic:
Feature: Concept → Systems Design Gate & Doc Hygiene Closure
Task: Save gate report (CONCERNS) & close Concept doc/hygiene items before stage advance
<!-- /STATUS -->

<!-- CHECKPOINT -->
**Updated:** 2026-11-21
**Branch:** `main`
**Current task:** Saved `/gate-check systems-design` report (`CONCERNS`, 0 blockers) & closed doc hygiene items (Concerns #1, #2, #5 hygiene); `project.stage` remains `Concept` pending user confirmation
**Next step:** Confirm accepting remaining 3 next-stage tracked concerns (M0 hosting prep, `#4` 2-vs-3 plane math lock, Stage 2 time-box) to advance stage via `set-stage.sh "Systems Design"`, or re-run `/gate-check systems-design`
**Blocked on:** `nothing`
**Files in progress:** `none`
**Open questions:** Week 1 443 WSS domain/TLS/VPS hosting pick (Milestone 0); default `2`- vs `3`-plane Express Classic simulation lock in `#4` GDD; Alpha-1 Game #2 open- vs hidden-info selection
<!-- /CHECKPOINT -->

---

## Notes

### Locked Concept Milestones (All 4 Required Artifacts Complete)
- `design/gdd/game-concept.md` — 4 pillars (P1 Ten-Second Table, P2 Tactile Tabletop Feel, P3 House Rules Transparently Yours, P4 One Living Table Many Classics), Express Classic Chinese Aeroplane Chess launch + Alpha-1 lightweight Game #2 + Alpha-2 Express Monopoly (`CD-PILLARS: APPROVE`, 7 `/design-review` blockers resolved).
- `project.yaml` & `CLAUDE.md` — Engine locked via `/setup-engine` to `Web` (`Vite 8.3.4`, `TypeScript 7.0.2`, `Canvas 2D` + native HTML/CSS Grounded Hybrid, `Vitest`, `Playwright`); `workflow: full`, `review_mode: full`, `docs.density: thorough`, `automation: autonomous`.
- `prototypes/pocket-table-hall/` — Validated `PROCEED` playable local Express Ludo one-shot prototype (`db976eb`); kept intact as reference (never imported by `src/`).
- `design/art/art-bible.md` — Full 9-section visual bible for 「阳光纸木桌游箱」（Sunlit Tabletop Craft）, signed off via `AD-ART-BIBLE: APPROVE` (`dd2d44c`).
- `design/gdd/systems-index.md` — 14-System / 5-Layer acyclic map (9 MVP + M0 443 WSS Spike calibrated to `6–8 周` / `~145–185h`; Vertical Slice `~48–65h`; Alpha-1 `+2.5–3.5 周`; Alpha-2 `+6–10 周`; Full Vision `+3–4.5 周`), approved via `TD-SYSTEM-BOUNDARY: APPROVE`, `PR-SCOPE: OPTIMISTIC` (recalibrated per user explicit approval), and `CD-SYSTEMS: APPROVE`.

### Mandatory Down-Stream `/design-system` Handoff Guardrails (from TD & CD Reviews)
1. **`#1 GameModule`**: Add `RuleDefinition.stampCategory` (`indigo_preset` `#2D4E7E` vs `vermilion_mod` `#B83227`) + `firstTriggerToastTemplate` metadata so `#11` stays 100% data-driven; include `getTurnState()`, `calcAnimDurationMs()`, and `MatchHighlight[]`.
2. **`#3 Room Core & ClientSession`**: Include lobby seat/nickname/claim/AI-fill/house-rule endpoints (`joinSeat / updateNickname / claimSeat / setBotSeat / setRules / rematch(ruleOverrides?)`); scope `#3 → #2` strictly to `client/net`; keep `server/room` zero DOM/Storage.
3. **`#4 Aeroplane Chess` (& `#7/#8`)**: Encode non-griefing bot scoring etiquette explicitly inside `pickBotAction(..., rng)` (do not rely solely on `#5`'s timing pause).
4. **`#9 Table Shell` & `#11 Overlays`**: Define clear boundary between lobby setup/random funny-nickname generator (`#9`) and in-game non-blocking rules drawer + veteran auto-only-move toggle (`#11`/`#2`); keep MVP WeChat `8px` left/right CSS touch/visual safe margin (even with custom JS swipe-back intercept deferred to VS); document desktop MVP `~540px` single-column vs VS `≥ 688px` dual-column board height expectations; keep MVP `resultsSlot` styled cleanly in sunlit wood/cardstock.
5. **`#10 Game View Adapters`**: Ensure persistent rolled-die proof covers BOTH active player AND spectators for opponents' rolls; enforce `60–70ms` knockback hitstop, `3–5px` restrained shake, crease flight trail, zero `#000000`, zero system Emoji, `CB-1..CB-7` channels, and Vite dynamic `import()` code splitting via thin `client/app.ts` loader.
6. **`#12 Audio` & `#14 Local Session`**: Converge reaction/toast audio triggers into `#9`'s `PresentationEvent` union so `#12` depends purely on `#2, #9`; constrain `#14 → #6` strictly to `shared/registry`.
