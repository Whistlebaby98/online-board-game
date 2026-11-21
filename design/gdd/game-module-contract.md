# GameModule 规则契约、规则元数据与确定性随机内核

> Authoring guidance: .claude/docs/templates/guidance/game-design-document-guide.md (load per-section as you author — do not read entirely).

> **Status**: Designed
> **Author**: User + Game Studio Lenses (autonomous)
> **Last Updated**: 2026-11-21
> **Last Verified**: 2026-11-21
> **Implements Pillar**: P1 (Ten-Second Table), P2 (Tactile Tabletop Feel), P3 (Your House Rules, Transparently Yours), P4 (One Living Table, Many Classics)
> **Creative Director Review (CD-GDD-ALIGN)**: APPROVED 2026-11-21

## Summary

`#1 GameModule 规则契约、规则元数据与确定性随机内核` 为《口袋桌游厅》确立了纯函数、零界面依赖的底层游戏规则规范与可复现伪随机底座，使任何经典桌游都能在浏览器预览、服务端裁决与单机传玩间无差错地同构运行。对玩家而言，它保障了零延迟的选子走位预判、手机电脑间绝对公平可追溯的掷骰结果、开局桌角一眼看懂的熟人“村规”徽标提示，以及同一张牌桌 10 秒无缝切换另一款经典桌游的延续体验。本契约处于全平台依赖最底端，直接支撑首发《中式经典飞行棋》与后续《轻量二游》《极速大富翁》及 11 个下游系统的解耦协作。

> **Quick reference** — Layer: `Foundation` · Priority: `MVP` · Key deps: `None` *(Engine feasibility note: `no engine reference for 'core' under docs/engine-reference/web/modules/; feasibility not checked against the pinned engine` — toolchain pinned in `docs/engine-reference/web/VERSION.md` with Zero-DOM `tsconfig` deferred to `ADR-001`)*

## Overview

`GameModule 规则契约、规则元数据与确定性随机内核`（以下简称 **`#1 GameModule` 契约**）是《口袋桌游厅》全平台处于 **Foundation 层** 的核心基础设施契约与确定性纯规则内核规范。它自身零界面、零网络传输、零持久化读写，而是定义所有经典桌游（首发《极速经典中式飞行棋》、Alpha-1 轻量经典二游、Alpha-2《极速大富翁》）都必须实现的**纯函数无副作用状态机接口（`GameModule<TState, TAction, TRules, TView>`）**、**声明式村规元数据与预设模板（`RuleDefinition[]` / `RulePreset[]`）**、**结构化表现事件与动画时长预算口径（`GameEvent[]` / `calcAnimDurationMs`）**、**战报高光片段（`MatchHighlight[]`）**以及**外部注入确定性伪随机端口（`RngPort`）**。

从玩家视角看，该系统处于**完全透明的被动自动化状态**：玩家永远不会在屏幕上看到 `GameModule` 这个名词，却会在每一次点开好友链接时直接享受到它赋能的结果——极速且绝对公平、前后端同构复算不出错的掷骰与撞飞裁决、无需手翻说明书就能通过桌角双色文字徽标与首次触发 `2.5–3.5s` Toast 看懂的熟人“村规”、同桌 10 秒无缝从飞行棋切换至另一张棋纸的“一桌多游”延续感，以及本地 1,000 局确定性 AI 自博弈校验出来的“零卡死”稳定度。若缺少这套处于最底层的中枢契约，每款游戏的走子规则将被迫散落并硬编码进服务端 WebSocket 分支、客户端 Canvas 点击事件或局内 UI 弹窗中，不仅客户端无法纯本地预览落点，村规开关也将退化为脆弱的 `if/else` 补丁，导致后续接入 Alpha-1 二游与 Alpha-2《极速大富翁》时彻底破坏 `art-bible.md` 原则 3（「不可变桌台壳层 + 可插拔棋纸及棋件」）。

### 设计边界与引擎可行性注记

- **行为契约 vs 工程实现边界**：本 GDD 仅锁定契约行为、数据结构语义、可配置元数据规范、异常边界与确定性保障要求；具体项目目录分包策略、Zero-DOM `tsconfig` 多项目隔离配置及前后端序列化编解码细节，均不在此展开实操代码，**→ 交由 `ADR-001`（`docs/architecture/`）在 Technical Setup 阶段正式落盘**。
- **引擎可行性核验（Web 8.3.4 / TypeScript 7.0.2，Domain: `Core`）**：
  - 按 [VERSION.md](file:///d:/Code/在线桌游集合/docs/engine-reference/web/VERSION.md) 钉定参数，当前工具链为 `Vite 8.3.4`、`TypeScript 7.0.2`、`Vitest 5.0.5`、`Node v22.20.0`（Knowledge Gap: **`HIGH`**）。
  - **缺口声明（Mandatory Disclosure）**：**`no engine reference for 'core' under docs/engine-reference/web/modules/; feasibility not checked against the pinned engine`**（`docs/engine-reference/web/modules/` 下目前无 `core.md` 参考手册）。本契约已针对 [VERSION.md](file:///d:/Code/在线桌游集合/docs/engine-reference/web/VERSION.md) 指出的 `tsconfig.json` 现行配置约束（根脚手架当前含 `"DOM"` 与 `"DOM.Iterable"`）前置设立物理约束：`shared/` 契约与游戏引擎包后续必须通过独立 Zero-DOM `tsconfig` 强制编译期禁用 `window` / `document` / `localStorage`。
- **关键架构范式对比（Alternatives Considered）**：
  1. **选定方案 — 无状态纯函数 `GameModule` + 外部注入 `RngPort` + `Snapshot-first`**：每次合法操作返回全新 JSON 可序列化状态与有界 `GameEvent[]`，既能让浏览器本地零网络完成 `getLegalActions` 高亮与 1 点落点预览（P2 零延迟触感），又能让服务端随时覆盖全量 `RoomSnapshot` 防止重连分歧，并在 Vitest 下 1 秒内完成千局并发 Fuzz。
  2. *弃选方案 A — 服务端 Room 面向对象继承（每个游戏继承 `BaseRoom` 并内置定时器与 Socket 广播）*：规则逻辑直接绑定定时器和传输通道，无法在前端纯本地预览或通过 `LocalClientSession` 零重构传玩（违背 P2 与 `#14` 预埋设计），测试必须启动全套 WS 服务端，维护成本随游戏数量呈指数上升。
  3. *弃选方案 B — 纯事件溯源（Event Sourcing Only，不保留完整状态快照）*：虽然单次日志小，但掉线 35s 重连或晚到入座玩家必须重放数百条历史事件与 RNG 步进才能恢复棋盘，且任何微调升级极易造成历史对局无法反序列化；结合本作 `10–15 分钟`短局（状态快照 `< 5KB`）特征，采用**显式序列化 `TState` + 有限瞬态 `GameEvent[]`** 是压倒性的工程最优解。

## Player Fantasy

> **体验定位（Framing: `[B] Indirect`）**：玩家通过其赋能的规则透明性、毫秒级本地预判交互与跨游戏桌面连续性**间接感知**本系统，而非直接操作“契约接口”。

### 创意总监视角评估的三组体验锚点（`lens-creative-director.md`）

在确立本契约的体验指向时，从三个候选玩家瞬间出发比对了各自对下游契约设计的要求（三者与四大支柱均无冲突）：

1. **候选锚点一（选定主锚点）：「隐形却零争议的桌面好裁判 + 一目了然的家规印章纸盒」**
   - **具体玩家瞬间**：好友局里有人开启了“三连 6 回老家”村规并正处于领先位置，第 3 颗骰子刚刚落地为 `6`，棋盘没有一丝迟疑或算错步数，领跑棋子清脆弹回基地，桌角原本静静贴着的朱砂印章徽标旁顺势滑出一张 3 秒轻纸条写明“触发【三连 6 回老家】：张三回基地”；与此同时，自己刚想点一架受阻棋子时，底部选子条与落点虚线瞬间就亮出可走与否，根本不必等服务器转圈才发现走错。
   - **锚定支柱原文**：**Pillar 2**（*「每一次掷骰、走子、撞飞或结算都具备清脆、有物理重量且清晰易读的实体桌游视听反馈」* 与 `Anti-Pillars` *「由权威状态机校验合法走法防误操作」*）及 **Pillar 3**（*「所有生效村规全程对全桌清晰可见、首次触发即给可读提示」*）。
   - **对后续设计的硬约束**：强制规则执行前先有纯本地确定性 `getLegalActions` 支持零延迟预览；强制 `applyAction` 在触发任何非默认村规时主动产出带 `ruleTag` 的 `GameEvent`，配合 `RuleDefinition` 元数据让 UI 无需写死文案即可向全桌“有理有据地裁决”。
2. **候选锚点二（纳入核心兼容维度）：「同一张午后木桌，抽走一张棋纸、摊开下一盘快乐」**
   - **具体玩家瞬间**：一局 12 分钟飞行棋分出胜负，大家笑着看了一眼局末“空中飞人”高光回味，10 秒后直接在桌上换盘摊开另一张 2–4 人经典棋纸，不用重新发链接、不用重新起昵称，原本熟悉的手感与桌面光线全留着，只觉得“手边桌游箱打开了第二层”。
   - **锚定支柱原文**：**Pillar 4**（*「好友聚齐一次就能在同一张跨端牌桌上连开多局（MVP 即具备一键 Rematch）、10 秒原地换盘；所有常驻换盘经典游戏必须原生支持 2–4 人同时参与」*）。
   - **对后续设计的硬约束**：`GameModule` 契约严禁夹带任何飞行棋专属概念（如“停机坪”“骰子点数”），必须抽象出通用 `getTurnState()`、`RulePreset[]`、`MatchHighlight[]` 与 `getViewForPlayer()`，确保 `#4`、`#7`、`#8` 以同一契约即插即用。
3. **候选锚点三（纳入公平与私密底线）：「不耍花招的实体木骰与干干净净的看牌隐私」**
   - **具体玩家瞬间**：即便连续两轮没摇到 6 起飞，朋友间也只会笑骂“手气背”，绝不会怀疑网页小游戏“故意卡你逼看广告”，因为后台只有一颗严苛校验的公平伪随机木骰；而未来切换至含暗牌的二游或传玩模式时，自己的手牌就像用手拢着一样，绝对不会在网络包里顺着抓包泄露给同桌损友。
   - **锚定支柱原文**：**Anti-Pillars**（*「零广告轰炸、无付费改骰子、无房卡体力锁，守护纯公平实体桌游体验」*）。
   - **对后续设计的硬约束**：所有随机性统一强制经由外部注入的确定性 `RngPort` 流转，杜绝隐式全局随机；`getViewForPlayer()` 必须在内部状态与玩家/观局视图之间筑起硬隔离，默认剥离内部 `rngState` 并支持非公开信息裁切。

**最终整合承诺**：本系统虽为“不露面”的 Foundation 契约，但它的尊严在于**让桌上每位玩家永远只感受到桌游本身的公正、顺滑、明快与可信赖**——“规矩清清楚楚、算步分毫不差、换盘行云流水、骰子干干净净”。

## Detailed Design

### Specialist Lens Perspectives (`lens-specialists.md` — `Core → Foundation/Infrastructure`)

在落笔精确契约前，分别从 `systems-designer`（主责）、`gameplay-programmer` 与 `engine-programmer` 三个视角审视边界与风险：

- **`systems-designer` 视角（状态机完备性与无死锁不变式）**：
  - **补充建议**：必须强制定死两项结构性契约——① 非终局状态下**严禁出现全部活跃座位 `getLegalActions() === []` 的“活锁空转”**；② 所有状态机错误（越权出牌、非己方回合、非法载荷、规则互斥）一律通过 `ActionError` 判别联合结构化返回，禁止靠 `throw Error` 中断状态流转。同时必须在 `GameModule` 层面内置 `getRuleDeviations()` 与 `stampCategory`，否则 `#11` 无法保证各游戏村规角标口径统一。
  - **风险提示**：若未明确定义 `getTurnState()` 中的 `clockMode`（单行动者 vs 多人同步响应）及 `rng_next_int` 取模偏差消除，后续 Alpha-2《极速大富翁》多人 2 步竞拍与高频骰子统计检验会出现系统性偏差。
- **`gameplay-programmer` 视角（前端零延迟交互与 AI 算法复杂度）**：
  - **补充建议**：客户端 `1 点预览落点 + 2 点确认走子` 与底部 `1–4` 快捷选子条全赖本地无网络阻塞地调用 `getLegalActions` 与可预测试算；`applyAction` 不得要求构造完整房间上下文，且 `pickBotAction` 应将复杂度锁定在 O(|legalActions|)（单次 `≤ 5ms` P99），并由游戏模块内部承载基础礼仪（例如不恶意集火特定玩家）而非把游戏语义倒灌给 `#5`。
  - **风险提示**：若在接口中保留面向对象类方法、`Date`/`Map`/`Set` 非原生 JSON 值或允许就地修改入参状态，`state` 历史回溯、断线全量 `RoomSnapshot` 序列化与 React/DOM/Canvas 状态比对将迅速退化出隐蔽引用污染缺陷。
- **`engine-programmer` 视角（Zero-DOM 物理隔离、打包体积与跨引擎字节确定性）**：
  - **补充建议**：契约模块 `shared/core/` 必须实现零第三方运行时依赖、包体硬控 `≤ 4KB gzip`；明确要求 `RngPort` 采用纯 32 位整型移位与 `Math.imul` 算子，确保 Node V8 服务端、Android Chromium 与 iOS Safari JavaScriptCore 在同一种子下比特级同构；`ADR-001` 阶段再配合独立无 `DOM` 的 `tsconfig` 编译拦截 `window`/`localStorage`。
  - **风险提示**：如果允许 `Math.random()` 混入任何默认分支，或未规定 `getViewForPlayer()` 对全游戏一律剥离 `rngState`，既会让种子回放失效，又会在网络快照中暴露未掷出的随机数内部状态。
- **核心设计张力与统一裁决（Metadata 丰富度 vs 防过度抽象 `ADR-001`）**：
  - **张力所在**：`systems-designer` 希望通过尽可能丰富的声明式结构支撑未来 `#4/#7/#8/#11/#13` 全自动生成 UI；但过重的平台通用 DSL/渲染描述符（如内置 UI 坐标、粒子参数或脚本虚拟机）会直接违背 `TD-FEASIBILITY` 第 4 条关于“严禁提前抽象跨游戏通用渲染引擎”的警告，并膨胀首屏体积。
  - **最终裁决（`autonomous` 收敛）**：**仅在元数据中声明“纯粹业务语义标签”**（`stampCategory` 枚举、`firstTriggerToastTemplate` 字符串模板、`GameEvent.kind/ruleTag/baseDurationMs/isChainLink`、`MatchHighlight` 事实指标），**绝对不夹带任何色值 hex、像素坐标、DOM 标签名或动效曲线参数**。一切视觉翻译权保留给 `#9/#10/#11/#13`，从而在零视图污染的前提下实现 100% 数据驱动。

### Core Rules

1. **纯净无状态与零 DOM 运行边界（Zero-DOM & Zero-Side-Effect Invariant）**
   - 所有 `#1 GameModule` 契约代码及其下辖游戏引擎（`shared/core/` 与 `shared/games/*/`）严格执行**零 DOM、零浏览器/Node 专属 API（禁用 `window`、`document`、`localStorage`、`fs`、`process`）、零异步 I/O、零 `Math.random()`、零 `Date.now()`**。
   - **纯 JSON 可序列化与不可变入参律**：所有状态 `TState`、动作 `TAction`、配置 `TRules`、玩家视图 `TView`、事件 `GameEvent` 与错误 `ActionError` 仅允许由原生 JSON 类型（`string | number | boolean | null | plain array | plain object`，严禁 `undefined` 作为必须字段语义传递跨网、`Map`/`Set`/`Date`/类实例/函数闭包）组成。`init` 与 `applyAction` 严禁就地篡改入参对象（在测试套件下通过递归 `Object.freeze` 强校验）。
   - **体量硬预算**：`shared/core/`（含契约类型、默认 `calcAnimDurationMs` 辅助函数、`mulberry32` 确定性随机实现与只读 `GameRegistry` 基座）编译打包后对客户端贡献增量必须 **≤ 4KB gzip**，且不引入任何第三方 npm 运行时依赖。

2. **`GameModule<TState, TAction, TRules, TView>` 完整标准接口契约**
   每款接入平台的游戏都必须导出满足下述全部成员的无状态单例描述器：
   - **`meta: GameMetadata`**（静态只读元信息）：包含 `gameId`（kebab-case 唯一标识，如 `aeroplane-chess`）、`displayName`（玩家可读中文名）、`shortTagline`（≤ 18 字换盘副标题）、`minPlayers`（平台硬下限 `2`）、`maxPlayers`（平台硬上限 `4`）、`supportsHiddenInfo: boolean`（区分明牌公开游戏与含私密手牌/信息的二游，决定服务端是否必须逐席位下发差异 `TView`）、`defaultPresetId: string`、`schemaVersion: number` 与 `estimatedDurationMinutes: [number, number]`。
   - **`ruleDefinitions: readonly RuleDefinition[]` 与 `rulePresets: readonly RulePreset<TRules>[]`**：声明式暴露该游戏全部可选预设（MVP 每游 1 套默认预设 + 3–6 个以内的高辨识村规槽位，实际首批启用 1–2 个，VS 补齐）及默认值。
   - **`validateRules(rawConfig: unknown): ValidationResult<TRules>`**：
     - 接收任意来源的原始规则载荷（建房默认、房主切换开关或未来版本短链解码），在校验阶段执行规范化与互斥校验。
     - 成功返回 `{ ok: true, rules: TRules }`；若存在未定义字段、类型越界、枚举非法或双向声明了 `conflictsWith` 的冲突组合，必须返回 `{ ok: false, errors: RuleValidationError[] }`（每条含 `ruleId`、`code` 与面向人类读者的报错说明），绝不静默丢弃非法修改后假装成功。
   - **`getRuleDeviations(rules: Readonly<TRules>, baselinePresetId?: string): readonly RuleDeviation[]`**：
     - 将当前生效规则与基准预设（未传则默认 `meta.defaultPresetId`）逐项比对，产出**所有偏离默认值的自定义条目列表**。
     - 返回序列强制按展示优先级排序：**`vermilion_mod`（朱砂强魔改类）排于 `indigo_preset`（靛青节奏/预设类）之前**，同类别内按 `ruleDefinitions` 声明顺序固定排列，供 `#11` 稳定截取角标与统计溢出 `+N` 数量。
   - **`init(params: MatchInitParams<TRules>, rng: RngPort): InitResult<TState>`**：
     - 校验 `params.playerSeats`（合法席位数必须满足 `meta.minPlayers <= count <= meta.maxPlayers`，且平台硬锁全局范围 `2–4` 人、席位 ID 无重复）与 `params.rules`；通过则结合注入的 `rng` 生成初始状态 `{ ok: true, state }`，非法则返回 `{ ok: false, error: ActionError }`（例如 `INVALID_PLAYER_COUNT` 或 `RULE_CONFLICT`）。
   - **`getTurnState(state: Readonly<TState>): TurnState`**：
     - 向 `#3 Room Core`、`#5 Autopilot` 与 `#9 Table Shell` 暴露统一的行动权与计时口径：`{ phase: string, activeSeatIds: readonly SeatId[], clockMode: 'single' | 'simultaneous_response', turnNumber: number, canTakeover: boolean }`。
     - 借此单函数，飞行棋的“掷骰阶段 (`roll`) → 选子移动阶段 (`move`)”与 Alpha-2 大富翁的“2 步地产交易/多人同时竞拍应答 (`simultaneous_response`)”皆可共用一套房间计时模型，无需修改 `#3` 核心代码。
   - **`getLegalActions(state: Readonly<TState>, seatId: SeatId): readonly TAction[]`**：
     - 确定性地列举指定席位在当前状态下的全部合法动作；非活跃席位（未落在 `activeSeatIds` 内）或终局态固定返回空数组 `[]`。
     - **零活锁契约不变式**：只要 `isGameOver(state) === false`，至少存在一个位于 `getTurnState(state).activeSeatIds` 中的席位满足 `getLegalActions(state, seatId).length >= 1`。
   - **`applyAction(state: Readonly<TState>, seatId: SeatId, action: TAction, rng: RngPort): ApplyActionResult<TState>`**：
     - 按固定顺序校验：① 未处于 `TERMINAL` 态 → ② `seatId` 归属当前合法 `activeSeatIds` → ③ 动作结构与现行 `phase` 匹配 → ④ 属于 `getLegalActions(state, seatId)` 等价合法动作集合。
     - 校验失败一律返回 `{ ok: false, error: ActionError }`（零异常抛出、零状态推进、零消耗 `rng`）；校验通过返回 `{ ok: true, nextState, events, animDurationMs }`，其中 `animDurationMs` 直接调用 `calcAnimDurationMs(events)` 生成并受单包最大事件上限 `32` 条硬裁剪保护。
   - **`isGameOver(state: Readonly<TState>): boolean` 与 `getResult(state: Readonly<TState>): MatchResult | null`**：
     - 未终局时 `getResult` 返回 `null`；一旦 `isGameOver(state) === true`，`getResult` 必须返回完整确定性结算对象 `{ winnerSeatIds: readonly SeatId[], rankings: readonly SeatRanking[], endReason: string, highlights: readonly MatchHighlight[] }`，明确支持同分并列胜出与按既定规则排序后的全员名次及战报高光切片。
   - **`getViewForPlayer(state: Readonly<TState>, viewerSeatId: SeatId | null): TView`**：
     - 唯一允许跨网络或向表现层传递的游戏状态投影出口。
     - **双强制隐私规则**：① 对**所有游戏**（含明牌飞行棋），一律剥离 `rngState` 及任何服务端/内核仅用于审计的内部临时字段；② 当 `meta.supportsHiddenInfo === true` 时，若 `viewerSeatId` 为具体玩家席位，裁切掉其余对手未公开牌面/暗置数值；若 `viewerSeatId === null`（观局或公共预览），裁切全部玩家私有信息，仅留公共桌面状态。
   - **`pickBotAction(state: Readonly<TState>, seatId: SeatId, rng: RngPort): TAction`**：
     - 为补位 AI 与 `5A/5B` 托管策略提供纯游戏内置决策建议。时间复杂度受限于 `O(|legalActions|)`（目标单次 `≤ 5ms` P99），**硬保证返回值必为当前 `getLegalActions(state, seatId)` 中的某一项**。由 `#4/#7/#8` 自行在内部编码社交礼仪权重（如不过分集中撞飞领先真人）。
   - **`calcAnimDurationMs(events: readonly GameEvent[]): number`**：
     - 依据 Section D 分段压缩公式计算本次动作的表现时间预算，直接供 `#3` 动态设置服务端动画缓冲延迟并确保对齐 P2 `≤ 0.8s` 单步 / `≤ 1.5s` 链式上限。

3. **声明式村规元数据规范（`RuleDefinition` — 承接 P3 与 `active.md` 护栏 #1）**
   每条 `RuleDefinition` 必须声明以下字段，使 `#11` 浮层 100% 数据驱动渲染：
   - `id`: 稳定短键名（如 `takeoff_on_5_or_6`、`triple_six_back_home`）。
   - `shortLabel`: **1–6 个汉字**的极简桌面角标短文（如 `5/6起飞`、`三连6回老家`），保障 375px 小屏桌角可读且不换行撑破。
   - `description`: 1 句自然中文说明，供 `#11` 村规快切/说明抽屉直接展示。
   - `type`: `'boolean' | 'enum' | 'int'`，配对应枚举选项或整数边界约束。
   - `defaultValue`: 对应默认极速预设下的初始值。
   - `stampCategory`: `'indigo_preset' | 'vermilion_mod'`（语义分类标识——由 `#11` 按 `art-bible.md` 映射为靛青 `#2D4E7E` 节拍预设章或朱砂 `#B83227` 改命魔改章；`#1` 不直接存储十六进制色值）。
   - `firstTriggerToastTemplate`: 带占位符的本地化播报模板（例如 `"{actor} 触发【{ruleLabel}】：5 或 6 点直接起飞"`），当 `#3/#10` 消费到携带非空 `ruleTag` 的 `GameEvent` 时，`#11` 直接按当前对局唯一触发记录（`seenRuleTriggers`）套用模板渲染 2.5–3.5s 轻提示条。
   - `conflictsWith?: readonly string[]`: 显式互斥规则表，任何规则自身不可列入自身的 `conflictsWith`。
   - `affectsMatchPacing: boolean`: 标示该规则是否显著改变平均对局时长，供 `#9` 建房面板提示“预计局时”。

4. **`GameEvent` 表现事件、`MatchHighlight` 与 `GameRegistry` 契约**
   - **`GameEvent` 标准载荷**：`{ kind: string, seqOffset: number, actorSeatId: SeatId | null, ruleTag?: string, baseDurationMs: number, isChainLink: boolean, payload: Record<string, JsonValue> }`。`seqOffset` 从 `0` 严格递增；单次 `applyAction` 事件总数上限受 `max_events_per_action = 32` 约束；`baseDurationMs >= 0`。
   - **`MatchHighlight` 战报高光快照**：`{ highlightId: string, category: string, seatId: SeatId, metricValue: number, metricUnit: string, summaryTemplate: string }`。游戏规则在结算时客观记录“被撞回次数”“连续飞跃格数”“末轮反超净胜格/资产”等可量化高光事实，供 `#3` 暂存于 `roomSessionLedger` 并最终由 VS `#13` 翻译为朋友局幽默称号，避免 `#1` 反向依赖 `#13`。
   - **`GameRegistry` 只读注册表**：提供 `register(module)`（发现重复 `gameId` 时即刻 fail-fast 报错，严禁静默覆盖）、`getModule(gameId)` 与 `listDescriptors(): readonly GameMetadata[]`。注册表保持完全无状态与懒注册友好性，为 `#6` 换盘与 `#14` 离线 `shared/registry` 复用提供唯一查询口。

5. **跨平台比特级确定性伪随机内核（Seeded `RngPort`）**
   - **单一算法锁定**：核心内核固定内置 **Mulberry32**（全 32 位无符号整型运算 `>>> 0` 与 `Math.imul`，零 64 位 BigInt 兼容负担且免疫不同 JS 引擎对浮点乘法的微小尾数偏差）。
   - **零依赖外部状态推进与可复现接口**：所有 `init`、`applyAction`、`pickBotAction` 若需随机数一律从入参 `rng: RngPort` 获取；提供 `nextUint32()`、`nextInt(minInclusive, maxInclusive)`（采用拒绝采样彻底消除低位或非 2 的幂跨度时的取模偏差）、`shuffle<T>(items)`（纯返回新数组的 Fisher-Yates 洗牌）以及 `getState()` / `fromState(state)` 状态快照/还原能力。
   - **种子规范化**：`0` 或负数种子经 `seed >>> 0` 映射为无符号 32 位整数；若结果为 `0`，按预定常量 `0x9E3779B9` 进行无副作用置换，保障在全零输入下依然拥有高熵离散步进表现。

### States and Transitions

`#1 GameModule` 所约束的任意单局规则状态机均统一遵循以下权威生命周期状态与跃迁边界（内部玩法子状态如飞行棋 `roll`/`move` 或大富翁竞拍则以 `phase` 字符串嵌入 `ACTIVE_TURN` 内部，由 `getTurnState()` 向外投射）：

| 当前状态 | 触发事件 / 调用 | 前置校验条件 | 下一状态 | 输出与错误语义 |
| ---- | ---- | ---- | ---- | ---- |
| `UNINITIALIZED` | `validateRules(rawConfig)` | 规则键存在、类型匹配且无 `conflictsWith` 冲突 | `CONFIG_VALID`（无状态输出） | `{ ok: true, rules }`；否则留滞配置校验失败列表 `RULE_UNKNOWN_KEY` / `RULE_INVALID_VALUE` / `RULE_CONFLICT` |
| `CONFIG_INVALID` | 修正配置并重试 `init()` | 所有配置通过 `validateRules` 且 `2 <= seats.length <= 4` | `ACTIVE_TURN` | `{ ok: true, state }` |
| `UNINITIALIZED` | `init(params, rng)` | 配置合法且席位数满足 `max(2, minPlayers) <= N <= min(4, maxPlayers)` 且席位 ID 唯一 | `ACTIVE_TURN` | 成功返回初始 `TState`（可即刻调用 `getTurnState` 与 `getViewForPlayer`）；非法返回 `INVALID_PLAYER_COUNT` / `RULE_CONFLICT` / `MALFORMED_PAYLOAD` |
| `ACTIVE_TURN` | `applyAction(state, seatId, action, rng)` | `seatId ∈ activeSeatIds`、`action.type` 符合当前 `phase`、动作匹配 `getLegalActions(state, seatId)` 且本手未触发终局条件 | `ACTIVE_TURN`（轮转下一 `activeSeatIds` / 下一 `phase`） | `{ ok: true, nextState, events[], animDurationMs }`；事件数上限 `32`，`rng` 前进 |
| `ACTIVE_TURN` | `applyAction(state, seatId, action, rng)` | 满足上述全部合法条件，且动作落盘后 `isGameOver(nextState) === true` | `TERMINAL` | `{ ok: true, nextState, events[], animDurationMs }`；`getResult(nextState)` 立即可读，`activeSeatIds` 变为 `[]` |
| `ACTIVE_TURN` | `applyAction(state, wrongSeat, ...)` | `!activeSeatIds.includes(wrongSeat)` 或 `action` 不符合 `phase` / 非法载荷 | `ACTIVE_TURN`（原状不变） | `{ ok: false, error: ActionError }`（`NOT_YOUR_TURN` / `INVALID_ACTOR` / `INVALID_PHASE` / `ILLEGAL_ACTION` / `MALFORMED_PAYLOAD`）；严禁修改原 `state` 或前进 `rng` |
| `TERMINAL` | 任意 `applyAction(...)` | `isGameOver(state) === true` | `TERMINAL`（终态锁定） | `{ ok: false, error: { code: 'MATCH_ALREADY_ENDED', ... } }`；复开局必须经由外层 `#3 rematch()` 重新调用 `init()` |

**规范化 `ActionErrorCode` 封闭错误枚举**：`INVALID_PLAYER_COUNT`、`RULE_CONFLICT`、`MALFORMED_PAYLOAD`、`NOT_YOUR_TURN`、`INVALID_ACTOR`、`INVALID_PHASE`、`ILLEGAL_ACTION`、`MATCH_ALREADY_ENDED`。

### Interactions with Other Systems

> **前置假定注记（Provisional Assumptions）**：由于目前阶段除 `#1` 外其余系统尚未编写各自 GDD（均标为 `Status: Not Started`），下表全部下游消费边界均先标记为 **`[Provisional]`**，待对应 `#3–#14` GDD 编写时逐一双向核验签名兼容。

| 交互系统（`systems-index.md`） | 交互方向 | 传入 `#1` 的数据（Input） | `#1` 暴露的数据与能力（Output / Contract） | 接口所有权（Owner） |
| ---- | ---- | ---- | ---- | ---- |
| **`#3` 权威房间核心与会话端口** `[Provisional]` | `#3 → #1` | 建房规则载荷、`2–4` 席位清单、客户端 `action`、服务端生成/保存的 `RngPort` | `validateRules`、`init`、`applyAction`（含 `animDurationMs` 供设置动画缓冲）、`getTurnState`（`clockMode` 选定单步或多人同时倒计时）、`getViewForPlayer`（逐席裁剪与剥离 `rngState`）、`isGameOver`/`getResult`（含 `highlights[]` 存入 `roomSessionLedger`） | `#1` 定义纯规则契约；`#3` 拥有会话封装、`stateSeq` 与房间生命周期 |
| **`#4` 中式经典飞行棋引擎（MVP）** `[Provisional]` | `#4` 实现 `#1` | 游戏内部状态流转与 15×15 棋盘走子逻辑 | 遵循并实现全套 `GameModule` 接口，提供极速经典 presets、`5/6起飞` / `三连6回老家` 等 `RuleDefinition[]`（含 `stampCategory`、`firstTriggerToastTemplate`）、带 `ruleTag` 的事件流及内部非恶意 `pickBotAction` | `#1` 拥有接口规范；`#4` 拥有自身规则实现 |
| **`#5` AI 补位与分级托管策略** `[Provisional]` | `#5 → #1` | 权威当前 `TState`、需要代走/补位的 `seatId` 及服务端传入 `RngPort` | `getTurnState`（识别可托管态与当前活跃席位）、`getLegalActions`、确定性且礼仪合规的 `pickBotAction(state, seatId, rng)`（确保返回动作经 `#3 onActionAttempt` 与真人动作一视同仁校验执行） | `#1` 拥有基础动作与建议接口；`#5` 拥有定时触发、`5A/5B` 切换与 `0.4–0.6s` 礼仪停顿节奏 |
| **`#6` 多游戏目录与原地换盘（Alpha-1）** `[Provisional]` | `#6 → #1` | 新游戏模块注册调用 `GameRegistry.register()` 与房主 `switchGame(gameId, rawRules)` | `GameRegistry.listDescriptors()`（提供游戏名称、人数上下限、默认预设 ID 与预计时长）、`validateRules` 与新局 `init` | `#1` 拥有基础注册表与描述器形状；`#6` 拥有房间内安全换盘状态跃迁 |
| **`#7` Alpha-1 轻量经典二游** `[Provisional]` | `#7` 实现 `#1` | 二游独立规则与可能触发的隐藏信息状态 | 同构实现 `GameModule`；若选暗牌类则靠 `meta.supportsHiddenInfo = true` 激活 `#3` 逐席调用 `getViewForPlayer()` 防泄密 | `#1` 拥有接口规范；`#7` 拥有自身规则实现 |
| **`#8` 《极速大富翁》引擎（Alpha-2）** `[Provisional]` | `#8` 实现 `#1` | 40 格资产流转、买地决策及 2 步拍卖响应阶段 | 利用 `getTurnState().clockMode = 'simultaneous_response'` 与多阶段 `phase` 无侵入跑通大富翁交易与破产结算；提供 `RuleDefinition[]` 开关收容无尽模式 | `#1` 拥有多阶段契约支持；`#8` 拥有自身经济规则实现 |
| **`#9` 不可变桌面壳层与触控框架** `[Provisional]` | `#9 → #1` | 当前只读 `TView`、当前房间规则预设配置 | 消费 `GameMetadata` 标题与时长提示、消费 `getTurnState()` 判定本人回合脉冲与禁用态、并在 `GameViewAdapterLoader` 按 `gameId` 加载 `#10` 时提供统一只读类型约束 | `#1` 拥有纯只读元数据；`#9` 拥有桌面壳槽位与生命周期调度 |
| **`#10` 可插拔游戏棋盘视图适配器** `[Provisional]` | `#10 → #1` | 玩家选子/点选棋盘的交互意图、当前 `TView` 与瞬态 `GameEvent[]` | 通过直调纯本地 `getLegalActions(viewAsState, mySeatId)` 零延迟呈现可点高亮与 1 点预览（仅依赖 `#1/#4/#7/#8` 纯客户端镜像能力，不改写服务端权威状态）；消费 `GameEvent.kind` / `baseDurationMs` 对齐动画节奏 | `#1` 拥有事件结构与时长预算算法；`#10` 拥有 Canvas 绘制与触控映射 |
| **`#11` 村规透明展示与轻社交浮层** `[Provisional]` | `#11 → #1` | 局内已配置规则、每次快照随附的 `GameEvent[]` | `getRuleDeviations()` 输出的排序清单、`RuleDefinition.shortLabel`、`description`、`stampCategory`（映射朱砂 `#B83227` / 靛青 `#2D4E7E`）与 `firstTriggerToastTemplate`（依据 `GameEvent.ruleTag` 触发首次 2.5–3.5s 轻提示） | `#1` 拥有纯元数据形状；`#11` 拥有印章排版与 `seenRuleTriggers` 去重逻辑 |
| **`#13` 连局战报与趣味称号系统（VS）** `[Provisional]` | `#13 → #1` | 局末结算 `MatchResult`（经由 `#3` 转交） | 读取 `MatchResult.winnerSeatIds`、`rankings` 与结构化 `highlights: MatchHighlight[]`（指标值与模板）生成朋友局高光名场面与趣味印章称号 | `#1` 拥有高光客观事实快照；`#13` 拥有称号文案修饰与视觉牌面呈现 |
| **`#14` 离线同屏传玩适配器（Full Vision）** `[Provisional]` | `#14 → #1` | 同机玩家本地点选规则、本地操作与接棒确认 | 借助零 DOM 纯 TS 特性，直接在浏览器内托管运行 `GameModule.init / applyAction / getViewForPlayer / pickBotAction` 与本地 `RngPort`，零修改复现完整桌游流程（仅通过 `shared/registry` 读取描述清单，绝不引入服务端代码） | `#1` 拥有纯规则契约与本地可运行 RNG；`#14` 拥有 `LocalClientSession` 隐私遮罩与传玩切换 |

## Formulas

> 本文全部数值与公式均经过 `lens-systems-designer.md` 的最小值 / 最大值 / `0` 值与越界边界推演校验；所有标注 `data file` 的外部配置常量将同步入库 `design/registry/entities.yaml` 并在 **Tuning Knobs** 节逐一定义安全上下界。

### Formula 1: `calc_anim_duration_ms`（动作表现动画与服务端缓冲时长）

该分段公式确保单步动作严格落入 **Pillar 2** 的 `≤ 800ms` 干脆区间，同时在发生连续触发事件（如“掷骰 → 连跳 → 虚线飞跃 → 撞飞”）时自动对后续事件施加线性加速压缩并锁死在 `≤ 1500ms` 硬上限内，作为 `#3 Room Core` 设置状态播映锁窗与 `#10` 表现时间轴对齐的唯一权威基准。

The `calc_anim_duration_ms` formula is defined as:

`calc_anim_duration_ms = 0` *(when `animated_event_count == 0`)*  
`calc_anim_duration_ms = min(max_single_step_ms, raw_sum_ms)` *(when `animated_event_count == 1`)*  
`calc_anim_duration_ms = min(max_chain_ms, round(first_event_ms + (raw_sum_ms - first_event_ms) * chain_compression_ratio))` *(when `animated_event_count >= 2`)*

*(其中取前 `min(events.length, max_events_per_action)` 条已规整事件参与统计，单条耗时经 `max(0, baseDurationMs)` 截断非负)*

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `animated_event_count` | int | `0–32` | calculated | 本次动作截断 `max_events_per_action` 后 `baseDurationMs > 0` 的事件条数 |
| `first_event_ms` | int | `0–1500` | calculated | 首个非零耗时动画事件的基础时长（毫秒）；`animated_event_count == 0` 时为 `0` |
| `raw_sum_ms` | int | `0–48000` | calculated | 被计入统计的动画事件规整后 `baseDurationMs` 累加总和（毫秒） |
| `max_single_step_ms` | int | `200–1200` (default `800`) | data file | 单步普通动作硬上限（毫秒），锚定 P2 `≤ 0.8s` 要求 |
| `max_chain_ms` | int | `600–2500` (default `1500`) | data file | 链式复合动画硬上限（毫秒），锚定 P2 `≤ 1.5s` 要求；硬性约束 `max_single_step_ms <= max_chain_ms` |
| `chain_compression_ratio` | float | `0.40–1.00` (default `0.72`) | data file | 多步链式后续事件的时长压缩系数（选中 `0.72` 使 3–4 步飞行棋复合链稳定落在 `1.1–1.4s`、贴合原 `art-bible.md` §3.3 `1.4–1.5s` 实测区间） |
| `max_events_per_action` | int | `4–64` (default `32`) | data file | 单次 `applyAction` 允许计入并透传的 `GameEvent` 最大数量防护阈值 |

**Output Range:** `0` to `1500` ms under normal play (`0` when all events have zero duration; clamped at `800ms` for single-step events and `1500ms` for chained events).  
**Example:** 飞行棋单步动作触发 3 段连环事件：`hop`（`450ms`）+ `shortcut_fly`（`650ms`）+ `knockback`（`520ms`）。则 `animated_event_count = 3`，`first_event_ms = 450`，`raw_sum_ms = 450 + 650 + 520 = 1620`。代入链式压缩段：`round(450 + (1620 - 450) * 0.72) = round(450 + 842.4) = 1292`，取 `min(1500, 1292) = 1292 ms`（完整保留节奏且严守 `≤ 1500ms` 上限）。

**Boundary Checks（0 / Min / Max / 退化输入检验）:**
- **`animated_event_count = 0`（全零瞬态动作）**：直接归零返回 `0 ms`，不触发任何额外服务端阻塞延迟（如瞬间弃权、无动画阶段推进）。
- **单步超标（`animated_event_count = 1`, `first_event_ms = 1200`）**：受 `min(800, 1200)` 截断为 `800 ms`，守住单步节奏契约。
- **极端长链（`events.length = 50`, 每条 `baseDurationMs = 500`）**：先按 `max_events_per_action = 32` 截取统计并由 `min(1500, ...)` 硬收口为 `1500 ms`（同时 QA 测试套件将捕获事件条数溢出预警）。
- **负值或 `NaN` 退化输入（`baseDurationMs = -200` 或 `NaN`）**：单条输入预清洗为 `0`（若为非有限数字则在契约校验阶段拒收为非合规事件，绝不传播负值/NaN 给 `#3` `setTimeout`）。
- **跨旋钮错配退化（假设人工把 `max_single_step_ms` 调至 `1600` 而 `max_chain_ms = 1200`）**：会出现“1 个事件等 1600ms，2 个事件反而只等 1200ms”的倒挂违背；已在 Tuning Knobs 与校验规则中强制不变式 **`max_single_step_ms <= max_chain_ms`**。

---

### Formula 2: `rng_next_int`（跨引擎同构无偏差随机整数映射）

基于 **Mulberry32** 32 位全整型步进流产出无符号整数 `u` 后，通过 Lemire/拒绝采样消除非 2 的幂区间取模偏差，保证 6 面木骰等概率分布及 Node V8 与 iOS WebKit JavaScriptCore 完全逐位同构。

The `rng_next_int` formula is defined as:

`s_next = (rng_state + 0x6D2B79F5) mod 2^32`  
`u = mulberry32_mix(s_next)` *(pure 32-bit `Math.imul` & unsigned shift `>>> 0`)*  
`limit = floor(4294967296 / span) * span`, where `span = max_inclusive - min_inclusive + 1`  
`rng_next_int = min_inclusive + (u mod span)` *(accept first draw satisfying `u < limit`; redraw if `u >= limit`)*

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `rng_state` | int | `1–4294967295` (`uint32` nonzero, `seed=0` normalized to `0x9E3779B9`) | calculated | 当前 Mulberry32 内部 32 位无符号状态字 |
| `min_inclusive` | int | `-2147483648–2147483647` | calculated | 随机整数闭区间下限 |
| `max_inclusive` | int | `-2147483648–2147483647` (`max >= min`) | calculated | 随机整数闭区间上限 |
| `span` | int | `1–4294967296` | calculated | 区间跨度 `max_inclusive - min_inclusive + 1`（`32` 位有界） |
| `limit` | int | `1–4294967296` | calculated | 无偏差最大整倍截断上界 `floor(2^32 / span) * span` |

**Output Range:** `min_inclusive` to `max_inclusive` (strictly uniform over `span` integers under valid inputs).  
**Example:** 标准 6 面骰子投掷：`min_inclusive = 1`，`max_inclusive = 6`，则 `span = 6`，`floor(4294967296 / 6) = 715827882`，`limit = 715827882 * 6 = 4294967292`。若本次 Mulberry32 输出 `u = 2863311533`（满足 `< 4294967292`），`2863311533 mod 6 = 5`，因此返回 `1 + 5 = 6` 点（拒绝重抽概率仅 `4 / 2^32 ≈ 9.31e-10`）。

**Boundary Checks（0 / Min / Max / 退化输入检验）:**
- **`span = 1`（`min_inclusive == max_inclusive`，单值退化范围）**：`limit = 4294967296`，任意 `uint32` 必满足 `u < 4294967296` 且 `u mod 1 = 0`，单次推进即可直接返回 `min_inclusive`，无死循环风险。
- **`seed = 0`（全零种子输入）**：进入规范化时固定映射至 Weyl 黄金分割常量 `0x9E3779B9`，消除全零种子初始位稀疏担忧。
- **`span <= 0`（`max_inclusive < min_inclusive` 倒置参数）**：**高危退化（会导致除零或无限死循环）**——在进入 `floor(2^32 / span)` 前强制显式拦截抛出契约边界异常，绝不执行除零取模。
- **`span = 2^32`（覆盖全无符号 32 位最大跨度）**：需以 `4294967296`（JS 安全整数 `< Number.MAX_SAFE_INTEGER`）或直接透传 `u` 处理，避免 `| 0` 有符号截断将 `2^32` 误折为 `0`。

---

### Formula 3: `rule_deviation_count`（偏离默认村规统计与桌角徽标截断计数）

统计实际生效规则相对于游戏基准预设的偏离项总数，并按展示上限切分“桌面外显角标槽位”与“溢出 `+N` 徽标计数”，在保障 **Pillar 3** 全透明的同时守住 **Pillar 2** 的 `375×540px dvh` 桌角空间预算。

The `rule_deviation_count` formula is defined as:

`rule_deviation_count = count({ r in ruleDefinitions | effective[r.id] != baseline[r.id] })`  
`visible_badge_count = min(max_visible_rule_badges, rule_deviation_count)`  
`overflow_badge_count = max(0, rule_deviation_count - max_visible_rule_badges)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `rule_deviation_count` | int | `0–16` | calculated | 与 `baselinePresetId`（默认 `meta.defaultPresetId`）相比发生变更的村规开关总条数 |
| `max_visible_rule_badges` | int | `1–6` (default `4`) | data file | 桌角同时允许直接展开文字短标的最大村规角标数（按 `vermilion_mod` 优先于 `indigo_preset` 截断） |
| `visible_badge_count` | int | `0–6` | calculated | 实际渲染为可见双色文字角标的村规条数 |
| `overflow_badge_count` | int | `0–16` | calculated | 超出桌面空间预算、合并计入 `+N` 折叠提示入口的剩余偏离规则数量 |

**Output Range:** `rule_deviation_count` `0` to `|ruleDefinitions|`; `visible_badge_count` `0` to `max_visible_rule_badges`; `overflow_badge_count` `0` to `max(0, |ruleDefinitions| - 1)`.  
**Example:** 某局飞行棋在极速默认预设基础上开启 5 项自定义改写（1 项 `indigo_preset`、4 项 `vermilion_mod`）。则 `rule_deviation_count = 5`；在 `max_visible_rule_badges = 4` 下，排序优先保留全部 4 枚朱砂强魔改章为 `visible_badge_count = min(4, 5) = 4`，剩余 1 项靛青章算得 `overflow_badge_count = max(0, 5 - 4) = 1`（由 `#11` 渲染 `+1` 折叠按钮并可在规则抽屉看全）。

**Boundary Checks（0 / Min / Max / 退化输入检验）:**
- **`rule_deviation_count = 0`（完全遵循默认极速预设）**：`visible_badge_count = 0`、`overflow_badge_count = 0`，桌角零干扰保持纸木桌面清爽（P1/P2）。
- **`max_visible_rule_badges = 0`（假设配置误设为 0）**：会导致任意 1 项偏离规则立刻全部隐藏进 `+1`，违背 P3“常驻可见角标”红线；故旋钮安全区间强制封底 **`>= 1`**（`2–4` 为手机竖屏推荐范围）。
- **极限多村规配置（如未来高扩展游戏打开 `12` 项自定义）**：`visible_badge_count` 稳锁为 `4`，`overflow_badge_count = 8`，严防桌角文字溢出遮挡棋盘区。

---

### 正反馈失控校验与阻尼护栏（Feedback Loops & Damping Bounds）

`#1 GameModule` 不掌管局内金币或升级成长，但存在两条工程与体验“滚雪球回路”必须在契约公式层主动设防：

1. **事件链式触发雪崩（Event Chain Cascade Loop）**：某游戏规则触发连锁效果（如 A 事件引发 B 事件，B 再引发 C）可能导致单手生成海量动画事件，把 10 秒一手的桌面变成 10 秒卡顿动画并阻塞服务端回合锁。
   - **阻尼机制**：由 `chain_compression_ratio = 0.72` 压缩尾长、由 `max_chain_ms = 1500` 强行对总表现耗时封顶，并由 `max_events_per_action = 32` 从契约结构层阻断单回合过长连环派生。
2. **自博弈无限空转死锁回路（Fuzz Infinite Non-Terminal Loop）**：若干边界村规组合（如反复连击退回或大富翁无终结正现金流循环）可能导致确定性局内状态永不收敛。
   - **阻尼机制**：通过全局测试/仿真上限旋钮 `fuzz_max_turns_per_match` 作为强制收口门限，任何对局在 `pickBotAction` 纯随机/启发式驱动下若步数触及该阈值仍未进入 `TERMINAL`，Vitest 千局 Fuzz 测试即刻判定为规则死循环失败。

**Fuzz Damping Variable:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `fuzz_max_turns_per_match` | int | `100–2000` (default `500`) | data file | Vitest 1,000 局确定性自博弈验证单局最大允许回合步数上限（4 人极速经典正常约 50–120 回合；`500` 为 ≥4 倍安全余量防死循环红线） |

## Edge Cases

*(已结合 Section C 状态机契约与 Section D 边界分析补全全部 13 类极端与交叉边界情形；每条均给出唯一可测裁决结果：)*

- **If `validateRules(rawConfig)` receives unknown keys, type mismatches, non-finite numbers, or out-of-range enum/int values**: reject the config with `{ ok: false, errors: [{ ruleId, code: 'RULE_UNKNOWN_KEY' | 'RULE_INVALID_VALUE', message }] }` and never fall back silently to defaults inside `validateRules`. Protects explicit room rule transparency (P3) and rejects stale client cached schemas or malformed future rule-link payloads cleanly.
- **If `validateRules(rawConfig)` encounters two mutually conflicting enabled rules declared via `conflictsWith`**: reject with `{ ok: false, errors: [{ ruleId, code: 'RULE_CONFLICT', conflictsWith }] }` and treat the conflict check symmetrically (if A conflicts with B, checking B must detect A even if only one side listed it). Prevents unreachable win states or ambiguous turn resolution.
- **If `init(params, rng)` is called with `playerSeats.length < 2` (`0` or `1`), `playerSeats.length > 4` (`5+`), outside `[meta.minPlayers, meta.maxPlayers]`, or containing duplicate `seatId`s**: return `{ ok: false, error: { code: 'INVALID_PLAYER_COUNT' } }` (never throw and never auto-pad missing AI seats inside `#1`). Seat synthesis/AI fill belongs exclusively to `#3/#5`; `#1` strictly enforces the platform 2–4 simultaneous-play floor/ceiling (P4).
- **If any active seat is returned by `getTurnState(state).activeSeatIds` while `!isGameOver(state)` and all active seats simultaneously yield `getLegalActions(state, seatId).length === 0`**: contract violation (non-terminal softlock) — module design is invalid and must either expose a legal pass/skip action or auto-advance/terminate cleanly inside the preceding `applyAction` step. Eliminates endless waiting rooms in live multiplayer and fuzz runs.
- **If `applyAction(state, seatId, action, rng)` is called by a seat outside `activeSeatIds`, with an unrecognized `seatId`, in the wrong sub-`phase`, or with an action absent from `getLegalActions`**: return `{ ok: false, error: { code: 'NOT_YOUR_TURN' | 'INVALID_ACTOR' | 'INVALID_PHASE' | 'ILLEGAL_ACTION' | 'MALFORMED_PAYLOAD' } }` with zero state change and zero `rng` step advancement. Prevents stale packets during simultaneous or high-latency clicks from corrupting state or desyncing dice streams.
- **If `applyAction(state, ...)` is called when `isGameOver(state) === true` (`TERMINAL` state)**: immediately reject with `{ ok: false, error: { code: 'MATCH_ALREADY_ENDED' } }` without modifying state or stepping `rng`; rematches must start a fresh state via `#3 rematch()` calling `init()`. Eliminates post-victory double-scoring and ghost actions during the Rematch transition window.
- **If `getViewForPlayer(state, viewerSeatId)` is called with `viewerSeatId === null` (spectator/public preview) or any `viewerSeatId` on either open-info (`supportsHiddenInfo: false`) or hidden-info (`supportsHiddenInfo: true`) games**: unconditionally strip `rngState` and any internal-only audit fields for every game; additionally redact all opponent private hands/secrets when `supportsHiddenInfo === true` (and all seats' private info when `viewerSeatId === null`). Guarantees no network snapshot leaks future dice rolls or hidden Alpha-1/2 cards.
- **If `applyAction` produces events with negative or `NaN` `baseDurationMs`, or more than `max_events_per_action` (`32`) events**: reject non-finite numbers (`NaN` / `Infinity`) in contract assertions, clamp negative durations with `max(0, baseDurationMs)`, slice event summation/transmission at `32` items before computing `calc_anim_duration_ms`, and clamp the final budget at `max_chain_ms` (`1500ms`). Prevents malformed event bursts from hanging `#3`'s room turn timer or exceeding P2 motion limits.
- **If `RngPort` is seeded with `0`, a negative number, or a float (e.g. `0`, `-42`, `3.7`), or `rng_next_int` is called with `max_inclusive < min_inclusive`**: normalize any finite integer via `seed >>> 0` and remap `0` → `0x9E3779B9` at PRNG creation, and fail-fast with a boundary error before modulo division whenever `span <= 0` (also guard `nextInt` bounds as integers). Eliminates silent division-by-zero traps and guarantees bit-identical V8/WebKit replay.
- **If a game implementation mutates `state`, `params.rules`, or `action` in place or stores `Map`/`Set`/`Date`/functions/`undefined`-dependent structures inside `TState` or `TView`**: fail contract verification tests (`deepFreeze` runtime trap + `JSON.parse(JSON.stringify(x))` structural equality check). Ensures safe snapshot diffing, `#3` server memory ledger stability, and client local-preview cloning.
- **If `getTurnState(state)` is in `clockMode: 'simultaneous_response'` (e.g., Alpha-2 multi-seat buy/bid/trade prompt) and two or more active seats send actions concurrently**: `applyAction` processes them sequentially in deterministic arrival/queue order given by `#3`; once the first responding seat settles or invalidates an outstanding offer, `nextState.activeSeatIds` shrinks immediately so the second arrival deterministically receives `NOT_YOUR_TURN` or `INVALID_PHASE` rather than mutating resolved ownership.
- **If `isGameOver(state)` becomes `true` via simultaneous win conditions or simultaneous multi-player bankruptcy (e.g. future Alpha-1/2 tie scenario)**: `getResult(state)` computes deterministic rankings using an explicit secondary tiebreak sequence defined by each game module (falling back cleanly to joint `winnerSeatIds` arrays when tied identically) in seat index order, emitting deterministic `MatchHighlight[]`. Guarantees `rankings` order never depends on JS engine `Array.sort` stability quirks or object key insertion order.
- **If `pickBotAction(state, seatId, rng)` is invoked when `getLegalActions(state, seatId)` has `1` option, `> 1` options, or `0` options**: when `length === 1`, return that single legal action deterministically without breaking etiquette; when `length > 1`, select a scored legal member using only `rng` for tie-breaking; when `length === 0` (mis-routed inactive seat or terminal state), throw/return explicit contract guard failure because `#5` must consult `getTurnState().activeSeatIds` before calling `pickBotAction`.

> *(Note on `cross-system` edge coverage: `#3` 并发双提交幂等缓存 `actionId` 归属 `#3` 本身、`#11` 单局重复触发去重 `seenRuleTriggers` 归属 `#11`，`#1` 只通过 `applyAction` 纯函数确定性与非空 `ruleTag` 支撑这两项下游边界。)*

## Dependencies

### Upstream Dependencies (What `#1` Depends On)
- **None** — 本系统处于 5 层有向无环图最底层的 **Foundation Layer**，不依赖任何业务规则、网络模块、持久化仓库、DOM 或浏览器运行时 API。

### Downstream Dependents (Who Depends On `#1` — `11` Systems, All Provisional Pending Their GDDs)

| System (# & Name) | Layer / Priority | Dependency Nature | Interface & Data Contract | Status |
|---|---|---|---|---|
| **`#3` 权威房间核心、会话端口与实时同步** | Core / MVP | **Hard** | `#3` 持有选定 `GameModule` 与 `RngPort` 实例，调用 `validateRules`、`init`、`applyAction`（消费 `animDurationMs` 设置播映缓冲）、`getTurnState`、`getViewForPlayer`、`isGameOver`/`getResult` | Provisional |
| **`#4` 中式经典飞行棋规则与村规引擎** | Core / MVP | **Hard** | 首发实现全套 `GameModule` 纯函数契约、极速预设与 1–2 MVP 高频村规 `RuleDefinition[]`（含 `stampCategory`、`firstTriggerToastTemplate` 及 `pickBotAction` 礼仪） | Provisional |
| **`#5` AI 补位与分级托管策略控制器** | Feature / MVP | **Hard** | 读取 `getTurnState().canTakeover / activeSeatIds`、`getLegalActions`，并经由 `#3` 请求 `pickBotAction(state, seatId, rng)` 生成合法代走动作 | Provisional |
| **`#6` 多游戏目录与原地换盘编排** | Feature / Alpha | **Hard** | 向 `GameRegistry` 查询可用多游元信息 `GameMetadata[]`，并在 `switchGame` 时经 `validateRules` 与 `init` 重置房间状态机 | Provisional |
| **`#7` Alpha-1 轻量经典二游规则引擎** | Feature / Alpha | **Hard** | 同构实现 `GameModule`；若选用暗牌制则置 `meta.supportsHiddenInfo = true` 并落实 `getViewForPlayer` 私密视野裁切 | Provisional |
| **`#8` 《极速大富翁》规则与地产经济引擎** | Feature / Alpha | **Hard** | 同构实现 `GameModule`；借助 `getTurnState().clockMode = 'simultaneous_response'` 承接 2 步买地/竞拍响应窗口 | Provisional |
| **`#9` 不可变桌面壳层与跨端触控框架** | Presentation / MVP | **Hard** | 只读消费 `GameMetadata`、`TurnState`（判断轮到我/活跃席位）与规范化 `ActionErrorCode` 映射友好提示 | Provisional |
| **`#10` 可插拔游戏棋盘视图适配器** | Presentation / MVP | **Hard** | 仅引用 `getLegalActions` 纯客户端预览接口（配合 `#4/#7/#8` 本地镜像）与 `GameEvent[]`（含 `baseDurationMs`/`isChainLink`）编排 2.5D 动效 | Provisional |
| **`#11` 村规透明展示与轻社交表情浮层** | Presentation / MVP | **Hard** | 消费 `getRuleDeviations()`、`RuleDefinition` 元数据（`stampCategory` / `shortLabel` / `firstTriggerToastTemplate`）与 `GameEvent.ruleTag` 触发首次 2.5–3.5s Toast | Provisional |
| **`#13` 连局战报展示与趣味称号系统** | Polish / VS | **Soft** | 经由 `#3` 转交消费终局 `MatchResult.winnerSeatIds / rankings / highlights: MatchHighlight[]`，为熟人生成幽默战报标签 | Provisional |
| **`#14` 离线同屏传玩适配器与全愿景增强** | Polish / Full Vision | **Hard** | 在本地浏览器用 `LocalClientSession` 托管运行 `GameModule` + `RngPort` 并仅依赖 `shared/registry` 查询游戏清单（严禁混入 `server/` 代码） | Provisional |

> **双向一致性维护注记**：待 `#3–#14` 系统逐篇启动 `/design-system` 时，每份下游 GDD 的 `## Dependencies` 必须反向声明对 **`#1 GameModule 规则契约、规则元数据与确定性随机内核`** 的依赖并校验此处所列接口完全闭合，无孤立单向引用。

## Tuning Knobs

> 按 `lens-systems-designer.md` 规定，此处仅暴露 Section D 公式变量表中标记为 **`data file`** 的 6 个可调设计常量（外部数据配置驱动，严禁散落硬编码于业务逻辑分支）；所有标注为 `constant` 的数学常数（如 Weyl `0x9E3779B9`、`2^32`）与全平台人数字段边界（`platform_min_players = 2`、`platform_max_players = 4`，由 P4 原生定义锁定）不列入数值调优旋钮。

| Knob | Default Value | Safe Range | What Breaks If Too High | What Breaks If Too Low | Interacting Knobs |
|---|---|---|---|---|---|
| **`max_single_step_ms`** | `800` ms | `450–900` ms *(绝对硬件上下界 `200–1200` ms)* | `> 900ms` 明显违背 **Pillar 2** 单步明快手感，连掷与日常走子开始显得拖沓；若超过 `max_chain_ms` 则会倒挂单/多步时长预期 | `< 450ms` 导致一次普通起飞/走子还没播完回弹落点动画就被 `#3` 提前解除回合锁并进入下一家掷骰 | **`max_chain_ms`**（必须严格保持 `max_single_step_ms <= max_chain_ms`） |
| **`max_chain_ms`** | `1500` ms | `1100–1600` ms *(绝对硬件上下界 `600–2500` ms)* | `> 1600ms` 突破 **Pillar 2** `≤ 1.5s` 链式硬预算，多连跳瞬间会让全桌被迫干等接近 2 秒以上 | `< 1100ms` 把 3 段“跳格 + 虚线飞跃 + 撞飞回巢”强行挤压进不足 1 秒，抹平 `65ms` 顿帧辨识度并使 `chain_compression_ratio` 的梯度微调失去空间 | **`max_single_step_ms`**（`>= max_single_step_ms`）、**`chain_compression_ratio`**、**`max_events_per_action`** |
| **`chain_compression_ratio`** | `0.72` | `0.55–0.85` *(绝对合法区间 `0.40–1.00`)* | 趋近 `1.00` 时多步链毫无加速节奏感，仅 2–3 步复合动作就会顶穿 `max_chain_ms` 封顶墙导致后续播映被硬截断 | 低于 `0.55` 时后半段连跳与撞飞飞得像瞬移鬼影，丧失“一跳再跳”的实体棋子连续触感 | **`max_chain_ms`**（高 `chain_compression_ratio` 配合过低 `max_chain_ms` 会令压缩系数形同虚设） |
| **`max_visible_rule_badges`** | `4` badges | `2–4` badges *(绝对允许范围 `1–6`)* | `> 4` 枚会在 `375×540px dvh` 极紧手机竖屏顶栏挤占或遮挡正方形棋盘有效视野 | `<= 1` 枚会逼迫熟人常用的第 2 条村规立刻藏进 `+1` 溢出按钮，削弱 **Pillar 3** 常驻清晰透明度 | *None in `#1`*（实际空间布局由 `#9` 顶栏高度与 `#11` 角标排版承载） |
| **`max_events_per_action`** | `32` events | `16–48` events *(绝对允许范围 `4–64`)* | `> 48` 容易放任下游规则缺陷产生臃肿网络差分与客户端渲染掉帧风险，却不会带来实质体验增量 | `< 16` 可能在大富翁连续触发收租 + 卡牌 + 连带破产或飞行棋极端叠子撞飞爆发时误截断合法提示事件 | **`max_chain_ms`**（单纯调高事件数上限而不调 `max_chain_ms`，总时长仍由 `max_chain_ms` 硬封顶） |
| **`fuzz_max_turns_per_match`** | `500` turns | `300–1000` turns *(绝对允许范围 `100–2000`)* | `> 1000` 会成倍拖慢 1,000 局 CI 自博弈门禁且掩盖部分规则“准死循环”低效振荡 | `< 300` 会将传统 4 机慢局或高对抗互撞局的合理长局误杀报错（`#4`/`#8` 平均局内操作约 60–180 步） | *Provisional downstream pace rules in `#4/#7/#8`*（归属各具体游戏规则预设，不在此处重复定义） |

## Visual/Audio Requirements

**N/A（本系统属 `Category: Core` / Foundation 契约层，无任何直接图形资产、VFX 粒子或音频节点）**。  
本契约仅向上下游提供**纯语义元数据结构传递**：
- 将 `RuleDefinition.stampCategory`（`indigo_preset` vs `vermilion_mod`）声明交予 `#11`，使其按 [art-bible.md](file:///d:/Code/在线桌游集合/design/art/art-bible.md) 映射为靛青 `#2D4E7E`（对盘面对比度 `7.85:1`）或朱砂 `#B83227`（对盘面对比度 `5.58:1`）双色文字徽标；本文件绝不直接写死视觉 hex 或图片路径。
- 将 `GameEvent` 序列表（`kind`、`baseDurationMs`、`isChainLink`）与经 `calcAnimDurationMs` 算出的总缓冲时长交予 `#9 / #10 / #12` 调度动画播映及音频节奏对齐。

## Game Feel

**N/A（本系统属 `Category: Core`，不直接处理触控输入或屏幕动画渲染）**。  
本契约从底层时间算术上兜底 **Pillar 2「指尖上的克制实体触感」**：通过 `calc_anim_duration_ms` 强制把单步交互锁定在 **`≤ 800ms`（`max_single_step_ms`）**、连跳/飞跃/撞飞链式复合交互锁定在 **`≤ 1500ms`（`max_chain_ms`）**，确保 `#9/#10` 无需在前端另行裁减服务端延迟窗即可达成明快不拖沓的桌面手感；同时靠 `getLegalActions` 纯客户端零网络可调用，保证“1 点显示精确落点虚线、2 点确认走子”零延迟响应。

## UI Requirements

**N/A（本系统严格零 DOM 依赖，不含任何界面组件或页面布局）**。  
本契约通过标准化数据字段向下游 UI 模块供电：
- 向 `#11` 供应 `RuleDefinition.shortLabel`（≤ 6 汉字保证 `375×540px dvh` 桌角不折行溢出）、`description` 与 `firstTriggerToastTemplate`，并经 `rule_deviation_count` 与 `max_visible_rule_badges` (`4`) 预排序好角标与 `+N` 溢出计数。
- 向 `#9 / #13` 供应只读 `GameMetadata`、`TurnState`、`ActionErrorCode` 以及客观事实快照 `MatchResult.highlights: MatchHighlight[]`，让一切界面文案与排版完全留在表现层。

## Cross-References

| Referenced Document | Shared Fact / Constraint Cited | Direction & Consistency Note |
|---|---|---|
| [game-concept.md](file:///d:/Code/在线桌游集合/design/gdd/game-concept.md) | 四大支柱 P1–P4；原生 2–4 人同时参与红线；`TD-FEASIBILITY` `ADR-001` 约束（`isGameOver/getResult`, `validateRules`, `pickBotAction(..., rng)`, `getViewForPlayer`, `animDurationMs`）；单步 `≤ 0.8s` / 链式 `≤ 1.5s`；Zero-DOM 共享逻辑 | 上游概念基石：全部契约字段与性能硬指标直接兑现其要求 |
| [art-bible.md](file:///d:/Code/在线桌游集合/design/art/art-bible.md) | 原则 3「不可变桌台壳层 + 可插拔棋纸及棋件」；村规双色印章语义分类（朱砂强魔改 `#B83227` / 靛青预设 `#2D4E7E`）；`375×540px dvh` 桌角角标预算；单步 `≤ 0.8s` / 链式 `≤ 1.5s` | 设计美学约束：仅消费语义分类与预算数值，严守 Zero-Visual 边界 |
| [systems-index.md](file:///d:/Code/在线桌游集合/design/gdd/systems-index.md) | `#1` 在 14 系统 / 5 层 DAG 中位于 Foundation 无上游依赖、拥有 11 个下游依赖；`active.md` 交接护栏 #1（`stampCategory` / `firstTriggerToastTemplate` / `getTurnState` / `calcAnimDurationMs` / `MatchHighlight[]`） | 架构索引锚点：逐条对照闭合 11 项下游输出契约 |
| [VERSION.md](file:///d:/Code/在线桌游集合/docs/engine-reference/web/VERSION.md) | 钉定 `Vite 8.3.4 / TypeScript 7.0.2 / Vitest 5.0.5 / Node v22.20.0`（`Knowledge Gap: HIGH`）；现行根 `tsconfig.json` 含 `DOM`，要求架构阶段拆出无 `DOM` 编译目标 | 工具链约束：明确记录 `core` 模块参考文档缺失并在技术Setup 落地编译隔离 |
| Provisional `#3–#14` *(未创建 GDD)* | `#3` `RoomSnapshot`/`ClientSession`/`roomSessionLedger`；`#4` 飞行棋实现；`#5` 托管策略；`#6` 换盘 `GameRegistry`；`#7/#8` 二游与大富翁实现；`#9/#10/#11` 壳层与视图/村规浮层；`#13` 连局战报；`#14` 本地传玩 | 待下游各自撰写 `/design-system` 时在对应 GDD `Cross-References` 与 `Dependencies` 完成双向闭环签收 |

## Acceptance Criteria

> 按 `lens-qa-lead.md` 规范逐条覆盖 Section C（Core Rules 1–5）、Section D（Formulas 1–3 及典型/边界/退化值）、Section E 关键边界以及对 `#3/#4/#5/#11` 的跨系统契约检验，并逐条标注所需自动化测试类型（本底层纯契约系统无需人工画面截屏或主观手感试玩用例）。

### 1. 纯净边界、编译隔离与体量预算（Core Rule 1）
- **AC-1 (`Automated — TypeCheck (tsc)`)**: **GIVEN** a dedicated Zero-DOM TypeScript configuration for `shared/` (`"lib": ["ES2023"]`, no `"DOM"`), **WHEN** running `tsc --noEmit` across `shared/core/` and `shared/games/` with zero runtime npm dependencies imported, **THEN** compilation succeeds with 0 errors and statically fails if any file references `window`, `document`, `localStorage`, `navigator`, or `fetch`.
- **AC-2 (`Automated — Build Budget (Vite)`)**: **GIVEN** production bundle compilation of `shared/core/` (contract helpers, `mulberry32`, `calcAnimDurationMs`, `validateRules`, `GameRegistry`), **WHEN** measuring the emitted gzip chunk contribution, **THEN** its gzipped footprint is `<= 4096` bytes (`<= 4KB gzip`).
- **AC-3 (`Automated — Unit (Vitest)`)**: **GIVEN** valid `TState`, `TRules`, and `TAction` objects recursively wrapped in `Object.freeze()` before calling `init`, `applyAction`, `validateRules`, `getViewForPlayer`, and `pickBotAction`, **WHEN** executing each contract function under Node strict mode, **THEN** 0 mutation `TypeError`s are thrown and `JSON.parse(JSON.stringify(nextState))` deep-equals `nextState`.

### 2. 状态机生命周期、动作校验与零活锁（Core Rule 2 & States）
- **AC-4 (`Automated — Unit (Vitest)`)**: **GIVEN** a compliant `GameModule` registered with `minPlayers: 2, maxPlayers: 4`, **WHEN** `init(params, rng)` is called with `1` seat, `5` seats, or duplicate `seatId`s, **THEN** `init` returns `{ ok: false, error: { code: 'INVALID_PLAYER_COUNT' | 'MALFORMED_PAYLOAD' } }` without throwing an exception or advancing `rng.getState()`.
- **AC-5 (`Automated — Unit (Vitest)`)**: **GIVEN** an `ACTIVE_TURN` state where `getTurnState(state).activeSeatIds` is `['seat_0']`, **WHEN** `applyAction` is invoked by `'seat_1'` (`NOT_YOUR_TURN`), in a mismatched `phase` (`INVALID_PHASE`), or with an action absent from `getLegalActions` (`ILLEGAL_ACTION`), **THEN** `applyAction` returns `{ ok: false, error: { code } }`, leaves `state` byte-for-byte unchanged, and keeps `rng.getState()` identical to before the call.
- **AC-6 (`Automated — Unit (Vitest)`)**: **GIVEN** a match state where `isGameOver(state)` is `true` (`TERMINAL`), **WHEN** `getTurnState(state)`, `getResult(state)`, and `applyAction(state, seatId, anyAction, rng)` are called, **THEN** `activeSeatIds` is `[]`, `getResult(state)` returns non-null deterministic `{ winnerSeatIds, rankings, endReason, highlights }`, and `applyAction` returns `{ ok: false, error: { code: 'MATCH_ALREADY_ENDED' } }`.
- **AC-7 (`Automated — Fuzz (Vitest)`)** `[Cross-System: #4 / #5]`: **GIVEN** `1,000` seeded matches per preset/rule pair initialized via `init()` and driven loop-wise by `pickBotAction(state, seatId, rng)` across valid `activeSeatIds`, **WHEN** executing turns up to `fuzz_max_turns_per_match` (`500` turns per match), **THEN** every match reaches `isGameOver(state) === true` within `<= 500` turns, `!isGameOver(state)` never encounters all active seats having `getLegalActions().length === 0`, every `pickBotAction` output matches `getLegalActions`, and measured per-call timings satisfy `applyAction <= 2ms` (P99) and `pickBotAction <= 5ms` (P99).

### 3. 确定性伪随机内核与跨端同构安全（Core Rule 5 & Formula 2 `rng_next_int`）
- **AC-8 (`Automated — Unit (Vitest)`)**: **GIVEN** `RngPort` instances initialized with `seed = 0`, `seed = -42`, and `seed = 20261121`, **WHEN** extracting `100` calls to `nextUint32()`, `nextInt(1, 6)`, and `shuffle([1, 2, 3, 4])` and comparing against golden snapshot vectors (verified under both Node V8 and Chromium/WebKit Playwright unit fixtures), **THEN** `seed = 0` normalizes cleanly (`state !== 0`), outputs are bit-identical across runs/engines, and re-creating `fromState(savedState)` reproduces the remaining sequence `100%`.
- **AC-9 (`Automated — Unit (Vitest)`)**: **GIVEN** `rng_next_int` invoked for `60,000` rolls on `(1, 6)` and called on boundary pairs `(5, 5)` (`span = 1`) and `(6, 1)` (`span <= 0`), **WHEN** inspecting distribution and boundary returns, **THEN** `(5, 5)` deterministically returns `5`, `(6, 1)` throws a contract `RangeError` without division by zero, and each face `1–6` across `60,000` samples falls within `[9500, 10500]` counts (`±5%` uniform tolerance around expected `10,000`).

### 4. 动作动画时长公式与雪崩截断（Formula 1 `calc_anim_duration_ms`）
- **AC-10 (`Automated — Unit (Vitest)`)**: **GIVEN** `calc_anim_duration_ms` configured with defaults (`max_single_step_ms = 800`, `max_chain_ms = 1500`, `chain_compression_ratio = 0.72`, `max_events_per_action = 32`), **WHEN** passing (a) `0` animated events, (b) `[950ms]` single event, (c) `[450ms, 650ms, 520ms]` 3-event chain, and (d) `40` events of `500ms` each plus negative `-100ms`, **THEN** outputs equal (a) `0 ms`, (b) `800 ms`, (c) `1292 ms`, and (d) `1500 ms` (negative clamped to `0`, summation truncated at `32` events, ceiling locked at `1500 ms`), satisfying `applyAction().animDurationMs === calcAnimDurationMs(events)` for `#3` buffer sync.

### 5. 村规声明式元数据、互斥校验与角标统计（Core Rule 3 & Formula 3 `rule_deviation_count`）
- **AC-11 (`Automated — Unit (Vitest)`)** `[Cross-System: #11]`: **GIVEN** a `GameModule` defining conflicting rules (`RuleA.conflictsWith = ['RuleB']`) and 5 overridden active deviations (`1` `indigo_preset`, `4` `vermilion_mod`) with `max_visible_rule_badges = 4`, **WHEN** calling `validateRules` on valid vs unknown/conflicting configs and calling `getRuleDeviations`, **THEN** unknown/conflicting inputs fail with `RULE_UNKNOWN_KEY` / `RULE_CONFLICT`, `rule_deviation_count` returns `5`, `visible_badge_count` equals `4` containing exclusively the `4` `vermilion_mod` items ahead of `indigo_preset`, and `overflow_badge_count` equals `1`.
- **AC-12 (`Automated — Unit (Vitest)`)** `[Cross-System: #3 / #11]`: **GIVEN** an action that triggers a custom house rule returning a `GameEvent` with `ruleTag: 'triple_six_back_home'` and contiguous `seqOffset = 0..n-1`, **WHEN** inspecting `RuleDefinition` metadata and the emitted event stream, **THEN** `ruleTag` resolves to a registered `RuleDefinition` bearing valid `shortLabel` (`<= 6` chars), `stampCategory` (`'indigo_preset' | 'vermilion_mod'`), and non-empty `firstTriggerToastTemplate`.

### 6. 玩家视图隐私隔离、并发响应与只读注册表（Core Rule 2 / Core Rule 4）
- **AC-13 (`Automated — Unit (Vitest)`)** `[Cross-System: #3 / #7]`: **GIVEN** two compliant modules—one open-info (`supportsHiddenInfo: false`) and one hidden-info mock (`supportsHiddenInfo: true`)—with internal `rngState` and opponent secret fields populated in `TState`, **WHEN** calling `getViewForPlayer(state, 'seat_0')` and `getViewForPlayer(state, null)` and serializing to JSON, **THEN** neither serialized payload contains `'rngState'`, opponent secret keys are absent from `'seat_0'`'s view on hidden-info modules, and `null` exposes zero seats' private fields.
- **AC-14 (`Automated — Unit (Vitest)`)** `[Cross-System: #6 / #8]`: **GIVEN** a mock multi-actor module returning `clockMode: 'simultaneous_response'` with `activeSeatIds: ['seat_1', 'seat_2']`, **WHEN** applying `'seat_1'`'s claim action first and `'seat_2'`'s concurrent claim action second against `nextState`, **THEN** `'seat_1'` returns `{ ok: true }` advancing phase/clearing `'seat_2'` from `activeSeatIds`, and `'seat_2'` returns `{ ok: false, error: { code: 'NOT_YOUR_TURN' | 'INVALID_PHASE' } }`; meanwhile `GameRegistry.register()` throws on duplicate `gameId` and preserves insertion-ordered `listDescriptors()`.

## Open Questions

1. **`ADR-001` Zero-DOM 多包 `tsconfig` 与目录物理布局** — *Owner: Technical Director / Lead Programmer* · *Target: Technical Setup（`/create-architecture` + `ADR-001` 阶段）*：明确拆出 `tsconfig.shared.json`（`"lib": ["ES2023"]` 无 `DOM`）、`tsconfig.client.json` 与 `tsconfig.server.json` 的精确引用及 Vite 别名映射。
2. **Alpha-1 第 2 款轻量经典游戏是否触发隐藏信息分支** — *Owner: User + Game Designer* · *Target: Alpha-1 启动前*：决定 `#7` 选用明牌轻二游（`supportsHiddenInfo: false`，`+2.5–3.5 周`）还是暗牌制游戏（`supportsHiddenInfo: true`，启用 `getViewForPlayer` 逐席差异裁剪并触发 `+1.5–2 周` 工期调整）。
3. **VS `#13` 趣味称号与 `MatchHighlight.category` 映射表定稿** — *Owner: Game Designer* · *Target: Vertical Slice（编写 `#13` GDD 时）*：将 `#4/#7/#8` 产出的标准 `MatchHighlight.category`（如 `'aerial_ace'`、`'most_knocked_home'`）精确映射为朋友局幽默中文印章标题及真人优先聚焦筛选规则。
