# Web3 Identity SEO: Structured Data for ENS Identity Pages

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Live Demo](https://img.shields.io/badge/demo-ookyet.eth-blue)](https://ookyet.com/proof/)
  [![Google SERP](https://img.shields.io/badge/Google%20SERP-Position%201-success)](https://www.google.com/search?q=ookyet)
  [![Google KG](https://img.shields.io/badge/Google%20KG-Person%20entity-success)](#milestone-knowledge-graph-entity-node-2026-07-02)
  [![Schema.org](https://img.shields.io/badge/Schema.org-validated-brightgreen)](https://search.google.com/test/rich-results?url=https://ookyet.com/)
  [![Dentity](https://img.shields.io/badge/Dentity-Verified-success)](https://dentity.com/ookyet.eth)
  [![Privacy](https://img.shields.io/badge/Privacy-Notice-blue)](PRIVACY.md)

> Open-source documentation for structured data, identity verification, and search indexing of ENS-based pages.
>
> Reference implementation: [`ookyet.eth`](https://ookyet.com/proof/) — measured outcomes in [Results](#results).

Privacy: see the [Privacy Notice](PRIVACY.md).

## Problem

ENS domains like `vitalik.eth` or `ookyet.eth` often lack structured entity markup on an associated website. Without machine-readable Person/Organization data and cross-source consistency, they may not appear as named entities in web search results or Knowledge Panels.

## Solution Architecture

A documented five-layer approach for entity markup and indexing submission:

### Layer 1: Indexing Acceleration
- **Google Indexing API** - 24-48 hour indexing vs 7+ days traditional crawl
- **IndexNow** - Bing/Yandex instant indexing
- Direct submission bypasses crawl queue

### Layer 2: Entity Markup
- **Schema.org @graph** - Structured entity data
- **Person/Organization types** - Standard Schema.org entity types
- **hasCredential properties** - Dentity/ENS verification signals

### Layer 3: Proof of Humanness
- **Dentity Unique Human verification** - Anti-Sybil KYC
- **Government ID + Biometric** - Third-party liveness and document checks
- **Verification checklist** - Provider-specific credential status

### Layer 4: Entity Graph Linkage
- **`@graph` with shared `@id` references** - Person, ProfilePage, WebSite, and Article entities are explicitly linked through stable `@id` URIs, so Google parses one cohesive entity rather than several disconnected ones
- **ProfilePage with `mainEntity` → Person** - signals the page's primary subject is a Person entity (per [Schema.org ProfilePage](https://schema.org/ProfilePage)). Google requires `mainEntity` to be a `Person` or `Organization`; emit exactly one ProfilePage on the canonical "about" page.
- **~~FAQ Schema (`FAQPage`)~~ — RETIRED** - Google limited FAQ rich results to authoritative government/health sites in Aug 2023, then fully removed the feature from Search on **May 7, 2026** (FAQ structured-data docs removed June 15, 2026). Do **not** emit `FAQPage` for entity SEO — keep FAQ as visible page content. (`HowTo` likewise retired Sep 2023; `QAPage` is still supported but only for a single **user-submitted** Q&A page, not authored FAQ copy.)

### Layer 5: Cross-Platform Validation
- **Unified cross-platform identity** - Consistent name/avatar/links across Web2/Web3 (audited count in [Results](#results))
- **NFT avatar** - Visual identity proof
- **sameAs linkage** - Cross-source consistency
- **Off-site co-occurrence** - real name and handle together on every authority profile (LinkedIn, ORCID) so Google reconciles the alias itself; display name where it reads natively, otherwise leading the bio — see [Step 4.3 of the guide](docs/implementation-guide.md)

## Reference Implementation

See **[ookyet.eth](https://ookyet.com/proof/)** for a production example:

- ✅ **ENS Domain**: ookyet.eth (owned since 2023)
- ✅ **Dentity Verified**: Unique Human KYC (10/10 checks)
- ✅ **NFT Avatar**: Lil Ghost #761 on-chain proof
- ✅ **Indexed entity**: Person + Organization + ProfilePage detected, 0 errors (Rich Results Test)
- ✅ **SERP features**: Position 1, Sitelinks, Image pack, AI Overview entity mention

**Technical Deep-Dive**: [Identity Through ENS](https://ookyet.com/blog/identity-through-ens/)
**Complete Proof Hub**: [ookyet.com/proof](https://ookyet.com/proof/)

## Implementation Guide

### Step 1: Schema.org Entity Markup

**Person-first naming.** Make the `Person` your single primary entity. Its `name`
should read like a person/handle (e.g. `Your Name` or `yourhandle`), **not** the ENS
domain. Put the ENS name in `alternateName` and as an `identifier` — it is a
verifiable anchor, not the entity's primary key. This keeps Google's person entity
keyed to a human/handle while ENS corroborates it.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://yoursite.com/#Author",
  "name": "Your Name",
  "alternateName": ["yourname.eth", "@yourhandle"],
  "hasCredential": [{
    "@type": "EducationalOccupationalCredential",
    "name": "Dentity Verified Human",
    "credentialCategory": "Identity Verification"
  }],
  "identifier": [
    {
      "@type": "PropertyValue",
      "propertyID": "ens",
      "value": "yourname.eth",
      "url": "https://app.ens.domains/name/yourname.eth"
    }
  ]
}
</script>
```

### Step 2: ProfilePage Declaration

Per [Google's ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page), the page's primary focus must be a single person/organization affiliated with the site (an "About" / author page qualifies). `mainEntity` must be a `Person` or `Organization`, and `name` is required. Google also recognizes `sameAs`, `identifier`, `description`, and `dateCreated`/`dateModified` on the entity. This markup feeds Google's **Discussions and Forums** understanding of who a creator is.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://yoursite.com/#ProfilePage",
  "dateCreated": "2023-01-01T00:00:00+00:00",
  "dateModified": "2026-06-29T00:00:00+00:00",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://yoursite.com/#Author"
  }
}
</script>
```

### Step 3: FAQ — RETIRED (do not emit `FAQPage`)

> **Google limited FAQ rich results to authoritative government/health sites in
> Aug 2023, then fully removed the feature from Search on May 7, 2026 (FAQ
> structured-data docs removed June 15, 2026).** Emitting `FAQPage` no longer produces a rich result
> and can surface as an invalid item / "Q&A" issue in Search Console. Keep FAQ
> content as **visible page copy** instead. `HowTo` is likewise retired (Sep 2023).
> `QAPage` remains supported but **only** for a single user-submitted Q&A page — not
> authored FAQ/marketing content.
>
> The former `FAQPage` example is kept below for historical context only — **do not deploy it**:

```html
<!-- RETIRED: do NOT deploy. FAQPage no longer yields rich results and may trigger GSC errors. -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Who is yourname.eth?",
    "acceptedAnswer": { "@type": "Answer", "text": "..." }
  }]
}
</script>
```

### Step 4: Get pages indexed

> ⚠️ **The Google Indexing API is NOT for identity/profile pages.** Per [Google's policy](https://developers.google.com/search/apis/indexing-api/v3/using-api), the Indexing API may only be used for pages with `JobPosting` or `BroadcastEvent` (in a `VideoObject`). In May 2025 Google reiterated it "may stop supporting unsupported content formats without notice," and misuse can get API access revoked. **For an identity/`ProfilePage` like `/proof/`, do not call the Indexing API** — submit a sitemap and, for a one-off, use Search Console → URL Inspection → "Request indexing." IndexNow (below) covers Bing/Yandex.

The API call itself, shown only for the content types Google actually allows (e.g. a `JobPosting` page):

```javascript
const { google } = require('googleapis');

async function submitToIndexingAPI(url) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/indexing']
  });

  const indexing = google.indexing({ version: 'v3', auth });

  await indexing.urlNotifications.publish({
    requestBody: { url, type: 'URL_UPDATED' }
  });
}

// Allowed: a JobPosting / BroadcastEvent page only.
await submitToIndexingAPI('https://yoursite.com/jobs/some-job-posting/');
```

## Results

Based on the **ookyet.eth** implementation:

| Metric | Before | After | How measured |
|--------|--------|-------|--------------|
| Google indexing time (per page) | 7-30 days | 24-48 hours | Google Search Console "Last crawl" timestamps |
| SERP features for `ookyet` / `ookyet.eth` | None | Position 1, Sitelinks, Image thumbnail, Image pack | Reproducible — search `ookyet` / `ookyet.eth` |
| Entity recognition in AI Overview | None | Google's AI Overview answers that ookyet "is indeed an entity," resolving the person (real name), the `ookyet.eth` ENS name, and the NFT avatar from 6-7 cross-linked sources | Reproducible — search `ookyet` or `ookyet is entity` |
| Search performance (cumulative since first indexed, Aug 2025) | — | Avg position **1.4**, CTR **11.1%** (11.8K impressions / 1.31K clicks) | Search Console → Performance (Web); ookyet.com was first indexed Aug 2025, so these are ~10 months of cumulative data |
| Rich Results Test status | N/A | 0 errors, Person + ProfilePage detected | [Google Rich Results Test](https://search.google.com/test/rich-results) |
| Cross-platform `sameAs` links | 0 | 15+ verified profiles | Manual audit of profile links in `sameAs` array |
| **Google Knowledge Graph entity node** | None (KG API returned no entity) | **Machine-generated Person node confirmed 2026-07-02** — query `ookyet` resolves uniquely to MID `/g/11z806my44` | KG Search API, reproducible ([see milestone](#milestone-knowledge-graph-entity-node-2026-07-02)) |
| Knowledge Panel (formal KP box) | Not triggered | Still not triggered — a KG entity node is the mechanical prerequisite for a KP, **not** the KP itself | Google KG API + direct SERP |

> **AI Overview entity recognition ≠ a Knowledge Panel.** Being narrated as an entity in an AI Overview (achieved above) means Google has resolved and understood the entity; a formal Knowledge Panel is a separate, black-box decision Google has not made here. (AI Overviews are generated and can vary between queries/sessions; the entity recognition above has been observed stable over an extended period.) The Knowledge Graph API exposes no "candidate"/pre-trigger state, so any "% probability of KP trigger" is an internal model estimate, not a Google metric. This project optimizes for **verifiable entity understanding**, not for forcing a KP.

### Milestone: Knowledge Graph entity node (2026-07-02)

About 11 months after first indexing (Aug 2025), the Google Knowledge Graph Search API returns a machine-generated Person node for this implementation:

```bash
curl "https://kgsearch.googleapis.com/v1/entities:search?query=ookyet&limit=10&indent=true&key=YOUR_API_KEY"
# → exactly one result: kg:/g/11z806my44 (@type: Person)
```

Why this is the outcome the architecture targets:

- **`/g/` MID = a machine-minted node** (post-Freebase), created by Google's own cross-source reconciliation. It cannot be registered or bought — only corroborated into existence. This is entity resolution, not document retrieval.
- **Zero-ambiguity resolution.** The KG holds **8 distinct Person nodes** sharing the author's real name; the query `ookyet` resolves uniquely to this one. A coined handle works as a cross-namespace disambiguation key (`handle → person`), which is exactly what a Person-first entity model is for.
- **Third-party corroboration outweighs self-declaration.** The node's canonical name is the author's real name (Qifeng Huang — see [CITATION.cff](CITATION.cff)), taken from high-authority anchors (LinkedIn, ORCID) rather than the site's self-declared `name: ookyet`. Expected and healthy: the handle stays the unique entry point; the legal name carries source authority.
- **Honest status.** The node is still sparse (no `detailedDescription`, `image`, or `url` exposed; near-zero `resultScore`), and a formal Knowledge Panel remains untriggered. Growth from here is driven by independent third-party coverage plus time — not by further markup changes.

**Post-milestone monitoring: the growth staircase.** Once a node exists, check it **weekly, not daily** — KG ingestion runs on a weeks-to-months cycle, and repeat queries within a day return byte-identical results (verified). A sparse Person node typically grows in a predictable order, so read the fields by priority:

1. **`url`** — usually first. It means Google has bound your **entity home** to the node; it is driven by the corroboration you already shipped (Person-first graph + ProfilePage + consistent `sameAs`), not by new signals.
2. **`image`** — next; drawn from the node's reconciled visual identity (a consistent avatar across sources keeps the candidate pool unambiguous).
3. **`resultScore`** rising by an order of magnitude — a precursor of display-worthiness.
4. **`detailedDescription`** — usually last, and often never for niche entities: it is largely sourced from encyclopedic references (Wikipedia/Wikidata), which are notability-gated. An empty description does **not** block the other fields.

First weekly check (2026-07-07, five days after discovery): all fields unchanged — expected, not a negative signal. Practical notes: KG Search API keys expire (renew before concluding anything from an error response), and *"the node has grown `url`"* is the point at which "Knowledge Panel plausible soon" becomes a defensible statement.

**Recovery-playbook validation (same window).** The reference site's structured-data fix (retiring `QAPage`, fixing `ProfilePage.mainEntity`; deployed Jun 28) was confirmed digested by Google on **Jul 7**: the GSC Profile page report turned **valid** (1 item, 0 invalid), indexed pages rose **4 → 6**, and 404s stayed at 0 — about **9 days** from deploy to report-level validation, with **zero further schema edits** in between. This is the "fix once, freeze, wait" discipline working as designed; re-tweaking mid-window would have reset Google's evaluation clock. (Related GSC note: **Test Live URL is read-only** — it never queues a crawl or resets anything; only *Request Indexing* sends an active signal.)

Timeline: **Aug 2025** first indexed → **Oct 2025** Dentity verification + entity markup → **Jun 2026** Person-first convergence (single Person entity; FAQ/HowTo retired) → **Jul 2, 2026** KG entity node confirmed via API → **Jul 7, 2026** GSC structured-data recovery confirmed (ProfilePage valid; indexed pages 4→6) → **Jul 8–12, 2026** corpus-supply window: the stale 2025 self-published article superseded by a [current retrospective](https://dev.to/ookyet/i-retired-my-85-knowledge-panel-probability-claim-then-google-built-the-entity-anyway-3e5o) (published Jul 8, indexed within days), first ORCID works entry mounted on the anchor (blog-post type, public-API-verified) → **Jul 16–18, 2026** second corpus pillar: the CSS migration pattern behind the reference site released as a standalone library on GitHub and npm (the package page's author field is the identity's first *open-web* real-name+handle co-occurrence surface outside login-walled platforms); both repositories mounted as ORCID **software** works; the combined-query confidence ladder measured — real-name+handle queries score 800× the bare handle on the same node, unique at every rung.

### The control group: three ways entities fail

The same API that confirmed this project's entity node returns nothing — or worse — for identities with far larger audiences (measured 2026-07-19/20; cases deliberately anonymized: the point is the pattern, not the people).

- **The famous developer.** An open-source author with an order of magnitude more stars and followers than this project's reference identity: the KG returns *empty* for their handle. Scattered prestige — stars, follows, walled-garden activity — is not a form the graph ingests. **The Knowledge Graph doesn't count stars; it reads structure.**
- **The generic brand word.** A brand named after a common English phrase: its query returns unrelated songs and legacy entities. A name that collides with natural language never routes uniquely. The coined-word advantage is structural and permanent.
- **The pseudonymous celebrity.** A globally known Web3-era creator — mainstream press coverage, seven-figure sales history — returns *empty* for both the real-name and handle queries, while the alias is crushed by an entrenched legacy entity of the same name; what may remain of an earlier node is a stripped, near-scoreless shell. This is the deepest failure mode: **fame without Person reconciliation does not persist.** A pseudonymous identity with no real-name binding gives Google no way to confirm *which human this is*. A panel granted during a hype cycle can ride shallow query-level mapping without a reconciled entity underneath — and shallow panels are the first casualties of a recalibration. Reconciled entities survive years of dormancy; unreconciled fame does not survive one re-evaluation. Note also the conversion trap: this creator still posts weekly, but activity inside login-walled platforms is high-volume, zero-conversion supply — the graph never sees it. Postscript, measured a day later: the entrenched same-alias entity turns out to be a modestly known film director whose **full panel** is fed by the movies vertical (IMDb) — API-sparse fields, complete panel. Feed membership beat world fame, and a displayed panel re-wins the alias with every impression, making the collision permanent.

The sequence this playbook encodes is the inverse: **reconciliation before display.** Confirm the entity first (Person-first graph, real-name binding on authority anchors, unique routing), and a panel — if it comes — sits on owned foundations rather than a news cycle. And once node fields appear, supply does not stop; it shifts from launch fuel to life support.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│          Google Knowledge Graph                 │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │   Entity: ookyet (alt: ookyet.eth)       │  │
│  │   Type: Person                           │  │
│  │   Verification: Dentity ✓                │  │
│  │   KG node: /g/11z806my44 (2026-07-02)    │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                        ▲
                        │
                        │ 5-Layer Signals
                        │
┌─────────────────────────────────────────────────┐
│              ookyet.eth Website                  │
│                                                  │
│  Layer 1: Indexing API ──────────────────────┐  │
│  Layer 2: Schema.org @graph ─────────────────┤  │
│  Layer 3: Dentity Unique Human ──────────────┤  │
│  Layer 4: Entity Graph Linkage ──────────────┤  │
│  Layer 5: Cross-Platform sameAs linkage ─────┘  │
│                                                  │
│  Result: KG Person node minted on 2026-07-02     │
│  (KP triggering is Google's black-box decision)  │
└─────────────────────────────────────────────────┘
```

## Key Technologies

- **ENS (Ethereum Name Service)** - Blockchain naming system
- **Dentity** - Unique Human KYC verification
- **Schema.org** - Structured data standard
- **Google Indexing API** - Direct indexing submission
- **IndexNow** - Multi-search-engine indexing protocol

## Community

- Issues: actionable, verifiable suggestions only (observability/privacy/minimization). For ideas, use [Discussions](https://github.com/ookyet/web3-identity-seo/discussions).
- Labels: `proposal:observability`, `privacy-reviewed`, `wontfix:ranking`.

## Use Cases

### Individual identity
- Publish structured Person/Organization markup tied to an ENS name
- Express on-chain ownership and optional third-party verification in `identifier` / `hasCredential`
- Link a canonical website and social profiles via `sameAs`

### Web3 / Web2 interoperability
- Document a repeatable pattern for aligning on-chain names with a public site
- Provide cross-source consistency signals search engines can parse

### Search engines
- Machine-readable entity graphs (`@graph`, ProfilePage, Person)
- Optional proof-of-personhood credentials where applicable
- Explicit cross-platform linkage for entity disambiguation

## Case Study: ookyet.eth

The complete implementation demonstrates:

1. **ENS Ownership Proof**
   - Domain: ookyet.eth
   - Wallet: 0xC5F1c8b15A658B1b36A0CF2c64b45101568B17fF
   - On-chain since 2023

2. **Dentity Verification**
   - Unique Human KYC: ✅ 10/10 checks
   - Government ID: ✅ Verified
   - Biometric Liveness: ✅ Verified
   - Anti-Sybil Database: ✅ Unique

3. **NFT Avatar Integration**
   - Lil Ghost #761 (verifiable on-chain)
   - Consistent visual identity
   - OpenSea ownership proof

4. **Search indexing and markup**
   - Schema.org complete @graph (Person-first; FAQ/HowTo/QAPage not emitted)
   - ProfilePage with `mainEntity` → Person on the about page
   - Consistent cross-platform `sameAs` + verifiable `identifier`/`hasCredential`

**Full Technical Breakdown**: https://ookyet.com/blog/identity-through-ens/
**Proof hub**: https://ookyet.com/proof/

## Getting Started

### Prerequisites
- ENS domain (register at app.ens.domains)
- Dentity verification (dentity.com)
- Website/Hugo site
- Google Cloud service account

### Quick Start

The fastest path is to fork this repository and adapt the reference schema to your own identity:

1. **Fork this repo** — you'll be editing the schema examples and scripts to match your identity, so start from your own copy.
2. **Replace the placeholder values** in [`examples/schema-person.json`](examples/schema-person.json): your domain (`yoursite.com`), your ENS name (`yourname.eth`), and your handle (`@yourhandle`).
3. **Serve the JSON-LD server-side** as a single `@graph` — one source of truth, no client-side injection ([implementation guide](docs/implementation-guide.md)).
4. **Verify, then submit**: pass the [Rich Results Test](https://search.google.com/test/rich-results) with zero errors, then accelerate indexing with the Indexing API and IndexNow scripts in [`scripts/`](scripts/).
5. **Bind your off-site profiles** — LinkedIn, ORCID, GitHub — to the same name/handle pair (guide, Step 4.3).

### Advanced Setup
- ProfilePage (`mainEntity` → Person) on the about page
- Person-first entity model (name = person/handle; ENS in `alternateName` + `identifier`)
- Cross-platform unification and off-site co-occurrence (guide, Step 4.3)
- Image structured data for the Google Images surface (guide, Advanced Optimization)
- Monitoring with kg-audit.sh

## Resources

- **Reference example**: [ookyet.eth](https://ookyet.com/proof/)
- **Technical Blog**: [Identity Through ENS](https://ookyet.com/blog/identity-through-ens/)
- **ENS Domains**: [app.ens.domains](https://app.ens.domains)
- **Dentity KYC**: [dentity.com](https://dentity.com)
- **Google Indexing API**: [Google Documentation](https://developers.google.com/search/apis/indexing-api/v3/quickstart)

## Contributing

Improvements welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for scope, process, and issue policy.

Git commit guard setup:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/commit-msg scripts/commit-message-guard.sh
```

## License

- **Code** — `scripts/`, `.github/`, and the copy-paste JSON-LD templates in `examples/`: [MIT](LICENSE). Drop them into your own site freely; no attribution required.
- **Documentation** — README, CHANGELOG, and everything under `docs/`: [CC BY 4.0](LICENSE-docs). Share and adapt freely, with credit to **Qifeng Huang (ookyet)** and a link back to this repository.

## Disclaimer

This project is independent documentation. It is not affiliated with, endorsed by, or
sponsored by Google, the Ethereum Name Service (ENS), Dentity, Microsoft, or Yandex; all
trademarks and product names are the property of their respective owners. Search result
appearance — including Knowledge Panels — is determined solely by the search engines and
is not guaranteed by anything in this repository. Nothing here is financial, legal, or
investment advice.

---

Reference implementation: [ookyet.eth](https://ookyet.com/proof/).
