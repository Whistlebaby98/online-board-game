# Game Brief: Pocket Table Hall — Express Ludo (口袋桌游厅 · 极速飞行棋)

## In your words
我想要开发设计一个在线桌游平台，我和可以和朋友通过手机或者电脑网页一起在这里玩一些经典的桌游
我想先做一个飞行棋或者大富翁，可以创建房间，然后好友加入一起游玩。因为纸质的桌游不是每一次都会携带，但是直接通过手机打开某个网页就很简单，或者远在各地可以电脑一起连接游玩。能够随时随地创造快乐
Locked design choices *(from /brainstorm & /design-review)*: 中式经典飞行棋（同色连跳 + 虚线飞跃航线）、极速经典 2–3 架飞机（10–15 分钟单局）、阳光纸木桌游箱 2.5D 轻实体触感（参考 Clubhouse Games 51）、375×540px 手机竖屏优先与电脑网页适配、桌角村规透明标签与 2.5–3.5s 首次触发提示、极简表情催促与一键再来一局。
After play: 整体游戏功能没有大的问题，但是有很多可以优化的地方。1。掷骰子右边有三个按钮，但是没有告知是有什么用，并且点击也没有任何反馈，不知道有什么功能。2，掷骰子后不知道自己是扔了几，骰子结果应该在页面上显示，至少要证明你投掷的是这个数字。3.画面UI可以在做的好看一点，现在有点太平板了。4.画布地图可以画的更大一点。5.增加直接AI接管的按钮，而不是只有因为超时才能让AI接管，有的时候不想自己下，可以让电脑直接帮我进行操作。目前先只想到这些

**Pitch:** A sunlit 2.5D web tabletop where 1–4 players (with named AI bots filling empty seats) play 10–15 minute Express Classic Chinese Aeroplane Chess with transparent house-rule toggles, crisp tactile hops, and one-tap rematches.

**Genre:** Board game — Chinese Aeroplane Chess (`board-and-abstract`)

**Controls:** Tap dice button or press `Space`/`Enter` to roll; tap a plane or numbered quick-pick cards (`1`–`4` or `ArrowLeft`/`ArrowRight`) to preview landing path and knockback warning, then tap again or press `Space`/`Enter` to confirm; `Q`/`W`/`E` for drawn tabletop reactions; `A` toggle manual AI takeover; `M` mute; `H` rules; `R` rematch.

**Question:** Does 2–3 plane Express Classic Chinese Aeroplane Chess with transparent house-rule toggles, tactile <=0.8s hops, and 375x540px touch/keyboard flow deliver a snappy 10–15 minute tabletop feel?

**Hooks:** Chinese Aeroplane Chess same-color +4 jumps and 12-step dotted flight shortcuts paired with live toggleable house rules (5/6 launch, triple-6 back-to-base, 2–4 planes preset) shown as corner badges with 3s first-trigger explanations inside a sunlit 2.5D paper-and-wood tabletop.

**Intent:** *(empty)*

## Look and references
- Look: Sunlit Tabletop Craft (2.5D paper-and-wood board game box): warm oak/linen table `#E9DFCF`/`#F5EFE6`, ivory thick cardstock board `#FAF7F2` with 2–3px bottom lip and soft contact shadows, `#2E2620` ink lines (no pure black), WCAG AA calibrated matte four colors (`#E05252` Coral Red, `#C98A00` Deep Ochre Yellow with dark-brown outline, `#3A7BD5` Cobalt Blue, `#3E9C6B` Meadow Green), high-contrast dark-brown frame + white pulse highlight, dual-channel tile geometric symbols and 4 distinct aircraft silhouettes with unique base shapes; every figure drawn in code, no emoji, no plain circles.
- References: Clubhouse Games: 51 Worldwide Classics (warm unified wood-and-paper tabletop clarity), Classic Chinese Aeroplane Chess paper board (four-color jump track and dotted flight shortcuts).
- View: 2.5D · Camera: static top-down tabletop framing filling viewport (`375x540px dvh` portrait and desktop landscape zero-scroll).

## First minute
Open directly to the sunlit tabletop setup card with 1–4 human/bot seat toggles and house-rule switches. Tap Start (or press Enter) to launch the board, roll the 2.5D wooden die, and see lifted movable aircraft with numbered quick-pick cards. Tap an aircraft or press a number to preview its dashed jump/shortcut trajectory and knockback warning, then confirm for a snappy elastic hop, wooden click sound, and a readable 3s first-trigger toast on your first 5/6 launch, same-color jump, or shortcut flight.

## Challenge
Tension spikes within 2–3 minutes as all 4 factions converge on the shared 52-tile outer ring, contesting 12-step dotted shortcuts and threatening knockbacks back to hangar. Overshooting the center triangle bounces the plane backward, enabling triple-6 penalty risks sending a lead outer plane home, and a 30s turn timer with consecutive-timeout AI auto-pilot prevents stalled turns.

## Core loop
- Roll the 2.5D wooden die and trigger legal-move highlights across aircraft and numbered quick-pick cards.
- Preview exact dashed jump/shortcut landing and knockback risk, then confirm a snappy <=0.8s hop (<=1.5s chained flight).
- Compete to land all planes in the center wedge first, then check funny titles and session scoreboard for a one-tap rematch.

## Goal & fail state
- First faction to land all of its planes (default 3 in Express Classic, tunable 2–4 in `config.js`) in the center finish wedge wins; losing occurs when an opponent finishes all planes first, transitioning to the Results card with match stats, session scoreboard, and one-key Rematch.

## Features
- [x] Title setup card with 1–4 human/bot seat toggles, Express/Blitz/Classic presets (2/3/4 planes), and house-rule switches (`5/6 launch`, `triple-6 back to base`)
- [x] Enlarged 15x15 symmetric 52-tile bevelled wood-framed Chinese Aeroplane Chess board with same-color +4 jumps, 12-step dotted shortcut flights, knockback-to-hangar, and exact-roll bounce finish
- [x] Four distinct 2.5D shaded aircraft silhouettes + geometric bases + dual-channel embossed outer tile/shortcut symbols and persistent rolled die proof banner in Sunlit Tabletop Craft 2.5D style (zero emoji)
- [x] Hover-free 2-step preview-and-confirm controls (numbered quick-pick cards, dashed landing & knockback preview, dedicated confirm slot) plus full keyboard controls (`Space`, `Enter`, `1-4`, `Arrows`, `Q/W/E`, `A`, `M`, `H`, `R`)
- [x] Transparent house-rule corner badges and 3s non-blocking first-trigger rule toasts, plus 3 labeled reaction buttons (`催`/`赞`/`惊`) with live floating speech bubbles, particles, and distinct SFX
- [x] Named AI bots filling empty seats with short think pauses plus direct manual AI takeover button (`A`), 30s turn countdown, and consecutive-timeout auto-pilot handoff/reclaim
- [ ] Web Audio synthesized tabletop SFX with mute toggle and Results screen with funny match titles, session scoreboard, and one-key Rematch

## Your systems
- Chinese Aeroplane Chess rule engine & house-rule toggles · in the slice
- Sunlit 2.5D tactile tabletop & 375x540px responsive HUD · in the slice
- Online rooms & cross-device WebSocket sync · thin stand-in *(local 1–4 human hot-seat + named AI bots)*
- Express Monopoly (Game #2) & mid-room game switching · later

## Keep

## Avoid
- No emoji art, no ads/gacha/stamina, no ranked matchmaking, no built-in voice/video chat, no heavy 3D physics sandbox, no pure-black outlines or yellow/amber highlight clash.

## Out of scope
- Online play (session level — friends on separate devices): needs a server (not built yet; built instead: local 1–4 human hot-seat + named AI bots)
- Phone touch kit verification: runs in phone browser with touch controls built from brief, unchecked by headless key script
- Express Monopoly (Game #2) and mid-room game switching: grow it / add it as a feature
- User accounts, persistent database, QR invite links: add it as a feature

## Build order
1. Complete playable Express Classic Chinese Aeroplane Chess slice (start card -> full 4-faction match with AI bots, house-rule toggles/badges/toasts, 2.5D board, Web Audio SFX -> results & rematch).

---
**Kill condition:** If Express Classic 3-plane matches feel dragged past 18 minutes or mobile 375x540px preview/confirm controls still feel fiddly after two tuning passes, simplify plane count or input flow before adding netcode.

**Who it's for / what they feel:** Friend groups (18–38) wanting zero-friction, zero-ad classic board game laughs on phones or PCs together.

**Games you love / don't:** Love Clubhouse Games: 51 Worldwide Classics (tactile wood/paper clarity); don't love ad-heavy, stamina-locked mobile mini-games.

**Online:** session: needs a server, so not built; built instead: players on one screen, and bots in the empty seats, named as bots *(provisional)*
**Platform:** phone: it runs in a phone's browser, with no touch kit yet: touch controls are built from your words, and no check plays them.
