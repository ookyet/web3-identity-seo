# Web3 Identity SEO Implementation Guide

Step-by-step guide to implementing structured data and indexing for ENS identity pages.

---

Privacy: see the repository’s [Privacy Notice](../PRIVACY.md). Submission utilities must follow search engine policies and do not process personal data.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **ENS domain** - Register at [app.ens.domains](https://app.ens.domains)
- ✅ **Website/Hugo site** - Your personal domain (e.g., yoursite.com)
- ✅ **Dentity verification** (recommended) - [dentity.com](https://dentity.com)
- ✅ **Google Cloud account** - For Indexing API
- ✅ **Google Search Console** - Verified ownership of your site

---

## Phase 1: Identity Verification (Day 1)

### Step 1.1: ENS Domain Setup

```bash
1. Visit https://app.ens.domains
2. Connect wallet (MetaMask/WalletConnect)
3. Search for desired name: yourname.eth
4. Register and pay gas fees
5. Set primary ENS name (reverse resolution)
6. Add records:
   - Avatar: IPFS hash or HTTPS URL
   - URL: https://yoursite.com
   - Twitter: @yourusername
   - GitHub: yourusername
```

**Verification**:
```bash
# Check ENS resolves correctly
curl https://metadata.ens.domains/mainnet/0x[YOUR_ADDRESS]
```

### Step 1.2: Dentity Unique Human Verification

```bash
1. Visit https://dentity.com
2. Connect wallet with ENS domain
3. Complete KYC verification:
   - Government ID upload
   - Biometric liveness check
   - Phone verification
   - Email verification
   - Social media linking
4. Achieve "Unique Human" status (10/10 checks)
5. Save verification URL: https://dentity.com/yourname.eth
```

**Optional but recommended**: Dentity adds a third-party `hasCredential` you can include in Person markup. Google does not publish how it weights such signals.

### Step 1.3: NFT Avatar (Optional but Recommended)

```bash
1. Choose an NFT you own (OpenSea, Foundation, etc.)
2. Set as ENS avatar:
   - eip155:1/erc721:0xCONTRACT/TOKENID
3. Verify avatar displays in ENS app
4. This provides visual identity + on-chain ownership proof
```

---

## Phase 2: Schema.org Implementation (Day 2-3)

### Step 2.1: Person Entity Markup

Create `layouts/partials/schema-person.html` (Hugo) or inline in `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://yoursite.com/#Author",
  "name": "Your Name",
  "alternateName": ["yourname.eth", "@yourhandle"],
  "url": "https://yoursite.com/",
  "image": "https://yoursite.com/images/avatar.png",
  "sameAs": [
    "https://twitter.com/yourusername",
    "https://github.com/yourusername",
    "https://app.ens.domains/name/yourname.eth"
  ],
  "identifier": [
    {
      "@type": "PropertyValue",
      "propertyID": "ens",
      "value": "yourname.eth"
    }
  ],
  "hasCredential": [{
    "@type": "EducationalOccupationalCredential",
    "name": "Dentity Verified Human",
    "url": "https://dentity.com/yourname.eth"
  }]
}
</script>
```

**Key elements**:
- `@id`: Unique entity identifier
- `hasCredential`: Dentity verification link
- `sameAs`: cross-source identity links — quality matters more than count (see note)

> 🔗 **`sameAs` quality > quantity.** Google's Knowledge Graph reconciles entities against authoritative identifier sources, so think in two tiers rather than stacking profiles:
> - **Consistency anchors** — your real, active profiles (X, Instagram, GitHub, ENS, on-chain proofs). Keep name / handle / avatar identical across them; that consistency is the trust signal, not the number.
> - **High-authority KG anchors** — sources Google's KG actively reconciles against: **Wikidata, Wikipedia, LinkedIn, ORCID, Crunchbase**. These carry the most weight.
>   - **Wikidata / Wikipedia are notability-gated** — a self-created item with no independent sources can be deleted, which is a *negative* signal. Don't force them.
>   - **LinkedIn and ORCID are attainable by anyone** (ORCID is free and region-neutral). For an individual / niche entity these are the realistic high-authority anchors. Add them to `sameAs`, put ORCID in `identifier` too (`propertyID: orcid`), and make sure the anchor links back to your site (reciprocal linking strengthens reconciliation).
> - **Only add real anchors — don't stack.** A profile belongs in `sameAs` only if it is **active, identity-consistent, and reachable/indexed**. A ghost or empty profile adds nothing and can dilute (an active Threads profile: yes; an abandoned page with 0 followers: no).
> - **`sameAs` ≠ `subjectOf`.** `sameAs` is only for the entity's *own* profiles/home pages. A *third party writing about you* (e.g. an organization's post mentioning you) is **not** `sameAs` — that's external corroboration: use `subjectOf`, or simply let Google index it. Putting third-party mentions in `sameAs` is semantically wrong and can confuse entity reconciliation.

> ⚠️ **Avoid non-standard `propertyID` values** (e.g., a fictional `knowledge_graph_eligible` flag). Google does not recognize undocumented properties and its anti-spam systems may down-weight pages that fabricate signals. Stick to standard Schema.org vocabulary plus widely recognized identifier types (`ens`, `wikidata`, etc.).

### Step 2.2: ProfilePage Declaration

Add `ProfilePage` declaration:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://yoursite.com/#ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://yoursite.com/#Author",
    "name": "Your Name"
  }
}
</script>
```

This declares that the page's primary subject is a Person entity (`ProfilePage.mainEntity`).

> ⚠️ **`mainEntity` must be a typed, named node — not a bare `@id` reference.** A bare
> `{"@id": "...#Author"}` can trip Google Search Console with *"Invalid object type for
> field mainEntity"* (observed in the reference implementation, Jun 2026). Carry
> `@type` + `name` explicitly; using the same `@id` as your canonical Person node still
> merges cleanly in the graph.

### Step 2.3: FAQ — RETIRED (do not emit `FAQPage`)

> Google limited FAQ rich results to authoritative government/health sites in Aug
> 2023, then fully removed the feature from Search on May 7, 2026 (FAQ structured-data
> docs removed June 15, 2026). Do **not** emit `FAQPage` — it no longer yields a rich result
> and can surface as an invalid item / "Q&A" issue in Search Console. Keep FAQ
> content as **visible page copy**. (`HowTo` likewise retired Sep 2023; `QAPage`
> only for a single user-submitted Q&A page.)

**Validation** (against the Person + ProfilePage markup from the steps above):
```bash
# Test with Google Rich Results Test
https://search.google.com/test/rich-results?url=https://yoursite.com/
```

Expected results:
- ✅ Person entity detected
- ✅ ProfilePage detected (`mainEntity` → Person)
- ✅ 0 errors, 0 warnings (no FAQPage / HowTo / QAPage)

### Step 2.4: Entity-graph hygiene (hard-won rules)

Seven rules from the reference implementation's Search Console recovery and
cross-surface audit (Jun–Jul 2026). Each one was learned the hard way — by triggering
a real GSC error, shipping markup Google ignores, or letting the markup drift from
what the page actually shows:

1. **One page entity per URL — and no synthetic "SEO intent" nodes.** Emit exactly one
   page-level entity (WebPage / ProfilePage / CollectionPage) per URL, and never mint
   nodes that describe your *ambitions* rather than the page (e.g. a WebPage named
   "Knowledge Panel candidate"). Google's policy requires markup to reflect actual page
   content; aspirational nodes add a duplicate page entity, restate facts already on
   your Person node, and read as spam. The reference implementation shipped one and
   later retired it.

2. **Keep `Organization` a thin publisher/brand shell.** If you emit an Organization
   (as `publisher`/`brand`), give it only `name` / `url` / `logo` / `founder`. Identity
   anchors — `sameAs`, `identifier`, credentials — belong to the **Person** exclusively.
   Duplicating them on the Organization makes Google reconcile two competing entities
   with the same evidence (Person↔Org ambiguity), which weakens both.

3. **Don't emit `WebSite.potentialAction` (`SearchAction`) unless a real search page
   exists.** Google retired the Sitelinks Search Box in Oct 2024 — the markup is inert.
   Worse, if your "search" is a client-side modal and `/search?q=` returns 404 (common
   on static sites), the markup points at a nonexistent page and violates the
   markup-must-reflect-the-page policy. The reference implementation shipped exactly
   this bug and removed the node in Jul 2026.

4. **Respect property domains: `mentions` is CreativeWork-only.** Third-party references
   feel like they belong on your Person node, but `mentions` is only valid on
   CreativeWork types (WebPage, Article, ProfilePage). On a Person node it is a domain
   violation; carry those references via `identifier`, `sameAs`, `hasCredential`, or
   `subjectOf` instead.

5. **Never emit structured data for content that does not exist yet.** A "planned
   coverage" section is legitimate visible copy, but marking it up asserts publications
   Google can verify do not exist — dead URLs carrying past `datePublished` values. On
   an identity site this is worse than a technical error: it fabricates precisely the
   notability evidence the Knowledge Graph weighs most, and it is provably false. Gate
   JSON-LD emission on publication status and let the visible layer carry the "planned"
   label alone. The reference implementation shipped three such phantom articles and
   retired them in Jul 2026.

6. **Keep every visible identity surface consistent with the graph.** Google's Article
   guidance expects the author name in markup to match the visible byline. A byline
   reading `yourname.eth` while `Person.name`, `<meta name="author">`, and the RSS feed
   all say `yourname` re-introduces, at the presentation layer, the exact naming split
   you resolved in the graph. Audit bylines, footer copyright, and page headings as one
   controlled vocabulary: the markup and the page must tell the same story.

7. **If you emit `speakable`, its CSS selectors must exist in the rendered DOM.**
   Speakable is a news-oriented beta with no rich-result upside for identity sites. If
   you keep it anyway, treat the selector list as a contract with the template:
   generate it under the same condition that renders the elements, so a selector can
   never point at nothing. A dead selector is the markup-must-reflect-the-page
   violation in miniature.

> 💡 **Serve JSON-LD from one place, server-side.** Google can process JS-generated
> structured data, but a client-side injector that duplicates or drifts from your
> server-rendered graph is how you get *duplicate `@id` collisions* and stale nodes.
> The reference implementation runs a strict "SSR is the only source of truth" rule —
> its client script never injects JSON-LD.

---

## Phase 3: Indexing Acceleration (Day 3-4)

### Step 3.1: Google Indexing API Setup

**3.1.1: Create Google Cloud Project**
```bash
1. Visit https://console.cloud.google.com
2. Create new project: "web3-identity-seo"
3. Enable "Indexing API"
   - Search "Indexing API" in API Library
   - Click "Enable"
```

**3.1.2: Create Service Account**
```bash
1. Navigate to IAM & Admin > Service Accounts
2. Create service account:
   - Name: indexing-api-bot
   - Role: (none needed at project level)
3. Create JSON key:
   - Click on service account
   - Keys > Add Key > Create new key
   - Choose JSON
   - Download and save as service-account.json
```

**3.1.3: Add to Search Console**
```bash
1. Copy service account email:
   indexing-api-bot@PROJECT_ID.iam.gserviceaccount.com
2. Visit https://search.google.com/search-console
3. Settings > Users and permissions
4. Add user with email above
5. Set permission: "Owner"
```

**3.1.4: Submit URLs**
```bash
# Use the example script
npm install googleapis
node examples/indexing-api.js submit
```

**Expected timeline**:
- Traditional crawl: 7-30 days
- Indexing API: 24-48 hours ✅

Compliance note: Google’s Indexing API may **only** be used for pages with `JobPosting` or `BroadcastEvent` (in a `VideoObject`) — see [Google's policy](https://developers.google.com/search/apis/indexing-api/v3/using-api). In May 2025 Google reiterated it may stop supporting other formats without notice, and misuse can get API access revoked. Identity/`ProfilePage` URLs are **not** eligible: use sitemaps + Search Console URL Inspection ("Request indexing") instead. The 24-48h timeline above applies to eligible content types.

⚖️ Compliance checklist
- Confirm your content type is eligible for Indexing API; otherwise use sitemaps/URL Inspection.
- Do not submit private or user-specific URLs; submit only public pages you own.
- Respect daily quotas; add delays between submissions.

### Step 3.2: IndexNow (Bing/Yandex)

**Generate API Key**:
```bash
# Create random key
openssl rand -hex 32 > indexnow-key.txt

# Example: 3f8a7b2c9d1e4f6a8b2c9d1e4f6a8b2c9d1e4f6a8b2c9d1e4f6a8b2c9d1e
```

**Create key file**:
```bash
# Place in static/.well-known/
echo "YOUR_KEY_HERE" > static/.well-known/indexnow-key.txt
```

**Submit URLs**:
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "yoursite.com",
    "key": "YOUR_KEY_HERE",
    "keyLocation": "https://yoursite.com/.well-known/indexnow-key.txt",
    "urlList": [
      "https://yoursite.com/",
      "https://yoursite.com/proof/"
    ]
  }'
```

---

## Phase 4: Content & External Authority (Week 2)

### Step 4.1: Create Identity Proof Hub

Create dedicated page (`/proof/` or `/about/`):

```markdown
---
title: "Identity Proof Hub"
description: "Complete verifiable identity proof for yourname.eth"
---

## Verifiable Web3 Identity

### ENS Ownership Proof
- Domain: yourname.eth
- Wallet: 0xYourAddress
- Owned since: [year]
- Verify: [ENS App link]

### Dentity Verification
- Status: Unique Human Verified
- Checks: 10/10 passed
- Verification: [Dentity profile link]

### Cross-Platform Consistency
[List of 10+ platforms with links]
```

### Step 4.2: External Authority Building

**GitHub Repository**:
```bash
1. Create repo: web3-identity-seo
2. Add README with your implementation
3. Topics: web3, ens, seo, google, knowledge-graph
4. License: MIT
```

**Dev.to Article**:
```bash
1. Write tutorial: "Making My ENS Domain Google-Visible"
2. Include code examples
3. Link to GitHub repo
4. Canonical URL: yoursite.com/blog/...
```

**Product Hunt** (optional):
```bash
1. Position as "Web3 Identity Verification Tool"
2. Prepare visual assets
3. Launch Tuesday/Wednesday 12:01 AM PST
```

### Step 4.3: Off-site co-occurrence — bind the real name to the handle

Once the on-site graph is clean, the highest-leverage external work is making your
real name and your handle co-occur on every authority surface Google already
reconciles against. The Knowledge Graph selects an entity's canonical name from those
sources — not from your self-declared markup — so each profile should let Google
complete the triangle *real name ↔ handle ↔ your domain* on its own.

**The LinkedIn "at yourname.eth" trap.** LinkedIn derives the default headline from
your current position, so an Experience entry whose *company* field is `yourname.eth`
renders as "Founder at yourname.eth" — an employment phrase that tells Google
`yourname.eth` is an organization. That quietly re-creates, from off-site, the
Person↔Org ambiguity Rule 2 eliminates on-site. The fix costs nothing:

- Set the company field to your website domain (or Self-employed) — never the ENS name.
- Write a custom headline that carries the bare handle, e.g.
  `Digital Creator (yourhandle) — anchoring a verifiable digital identity · ENS yourname.eth · yoursite.com`.
  Avoid "Identity Architect"-style titles: in hiring contexts they pattern-match to
  enterprise IAM/SSO roles, not personal digital identity.
- Open the About section with the same one-sentence identity statement your site uses.
  Verbatim reuse across independent domains is corroboration, not duplication.

**ORCID — the structured alias field.** ORCID is a high-authority identity registry
anyone can join, and its *Also known as* field is machine-readable: mirror your
`Person.alternateName` there (both the handle and the ENS name). Add a one-sentence
biography in your controlled vocabulary, plus researcher URLs for your site, proof
page, and GitHub. Two details silently void the work if missed:

- Every ORCID field has its own visibility toggle — set it to **Everyone**, or the
  public API (and Google) sees nothing.
- Name URL entries after their destinations (`yoursite.com`, not "My site").

**The template to replicate everywhere**: `Real Name (@handle)` — Instagram's display
format is the ideal shape. Verify what actually reached the public record through the
ORCID public API rather than trusting the edit form:

```bash
curl -s -H "Accept: application/json" \
  "https://pub.orcid.org/v3.0/YOUR-ORCID-ID/person" | jq '."other-names"'
```

---

## Phase 5: Monitoring & Validation (Ongoing)

### Step 5.1: Knowledge Graph Audit

Use the monitoring script:
```bash
# Copy from this repo
cp scripts/kg-audit.sh ~/yourproject/
chmod +x kg-audit.sh

# Run weekly (daily adds nothing — KG ingestion is not real-time;
# same-day repeat queries return identical results)
./kg-audit.sh
```

**Key metrics to track** (local heuristics in `kg-audit.sh` / `kg-monitor.js` — **not Google metrics**):
- `TRIGGER_SCORE` / signal-completeness bands (relative checklist only)
- Cross-source consistency (`sameAs` + display name / avatar alignment)
- External validation count (minimum 3 independent sources recommended)
- Rich Results Test: 0 errors on canonical Person + ProfilePage

See [scripts/README.md](../scripts/README.md) for heuristic band definitions and disclaimers.

### Step 5.2: Google Search Console

Monitor weekly:
```bash
1. Coverage report - ensure all pages indexed
2. Performance - search queries for "yourname.eth"
3. Enhancements - Rich Results status
4. Links - external backlinks count
```

### Step 5.3: Knowledge Graph API Check

```bash
curl "https://kgsearch.googleapis.com/v1/entities:search?query=yourname.eth&key=YOUR_API_KEY&limit=1"
```

**KG API note**: Empty `itemListElement` is normal and does not distinguish "not indexed as an entity" from "signals present but no KP." Do not treat API responses as a KP probability. API keys **expire** — renew before concluding anything from an error response.

**Once a node exists — read its growth in priority order** (the "staircase"; see the [README milestone section](../README.md#milestone-knowledge-graph-entity-node-2026-07-02) for the field-tested rationale):

1. `url` appearing = Google has bound your **entity home** to the node (first milestone; driven by corroboration you already shipped).
2. `image` appearing = the entity pipeline picked a canonical photo (a consistent avatar across sources keeps this unambiguous).
3. `resultScore` rising an order of magnitude = display-confidence precursor.
4. `detailedDescription` = encyclopedic-source gated (Wikipedia/Wikidata); often stays empty for niche entities and does **not** block the others.

No change week over week is the normal case and not a negative signal. While waiting, the only lever that moves the corpus is **authored content supply** (posts and articles under your byline). Do not touch a stable entity graph to "speed things up" — schema edits reset Google's re-evaluation clock.

---

## Troubleshooting

See [troubleshooting.md](./troubleshooting.md) for common issues and solutions.

---

## Success Checklist

**Technical Infrastructure** (Week 1):
- [ ] ENS domain registered and configured
- [ ] Dentity Unique Human verification complete
- [ ] Schema.org Person entity implemented
- [ ] ProfilePage declaration added
- [ ] FAQ Schema created
- [ ] Google Indexing API configured and submitted
- [ ] IndexNow configured for Bing/Yandex
 - [ ] ⚖️ Compliance verified for Indexing API usage (or fallback to sitemaps)

**Content & Authority** (Week 2-3):
- [ ] Identity Proof Hub page created
- [ ] 3+ blog articles published
- [ ] GitHub repository created and configured
- [ ] Dev.to article published
- [ ] Cross-platform links updated (10+ platforms)
- [ ] External mentions collected (3+ sources)

**Validation** (Ongoing):
- [ ] Google Rich Results Test: 0 errors
- [ ] All pages indexed in Search Console
- [ ] External backlinks verified
- [ ] Daily KG audit running
- [ ] Cross-source consistency maintained

**Implementation phases** (your pace may vary):
- Week 1: Technical setup complete
- Week 2: Content published
- Week 3+: External corroboration and stability (no KP timeline — see FAQ)

---

## Advanced Optimization

### Cross-Platform Unification
Ensure consistent identity across:
1. ENS App profile
2. GitHub profile
3. Twitter bio
4. LinkedIn profile *(high-authority KG anchor — attainable by anyone)*
5. ORCID iD *(high-authority KG anchor — free, region-neutral; also add as `identifier` propertyID `orcid`)*
6. Personal website
7. Dentity profile
8. OpenSea (if NFT avatar)
9. Mirror.xyz / Paragraph
10. Farcaster
11. Lens Protocol

**Consistency requirements**:
- Same display name
- Same avatar image
- Same bio/description
- Links to other platforms
- ENS domain mentioned

### Entity Disambiguation
If your name is common, add disambiguating properties:
```json
{
  "@type": "Person",
  "name": "Your Name",
  "alternateName": "yourname.eth",
  "disambiguatingDescription": "Web3 developer specializing in ENS and decentralized identity"
}
```

### Image Structured Data (the Google Images surface)

Identity queries increasingly resolve on the Images tab, and once an entity node
exists, avatars, logos, and social cards get indexed fast. Google's *image metadata*
feature (`ImageObject` with `creator`, `creditText`, `copyrightNotice`, `license`) is
the only supported structured-data feature that operates on that surface: it binds
your images to your Person node and earns a creator credit in the Images viewer.
Lower priority than the entity graph itself — schedule it for your next planned markup
change rather than breaking a stable graph's freeze window for it.

---

## Next Steps

After implementation:
1. Wait 2-4 weeks for Google indexing
2. Monitor daily with kg-audit.sh
3. Maintain external authority (don't delete articles)
4. Keep cross-platform consistency
5. Publish regular content (1+ per month)

Knowledge Panel display remains Google's non-public decision. Treat signal completeness (see FAQ methodology note) as a checklist, not a timeline or guarantee.

For support and questions, open an issue in the GitHub repository.
