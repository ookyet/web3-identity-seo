# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2026-05-09

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
