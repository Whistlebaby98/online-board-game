# Design Review Log: `design/gdd/game-concept.md`

## Review — 2026-11-21 — Verdict: NEEDS REVISION
Review mode: full · Workflow: full
Scope signal: L-XL
Specialists: game-designer, network-programmer, ux-designer, lead-programmer, qa-lead, creative-director
Blocking items: 7 | Recommended: 4 handoff groups
Summary: Core vision, MDA priorities, and 4 pillars are strong, but PR-SCOPE Option A hollowed out Pillar 3 and Fellowship in MVP, 4-plane Chinese Ludo contradicted the 10-15m duration, Alpha-1 2-player games broke Pillar 4, Visual Identity Anchor had colorblind/contrast flaws, 375x540px vertical height was unbudgeted, engine state drifted from project.yaml, and Scope Tiers lacked measurable Exit Criteria. All 7 blockers were revised in-session following user approval of Option A (5-7w online MVP) and Hybrid rendering (on-demand Canvas 2D board + HTML/CSS shell); awaiting fresh re-review.
Prior verdict resolved: First review (7/7 blockers addressed in-session on 2026-11-21; ready for re-review)
Findings:
- [BLOCKING] MVP Definition / Game Pillars: Restored minimal corner rule tags, 2.5-3.5s first-trigger toast, 2-3 static emojis/nudge, explicit Rematch, consecutive-timeout decay, and Host Migration; honestly updated online MVP timeline to 5-7 weeks (user-approved Option A).
- [BLOCKING] Core Loop / Core Identity: Calibrated default Express Classic Chinese Ludo to 2-3 planes + ready/5-6 launch to satisfy 10-15m match duration; kept 4-plane classic in preset.
- [BLOCKING] Game Pillars / Scope Tiers (Alpha-1): Locked native 2-4 player simultaneous participation rule; replaced Gomoku/Connect-4 candidates with 2-4p lightweight classics (UNO-lite / Snakes & Ladders / Liar's Dice).
- [BLOCKING] Visual Identity Anchor: Recalibrated yellow contrast (>=3:1 with dark brown outline), replaced amber highlight with dark-brown frame + white pulse/lift, replaced 8-10px plane icons with silhouette/base dual-channel + board tile/shortcut dual-channel markers.
- [BLOCKING] Core Loop / Technical Considerations: Added 375x540px dvh zero-scroll budget, mutually exclusive bottom slot, x2/x3 stack badge + numbered quick-pick strip, and 1-tap preview -> 2-tap confirm hover-free model.
- [BLOCKING] Technical Considerations: Synced locked Web (Vite 8.3.4, TypeScript 7.0.2, Canvas 2D) stack, explicit Hybrid rendering boundary (on-demand Canvas 2D board with Playwright/a11y hit layer + HTML/CSS shell), and separate authoritative WebSocket server boundary.
- [BLOCKING] MVP Definition / Scope Tiers: Replaced untestable metrics with measurable Fast 4G / animation / fault-injection / playtest thresholds and added Exit Criteria for all 5 Scope Tiers.
- [RECOMMENDED] Downstream Handoff Constraints: Captured network-programmer, lead-programmer, ux-designer, game-designer, and qa-lead constraints for /create-architecture, /art-bible, /ux-design, /design-system, and /qa-plan.
