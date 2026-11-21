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
