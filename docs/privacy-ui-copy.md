Privacy UI Copy Pack

Purpose
- Provide product UI text for the optional GSC read‑only observability module. English first; Chinese appendix follows.

Scope
- Property‑level aggregates only; no query/page; no PII; local cache with TTL; optional and off by default.

Settings Panel
- Section title: Search Console (Read‑only)
- Toggle label: Enable GSC observability (Discover)
- Toggle help: Reads property‑level aggregates from Google Search Console with read‑only scope. No query/page dimensions. No PII. Data is cached locally only.
- Badge/CTA note (inline): Optional feature — off by default.

Disclosure Block (inline, collapsible)
- Title: Fixed Disclaimer
- Bullets:
  - Read‑only OAuth scope only: https://www.googleapis.com/auth/webmasters.readonly
  - Local, temporary cache (24h TTL by default); never leaves your device; one‑click clear available.
  - No PII; no per‑user/session/URL logging.
  - No query/page dimensions (property‑level aggregates only).
  - You can disable anytime and clear cache with one click.

Controls
- Button: Clear local cache
- Button (danger): Disable module
- Link: Revoke Google access (opens Google Account Security)

Cache Settings
- Label: Cache TTL (hours)
- Help: Controls how long results are kept locally to reduce API calls. Set to 0 to disable caching.

States & Toasts
- On enable: GSC observability enabled. Read‑only scope; local cache active.
- On disable: Module disabled. You can clear local cache below.
- On clear cache (success): Local cache cleared.
- On clear cache (no data): No cached data found.
- On error (auth): Sign in with Google to continue (read‑only).
- On error (quota): API quota reached. Try again later.

Confirmation Dialogs
- Disable module?
  - Body: This will turn off the read‑only observability feature. You can re‑enable it anytime.
  - Confirm: Disable
  - Cancel: Keep enabled
- Clear local cache?
  - Body: This removes locally stored results (24h TTL). No data leaves your device.
  - Confirm: Clear cache
  - Cancel: Cancel

Empty State
- Title: Observability is off
- Body: Enable the module to view property‑level Discover metrics. Read‑only scope only; no query/page dimensions; local cache only.
- Action: Enable now

Footer microcopy
- Text: Learn more in the Privacy Notice (opens PRIVACY.md).

—

中文附录 / Chinese Appendix

目的
- 为可选的 GSC 只读可观测性模块提供 UI 文案。英文为主，中文附后。

范围
- 仅属性级汇总；无 query/page；无 PII；本地缓存（TTL）；可选且默认关闭。

设置面板
- 分组标题：Search Console（只读）
- 开关名称：启用 GSC 可观测性（Discover）
- 开关说明：以只读权限从 Google Search Console 读取属性级汇总数据。无 query/page 维度。无 PII。数据仅保存在本地。
- 提示：可选功能 — 默认关闭。

披露区块（可折叠）
- 标题：固定免责声明
- 要点：
  - 仅请求只读授权范围：https://www.googleapis.com/auth/webmasters.readonly
  - 仅本地临时缓存（默认 24 小时 TTL），数据不出设备；支持一键清除。
  - 不含 PII；不记录用户/会话/URL 级日志。
  - 不获取/处理 query 或 page 维度（仅属性级汇总）。
  - 你可随时一键关闭并清除缓存。

控制项
- 按钮：清除本地缓存
- 按钮（危险）：关闭模块
- 链接：撤销 Google 授权（打开 Google 账号安全设置）

缓存设置
- 标签：缓存 TTL（小时）
- 说明：控制本地结果保留时长以减少 API 调用。设置为 0 可关闭缓存。

状态与提示
- 启用：已启用 GSC 可观测性。只读权限；本地缓存生效。
- 关闭：模块已关闭。你可以下方清除本地缓存。
- 清除缓存（成功）：已清除本地缓存。
- 清除缓存（无数据）：未发现本地缓存。
- 错误（鉴权）：请使用 Google 登录（只读）。
- 错误（配额）：API 配额已达上限，请稍后再试。

确认对话
- 关闭模块？
  - 正文：这将关闭只读可观测性功能。可随时再次开启。
  - 确认：关闭
  - 取消：保持开启
- 清除本地缓存？
  - 正文：将移除本地保存的结果（默认 24 小时 TTL）。不会有任何数据离开你的设备。
  - 确认：清除缓存
  - 取消：取消

空状态
- 标题：可观测性未开启
- 正文：启用模块以查看属性级 Discover 指标。仅只读权限；无 query/page 维度；仅本地缓存。
- 操作：立即启用

页脚提示
- 文本：查看隐私声明以了解更多（打开 PRIVACY.md）。

