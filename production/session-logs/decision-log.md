# Decision Log

Append-only audit trail of decisions made in autonomous mode.

## 2026-11-19T23:43:00Z — brainstorm

**Decision point:** Phase 1: Creative Discovery & Creative Brief
**Options considered:** Ask full Phase 1 personal discovery prompts / Synthesize Creative Brief from /start input
**Chosen:** Synthesized Creative Brief from /start input (mobile+desktop browser classic board game platform with friends, starting with Ludo/Monopoly, goal=hobby)
**Reason:** Autonomous mode skips non-mandatory discovery prompts when the user already provided clear emotional and product direction; factual timeline/team/engine inputs were still gathered in Phase 6.
**Category:** minor

## 2026-11-19T23:43:01Z — brainstorm

**Decision point:** Phase 3: Core Action Feel & Launch Game Strategy
**Options considered:** Feel: Snappy tactile (<=0.8s) vs instant jumps vs slow cinematic; Launch: Ludo MVP first vs Monopoly first vs both simultaneously
**Chosen:** Snappy tactile physical feel (<=0.8s) + Chinese Classic Ludo MVP first (Express Monopoly later)
**Reason:** Matches Fellowship + Sensation aesthetics while keeping turns fast and scope achievable for a solo first-time developer.
**Category:** minor

## 2026-11-19T23:43:01Z — brainstorm

**Decision point:** Phase 4: Lock Pillars & Resolve CD-PILLARS CONCERNS
**Options considered:** Lock initial pillar draft / Revise 4 structural concerns flagged by creative-director and re-verify
**Chosen:** Revised all 4 concerns (moved pluggable state machine to ADR-001, created player-facing Pillar 4 for Fellowship, sharpened cross-pillar Design Tests, recalibrated Unique Hook against Clubhouse Games 51 + Gartic Phone + WeChat Mini Games) and passed CD-PILLARS: APPROVE
**Reason:** Resolved all structural pillar gaps before locking design direction.
**Category:** minor

## 2026-11-19T23:43:01Z — brainstorm

**Decision point:** Phase 4: Select Visual Identity Anchor (AD-CONCEPT-VISUAL)
**Options considered:** 方向一「阳光纸木桌游箱」(Recommended) / 方向二「明快几何桌游台」 / 方向三「怀旧平版印刷盒」
**Chosen:** 方向一「阳光纸木桌游箱」（Sunlit Tabletop Craft）, absorbing Direction 3's highlighted stamp/badge cue for modified house rules
**Reason:** Art Director's recommended direction uniquely aligns all 4 pillars, 4G/5G <=2s lightweight vector budget, and multi-game tabletop shell extensibility.
**Category:** minor

## 2026-11-19T23:43:01Z — brainstorm

**Decision point:** Phase 6: Lock Target Platform & Adopt TD-FEASIBILITY Guardrails
**Options considered:** Web/Browser (mobile portrait + desktop) vs Native Mobile vs PC Desktop; adopt TD-FEASIBILITY guardrails vs defer
**Chosen:** Web/Browser (mobile portrait first + desktop adaptive) with all 5 TD-FEASIBILITY guardrails adopted (Snapshot-first stateSeq, lobby/in-game reconnect + AI takeover, 6-function GameModule ADR-001, <=200KB gzip / <=2s budget, Week 1 WeChat/iOS network spike)
**Reason:** Directly matches user's stated phone+PC browser requirement and mitigates top solo multiplayer risks without altering scope.
**Category:** minor

## 2026-11-19T23:43:01Z — brainstorm

**Decision point:** Phase 7: Write design/gdd/game-concept.md
**Options considered:** Write concept document directly (autonomous) / Pause for manual draft review
**Chosen:** Write design/gdd/game-concept.md directly (incorporating user-approved PR-SCOPE Option A and Chinese Classic Ludo baseline)
**Reason:** Per full-concept.md Phase 7 autonomous mode rules; scope_changes (Option A) and engine preference (undecided) were already explicitly decided by the user.
**Category:** minor

## 2026-11-20T17:41:37Z — design-review

**Decision point:** Phase 5: Write review log and recommend next step after resolving 7 blockers in design/gdd/game-concept.md
**Options considered:** Append review log + recommend /prototype or re-review / Skip review log
**Chosen:** Appended review log to design/gdd/reviews/game-concept-review-log.md (without stamping post-revision hash as a failing receipt so re-review runs fresh) and recommended next steps
**Reason:** Autonomous mode closes post-revision tracking and records next step after user approved scope_changes (Option A 5-7w online MVP) and Hybrid rendering.
**Category:** minor

## 2026-11-20T17:47:13Z — prototype

**Decision point:** One-shot 1: Brief & Build Confirmation for Pocket Table Hall Express Ludo prototype
**Options considered:** Ask interactive One-shot 1 questions & confirm Build it / Derive brief from design/gdd/game-concept.md and build directly (autonomous)
**Chosen:** Derived design/game-brief.md from design/gdd/game-concept.md (Express Classic 3-plane Chinese Aeroplane Chess, Sunlit Tabletop Craft 2.5D, local hot-seat + named AI stand-in) and proceeded directly to one-shot build
**Reason:** Autonomous automation mode derives provisional defaults from the approved concept doc without prompting for Build it.
**Category:** minor

## 2026-11-20T18:58:00Z — prototype

**Decision point:** Post-playtest Prototype Verdict & Next Step Transition after Iteration 1 (`db976eb`)
**Options considered:** PROCEED / Keep going (advance to next required Studio Mode step `/art-bible`) vs PIVOT (`Change direction`) vs KILL (`Drop it`)
**Chosen:** PROCEED — retain `prototypes/pocket-table-hall/` intact as validated playable reference and advance to Concept required step `/art-bible` (`one-shot-grow.sh guard pocket-table-hall` returned `guard root fail: package.json is at the root` because `/setup-engine` already scaffolded the Web root in `workflow: full`)
**Reason:** User confirmed "进入下一环节，继续推进" after Iteration 1 addressed all 5 playtest items; root Web scaffold already exists, so growing is skipped and Studio Mode proceeds to Art Bible.
**Category:** minor

## 2026-11-20T18:58:30Z — art-bible

**Decision point:** Phase 1: Art Bible Scope & Reference Framing
**Options considered:** Full bible — all 9 sections (Recommended for `workflow: full`) / Visual identity core (sections 1–4 only) / Asset standards only (section 8)
**Chosen:** Full bible — all 9 sections at `docs.density: thorough`, anchored on `design/gdd/game-concept.md` ("阳光纸木桌游箱" Sunlit Tabletop Craft + 5 additive orthogonal references: Clubhouse Games 51, Paper Mario: The Origami King, Traditional Chinese Print Aeroplane Chess & Stamp Craft, Oink Games, PlayingCards.io) and Iteration 1 playtest learnings
**Reason:** `workflow: full` requires all 9 Art Bible sections before `/map-systems` and downstream Phase 3–4 gate checks.
**Category:** minor

## 2026-11-20T18:58:45Z — art-bible

**Decision point:** Section 7: Art vs UX Conflicts & Accessibility-Preserving Resolutions
**Options considered:** Pure maximized board & tilted stamp typography vs accessibility-preserving responsive sizing (`340–355px`), `0°` horizontal CJK stamp text, and Grounded Hybrid HTML/CSS controls
**Chosen:** Accessibility-preserving resolutions across all 3 conflicts: (1) responsive board cap `min(calc(100vw - 12px), calc(100dvh - 180px))` (`340–355px` at `375×540px dvh`, `≥ 688px` desktop) preserving `≥ 44×44px` touch targets and zero vertical scroll; (2) tilt only stamp borders `3°–4°` (`≤ 6°` ceremony stamps) outside hangar hitboxes with CJK text strictly `0°` horizontal; (3) Grounded Hybrid layer (Canvas 2D board/pieces + native HTML/CSS outer controls with `:focus-visible` and `aria-live="polite"` + aligned Canvas hit proxies)
**Reason:** Preserves WCAG AA readability, keyboard/IME/ARIA accessibility, and `375×540px dvh` zero-scroll requirement without breaking Sunlit Tabletop Craft aesthetic.
**Category:** minor

## 2026-11-20T18:59:00Z — art-bible

**Decision point:** Section 8: Art vs Technical Asset Constraints Trade-Offs (MVP vs Vertical Slice)
**Options considered:** Ideal Art Standard (custom rounded CJK Webfont + 256×256 raster paper/wood grain + native 3x offscreen canvas + per-frame `ctx.shadowBlur`) vs Constrained Technical Standard (system CJK sans + `tabular-nums`, 100% procedural Canvas 2D vectors, `DPR ≤ 2` offscreen static board cache, geometric layered contact shadows)
**Chosen:** Constrained Technical Standard locked for MVP (`0 KB` Webfont, `0 KB` external raster textures, `DPR ≤ 2` offscreen static board cache, zero per-frame `ctx.shadowBlur`, `≤ 16` event particles / `≤ 40` confetti, `publicDir: false` Vite ES imports, `npm run build` `dist/` for production); optional lazy-loaded `≤ 128×128px` (`≤ 4KB` WebP) micro-grain baked once into static cache deferred to Vertical Slice
**Reason:** Hard performance budgets (`≤ 200KB gzip`, `Fast 4G ≤ 2.0s`, `60fps / 16.6ms` frame budget on mobile WebViews) take precedence in autonomous mode while reserving Vertical Slice path.
**Category:** minor

## 2026-11-20T18:59:15Z — art-bible

**Decision point:** Phase 5: AD-ART-BIBLE Gate Sign-Off
**Options considered:** APPROVE (`design/art/art-bible.md` complete & consistent) / CONCERNS / REJECT / NOT ASSESSED
**Chosen:** `AD-ART-BIBLE: APPROVE` — recorded `Status: Approved` and `AD-ART-BIBLE: APPROVED 2026-11-21` in `design/art/art-bible.md` after full disk re-read and consistency audit across all 9 sections
**Reason:** All 9 sections at `docs.density: thorough` passed completeness, cross-section hex/lighting/line-rhythm/stamp-angle consistency, WCAG AA & colorblind safety (`CB-1`..`CB-7`), and engine constraint verification.
**Category:** minor

## 2026-11-21T02:17:00Z — map-systems

**Decision point:** Phase 2: Systems Enumeration (explicit + inferred systems from `design/gdd/game-concept.md`)
**Options considered:** 12-system initial map vs decomposed 14-system / 5-layer map extracting inferred runtime boundaries (`#2` local persistence, `#12` tactile audio bus, `#14` offline Pass-and-Play port adapter) and separating platform game switching (`#6`) from Alpha-1 Game #2 (`#7`) and Immutable Table Shell (`#9`) from lazy-loaded GameViewAdapters (`#10`)
**Chosen:** 14-System / 5-Layer decomposition across 7 categories (`Core`, `Gameplay`, `Economy`, `Persistence`, `UI`, `Audio`, `Meta`) with 3 inferred systems (`#2`, `#12`, `#14`) explicitly flagged
**Reason:** Derived cleanly from `ADR-001` (`shared/client/server` isolation), `art-bible.md` Principle 3, zero-account local persistence/reconnect fallback requirements, and iOS/WeChat Web Audio constraints.
**Category:** minor

## 2026-11-21T02:17:10Z — map-systems

**Decision point:** Phase 3: Dependency Mapping & `TD-SYSTEM-BOUNDARY` Gate Resolution
**Options considered:** Leave 12-system boundaries as drafted / Revise all 5 structural boundary defects flagged by `technical-director` `REJECT` and re-verify
**Chosen:** Revised to 14-System / 5-Layer acyclic DAG (`#4/#7/#8` strictly depend on `#1` ONLY; authoritative `rematch()` & `roomSessionLedger` placed in `#3`; `Week 1 443 WSS Spike` extracted as Milestone 0 gate; `#9` & `#10` split via `GameViewAdapterLoader` in `client/app.ts`; `#3 → #2` scoped to `client/net`; `#12` unidirectional via `#2` observable & event bus) -> passed `TD-SYSTEM-BOUNDARY: APPROVE`
**Reason:** Eliminated all circular/reverse dependencies, God Object risks, and client/server bundle contamination risks prior to writing any GDD.
**Category:** minor

## 2026-11-21T02:17:20Z — map-systems

**Decision point:** Phase 4: Priority Tiers & `PR-SCOPE: OPTIMISTIC` Recalibration (`scope_changes` user-confirmed)
**Options considered:** Adopt Producer recalibration (MVP `6–8 周` / `~145–185h` impl+QA, defer live spectate, custom WeChat anti-swipe-back JS intercept, and reaction particles/tilted stamp border frame to VS; Alpha-1 `+2.5–3.5 周` with hidden-info fork note) / Keep unadjusted `5–7 周` / Compress MVP by also deferring `5A` manual takeover
**Chosen:** User explicitly selected Option 1 — Adopted Producer recalibration (`MVP 6–8 周`, deferred 3 non-pillar items to VS while keeping `5A` manual takeover, `5B` timeout autopilot, Host Migration, 1–2 house rules + corner tags + 3s Toast, `催/赞/惊` reactions, and Rematch in MVP; Alpha-1 `+2.5–3.5 周`)
**Reason:** Explicit user `ask_question` decision on `scope_changes` aligns solo part-time capacity (`~20h/week` incl. E2E/QA & 20% buffer) without cutting any Game Pillar.
**Category:** scope_changes

## 2026-11-21T02:17:30Z — map-systems

**Decision point:** Phase 5: Write `design/gdd/systems-index.md`, `CD-SYSTEMS` Gate Sign-Off & Session Checkpoint
**Options considered:** Write `design/gdd/systems-index.md` (`docs.density: thorough`), run `CD-SYSTEMS`, record non-blocking handoff guardrails in `production/session-state/active.md` / Defer index write
**Chosen:** Wrote `design/gdd/systems-index.md` (`TD-SYSTEM-BOUNDARY: APPROVE`, `PR-SCOPE` user-calibrated, `CD-SYSTEMS: APPROVE`), updated status to `Approved`, created `production/session-state/active.md` with checkpoint + 6 CD/TD GDD handoff guardrails
**Reason:** All 3 Concept systems-mapping director gates (`TD-SYSTEM-BOUNDARY`, `PR-SCOPE` recalibration, `CD-SYSTEMS`) approved cleanly in `autonomous` mode and Concept phase required artifacts are now 4/4 `PRESENT`.
**Category:** minor

## 2026-11-21T03:28:30Z — gate-check

**Decision point:** Concept → Systems Design Gate (`CONCERNS`, 0 Blockers: `CD: CONCERNS`, `TD: CONCERNS`, `PR: CONCERNS`, `AD: READY`)
**Options considered:** Write gate report without advancing stage and close documentation hygiene concerns (#1 `game-concept.md` baseline sync, #2 `docs/engine-reference/web/VERSION.md`, #5 `technical-preferences.md` hygiene) first / Accept all 5 concerns immediately and advance stage / Hold without writing files
**Chosen:** User explicitly selected Option 1 — write `production/gate-checks/concept-to-systems-design-2026-11-21.md` (`Verdict: CONCERNS`, `project.stage` kept at `Concept`), close Concerns #1, #2, and #5 hygiene immediately, push to GitHub, then ask user to confirm accepting the remaining 3 next-stage tracked concerns to advance to `Systems Design`
**Reason:** Gate checks are exempt from `autonomous` auto-advance and explicitly honor user control; resolving doc drift before Systems Design prevents GDD contradictions across all 9 MVP systems.
**Category:** minor


## 2026-11-21T04:13:50Z — gate-check

**Decision point:** Concept → Systems Design Stage Transition (`CONCERNS` Accepted Risks Sign-Off)
**Options considered:** Accept remaining 3 next-stage tracked concerns (`M0` 443 WSS hosting/boundary prep, `#4` `2`- vs `3`-plane Express Classic math lock & real-phone checks, Stage 2 time-box + `#9/#11` MVP safeguards) and advance `project.stage` to `Systems Design` / Re-run gate check after additional edits / Defer transition
**Chosen:** User explicitly accepted the 3 remaining tracked concerns (`Option 1`), appended `### Accepted Risks` and stage transition record to `production/gate-checks/concept-to-systems-design-2026-11-21.md`, dual-wrote `Concept` → `Systems Design` via `.claude/scripts/set-stage.sh "Systems Design"` (`project.yaml` + `production/stage.txt`), updated `production/session-state/active.md`, and checked off stage-gate checkboxes in `design/gdd/game-concept.md` and `design/gdd/systems-index.md`
**Reason:** All 3 Concept doc/hygiene items closed cleanly in `689a1cc`; remaining 3 items belong structurally to Systems Design & M0 execution and are explicitly tracked under `### Accepted Risks`.
**Category:** major


## 2026-11-21T14:48:00Z — design-system

**Decision point:** Phase 2e Technical Feasibility & Start Confirmation (`game-module-contract`)
**Options considered:** Proceed with noted Zero-DOM constraint & missing `modules/core.md` engine reference disclosure / Add constraint first / Pause
**Chosen:** Proceed with constraints noted (`docs/engine-reference/web/VERSION.md` `Knowledge Gap: HIGH`; `no engine reference for 'core' under docs/engine-reference/web/modules/` disclosed in Overview & Summary)
**Reason:** Pure Foundation TS contract avoids engine rendering APIs and defers tsconfig DOM-free split to `ADR-001`.
**Category:** minor

## 2026-11-21T14:48:05Z — design-system

**Decision point:** Section A Overview Multi-Tab Framing (`Framing`, `ADR ref`, `Fantasy`)
**Options considered:** Framing (`[A]` Data/infra / `[B]` Player effect / `[C]` Both); ADR ref (`[A]` Cite ADR / `[B]` No existing ADR yet); Fantasy (`[A]` Direct / `[B]` Indirect infra)
**Chosen:** Framing=`[A]` As a data/infrastructure layer; ADR ref=`[B]` No (defer `shared/` split & codecs to `→ becomes ADR-001`); Fantasy=`[B]` Pure infrastructure players feel indirectly
**Reason:** Matches Section 4 framing rules for `Category: Core` / `Layer: Foundation` with 0 existing ADRs in `docs/architecture/`.
**Category:** minor

## 2026-11-21T14:48:10Z — design-system

**Decision point:** Section B Player Fantasy Framing & `creative-director` Lens Candidate Selection
**Options considered:** Framing (`[A] Direct` / `[B] Indirect` / `[C] Both`); Candidate anchors (1: Invisible zero-dispute tabletop referee & rule stamps / 2: One oak table swap-sheet continuity / 3: Unrigged fair wood die & card privacy)
**Chosen:** Framing=`[B] Indirect`; Primary anchor=Candidate 1 integrating Candidate 2 (P4 multi-game continuity) and Candidate 3 (Anti-Pillar fair-dice & view isolation)
**Reason:** Derived from `Category: Core` framing rule; all three candidates align cleanly with P2, P3, P4, and Anti-Pillars without conflict.
**Category:** minor

## 2026-11-21T14:48:15Z — design-system

**Decision point:** Section C Detailed Design Specialist Tension Resolution (`systems-designer` + `gameplay-programmer` + `engine-programmer`)
**Options considered:** Rich generic UI/FX DSL embedded in `#1` metadata vs minimal rule stubs requiring hardcoded UI in `#11`/`#13` vs slim declarative business-semantic metadata (`stampCategory`, `firstTriggerToastTemplate`, `GameEvent.ruleTag`, `MatchHighlight[]`) without visual/DOM properties
**Chosen:** Slim declarative business-semantic metadata with zero visual hex/DOM coordinates (`GameModule<TState, TAction, TRules, TView>`, discriminated `ActionError` union, `getTurnState()`, `getViewForPlayer()` stripping `rngState`, `GameRegistry`, Mulberry32 `RngPort`)
**Reason:** Resolves tension between 100% data-driven `#11/#13` UI and `TD-FEASIBILITY` prohibition against over-abstracting a cross-game rendering engine, keeping `shared/core <= 4KB gzip`.
**Category:** minor

## 2026-11-21T14:48:20Z — design-system

**Decision point:** Section D Formulas, Boundary Guards & Damping Bounds (`lens-systems-designer`)
**Options considered:** Raw summed event delays & plain modulo RNG vs piecewise chain-compressed `calc_anim_duration_ms` (`800ms`/`1500ms`/`0.72`/`max_events=32`), rejection-sampled Mulberry32 `rng_next_int` (`seed=0 -> 0x9E3779B9`, `span<=0` fail-fast), priority-ranked `rule_deviation_count` (`max_visible=4`), and `fuzz_max_turns_per_match=500` damping
**Chosen:** All 3 canonical formulas + cross-knob invariant (`max_single_step_ms <= max_chain_ms`) + `fuzz_max_turns_per_match=500` loop damping
**Reason:** Eliminates modulo bias, V8/WebKit float divergence, negative/infinite animation storms, and mobile `375×540px dvh` badge overflow.
**Category:** minor

## 2026-11-21T14:48:25Z — design-system

**Decision point:** Section E Edge Cases (`13` boundary & error-code resolutions) and Section F Dependencies (`11` provisional downstream dependents)
**Options considered:** Defer simultaneous-turn / hidden-info null spectator / `deepFreeze` invariants until `#7/#8` vs lock all 13 deterministic error codes and invariants in `#1` now
**Chosen:** Locked all 13 explicit If-Outcome rules and all 11 `[Provisional]` downstream interface rows (`Upstream: None`)
**Reason:** Prevents breaking contract rewrites when `#3, #4, #5, #6, #7, #8, #9, #10, #11, #13, #14` GDDs are authored.
**Category:** minor

## 2026-11-21T14:48:30Z — design-system

**Decision point:** Section G Tuning Knobs, Optional Sections (`N/A` Core boundaries, `Cross-References`, `Open Questions`), and Section H Acceptance Criteria (`lens-qa-lead`)
**Options considered:** Skip optional N/A template sections vs fill explicit Core N/A metadata boundaries + `Cross-References` + `Open Questions` alongside 6 Tuning Knobs (`data file`) and 14 measurable `GIVEN/WHEN/THEN` ACs (`AC-1..AC-14`)
**Chosen:** Populated all 6 knobs with bidirectional `Interacting Knobs`, explicit N/A Core handoff notes (no UI/Asset false flags), full `Cross-References`, 3 owned `Open Questions`, and `AC-1..AC-14` (`<= 4KB gzip`, `applyAction <= 2ms`, `pickBotAction <= 5ms`, `1,000`-match fuzz)
**Reason:** Satisfies `workflow: full` / `review_mode: full` completeness rules while leaving zero `[To be designed]` placeholders.
**Category:** minor

## 2026-11-21T14:48:35Z — design-system

**Decision point:** Phase 5 Post-Design Validation (`Summary`, `CD-GDD-ALIGN: APPROVED`, `entities.yaml` registration of `11` entries, `systems-index.md` Status update)
**Options considered:** Keep `Status: In Design` / omit registry vs complete `CD-GDD-ALIGN` inline audit, mark `Status: Designed`, register `3` formulas + `8` constants in `design/registry/entities.yaml` (using only existing disk paths), and update `#1` row + Progress Tracker (`1/9 MVP`) in `systems-index.md`
**Chosen:** Approved `CD-GDD-ALIGN: APPROVED 2026-11-21`, set `Status: Designed`, registered 11 validated facts (`registry.sh validate` `0` errors), and updated `systems-index.md` + `active.md`
**Reason:** Registry append and systems-index status update are `minor` data-file updates under `autonomous` mode; independent `/design-review` preserved for fresh session per §5c.
**Category:** minor
