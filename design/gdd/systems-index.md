# Systems Index: 《口袋桌游厅》（Pocket Table Hall）

> **Status**: Approved
> **Created**: 2026-11-21
> **Last Updated**: 2026-11-21
> **Source Concept**: design/gdd/game-concept.md
> **Technical Director Review (TD-SYSTEM-BOUNDARY)**: REVISED 2026-11-21 — APPROVED 2026-11-21
> **Producer Review (PR-SCOPE)**: OPTIMISTIC (recalibrated per user approval) 2026-11-21
> **Creative Director Review (CD-SYSTEMS)**: APPROVED 2026-11-21

---

## Overview

《口袋桌游厅》（Pocket Table Hall）是一款以**核心幻想「口袋里永远揣着一整箱随时能摊开的实体桌游」**与头号美学 **Fellowship（社交联结）**为统领的跨端浏览器经典桌游平台，严格围绕四大游戏支柱演进：**P1「十秒开桌，零摩擦入局」**（Fast 4G 首屏关键路径 `≤ 200KB gzip`、TTI `≤ 2.0s`、1 次点击入座 `≤ 8s`）、**P2「指尖上的克制实体触感」**（`375×540px dvh` 手机竖屏零滚动、单步 `≤ 0.8s` / 链式 `≤ 1.5s`、「阳光纸木桌游箱」2.5D 轻构造、零光污染）、**P3「村规自由，透明不懵圈」**（桌角常驻清晰文字标签 + `2.5–3.5s` 非阻塞首次触发轻提示）以及 **P4「一桌不断席，换盘不散场」**（原生 2–4 人同桌一键 Rematch、10 秒原地换盘、连续超时托管衰减与房主自动移交）。为承接「一桌百盘」平台定位与 `art-bible.md` 原则 3（「不可变桌台壳层 + 可插拔棋纸及棋件」），系统地图采用 **14 个职责单一、零循环与零逆向依赖的 5 层系统架构**：`shared/` 纯 TypeScript 规则契约与游戏引擎层（`#1, #4, #7, #8`）与 `server/` 权威房间同步及托管编排层（`#3, #5, #6`）严格隔离于 `client/` 混合分层表现壳层与懒加载棋盘适配器（`#2, #9, #10, #11, #12, #13, #14`）。

### 前置工程门禁：Milestone 0（Week 1 真机 443 WSS 技术探针）

- **Gate M0（非运行时系统，阻塞 `#9 / #10 / #11` 全面进入联机生产）**：针对单人首次搭建公网权威 WebSocket 联机的最高不确定性，独立前置 1 周半天真机探针——先落定国内微信及公网可达的域名、标准 TLS（443 端口）与**禁止休眠的非免费 PaaS 常驻主机**（须在开发前提前启动资源准备与选型），部署极简 Echo 房在微信 iOS / Android 与 iOS Safari 实测 `Fast 4G ≤ 2.0s` 首开与 `10/10` 次切后台 `35s` 重连恢复后，再全面展开客户端联机联调。

### 里程碑工时校准与预算口径（单人业余节奏 `~20h/周`）

经 `PR-SCOPE` 核算并由用户拍板确认，本索引统一采用**小时（hours）**计价，且明确区分 **Stage 2 前置 GDD/架构/UX 设计期** 与 **设计定稿后的编码实现 + 集成 QA 周期**（本地 `prototypes/pocket-table-hall/` 原型已前置验证了极速 3 机飞行棋、2.5D 视觉质感、常驻掷骰凭证、中文标注反应按键与手动 AI 接管 UX，真实降低了 `#4/#10/#11/#12` 的玩法试错成本）：

| 里程碑 | 涵盖系统与范围边界 | 校准后工时与周数 | 关键风控与可停靠价值 |
| ---- | ---- | ---- | ---- |
| **MVP（首发线上闭环）** | 9 个系统（`#1, #2, #3, #4, #5, #9, #10[飞行棋], #11, #12`）+ Gate M0。<br>*按 `PR-SCOPE` 校准，仅将 3 项非支柱边缘项顺延至 VS*：局中实时旁观模式（保留掉线空位一键认领）、微信自定义防误滑拦截、表情粒子与倾斜装饰印章框 | **实现+QA `6–8 周`**<br>（`~145–185h`，已含集成/Playwright 2–4 端 10 局与 4 类故障注入回归 `22–30h` + `20%` 缓冲） | **可上线熟人真玩闭环**：零广告、手机/PC/微信互通的极速 3 机中式飞行棋，完整兑现 P1–P4 最小可验证假设 |
| **Vertical Slice（精品单作）** | 新增 `#13`（18–24h）+ 承接 MVP 延后 3 项 + `#4` 第 3–4 项村规与传统 4 机预设 + `#9` QR 邀房卡/桌面双栏/静态缓存微纸纹 + `#11` 扩至 4–6 表情 | **增量 `+2.5–3 周`**<br>（`~48–65h`，累计 `8.5–11 周`） | **优雅停靠点 A**：即便至此停步，亦是一部完整精品级熟人飞行棋单作；注意 QR 编码须用极轻或懒加载实现，禁破 `≤ 200KB gzip` |
| **Alpha-1（多游换盘验证）** | `#6`（24–34h）+ `#7`（16–24h）+ `#10` Game #2 懒加载适配器 | **增量 `+2.5–3.5 周`**<br>（`~50–70h` 明牌二游基线；若 `#7` 选暗牌类触发隐藏信息，须另加 **`+1.5–2 周` / `+20–30h`** → `70–95h`） | **优雅停靠点 B**：已兑现“一桌不断席、10 秒原地换盘”双游戏平台承诺；`#7` 暗牌分叉须在 Alpha-1 启动前定型 |
| **Alpha-2（极速大富翁里程碑）** | `#8`（10–15 分钟极速大富翁纯规则）+ `#10`-Monopoly（40 格零密文棋盘 & 2 步地产抽屉）+ `#5`-Monopoly AI | **增量 `+6–10 周`**<br>（`~120–170h` 专项里程碑，其中视图适配器与 AI 占近 40%–50%） | 孤立隔离最大体量风险；预设“顺序单轮暗拍或买/弃简化版”兜底，严防多人实时竞拍膨胀 |
| **Full Vision（完整合集）** | `#14`（离线同屏 `LocalClientSession`、可分享村规短链、无障碍偏好面板）+ 全合集无障碍/弱网回归审计 | **增量 `+3–4.5 周`**<br>（`~60–90h`；全周期 **`7–10 个月`** 稳妥成立） | 借助 MVP 预埋的 `ClientSession` 端口实现离线 Pass-and-Play 零重构接入 |

### 逐系统职责推演与架构关系分析（14 Systems — Explicit & Inferred）

1. **`#1` GameModule 规则契约、规则元数据与确定性随机内核**（`Core` · Foundation · `shared/` 纯 TS 零 DOM · GDD `S` · 预估实现 `8–12h`）：确立 `ADR-001` 纯函数状态机铁边界，使一切游戏规则可由客户端预览复用、由权威服务端校验执行、并由 Vitest 在 Node 下跑 1,000 局确定性 AI Fuzz（P2/P3/P4）。**核心扩展槽**：除完整六大函数签名（`init / getLegalActions / applyAction[判别联合错误] / isGameOver/getResult[winnerSeatIds, rankings, highlights[]] / validateRules / getViewForPlayer / pickBotAction(..., rng)`）外，显式持有声明式村规元数据 `RuleDefinition[] / RulePreset[] / getRuleDeviations()`、`getTurnState()`（声明多阶段 `roll→move` 与 Alpha-2 竞拍响应计时归属）、含可选 `ruleTag` 的 `GameEvent[]` 与确定性 `calcAnimDurationMs`、以及 `GameRegistry` 契约与外部 Seeded `rng`。
2. **`#2` 客户端本地偏好与重连凭证存储 (inferred)**（`Persistence` · Foundation · `client/` 浏览器专属 · GDD `S` · 预估实现 `4–6h`）：概念原文声明“零账号与云端数据库，但需本地记忆昵称、偏好预设、静音开关及丢 `seatToken` 兜底”，因此推导为独立的客户端持久化适配器。负责在微信内置浏览器 / iOS Safari 沙盒隔离场景下安全降级读写（`localStorage` → `sessionStorage`/内存），管理可观察的静音状态（切断 `Shell ↔ Audio` 循环）、按游戏隔离的不透明 `Record<gameId, presetId>` 偏好，以及有界 LRU `roomCode -> seatToken` 映射（**严禁将 `seatToken` 拼入分享 URL**）。
3. **`#3` 权威房间核心、会话端口与实时同步**（`Core` · Core · `shared/protocol` + `server/room` + `client/net` · GDD `L` · 预估实现 `45–60h` 含 M0 准备）：全作最高风险核心，直接支撑 P1 秒开入座与 P4 零死锁联机。
   - `shared/protocol` 声明平台无关的 `ClientSession` 端口（`getSnapshot / subscribe / sendAction / sendEphemeral / setTakeover / rematch / switchGame`）、`protocolVersion`、`RoomSnapshot`（含 `SeatControlState: human | bot | manual_5A | timeout_5B`、`TurnClock.remainingMs` 与 `roomSessionLedger` 槽位）、`expectedSeq` / 最近 N 条 `actionId` 幂等缓存及独立 ephemeral 广播协议（表情绝不递增 `stateSeq`）；
   - `server/room`（**严禁触碰 DOM/Storage**）持有权威房间生命周期：1 秒建房与短码入座、大厅 60–120s 保活、Host Migration（**自动跳过永久 `bot` 座位**）、全员真人离线自动暂停、`animDurationMs` 动态缓冲窗、**MVP 权威 `rematch()` 跃迁**、服务端内存 **`roomSessionLedger`** 记分累计、房间 TTL 与 `MAX_ACTIVE_ROOMS`/速率限制，以及向 `#5` 暴露**单 tick 原子钩子 `TurnAutomationHooks`**（`onActionAttempt` 在真人落子同一 tick 内清除 `5A/5B` 并取消已排程的 Bot Timer，杜绝双重提交竞态）；
   - `client/net` 实现 WebSocket 版 `ClientSession`（处理双标签顶号关闭码 `4001` 禁自动重连、切后台超 3s 先发 1.5–2s ping 主动探活），且**全项目仅此前端传输子层依赖 `#2`**。
4. **`#4` 中式经典飞行棋规则与村规引擎**（`Gameplay` · Core · `shared/games/aeroplane-chess/` 纯 TS · GDD `M` · 预估实现 `18–26h`）：首发支柱游戏本体，**仅依赖 `#1`**（零网络/UI 耦合）。完整实现 15×15 对称 52 格外圈、四角停机坪、起飞引导、同色 +4 连跳、12 步虚线快捷飞跃、叠子/被撞/飞跃后连跳及终点精准折返唯一默认规则表；MVP 默认交付极速经典 2–3 架飞机预设（数学锁定 10–15 分钟）+ 1–2 项高频村规（`5/6 起飞`、`三连 6 回老家`）并携带 `ruleTag` 与 `MatchHighlight[]`，VS 补全第 3–4 项村规与传统 4 架完整预设。
5. **`#5` AI 补位与分级托管策略控制器**（`Gameplay` · Feature · `server/autopilot/` 策略插件 · GDD `M` · 预估实现 `16–22h`）：作为严格的无套接字策略插件挂载至 `#3` 的 `TurnAutomationHooks`，同时服务于“人数不够 AI 凑”与“走神/主动暂离不冷场”（P4 + 试玩需求）。管理开局命名补位 AI（0.4–0.6s 礼仪短停顿、不恶意集火领先真人）、30s（+1.5–2s 服务端宽限）倒计时、连续 `≥ 2` 次超时或确认断连衰减为 `5B` 超时托管（AI 2–3s 内代走）、玩家主动切换的 `5A` 手动托管与原子还权协调，以及全员离线暂停时的计时器挂起。
6. **`#6` 多游戏目录与原地换盘编排**（`Core` · Alpha-1 · `shared/registry` + `server/switch-game` · GDD `M` · 预估实现 `24–34h`）：将“一桌不断席、10 秒原地换盘（P4）”与具体游戏内容解耦为平台能力。由 `GameRegistry` 管理多游戏元信息清单，服务端 `Room.switchGame(gameId, rules)` 复用 `#3` 的 `rematch()` 安全重置通道，完整保留 2–4 人座位、`SeatControlState` 与 `roomSessionLedger`；**严格不对 Presentation `#9` 建立反向依赖**，前端完全靠监听 `snapshot.gameId` 变化按需切盘。
7. **`#7` Alpha-1 轻量经典二游规则引擎**（`Gameplay` · Alpha-1 · `shared/games/<game2>/` 纯 TS · GDD `S` · 预估实现 `16–24h` 明牌 / `+20–30h` 暗牌）：原生 2–4 人同时参与的超轻量第 2 款经典桌游（蛇梯棋 / 极简变色牌 UNO / 吹牛骰三选一，绝不选纯 2 人坐冷板凳品类），**仅依赖 `#1`**，以最小增量率先跑通换盘协议并验出暗牌或明牌分支风险。
8. **`#8` 《极速大富翁》规则与地产经济引擎**（`Economy` · Alpha-2 · `shared/games/monopoly/` 纯 TS · GDD `L` · 预估实现 `120–170h` 含配套视图与 AI）：旗舰第 3 作（10–15 分钟固定回合总资产决胜或首破产即结算，传统无尽模式进村规），**仅依赖 `#1`**。覆盖 40 格地产买卖/分级租金/机会命运/监狱/破产清算、借助 `#1 getTurnState()` 的 2 步竞拍与交易响应、3–5 项村规及防经济溢出测试。
9. **`#9` 不可变桌面壳层与跨端触控框架**（`UI` · Presentation · `client/shell/` · GDD `L` · 预估实现 `30–40h`）：`art-bible.md` 原则 3 的直接工程化身，彻底摆脱具体游戏耦合，实现四大支柱共用的「阳光纸木桌游箱」桌面壳：浅橡木桌台与 45° 胡桃木框、`375×540px dvh` 零滚动自适应棋盘尺寸约束（`min(calc(100vw - 12px), calc(100dvh - 180px))` → 手机 `340–355px`，桌面 `≥ 688px`）、座位环、1 步入座大厅（VS 增 QR 邀房卡）、异常边缘提示（满房/失效链接/`4001`/掉线一键认领、VS 增实时旁观与微信防误滑）、底部互斥操作槽、`5A/5B/5C` 三态区分横幅、**MVP 极简结算与一键 Rematch 入口**、键盘/`:focus-visible`/ARIA/`prefers-reduced-motion`、静音键帽（仅写 `#2`）、`DPR ≤ 2` 离屏静态棋盘缓存宿主与 DOM 热区代理。核心技术中枢包含：**`PresentationTimelineReconciler`**（协调在线 `events[]` 动画缓冲播映与重连跳过直达终态）、4 个受控布局槽位（`topRuleSlot / bottomActionTraySlot / seatBubbleAnchor / resultsSlot`）、语义化 **Presentation Event Bus**，以及由薄组合根 `client/app.ts` 注入的 **`GameViewAdapterLoader`**，按 `gameId` 动态 `import()` 懒加载 `#10` 守住首屏 `≤ 200KB gzip`。
10. **`#10` 可插拔游戏棋盘视图适配器**（`UI` · MVP 首发飞行棋，Alpha-1/2 增量扩充同级懒加载适配器 · `client/games/<gameId>/` · GDD `M` · MVP 实现 `24–32h`）：实现 `#9` 定义的 `GameViewAdapter` 插件契约，负责把纯规则状态绘制为可捏取的 2.5D 棋纸与微雕棋件。MVP 交付飞行棋 15×15 双通道棋盘、`CB-1..CB-7` 压纹与 4 种航线虚线节奏、四阵营剪影+几何底托+`1–4` 圆牌+`×2/×3` 阶梯叠子、常驻掷骰点数凭证铭牌、1 点虚线与撞飞靶心预警及 2 点确认；Alpha-1/Alpha-2 分别独立代码分割追加二游适配器与《极速大富翁》40 格零地名密文棋盘 + 手机 2 步地产/竞拍抽屉。
11. **`#11` 村规透明展示与轻社交表情浮层**（`UI` · Presentation · `client/overlays/` · GDD `S` · 预估实现 `10–14h`）：挂载于 `#9` 顶栏与对手回合底部槽的透明化社交轻浮层。读取 `#1 RuleDefinition[]` 数据驱动生成桌角村规文字标签（VS 加 `3°–4°` 倾斜胶皮印章外框，内部中文严格 `0°` 水平），以客户端 `matchId` 作用域 `seenRuleTriggers` 驱动首次触发 **`2.5–3.5s`** 非阻塞可点收 Toast；通过 `#3` ephemeral 通道收发 **`催` / `赞` / `惊`**（VS 扩至 4–6 枚）中文短标实体键帽及手绘墨线厚卡纸气泡（VS 补轻量纸屑微粒），并在触发帧向 `#9` 事件总线发布音效事件。
12. **`#12` 拟物桌面音效与静音安全反馈系统 (inferred)**（`Audio` · Presentation · `client/audio/` · GDD `S` · 预估实现 `6–10h`）：头号美学 Sensation 与移动端 Web Audio 特殊坑（iOS/微信首手势解锁、来电/切后台 `interrupted` 状态同步恢复）决定了不能将音效散落耦合进核心规则或 UI 控件中。采用严格单向订阅架构：监听 `#2` 静音状态、`document` `{ capture: true, passive: true }` 首手势解锁、`visibilitychange` 恢复，并订阅 `#9/#11` 的 Presentation Event Bus 对齐 65ms 撞飞顿帧与跳跃节奏（GDD 阶段可进一步将 `#11` 触发事件归并至 `#9` 联合类型，从而在代码上收敛为仅依赖 `#2, #9`），同时承担“静音纯视觉 100% 完备”检验。
13. **`#13` 连局战报展示与趣味称号系统**（`Meta` · Vertical Slice · `client/results/` · GDD `M` · 预估实现 `18–24h`）：专职渲染 Vertical Slice 的朋友局幽默收尾仪式（Service 权威账本由 `#3` 保管，高光数据由 `#1 MatchHighlight[]` 提供，Rematch 权威入口归 `#3/#9`，从而彻底零逆向依赖）。挂载于 `#9` 的 `resultsSlot`，绘制胡桃木边厚卡纸战报铭牌、多局胜场排行、优先聚焦真人的幽默称号印章贴纸（如“空中飞人”“全村最惨靶子”）及 `≤ 40` 枚几何模切庆祝纸屑。
14. **`#14` 离线同屏传玩适配器与全愿景便携增强 (inferred)**（`Meta` · Full Vision · `client/local-session/` + `client/a11y/` · GDD `M` · 预估实现 `60–90h` 含全合集回归）：依托 `#3` 预先暴露的 `ClientSession` 端口，于浏览器本地实现 `LocalClientSession` 状态推进与过手隐私屏蔽（零重构直接驱动 `#9–#13` 运行单机 Pass-and-Play），提供基于 `#1 validateRules()` 的可分享村规预设短链编解码（**引用 `#6` 时严格仅限 `shared/registry` 子路径，严禁打入服务端代码**），并收纳 Full Vision 级无障碍覆盖面板与跨端全量审计工具链。

---

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | GameModule 规则契约、规则元数据与确定性随机内核 | Core | MVP | Designed | design/gdd/game-module-contract.md | — |
| 2 | 客户端本地偏好与重连凭证存储 (inferred) | Persistence | MVP | Not Started | — | — |
| 3 | 权威房间核心、会话端口与实时同步 | Core | MVP | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 客户端本地偏好与重连凭证存储 (inferred)（仅 client/net 子层） |
| 4 | 中式经典飞行棋规则与村规引擎 | Gameplay | MVP | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核 |
| 5 | AI 补位与分级托管策略控制器 | Gameplay | MVP | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 权威房间核心、会话端口与实时同步 |
| 6 | 多游戏目录与原地换盘编排 | Core | Alpha | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 权威房间核心、会话端口与实时同步, AI 补位与分级托管策略控制器 |
| 7 | Alpha-1 轻量经典二游规则引擎 | Gameplay | Alpha | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核 |
| 8 | 《极速大富翁》规则与地产经济引擎 | Economy | Alpha | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核 |
| 9 | 不可变桌面壳层与跨端触控框架 | UI | MVP | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 客户端本地偏好与重连凭证存储 (inferred), 权威房间核心、会话端口与实时同步（ClientSession 端口） |
| 10 | 可插拔游戏棋盘视图适配器 | UI | MVP | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 中式经典飞行棋规则与村规引擎（MVP；Alpha 适配器分别仅依赖 #7/#8）, 不可变桌面壳层与跨端触控框架 |
| 11 | 村规透明展示与轻社交表情浮层 | UI | MVP | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 权威房间核心、会话端口与实时同步（ClientSession ephemeral 端口）, 不可变桌面壳层与跨端触控框架 |
| 12 | 拟物桌面音效与静音安全反馈系统 (inferred) | Audio | MVP | Not Started | — | 客户端本地偏好与重连凭证存储 (inferred), 不可变桌面壳层与跨端触控框架, 村规透明展示与轻社交表情浮层 |
| 13 | 连局战报展示与趣味称号系统 | Meta | Vertical Slice | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 权威房间核心、会话端口与实时同步（ClientSession 端口）, 不可变桌面壳层与跨端触控框架 |
| 14 | 离线同屏传玩适配器与全愿景便携增强 (inferred) | Meta | Full Vision | Not Started | — | GameModule 规则契约、规则元数据与确定性随机内核, 客户端本地偏好与重连凭证存储 (inferred), 权威房间核心、会话端口与实时同步（仅 shared ClientSession 接口）, 多游戏目录与原地换盘编排（仅 shared/registry 子路径）, 不可变桌面壳层与跨端触控框架 |

---

## Categories

| Category | Description | Typical Systems |
|----------|-------------|-----------------|
| **Core** | 跨端契约边界、房间权威生命周期与平台目录基础设施，几乎全部上游系统赖以为基 | `GameModule 规则契约与随机内核`、`权威房间核心与实时同步`、`多游戏目录与原地换盘编排` |
| **Gameplay** | 决定核心乐趣与单局博弈循环的纯规则状态机与托管策略（均零 DOM 依赖、100% 可单测） | `中式经典飞行棋规则引擎`、`AI 补位与分级托管策略控制器`、`Alpha-1 轻量经典二游规则引擎` |
| **Economy** | 多资产、房产租金梯度、回合资产结算与简版竞拍交易数值引擎 | `《极速大富翁》规则与地产经济引擎` |
| **Persistence** | 无账号架构下的客户端本地记忆与断线重连令牌存储（及服务端受限异常降级策略） | `客户端本地偏好与重连凭证存储` |
| **UI** | 「阳光纸木桌游箱」2.5D 混合分层桌面壳、可插拔棋盘适配器、村规铭牌/轻提示与表情气泡 | `不可变桌面壳层与跨端触控框架`、`可插拔游戏棋盘视图适配器`、`村规透明展示与轻社交表情浮层` |
| **Audio** | 轻量合成/懒加载木纸物理音效总线、iOS/微信解锁恢复与静音纯视觉等价保证 | `拟物桌面音效与静音安全反馈系统` |
| **Meta** | 局间连局战报仪式感、单机离线 Pass-and-Play 适配、规则分享短链与全合集无障碍增强 | `连局战报展示与趣味称号系统`、`离线同屏传玩适配器与全愿景便携增强` |

---

## Priority Tiers

| Tier | Definition | Target Milestone | Design Urgency |
|------|------------|------------------|----------------|
| **MVP** | 兑现四大支柱最小可验证闭环（9 个系统 + Gate M0 Spike：无账号建房防死锁联机、极速 3 机飞行棋、1–2 村规+角标+3s Toast、`催/赞/惊`、`5A/5B` 托管、Rematch 与 `375×540px dvh` 触控） | 首个好友可测联机版本<br>*（实现+QA 校准为 `6–8 周` / `~145–185h`，含 M0 前置门禁；不含 GDD 设计期）* | **Design FIRST** |
| **Vertical Slice** | 补全 `#13` 连局趣味称号战报、MVP 延后 3 项非支柱体验（局中实时旁观、微信防误滑、表情粒子与倾斜印章框）、3–4 项村规与 4 机预设、QR 邀房及视觉微纸纹打磨 | **优雅停靠站 A（精品单作飞行棋）**<br>*（增量 `+2.5–3 周` / `~48–65h`，累计 `8.5–11 周`）* | **Design SECOND** |
| **Alpha** | 分两步兑现合集扩张：<br>• **Alpha-1**：`#6` 原地换盘 + `#7` 原生 2–4 人轻二游 + `#10` 适配器（增量 `+2.5–3.5 周` / `~50–70h` 明牌基线；暗牌分叉 `+1.5–2 周`）— **优雅停靠站 B（双游同桌平台）**<br>• **Alpha-2**：`#8` 《极速大富翁》+ `#10`-Monopoly + `#5`-AI（增量 `+6–10 周` / `~120–170h`） | **Alpha-1（累计 `11–14.5 周`）**<br>**Alpha-2（累计 `17–24.5 周`）** | **Design THIRD** |
| **Full Vision** | `#14` 离线单机同屏传玩 `LocalClientSession`、可分享村规短链、无障碍偏好覆盖面板与全合集弱网/无障碍回归审计 | 最终完整版合集<br>*（增量 `+3–4.5 周` / `~60–90h`，全周期 `7–10 个月`）* | **Design LAST** |

---

## Dependency Map

全图严格维持 **5 层有向无环图（DAG）**：越底层的系统零外界依赖越早定稿；**三大高风险瓶颈系统**为 `#1 GameModule 契约`（**11** 个直接依赖方）、`#3 权威房间核心与会话端口`（**6** 个直接依赖方）与 `#9 不可变桌面壳层`（**5** 个直接依赖方）。纯叶子节点为 `#10`、`#12`、`#13`、`#14`（以及 Alpha 里程碑方被动态加载的独立规则叶节点 `#7`、`#8`），改动风险最低、适合后置编写。

### Foundation Layer (no dependencies)

> 设计与构建基石：零外界、零 DOM/Storage 与零传输协议混杂。`#1` 定义全平台共享契约，决定多游戏可插拔成败；`#2` 收口浏览器持久化异常边界。

1. **`#1 GameModule 规则契约、规则元数据与确定性随机内核`** — 无依赖；确立 `shared/` 纯 TS 状态机、`RuleDefinition[]`、`getTurnState()`、`MatchHighlight[]` 与外部 Seeded `rng` 铁契约（**全图第 1 瓶颈：11 个直接依赖方**）。
2. **`#2 客户端本地偏好与重连凭证存储 (inferred)`** — 无依赖；隔离微信/Safari `localStorage` 沙盒降级、静音可观察状态、预设偏好与禁止入 URL 的 `seatToken` LRU 缓存。

### Core Layer (depends on foundation)

> 平台通信中枢与首发纯规则引擎分道并行：`#3` 持有权威状态、`ClientSession` 接口与 `server/room` 原子动作钩子（严格限定仅 `client/net` 读 `#2`）；`#4` 保持纯数学规则纯粹性。

1. **`#3 权威房间核心、会话端口与实时同步`** — depends on: `#1`, `#2` *(仅限 `client/net` 传输子边界，`server/room` 与 `shared/protocol` 严禁触碰 DOM/Storage)*（**全图第 2 瓶颈：6 个直接依赖方**）。
2. **`#4 中式经典飞行棋规则与村规引擎`** — depends on: `#1` ONLY（零网络、零托管、零 DOM，可直接跑 Node 1,000 局确定性 AI 自博弈 Fuzz）。

### Feature Layer (depends on foundation / core)

> 所有非规则状态流与玩法扩展均在此层收敛：`#5` 仅通过 `#3` 的原子钩子策略运行；`#6` 仅编排换盘流程而对任何 UI 零反向依赖；`#7` 与 `#8` 作为各时代纯游戏规则，**同样只依赖 `#1`**。

1. **`#5 AI 补位与分级托管策略控制器`** — depends on: `#1`, `#3`（挂载至 `#3` `TurnAutomationHooks`，治理补位 AI、`5A` 手动托管、`5B` 超时衰减与离线暂停挂起）。
2. **`#6 多游戏目录与原地换盘编排`** — depends on: `#1`, `#3`, `#5`（Alpha-1 平台 `GameRegistry` + `server/room.switchGame()`，复用 `#3` `rematch()` 通道且零接触表现层）。
3. **`#7 Alpha-1 轻量经典二游规则引擎`** — depends on: `#1` ONLY（纯 TS 第 2 款 2–4 人经典规则状态机，架构位置与 `#4` 完全对称）。
4. **`#8 《极速大富翁》规则与地产经济引擎`** — depends on: `#1` ONLY（Alpha-2 旗舰纯 TS 规则状态机，依赖 `#1` `getTurnState()` 支撑多行动者 2 步竞拍/交易而不耦合 `#5/#6`）。

### Presentation Layer (depends on foundation / core / feature)

> 严守 `art-bible.md` 原则 3 与 `client/` 薄组合根边界：`#9` 通过 `ClientSession` 端口 + 动态 `GameViewAdapterLoader` 驱动表现层，对具体游戏保持无知；`#12 Audio` 严格单向订阅总线，杜绝隐式循环。

1. **`#9 不可变桌面壳层与跨端触控框架`** — depends on: `#1`, `#2`, `#3` *(仅 `ClientSession` 端口)*（**全图第 3 瓶颈：5 个直接依赖方**；由最外层薄组合根 `client/app.ts` 注入各游戏适配器懒加载表以守住 `≤ 200KB gzip`）。
2. **`#10 可插拔游戏棋盘视图适配器`** — depends on: `#1`, `#4` *(MVP 首发；Alpha-1/2 各自增量适配器分别仅依赖 `#7` / `#8`)*, `#9`（纯叶子视图，按 `gameId` 代码分割懒加载）。
3. **`#11 村规透明展示与轻社交表情浮层`** — depends on: `#1`, `#3` *(ClientSession ephemeral 端口)*, `#9`（挂载至 `#9` 的 `topRuleSlot` / `bottomActionTraySlot` / `seatBubbleAnchor`，零逆向侵占）。
4. **`#12 拟物桌面音效与静音安全反馈系统 (inferred)`** — depends on: `#2`, `#9`, `#11`（纯叶子系统：严格单向观察 `#2` 与 `#9/#11` Presentation Event Bus，独立捕获首手势与 `visibilitychange` `interrupted` 恢复；GDD 定稿阶段可选将 `#11` 事件并入 `#9` 联合类型以收敛为仅依赖 `#2, #9`）。

### Polish Layer (depends on earlier layers)

> 体验仪式感与跨端口便携封装层，完全依托前置稳定接口“免重构挂载”。

1. **`#13 连局战报展示与趣味称号系统`** — depends on: `#1`, `#3` *(ClientSession 端口消费 `roomSessionLedger`)*, `#9`（挂载 `#9` `resultsSlot`，消费 `#1 MatchHighlight[]` 与 `#3` 记分账本）。
2. **`#14 离线同屏传玩适配器与全愿景便携增强 (inferred)`** — depends on: `#1`, `#2`, `#3` *(仅 `shared/protocol` `ClientSession` 接口)*, `#6` *(仅 `shared/registry` 子路径，禁引服务端代码)*, `#9`（以 `LocalClientSession` 无侵入替换网络传输层运行 Pass-and-Play）。

---

## Recommended Design Order

遵循“**先锁定契约与边界瓶颈，再按 MVP → Vertical Slice → Alpha-1 → Alpha-2 → Full Vision 推进；同层先 Foundation/Core 再 Feature/Presentation**”的顺序逐一撰写系统 GDD。鉴于本工程处于 `workflow: full` 且个人业余开发需兼顾文档性价比，强烈建议对标明 `S` 级的 4 个工具/轻展示系统（`#1, #2, #11, #12`）采用精简聚焦版 GDD，把精力集中在高风险系统中枢（`#3, #4, #5, #9, #10, #8`）。

| Order | System | Priority | Layer | Agent(s) | Est. Effort |
|-------|--------|----------|-------|----------|-------------|
| 1 | GameModule 规则契约、规则元数据与确定性随机内核 | MVP | Foundation | game-designer, lead-programmer | S |
| 2 | 客户端本地偏好与重连凭证存储 (inferred) | MVP | Foundation | lead-programmer | S |
| 3 | 权威房间核心、会话端口与实时同步 | MVP | Core | network-programmer, technical-director | L |
| 4 | 中式经典飞行棋规则与村规引擎 | MVP | Core | game-designer, qa-lead | M |
| 5 | AI 补位与分级托管策略控制器 | MVP | Feature | game-designer, network-programmer | M |
| 6 | 不可变桌面壳层与跨端触控框架 | MVP | Presentation | ux-designer, art-director, lead-programmer | L |
| 7 | 可插拔游戏棋盘视图适配器 | MVP | Presentation | art-director, ux-designer, lead-programmer | M |
| 8 | 村规透明展示与轻社交表情浮层 | MVP | Presentation | ux-designer, game-designer | S |
| 9 | 拟物桌面音效与静音安全反馈系统 (inferred) | MVP | Presentation | audio-director, sound-designer | S |
| 10 | 连局战报展示与趣味称号系统 | Vertical Slice | Polish | game-designer, art-director, ux-designer | M |
| 11 | 多游戏目录与原地换盘编排 | Alpha | Feature | network-programmer, game-designer | M |
| 12 | Alpha-1 轻量经典二游规则引擎 | Alpha | Feature | game-designer, qa-lead | S |
| 13 | 《极速大富翁》规则与地产经济引擎 | Alpha | Feature | economy-designer, game-designer, ux-designer | L |
| 14 | 离线同屏传玩适配器与全愿景便携增强 (inferred) | Full Vision | Polish | lead-programmer, ux-designer | M |

---

## Circular Dependencies

- None found

> **4 处潜在隐式循环已通过架构契约主动打破**：
> 1. **`#3 Room Core ↔ #5 Autopilot`**：改为由 `#3` 持有 `SeatControlState`、`TurnClock.remainingMs` 与单 tick 原子回调 `TurnAutomationHooks`，`#5` 单向依附挂载，消除并发读写与双向依赖；
> 2. **`#9 Table Shell ↔ #12 Audio`**：禁止 `#9/#11` 导入 `#12`；静音状态写入 `#2`，首次手势解锁与 `interrupted` 恢复由 `#12` 在 `document` 捕获监听，音画帧同步通过订阅 `#9` Presentation Event Bus 完成；
> 3. **`#9 Table Shell ↔ #10 Game Views`**：由薄组合根 `client/app.ts` 注入按 `gameId` 异步 `import()` 的 `GameViewAdapterLoader`，`#9` 仅面向抽象视图契约编程；
> 4. **`#3 Room Core ↔ #13 Results / #11 Overlays`**：权威 `rematch()` 状态机跃迁与服务端 `roomSessionLedger` 归位 `#3`，`#11` 与 `#13` 仅经 `ClientSession` 只读订阅与挂载 `#9` 槽位。

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| **#3 权威房间核心、会话端口与实时同步** | Technical | 个人首次全栈多人工程：微信内置浏览器 / iOS Safari 443 WSS 连通、切后台 35s TCP 半开假在线、双标签顶号、断线重连后 `events[]` 与 `remainingMs` 动画缓冲竞态、以及非休眠主机延迟 | 前置执行 **Milestone 0（Week 1 443 WSS Spike）** 并提前准备域名/TLS；协议强制 `stateSeq` + `expectedSeq`/`actionId` 幂等 + `4001` 禁重连 + 切回 1.5–2s ping；支持测试时钟注入跑 4 类 Playwright 故障注入 |
| **#9 不可变桌面壳层与跨端触控框架** | Technical / Scope | `375×540px dvh` 极紧竖屏下需同时守住 `340–355px` 棋盘、`≥ 44×44px` 触控热区、零滚动、全套断线/认领边缘页、`PresentationTimelineReconciler` 队列及首屏 `≤ 200KB gzip`（PR-SCOPE 指出原 1 周估时严重低估） | 按 PR-SCOPE 上调至 `30–40h`，并在 MVP 先行聚焦非旁观主链路（实时旁观与防误滑移入 VS）；遵循 `vite.config.ts` `dist/` 分包 + `GameViewAdapter` 动态 `import()` 拆包；Canvas 暴露语义热区代理支持 Playwright 断言 |
| **#5 AI 补位与分级托管策略控制器** | Technical / Design | 原型新增手动 AI 接管（`5A`）与超时衰减（`5B`）、断线重连（`5C`）并发交织时，真人点击滚骰/走子瞬间恰逢服务端 Bot 定时器触发易引发同回合双重落子或误夺权；UI 混色亦会造成状态误判 | 托管还权与定时器取消强制锁入 `#3` 单 tick `onActionAttempt` 原子边界；按 `art-bible.md` 实施三态正交编码（5A 青石板实线双框 / 5B 焦糖铜虚线横幅 / 5C 暮紫硫酸纸遮罩） |
| **#1 GameModule 契约、规则元数据与随机内核** | Architecture / Technical | 作为全图 11 处依赖的唯一中枢，若未预先定义 `RuleDefinition[]`、`getTurnState()`、`MatchHighlight[]` 与 `ClientSession` 配套视角语义，后续接 `#11`、`#13`、`#7` 或 `#8` 时必将触发破坏性返工 | 在 `/design-system` 第 1 篇优先锁死 `ADR-001` 完整接口；严守零 DOM 依赖与纯 seeded `rng` 注入；`#7/#8` 仅通过其声明式契约对接壳层 |
| **#7 Alpha-1 轻量经典二游规则引擎** | Scope | 选型分叉隐患：明牌类（蛇梯棋）仅需 `~50–70h` 验证换盘，若盲目选中暗牌/隐藏信息类（UNO / 吹牛骰），将首次激活 `#3 getViewForPlayer` 防泄密裁切、私密手牌 UI 与不完全信息 AI，工期翻倍至 `70–95h` | 在 Alpha-1 启动前先由用户根据当时精力拍板明牌（低风控换盘优先）或暗牌（追加 `+1.5–2 周` 预算） |
| **#8 《极速大富翁》规则与地产经济引擎** | Scope / Design | 120–170h 单体工作量接近整个 MVP；40 格小屏密集地名不可读、传统模式坐牢观战、以及多人实时自由竞拍造成状态机与 UI 复杂度暴涨 | 从 `#10` 视图红线锁死 40 格零微缩文字 + 手机 2 步抽屉；规则默认 10–15 分钟固定回合/首破产决胜；竞拍设计默认预备“顺序单轮暗拍或仅买/弃”低风险降级方案 |

---

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 14 |
| Design docs started | 1 |
| Design docs reviewed | 0 |
| Design docs approved | 0 |
| MVP systems designed | 1/9 |
| Vertical Slice systems designed | 0/1 |

---

## Next Steps

- [x] 通过 `CD-SYSTEMS` 门禁评审并锁定 `design/gdd/systems-index.md`
- [x] 运行 `/gate-check systems-design` 完成 **Concept → Systems Design** 阶段准出核验（此时 Concept 阶段全部 4 项必选产物已齐备）
- [ ] 在全面联机编码前提前筹备 **Milestone 0（Week 1 443 WSS Spike）** 域名、TLS 与非休眠主机资源
- [ ] 按 Recommended Design Order 从 **#1 `GameModule 规则契约、规则元数据与确定性随机内核`**（或直接运行 `/map-systems next` / `/design-system`）开始逐系统编写 GDD
- [ ] 每完成一份系统 GDD 即在独立审查上下文运行 `/design-review design/gdd/[system].md`
- [ ] 当 9 项 MVP 系统 GDD 全部完成审阅后运行 `/gate-check technical-setup` 并进入 `/create-architecture` 与 `ADR-001` 落地
