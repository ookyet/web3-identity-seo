# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.5.0] — 2026-07-18

Ported the Jul 16–18 field window: the second corpus pillar (a standalone library shipped on GitHub + npm), ORCID software works, and a week of measurement that pinned down what the KG API can and cannot tell you.

### Added

- **`docs/implementation-guide.md` Step 5.3 "A second gauge: binding depth via combined queries"** — the measured confidence ladder on the reference entity: handle alone 0.0001 → handle + half the real name 50× → full combination 800×, order-insensitive, uniquely resolved at every rung against eight same-name entities. Plus **"What `resultScore` is — and is not"**: Google's own definition (a match indicator, unscaled, no panel threshold; the gating confidence value is not exposed by any API), and why the consultancy exact-name proxy (~500 = "secure") breaks for crowded-name people — the handle query and the combination ladder are the gauges that actually move.
- **`docs/implementation-guide.md` Step 4.3 "Software works"** — mounting open-source repositories on the ORCID anchor: work type Software, title verbatim from `CITATION.cff`, publication date anchored to the platform's `created_at` (not the latest version, not a possibly-rewritten first commit), dual URI/Self identifiers (repo + package registry), CRediT **Software** contributor role, and the long-form Save-button quirk that silently drops fields.
- **`docs/faq.md`** — three new questions: *"My AI Overview appears instantly and reads identically every time"* (cached/converged answers as interface-layer evidence that comprehension is settled, and why the locked-in definition is the controlled vocabulary's payoff); *"A 'People also search for' box appeared"* (entity-shaped query treatment; template-generated commercial variants are not demand); *"My ENS app profile page got indexed"* (consistency-layer anchor, not a notability signal).
- **`docs/troubleshooting.md` "Off-Site Surface Issues"** — one diagnostic (`curl | grep -ci`) that splits snippet problems into stale crawls (live page correct → do nothing; three field cases) and page-data leaks (a forgotten link-in-bio campaign toggle serialized `causeBanner` JSON that Google quoted instead of the bio → find the switch, not the content).

### Changed

- **`README.md` timeline** — appended **Jul 16–18, 2026**: second corpus pillar on GitHub + npm (the package author field as the identity's first open-web real-name co-occurrence surface), both repositories mounted as ORCID software works, combined-query ladder measured.

---

## [3.4.1] — 2026-07-12

Licensing hygiene: made the implicit code/content split explicit.

### Added

- **`LICENSE-docs`** — the documentation (README, CHANGELOG, everything under `docs/`) is now explicitly **CC BY 4.0**: share and adapt freely, with credit to "Qifeng Huang (ookyet)" and a link back to the repository. Code, workflows, and the copy-paste JSON-LD templates in `examples/` stay **MIT**, so nothing a reader drops into their own site ever owes attribution.

### Changed

- **`README.md` License section** — documents the split.
- **`docs/faq.md` footer** — license line updated; stale "Last updated 2025-10-06" stamp refreshed.

---

## [3.4.0] — 2026-07-12

Ported the corpus-supply execution lessons from the reference implementation's Jul 8–12 field window: authored content mounted on an existing anchor, and the off-site display-name question settled by deploying profiles across five surfaces in one day.

### Added

- **`docs/implementation-guide.md` Step 4.3 "ORCID Works — mount your authored content on the anchor"** — ORCID separates identity fields (fix once, freeze) from the append-only works list, so adding a work is corroboration supply that touches nothing frozen. The field-tested form details the UI does not make obvious: *Add manually* (the import connectors are scholarly-database integrations that also grant an external service write access); work type **Blog post** under Dissemination — not "Journal article", which is the same aspirational-markup mistake retired elsewhere; verbatim title; URI external identifier with value and URL set to the same canonical article URL, relationship **Self**; contributor role **Writing – Original Draft** (the CRediT picker has no "Author"); visibility **Everyone**; every other optional field left empty. Public-API verification command for the works endpoint included.
- **`docs/implementation-guide.md` Step 4.3 "Display names: two tiers, one bio"** — replaces the flat "`Real Name (@handle)` everywhere" template with what survived contact with real platforms: real name in the display only where it reads natively (Instagram; Discourse Name fields), handle-first display plus a real-name-led controlled bio sentence on handle-native platforms (Bluesky, Mastodon, YouTube). Honest trade-off documented: the profile page — what entity reconciliation actually reads — keeps all four tokens either way; per-post real-name bylines are a volume amplifier, not a requirement. Platform mechanics: Bluesky's domain-as-handle is a DNS-verified account↔domain binding (the hardest available); Discourse hides trust-level-0 profiles from crawlers.
- **`docs/faq.md`** — two new questions: *"Should my display name include my real name on every platform?"* and *"I registered extra domains for my name — should I build anything on them?"* (defensive domains: 301-redirect-only — a second domain with content is a second entity-home candidate; no registrar parking ads on your own brand query; auto-renew on; never in `sameAs`).

### Changed

- **`README.md` timeline** — appended **Jul 8–12, 2026**: corpus-supply window — the stale 2025 self-published article superseded by a current retrospective (published Jul 8, indexed within days), first ORCID works entry mounted and public-API-verified.
- **`README.md` Layer 5 off-site bullet** — aligned with the two-tier display-name guidance.

---

## [3.3.1] — 2026-07-08

Tooling honesty pass for `kg-monitor.js` — the same treatment `kg-audit.sh` received in 3.2.1. The script predated the project's documented conclusions and was still reporting an Oct 2025 fiction.

### Changed

- **`scripts/kg-monitor.js` rewritten as what it claims to be.** The old script reported a hardcoded "Knowledge Panel probability" (baseline 87%) via an invented weighted formula, printed a **simulated** "Google indexing status" as if it were live data (hardcoded Oct 2025 snapshots: "indexed in 48h", "8 reactions"), counted days against a "Phase 1 / Day 7 (2025-10-13)" plan retired months ago, and mixed Chinese into an English-only repo. All of that contradicted the honesty rules the docs already state. The new script has two honest modes: **inventory mode** (default, no network) reporting a weighted **Signal Index** over the self-maintained signal checklist, and **live mode** (`KG_API_KEY` set) querying the KG Search API and reporting the entity node's growth fields in staircase order (`url` -> `image` -> `resultScore` -> `detailedDescription`), with the key-expiry caveat built into its error message. Log-file contract (`KG_MONITOR_LOG=1` -> `.monitoring-logs/*.json`) is unchanged; the JSON schema now carries `signalIndex` + `node` instead of the retired fiction metrics.
- **`scripts/README.md`** — the metrics list now describes the Signal Index and live node check instead of "KP trigger probability"; the sample CI cron is weekly (Monday) instead of daily, matching the documented monitoring cadence.

## [3.3.0] — 2026-07-08

Ported the first post-milestone monitoring lessons from the reference implementation's Jul 7 weekly check and GSC recovery confirmation.

### Added

- **`README.md` milestone section — "Post-milestone monitoring: the growth staircase"** — how to read a sparse KG node over time, in field priority order: `url` (entity home bound; usually first, driven by corroboration already shipped) → `image` → `resultScore` rising an order of magnitude → `detailedDescription` (encyclopedic-source gated; often never for niche entities, and not a blocker for the rest). Weekly cadence rationale (same-day repeat queries return byte-identical results); first weekly check (2026-07-07, unchanged after five days) recorded as the normal case, not a negative signal.
- **`README.md` milestone section — "Recovery-playbook validation"** — field data for the "fix once, freeze, wait" discipline: structured-data fix deployed Jun 28 → GSC Profile page report valid (1 item, 0 invalid), indexed pages 4→6, 404s 0 by Jul 7 (~9 days), with zero schema edits in between. Includes the *Test Live URL is read-only* GSC note.
- **`docs/faq.md`** — two new questions: *"The SERP already shows an Images pack for my name — is that the Knowledge Panel image?"* (image retrieval system vs. KG node `image` property; why the pack still helps) and *"I rank #1 on Google but barely appear on other search engines — is something wrong?"* (ranking layer vs. corpus layer; thin-corpus symptoms including AI-fabricated facts and stale self-published narratives; content supply — not markup — as the fix).
- **`docs/implementation-guide.md` Step 5.3** — the growth staircase in checklist form, the API-key-expiry pitfall, and the no-change-is-normal guidance.

### Changed

- **`docs/faq.md` "How do I know if it's working?"** — the long-term list promised *"Rich Results (FAQ, Person)"* (FAQ rich results are retired — contradicted this repo's own Step 3) and put a Knowledge Panel on a Week 4–8 calendar (the reference implementation took ~11 months to a KG node, and a KP is not calendar-able). Rewritten to the staircase model with honest timescales; daily monitoring advice relaxed to weekly.
- **`docs/implementation-guide.md` Step 5.1** — retitled from "Daily Knowledge Graph Audit"; weekly cadence with rationale.
- **`README.md` timeline** — appended **Jul 7, 2026**: GSC structured-data recovery confirmed (ProfilePage valid; indexed pages 4→6).

---

## [3.2.1] — 2026-07-03

Repository hygiene: community standards completion, CI lint gate, and retiring the last "KP trigger" relic from the tooling so the scripts say what the docs say.

### Added

- **`CODE_OF_CONDUCT.md`** — Contributor Covenant 2.1 (the last missing GitHub community-standards file).
- **`.github/workflows/shellcheck.yml`** — ShellCheck CI gate (`-S warning`) over `scripts/*.sh`, path-filtered, minimal permissions.

### Changed

- **`scripts/kg-audit.sh`** — the "Trigger Score / threshold: 75% / READY FOR KP" framing predated the project's own conclusion that a Knowledge Panel is notability-driven and cannot be force-triggered; the docs said one thing and the tooling said another. Renamed the user-facing concept to **Signal Index** (an internal heuristic for self-maintained signals, explicitly "not a KP probability"), reworded the saturation status to point at independent coverage + time, and updated the stale `INTENT_MATCH` comment (FAQ schema is retired). The `TRIGGER_SCORE` variable and the `timeline.csv` column are kept for data continuity.

### Fixed

- **`scripts/kg-audit.sh`** — quoted all unquoted command substitutions in `[ … ]` tests (ShellCheck SC2046); the script now passes the new CI gate.

---

## [3.2.0] — 2026-07-03

Ported the off-site reconciliation lessons from the reference implementation's Jul 2026 cross-surface audit, and reframed onboarding around forking.

### Added

- **`docs/implementation-guide.md` Step 2.4, rules 5–7** — three more field-tested entity-graph rules: (5) never emit structured data for content that does not exist yet (phantom "planned coverage" articles assert publications Google can verify are false — fabricated notability evidence; gate JSON-LD on publication status); (6) keep every visible identity surface consistent with the graph (the byline, footer copyright, and page headings must carry the same name as `Person.name`, `meta author`, and the feed — Google's Article guidance expects markup author names to match visible bylines); (7) `speakable` selectors must exist in the rendered DOM (generate the selector list under the same condition that renders the elements).
- **`docs/implementation-guide.md` Step 4.3 "Off-site co-occurrence"** — the highest-leverage external work once the on-site graph is clean: the LinkedIn "at yourname.eth" company-field trap (an employment phrase that re-creates Person↔Org ambiguity from off-site, plus the three-part fix); the ORCID structured-alias playbook (*Also known as* mirroring `Person.alternateName`, per-field visibility set to Everyone, destination-named URLs, public-API verification command); and the `Real Name (@handle)` template.
- **`docs/implementation-guide.md` Advanced Optimization** — image structured data (`ImageObject` with `creator`/`creditText`/`copyrightNotice`/`license`) for the Google Images surface, scheduled for a planned markup window rather than breaking a stable graph's freeze.
- **`README.md`** — Layer 5 gains the off-site co-occurrence bullet; Advanced Setup points at Step 4.3 and the Images-surface note.

### Changed

- **`README.md` Quick Start** — reframed as fork-first: fork → replace the placeholder identity values in `examples/schema-person.json` → serve the JSON-LD server-side as a single `@graph` → verify with the Rich Results Test and submit via the indexing scripts → bind off-site profiles to the same name/handle pair.

---

## [3.1.1] — 2026-07-02

Ported the remaining hard-won entity-graph lessons from the reference implementation's Jun–Jul 2026 Search Console recovery.

### Added

- **`docs/implementation-guide.md` Step 2.4 "Entity-graph hygiene"** — four field-tested rules: (1) one page entity per URL and no synthetic "SEO intent" nodes (markup must reflect actual page content); (2) Organization stays a thin publisher/brand shell — `sameAs`/`identifier`/credentials belong to the Person exclusively (avoids Person↔Org reconciliation ambiguity); (3) no `WebSite.potentialAction`/`SearchAction` unless a real search page exists (Sitelinks Search Box retired Oct 2024; a modal-only search plus `/search` 404 violates markup policy — bug shipped and fixed in the reference implementation); (4) `mentions` is CreativeWork-only — invalid on a Person node. Plus a note: serve JSON-LD server-side from a single source of truth.
- **`docs/implementation-guide.md` Step 2.2** — `mainEntity` must be a typed, named node; a bare `@id` reference trips GSC "Invalid object type for field mainEntity". Example updated to carry `name`.
- **`docs/troubleshooting.md`** — new entry mapping the GSC triple report (`Unparsable structured data` "string" root / `Profile page` invalid `mainEntity` / `Q&A` invalid items) to root causes and fixes, with the batch-fix → Validate Fix → freeze recovery protocol.

---

## [3.1.0] — 2026-07-02

First externally verifiable Knowledge Graph outcome for the reference implementation.

### Added

- **`README.md` Results + "Milestone" subsection** — Google Knowledge Graph **entity node confirmed** via the KG Search API: the query `ookyet` resolves **uniquely** to a machine-generated Person MID (`/g/11z806my44`). Documented the reproducible API check (key placeholder only), the disambiguation evidence (8 distinct same-named Person nodes in the KG; the handle selects exactly one), the canonical-name observation (Google chose the author's real name from high-authority anchors over the site's self-declared handle — third-party corroboration outweighs self-declaration), the ~11-month timeline (first indexed Aug 2025 → KG node Jul 2, 2026), and the honest status (node still sparse; **no formal Knowledge Panel** — an entity node is the mechanical prerequisite, not the KP).
- **`README.md`** — Google KG badge linking to the milestone section.

### Changed

- **`README.md` architecture diagram** — the Knowledge Graph box now shows the minted node (MID + date) instead of a hypothetical target; result line updated accordingly. KP remains explicitly labeled as Google's black-box decision.

---

## [3.0.7] — 2026-06-30

More entity guidance for individual/niche entities, mirrored from the reference implementation's field notes.

### Added

- **`docs/implementation-guide.md`** — `sameAs` inclusion criteria ("only add real anchors — active, identity-consistent, reachable/indexed; don't stack ghosts") and the **`sameAs` vs `subjectOf`** distinction (third-party mentions are corroboration, not `sameAs`).
- **`docs/faq.md`** — two Q&As: there is no magic number of third-party citations (quality × time × stability compounds; "30+" is folklore), and how a unique/coined name helps (zero-disambiguation multiplier, not a Knowledge Panel trigger).

---

## [3.0.6] — 2026-06-30

Entity / Knowledge-Graph guidance aligned with Google's 2026 stance and real-world constraints for individual entities.

### Changed

- **`docs/implementation-guide.md`** — reframed `sameAs` from a count ("minimum 5 platforms") to a quality model: **consistency anchors** (your active profiles) vs **high-authority KG anchors** (Wikidata, Wikipedia, LinkedIn, ORCID, Crunchbase). Noted Wikidata/Wikipedia are notability-gated (self-created items can be deleted — a negative signal), while **LinkedIn and ORCID are attainable by anyone** and are the realistic high-authority anchors for an individual/niche entity. Added ORCID to the external-sources list.

### Added

- **`docs/faq.md`** — two Knowledge-Panel Q&As: (1) why an entity can appear in **AI Overview** without a formal **Knowledge Panel** (AI Overview recognition is the realistic ceiling for niche entities; KP is notability-gated), and (2) how to **claim/correct** a Knowledge Panel per Google's official process (claim via Search Console/YouTube/X/Facebook; you can suggest edits via Feedback, not overwrite facts).

---

## [3.0.5] — 2026-06-30

Accuracy correction to the v3.0.4 Results figures.

### Changed

- **`README.md` Results** — corrected the Search Console performance row: ookyet.com was first indexed in Aug 2025, so the 11.8K impressions / 1.31K clicks (avg position 1.4, CTR 11.1%) are **~10 months of cumulative data**, not a full "16-month" span (16 months was only the GSC date-range filter). Added an explicit note that AI Overviews are generated and can vary, while the observed entity recognition has been stable.

---

## [3.0.4] — 2026-06-29

Results updated to reflect now-verifiable outcomes; added citation metadata.

### Changed

- **`README.md` Results** — recorded the reference implementation's verified, reproducible outcomes: Google AI Overview now narrates `ookyet` as an entity (resolving person, ENS, and NFT avatar from 6-7 sources); Search Console 16-month performance (avg position 1.4, CTR 11.1%). Kept the honest distinction that **AI Overview entity recognition is not a formal Knowledge Panel** (still not triggered).

### Added

- **`CITATION.cff`** — citation metadata so the architecture can be referenced (enables GitHub's "Cite this repository").

### Notes

- Repository description refined to lead with "Google-recognized entities" rather than "Knowledge Panel optimization," matching the project's verifiable-outcomes discipline.

---

## [3.0.3] — 2026-06-29

Alignment with Google's official documentation as of June 2026 (verified against Search Central).

### Changed

- **Indexing API guidance** (`README.md` Step 4, `docs/implementation-guide.md`) — corrected to state the API may **only** be used for `JobPosting` / `BroadcastEvent` (in `VideoObject`) per Google's policy, cited the May 2025 reiteration, and replaced the example that submitted an identity/`/proof/` page with a `JobPosting` URL. Identity/`ProfilePage` pages now point to sitemaps + URL Inspection.
- **FAQ deprecation timeline** (`README.md`, `docs/faq.md`, `docs/troubleshooting.md`, `docs/implementation-guide.md`, `examples/README.md`) — replaced the imprecise "removed Aug 2023" with the accurate sequence: limited to authoritative gov/health sites Aug 2023, fully removed from Search May 7, 2026, docs removed June 15, 2026.
- **ProfilePage** (`README.md` Step 2) — linked Google's official ProfilePage doc, noted the Discussions-and-Forums connection and Google-recognized properties (`sameAs`, `identifier`, `description`, `dateCreated`/`dateModified`).

### Added

- **`docs/troubleshooting.md`** — a structured-data currency note listing the June 2025 retired rich-result types (Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing).

---

## [3.0.2] — 2026-06-29

Tooling and documentation hardening. No changes to the structured-data guidance.

### Changed

- **`scripts/commit-message-guard.sh`** — added a `--check-range` mode so the guard validates every commit in a push or pull-request range, not just the tip. `--check-head` is preserved.
- **`.github/workflows/commit-guard.yml`** — CI now runs the guard over the full commit range of each push/PR instead of only HEAD.
- **`CONTRIBUTING.md`** — documented the `core.hooksPath` one-time setup and clarified that CI checks the whole range.
- **`docs/troubleshooting.md`** — replaced placeholder links in "Getting Help" with the real GitHub issues URL and Google Search Central community link.

---

## [3.0.1] — 2026-06-29

Rigor pass aligned with the reference site (`ookyet.com`) KG/KP discipline: stable signals over KP chasing.

### Changed

- **`docs/faq.md`** — replaced KP "success rate" percentages and timelines with a signal-completeness tier table; clarified KP has no reliable timeline.
- **`docs/implementation-guide.md`** — monitoring metrics and phase timeline no longer promise KP activation weeks; KG API empty results documented as non-diagnostic.
- **`scripts/kg-monitor.js`** — renamed KP probability output to signal completeness (heuristic); removed `95%+` target line.
- **`scripts/README.md`** — heuristic bands described without implying Google timelines.
- **`CONTRIBUTING.md` / `README.md`** (prior commits in this series) — issue-closure policy; retired `KnowledgePanelCandidate` / Active Trigger naming; `ens` propertyID consistency.

---

## [3.0.0] — 2026-06-28

Alignment with Google's current structured-data policy and a Person-first entity model, after the 2026-06-28 GSC re-identification of the reference site (`ookyet.com`) flagged retired/misused types. Companion rigor pass to 2.0.0.

### Changed

- **Retired `FAQPage` across the project** (`README.md`, `docs/implementation-guide.md`, `docs/faq.md`, `docs/troubleshooting.md`, `examples/schema-faq.json`, `examples/README.md`, `scripts/kg-audit.sh`). Google removed FAQ rich results (Aug 2023) and retired the FAQ structured-data docs (2026-06-15). The guide no longer recommends emitting `FAQPage`; FAQ content belongs in visible page copy. `examples/schema-faq.json` is kept but wrapped so it cannot be pasted as valid markup.
- **`HowTo` / `QAPage` guidance** — noted `HowTo` is retired (Sep 2023) and `QAPage` is valid only for a single user-submitted Q&A page (not authored FAQ copy).
- **Person-first naming** (`README.md` Step 1, `examples/schema-person.json`, `examples/README.md`). The `Person` is the single primary entity; `name` is the person/handle, and the ENS domain moves to `alternateName` + `identifier` (a verifiable anchor, not the primary key). Fixed `propertyID` `ens_domain` → `ens` with a resolvable `url`.
- **ProfilePage** — clarified `mainEntity` must be a `Person`/`Organization`; emit exactly one ProfilePage on the canonical about page.

### Removed

- **Unverifiable KP-probability claims** (`README.md` Live Implementation `85%+`, architecture diagram `Confidence: 96%` and `85%+ KP Trigger Probability`, case study `85%+`). These contradicted the repo's own Knowledge-Panel-probability disclosure note and were performative signals.
- **False "FAQ rich result" / "FAQPage detected" outcomes** from the README live badge and Results table (the type is retired and cannot be detected).

Field-rigor revision after ~7 months of running the architecture against `ookyet.eth`. Anti-patterns removed; verifiable outcomes promoted; unverifiable claims qualified with methodology disclosure.

### Removed

- **`propertyID: "knowledge_graph_eligible"` everywhere** (`README.md`, `docs/implementation-guide.md`, `docs/faq.md`, `examples/schema-person.json`, `examples/README.md`). This non-standard property was never recognized by Google and may be interpreted by Google's anti-spam systems as a fabricated signal. Stick to standard Schema.org vocabulary.
- **Plaintext `ethereum_address` PropertyValue** from `examples/schema-person.json`. Promoting publication of an Ethereum address in structured data is a privacy footgun (transaction-graph deanonymization) and contradicts the privacy-conscious recommendation already in `docs/faq.md`.

### Changed

- **`README.md` header** — replaced the `KP Probability 85%` shields.io badge (an unverifiable claim) with two badges that link to live verification: `Google SERP — Position 1` and `Schema.org — validated`.
- **`README.md` snippet area** (the blockquote and "Live Example" line that Google抽 into SERP snippets) — replaced "85%+ Knowledge Panel trigger probability" with the verifiable SERP outcomes actually observed for `ookyet.eth`: Position 1 stable 90+ days, Sitelinks, Image Thumbnail, FAQ rich result, AI Overview entity mention.
- **`README.md` "Layer 4: Active Trigger Interfaces"** renamed to **"Layer 4: Entity Graph Linkage"** and rewritten to describe what the layer actually does (`@graph` with shared `@id` references, FAQPage, ProfilePage with `mainEntity`) rather than asserting a fabricated `knowledge_graph_eligible` flag is a "Google internal entity marker".
- **`README.md` Results table** — added a "How measured" column and a methodology footnote clarifying that Knowledge Panel triggering is a black-box decision; the Google Knowledge Graph API does not distinguish "candidate" from "unknown" entities; any "% probability" is an internal model estimate, not a Google-published metric.
- **`docs/faq.md` "What is the `knowledge_graph_eligible` flag?"** — heading kept (anchor stability for any external links) but answer fully reversed: from "use this flag" to "don't — it isn't real."
- **`docs/faq.md` "What's the success rate for getting a Knowledge Panel?"** — added a methodology note framing the 85-95% / 60-70% / 20-30% figures as relative ranking of signal completeness based on observed implementations, not a Google-confirmed probability.
- **`docs/implementation-guide.md` Step 2.1** — removed the `knowledge_graph_eligible` PropertyValue from the example schema, removed it from the "Key elements" bullet list, and added a callout warning against fabricating non-standard `propertyID` values.
- **`docs/implementation-guide.md` Success Checklist** — "ProfilePage + knowledge_graph_eligible flag added" → "ProfilePage declaration added".
- **`docs/troubleshooting.md`** — `TRIGGER_SCORE: >90` corrected to `TRIGGER_SCORE: >75` to match the actual threshold computed in `scripts/kg-audit.sh`.
- **`examples/README.md` Tips** — flipped from "Use `knowledge_graph_eligible` flag in identifier array" to "Stick to standard Schema.org vocabulary; avoid fabricated `propertyID` values"; expanded the other tips with a defensible reason each.

### Notes for downstream users

- If your fork or implementation was using `propertyID: "knowledge_graph_eligible"` based on the previous version of this guide, removing it will not lose you any signal — it never had any. Your other identifiers (`ens_domain`, `wikidata`, etc.) and `hasCredential` block carry the real weight.
- The architectural logic of the 5-layer model is unchanged. The revision is about removing fabricated signal claims and grounding the public-facing copy in observable, verifiable SERP outcomes.

---

## [1.0.0] — 2025-10-22

Initial public release. Five-layer architecture for making ENS domains visible in Google Search and eligible for Knowledge Panel candidacy.

- 5-layer model: Indexing acceleration, Schema.org entity markup, Proof of humanness (Dentity), Active trigger interfaces, Cross-platform validation.
- `docs/implementation-guide.md`, `docs/faq.md`, `docs/troubleshooting.md` — full implementation and troubleshooting docs.
- `examples/` — drop-in JSON-LD samples and Indexing API submission script.
- `scripts/` — `kg-audit.sh` daily monitoring, `indexnow-submit.js`, GitHub issue/discussion tooling.
- `PRIVACY.md`, `SECURITY.md`, `CONTRIBUTING.md` — repository governance.
