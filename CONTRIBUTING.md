Contributing Guidelines (English) / 贡献指引（中文附后）

Scope of Issues (keep it simple)
- Welcome: Observability, privacy, data minimization, revocability (opt‑in/off by default, local cache only).
- Not accepted: Ranking/SEO optimization, attempts to influence/manipulate search systems, scraping/collecting third‑party user data.

Process
- Use Issues for actionable, verifiable suggestions or bug reports.
- Use Discussions > Ideas for open‑ended brainstorming or product thoughts.
- For Discover‑type observability proposals, add label `proposal:observability`. After privacy confirmation, apply `privacy-reviewed`.
- Requests about “ranking/SEO growth” will be closed with label `wontfix:ranking` and redirected to Discussions.

PRs
- Small, focused changes only. Follow the privacy constraints documented in `PRIVACY.md`.
- Do not add analytics/telemetry, third‑party data collection, or non‑read‑only scopes.
- No external write access is granted; all contributions go through PR review.

Git commit guard (required)
- This repo uses `core.hooksPath=.githooks`. The `commit-msg` hook calls `scripts/commit-message-guard.sh`.
- Author and committer must be `ookyet <ookyet.mid@gmail.com>`.
- Commit messages must be ASCII English. The hook strips and blocks `Co-authored-by:`, `Signed-off-by:`, `Made-with:`, `Generated with ...`, and similar AI/tool watermarks.
- CI runs the same guard on HEAD via `commit-guard.yml`. Do not use `--no-verify` unless explicitly requested.
- One-time local setup:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/commit-msg scripts/commit-message-guard.sh
```

Issues
- Documented guidance does not by itself close a thread. Keep historical implementation discussions open unless the reporter confirms resolution or the issue is a duplicate.
- Do not close issues because a reference site is indexed or because FAQ text exists — indexing outcomes are case-by-case.

—

中文简版
- 欢迎：可观测性、隐私、数据最小化、可撤回性（可选、默认关闭、本地缓存）。
- 不接受：排名/SEO 优化、操纵搜索系统、抓取/采集第三方用户数据。
- Issues 只收可执行、可验证建议；泛讨论移至 Discussions 的 Ideas。文档化不等于关 issue；保留历史实现讨论，除非 reporter 确认已解决或为重复 issue。
- PR 审查后合并；遵循 `PRIVACY.md` 约束。
- **Git 提交围栏**：`core.hooksPath=.githooks`；`commit-msg` 调用 `scripts/commit-message-guard.sh`。作者/提交者必须是 `ookyet <ookyet.mid@gmail.com>`；提交说明 ASCII English；自动删除 `Co-authored-by:` 等 AI/工具水印。CI 用 `commit-guard.yml` 验证 HEAD。本地一次性配置：`git config core.hooksPath .githooks && chmod +x .githooks/commit-msg scripts/commit-message-guard.sh`
