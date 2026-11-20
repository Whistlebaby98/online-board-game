// PROTOTYPE - NOT FOR PRODUCTION
// Question: Does 2-3 plane Express Classic Chinese Aeroplane Chess with transparent house-rule toggles, tactile <=0.8s hops, and 375x540px touch/keyboard flow deliver a snappy 10-15 minute tabletop feel?
// Date: 2026-11-21
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.5, min: 0, max: 1, step: 0.05 }, // master Web Audio gain (0..1)
  planes_per_player: { value: 3, min: 2, max: 4, step: 1 }, // aircraft per faction (2=Blitz, 3=Express Classic, 4=Standard)
  launch_on_five_or_six: { value: 1, min: 0, max: 1, step: 1 }, // 1=5 or 6 launches from hangar, 0=6 only
  triple_six_penalty: { value: 1, min: 0, max: 1, step: 1 }, // 1=three consecutive 6s return furthest outer plane to hangar
  start_with_one_ready: { value: 1, min: 0, max: 1, step: 1 }, // 1=start with plane #1 on ready pad, 0=all in hangar
  hop_duration_s: { value: 0.12, min: 0.05, max: 0.25, step: 0.01 }, // single-step hop duration in seconds
  max_chain_duration_s: { value: 1.4, min: 0.6, max: 2.0, step: 0.1 }, // hard cap on chained jump+shortcut animation seconds
  hitstop_s: { value: 0.065, min: 0, max: 0.15, step: 0.005 }, // knockback impact pause in seconds
  ai_think_s: { value: 0.45, min: 0.15, max: 1.5, step: 0.05 }, // bot think pause before roll/pick in seconds
  turn_timeout_s: { value: 30, min: 10, max: 60, step: 5 }, // human turn timeout before AI fallback step in seconds
  toast_duration_s: { value: 3.0, min: 1.5, max: 5.0, step: 0.5 }, // first-trigger rule toast lifetime in seconds
  shake_intensity: { value: 4.5, min: 0, max: 10, step: 0.5 }, // knockback board micro-shake amplitude in px
};
