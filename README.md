# Web3 Identity SEO: Structured Data for ENS Identity Pages

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Live Demo](https://img.shields.io/badge/demo-ookyet.eth-blue)](https://ookyet.com/proof/)
  [![Google SERP](https://img.shields.io/badge/Google%20SERP-Position%201-success)](https://www.google.com/search?q=ookyet)
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
| Knowledge Panel (formal KP box) | Not triggered | Still not triggered — AI Overview entity recognition is **not** the same as a formal Knowledge Panel | Google KG API + direct SERP |

> **AI Overview entity recognition ≠ a Knowledge Panel.** Being narrated as an entity in an AI Overview (achieved above) means Google has resolved and understood the entity; a formal Knowledge Panel is a separate, black-box decision Google has not made here. (AI Overviews are generated and can vary between queries/sessions; the entity recognition above has been observed stable over an extended period.) The Knowledge Graph API exposes no "candidate"/pre-trigger state, so any "% probability of KP trigger" is an internal model estimate, not a Google metric. This project optimizes for **verifiable entity understanding**, not for forcing a KP.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│          Google Knowledge Graph                 │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │   Entity: ookyet (alt: ookyet.eth)       │  │
│  │   Type: Person                           │  │
│  │   Verification: Dentity ✓                │  │
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
│  Result: indexed, consistent entity signals      │
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
1. Clone this architecture
2. Implement Schema.org markup
3. Add Dentity verification
4. Configure Indexing API
5. Submit to Google

### Advanced Setup
- ProfilePage (`mainEntity` → Person) on the about page
- Person-first entity model (name = person/handle; ENS in `alternateName` + `identifier`)
- Cross-platform unification
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

MIT License.

---

Reference implementation: [ookyet.eth](https://ookyet.com/proof/).
