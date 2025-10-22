Privacy Notice

Last updated: 2025-10-22

## Fixed Disclaimer

- Read-only OAuth scope only: `https://www.googleapis.com/auth/webmasters.readonly` (no write/admin scopes).
- Local, temporary cache only (24h TTL by default); data never leaves your device; one-click clear available.
- No PII collected or stored; no per-user/session/URL logging.
- No query/page dimensions retrieved, processed, or stored (property-level aggregates only).
- Optional and off by default; one-click disable and one-click cache deletion are provided.

## Summary

- Opt-in only; the feature is off by default.
- Read-only access to Google Search Console (GSC); property-level aggregates only.
- Local short-term cache reduces API calls; you can clear or disable at any time.
- No project-controlled servers receive your data; credentials are never proxied.
- No scraping. No growth/SEO/ranking recommendations.

## Data Scope

- When the optional module is enabled, the tool reads property-level aggregates (e.g., impressions, clicks, CTR) from GSC Search Analytics.
- No dimensions are used (no query, page, country, device, etc.).
- Default window: last 28 days; `dataState` defaults to "final".
- Only lightweight client-side derivations (e.g., CTR or week-over-week indicators); nothing persists beyond cache TTL.

## Storage & Retention

- Cache is stored locally (browser: localStorage/IndexedDB; desktop/Node: local temp directory).
- Default cache TTL is 24 hours; it auto-expires and you may clear it at any time.
- No copies exist elsewhere; no data is sent to project or third-party servers.

## Out of Scope

- Indexing/Submission utilities (e.g., Google Indexing API examples, IndexNow script) submit public URLs to search engines. They do not read or process personal data and are not part of the read-only GSC module covered above.
- Developer diagnostics (e.g., optional local monitoring logs) are strictly local and off by default; when enabled, they never leave your device and contain no PII.

## Authentication & Credentials

- You authenticate directly with Google via standard OAuth.
- Only the read-only scope `https://www.googleapis.com/auth/webmasters.readonly` is requested.
- Credentials are not proxied or collected; you can revoke access in your Google Account at any time.

## Disable & Delete

1. Disable the module via settings/config (one click or by removing related config/env variables).
2. Clear local cache with one click (or manually clear site storage / local temp directory).
3. Optionally revoke OAuth access in your Google Account security settings.

## Third Parties

- Google Search Console API (read-only).
- No analytics, CDN log collection, or other processors are used by this module.

## Security Notes

- Calls are made from your device directly to Google APIs; the project does not receive copies of your data.
- Keep your device and browser/runtime up to date; security posture is inherited from your environment and Google OAuth.

## Changes

- Material changes are recorded here and in release notes. If you prefer not to participate, keep the feature disabled.

## Contact

- For privacy questions or suggestions, open a repository issue labeled `privacy` (do not include PII).

---

中文附录 / Chinese Appendix

### 固定免责声明

- 仅请求只读授权范围：`https://www.googleapis.com/auth/webmasters.readonly`（不请求写入/管理权限）。
- 仅本地、临时缓存（默认 24 小时 TTL），数据不出设备/浏览器；支持一键清除。
- 不收集、不存储任何个人身份信息（PII）；不记录用户/会话/URL 级日志。
- 不获取、不处理、不存储 query 或 page 维度数据（仅属性级汇总指标）。
- 功能为可选且默认关闭；提供一键关闭与一键删除缓存。

### 摘要

- 仅在你主动启用时工作（opt-in），默认关闭。
- 只读访问 GSC 数据，且限制为属性级汇总指标。
- 本地短期缓存用于减少 API 调用；可随时清除或关闭。
- 无项目方控制的服务器接收你的数据；凭据不经代理。
- 不抓取（scraping），不提供增长/排名类建议。

### 数据范围

- 启用后仅从 GSC Search Analytics 读取属性级汇总（如 impressions、clicks、CTR）。
- 不包含任何维度（如 query、page、country、device）。
- 默认时间窗：近 28 天；`dataState` 默认 "final"。
- 仅在本地做必要的轻量派生（如 CTR、环比指示），不超过缓存 TTL 持久化。

### 存储与保留

- 缓存仅在本地（浏览器：localStorage/IndexedDB；桌面/Node：本地临时目录）。
- 默认 TTL 为 24 小时；到期自动失效；你可随时清除。
- 本地以外无副本；不向项目方或第三方服务器回传数据。

### 超出范围说明

- 提交/索引工具（如 Google Indexing API 示例、IndexNow 脚本）用于向搜索引擎提交公开 URL，不读取或处理个人数据，不属于上文“只读 GSC 模块”的隐私承诺范围。
- 开发诊断（如可选的本地监控日志）严格本地化，默认关闭；如开启，数据不出你的设备，且不包含 PII。

### 鉴权与凭据

- 通过标准 Google OAuth 直接与 GSC 交互。
- 仅请求只读范围：`https://www.googleapis.com/auth/webmasters.readonly`。
- 凭据不经项目服务器中转或收集；可随时在 Google 账号撤销授权。

### 关闭与删除

1. 在设置/配置中一键关闭（或移除相关配置/环境变量）。
2. 一键清除本地缓存（或手动清理站点存储/本地临时目录）。
3. 如需彻底断开，可在 Google 账号安全设置撤销 OAuth 访问。

### 第三方服务

- Google Search Console API（只读）。
- 不使用分析、CDN 日志收集或其他处理器处理该模块数据。

### 安全说明

- 请求由你的设备直连 Google；项目不接收你的数据副本。
- 请保持设备与浏览器/运行环境更新；安全基线由你的环境与 Google OAuth 决定。

### 变更

- 重大变更会记录在本文件与发行说明；若不希望使用，可保持默认关闭。

### 联系

- 如对隐私有疑问或建议，请在仓库新建 issue 并标注 `privacy`（请勿包含 PII）。
