# Frequently Asked Questions

Common questions about implementing structured data and indexing for ENS identity pages.

---

Privacy: see the [Privacy Notice](../PRIVACY.md). Use of submission utilities must follow search engine policies.

## General Questions

### What is this project?

An open-source architecture documenting structured data, verification, and indexing patterns for ENS identity pages. Knowledge Panel display is determined by Google and is not guaranteed by this project.

### Why do I need this?

ENS domains like `vitalik.eth` or `yourname.eth` often lack structured entity markup on an associated website, so they may not appear as named entities in web search. This project documents repeatable patterns—Schema.org markup, optional verification credentials, and indexing submission—to improve parseability and discoverability.

### How long does implementation take?

**Technical setup**: 1-2 days
**Content creation**: 3-5 days
**External corroboration**: ongoing (typically weeks to months)
**Knowledge Panel**: no reliable timeline — Google's non-public decision; not guaranteed by this project

The technical implementation is fast. Most ongoing work is external validation (GitHub, Dev.to, cross-source consistency).

### Do I need coding knowledge?

Basic HTML/JSON knowledge helpful but not required. If you use Hugo or similar static site generator, you can copy-paste the provided examples. The Schema.org markup is just JSON embedded in `<script>` tags.

### How much does it cost?

**Free components**:
- ENS domain registration: ~$5-20/year (gas fees vary)
- Hugo/static site hosting: Free (Netlify, Vercel, GitHub Pages)
- Schema.org markup: Free
- GitHub, Dev.to, Medium: Free

**Optional paid**:
- Dentity verification: ~$30-50 one-time
- Custom domain: ~$10-15/year
- Google Cloud (Indexing API): Free tier sufficient

**Total minimum**: ~$50-100 one-time + ~$15/year

---

## Technical Questions

### What is Schema.org and why is it important?

Schema.org is a structured data standard created by Google, Microsoft, Yahoo, and Yandex. It tells search engines "this page is about a Person named X with these properties."

Without Schema.org, Google sees your site as unstructured text. With it, search engines can parse a typed entity (Person/Organization) with explicit properties.

### What is the `knowledge_graph_eligible` flag?

**Short answer: it isn't real — don't use it.**

Earlier versions of this guide showed a `PropertyValue` with `propertyID: "knowledge_graph_eligible"` as if it were a recognized signal. It is not. Google has never published or acknowledged such a property, and its anti-spam systems can interpret fabricated identifiers as performative SEO — a negative signal rather than a positive one.

```json
// ❌ Don't do this — non-standard, no documented effect, possible spam signal
"identifier": [{
  "@type": "PropertyValue",
  "propertyID": "knowledge_graph_eligible",
  "value": "verified_entity"
}]
```

Use standard Schema.org vocabulary instead. For Web3 identity, real, useful identifiers include:

```json
"identifier": [{
  "@type": "PropertyValue",
  "propertyID": "ens",
  "value": "yourname.eth"
}]
```

Knowledge Panel eligibility comes from genuine signals — entity disambiguation, cross-platform consistency, external validation, structured data correctness — not from declaring eligibility yourself.

### Do I need Dentity verification?

**Optional** third-party verification. It is not required to deploy Schema.org markup or submit URLs for indexing.

**With Dentity** (Unique Human KYC):
- Adds a verifiable `hasCredential` block to your entity markup
- Documents identity verification from a third-party provider
- May reduce ambiguity when search systems evaluate person entities

**Without Dentity**:
- You can still publish Person markup, `sameAs` links, and ENS identifiers
- Google does not publish how it weights third-party KYC credentials

See [What's the success rate for getting a Knowledge Panel?](#whats-the-success-rate-for-getting-a-knowledge-panel) for a relative ranking of signal completeness, with caveats in the methodology note there.

### Can I use this without ENS?

The architecture works for any identity, but ENS provides on-chain ownership proof and a portable identifier you can express in `identifier` and `sameAs`.

### What's the difference between IndexNow and Indexing API?

**Google Indexing API**:
- Google-specific
- 24-48 hour indexing
- 200 URLs/day limit
- Requires Search Console ownership

**IndexNow**:
- Microsoft (Bing) and Yandex
- Near-instant notification
- No hard limit
- Simpler setup

Use both where applicable. Indexing API may speed Google crawl/indexing for eligible URL types; IndexNow notifies Bing/Yandex. Neither guarantees Knowledge Panel display.

Compliance note: Google’s Indexing API is intended for specific content types (e.g., JobPosting, live streams). For general pages, prefer sitemaps and normal crawling. Use responsibly and follow Google policies.

### How do I know if it's working?

**Immediate checks** (Day 1-7):
1. Google Rich Results Test shows Person entity ✅
2. Search Console shows pages indexed ✅
3. Dentity profile shows 10/10 verification ✅

**Medium-term** (Week 2-4):
1. `site:yoursite.com yourname.eth` shows your pages
2. External articles (GitHub, Dev.to) indexed
3. Search Console shows impressions for "yourname.eth"

**Long-term** (Week 4-8):
1. Knowledge Graph API returns your entity
2. Knowledge Panel appears for "yourname.eth" search
3. Rich Results (FAQ, Person) appear in SERP

Use the `kg-audit.sh` script for daily monitoring.

---

## Implementation Questions

### Where should I host my site?

**Recommended platforms**:
- **Netlify** - Free tier, Hugo support, easy DNS
- **Vercel** - Free tier, fast deployment
- **GitHub Pages** - Free, simple for static sites
- **Cloudflare Pages** - Free tier, excellent performance

All support custom domains and HTTPS (required for Schema.org).

### Do I need a custom domain or can I use ENS subdomain?

**Custom domain highly recommended** (yourname.com):
- Better Google Search Console integration
- Easier indexing
- Traditional web compatibility
- Can point ENS to it

**ENS-only** (yourname.eth.link):
- Harder for Google to index
- Limited Search Console features
- May not qualify for Knowledge Panel

Best: Own both and link them bidirectionally.

### How do I handle multiple subdomains or site sections?

Use **one Person entity** as the primary subject across your web presence.

**Recommended pattern**

- **`name`**: your person/handle (not the ENS domain)
- **`alternateName` / `identifier`**: include your primary ENS name
- **`url`**: your canonical site root (or an array of official site URLs you control)
- **One `ProfilePage`** on the canonical about page with `mainEntity` pointing to that Person `@id`
- **Section or subdomain pages** (e.g. `/work/`, `/art/`, or `work.example.com`): use page-level `WebPage` / `CollectionPage` markup; do **not** create separate Person entities for each section

**Avoid**

- A fictional `knowledge_graph_eligible` property — removed from this guide in v3.0.0; Google does not recognize it
- Treating `kg-monitor.js` / `kg-audit.sh` percentages as Google metrics — they are local heuristics for signal completeness only
- Duplicate or near-duplicate copy across sections; fix Search Console duplicate-content warnings before expanding markup
- Bulk Indexing API submission of thin section landing pages; prefer sitemap + normal crawl for general content

**Dentity**: verification is tied to the wallet/ENS you verified. It does not automatically cover every subdomain — reuse the same `hasCredential` URL on pages that represent the same person.

**`sameAs`**: keep one consistent set of profile links on the canonical Person entity. Section-specific pages can link back to the canonical about page; avoid divergent identity signals across subdomains.

Related discussion: [Issue #8](https://github.com/ookyet/web3-identity-seo/issues/8).

### How many external sources do I need?

**Minimum**: 3 independent sources with average Domain Authority (DA) ≥ 70

**Recommended**: 5-6 independent sources for stronger cross-source corroboration (quality over quantity).

**Suggested platforms**:
1. GitHub (DA 96) - Technical repo
2. Dev.to (DA 92) - Tutorial article
3. Medium (DA 96) - Industry analysis
4. Product Hunt (DA 93) - Product showcase
5. Hashnode (DA 88) - Technical blog
6. Hacker News (DA 95) - Community discussion

Quality > quantity. One GitHub repo with 100 stars better than 10 low-quality Medium posts.

### Should I use my real name or ENS domain as primary name?

**Person-first: make `name` a person/handle, and put the ENS domain in
`alternateName` + `identifier`.** The ENS name is a verifiable *anchor*, not the
entity's primary key.

```json
{
  "name": "Your Name",
  "alternateName": ["yourname.eth", "@yourhandle"],
  "identifier": [{
    "@type": "PropertyValue",
    "propertyID": "ens",
    "value": "yourname.eth",
    "url": "https://app.ens.domains/name/yourname.eth"
  }]
}
```

**Why**: Google keys person entities to a human/handle, not a domain string, and
[ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
expects `mainEntity` to be a `Person`/`Organization` identified by a name. Setting
`name` to the ENS domain makes the primary key a domain and weakens reconciliation
with your social profiles (where your name/handle appears). You lose nothing — the
ENS name stays fully present via `alternateName` and `identifier`. (Earlier versions
of this guide suggested "ENS as primary"; that is no longer recommended.)

### Can I have multiple ENS domains pointing to one identity?

Yes, use `sameAs` to link them:

```json
{
  "@type": "Person",
  "name": "Your Name",
  "alternateName": ["primary.eth", "secondary.eth"],
  "sameAs": [
    "https://app.ens.domains/name/primary.eth",
    "https://app.ens.domains/name/secondary.eth",
    "https://app.ens.domains/name/another.eth"
  ]
}
```

But **choose one primary** canonical site and Person `@id` for entity disambiguation. Multiple competing primary entities dilute signals.

---

## Knowledge Panel Questions

### What's the success rate for getting a Knowledge Panel?

Google does not publish success rates or timelines. Use this **signal completeness checklist** instead of a probability score:

| Tier | Typical signals present |
|------|-------------------------|
| **Full** | Person-first `@graph`; one ProfilePage on the about page; optional `hasCredential`; 5+ consistent `sameAs` profiles; stable canonical URLs (minimal schema churn) |
| **Partial** | Person markup + canonical site; fewer external sources; no third-party KYC |
| **Minimal** | Person JSON-LD on a single site only |

> **Methodology note**: These tiers rank how complete your **on-site and cross-source signals** are. They are not Google metrics. Knowledge Panel display is opaque — the Knowledge Graph API does not expose a "candidate" state, and empty API results do not distinguish "unknown" from "prepared but not promoted." After signals are stable, further schema tweaks often reset Google's re-evaluation clock rather than accelerate KP.

### Can Google reject my Knowledge Panel?

Yes, if:
1. **Insufficient notability** - No external validation
2. **Spam signals** - No Proof of Humanness (Dentity)
3. **Inconsistent identity** - Different names across platforms
4. **Low-quality content** - Thin or duplicated content
5. **Guideline violations** - Misleading information

Mitigation:
- Get Dentity verification (anti-spam)
- 3+ high-DA external sources
- Maintain cross-platform consistency
- Create substantive original content

### How is this different from Wikipedia?

**Wikipedia**:
- Requires "notability" (media coverage)
- Community-edited (can be rejected/deleted)
- High barrier to entry
- But very high Google weight

**This approach**:
- No notability requirement
- Self-published (you control)
- Lower barrier (anyone with ENS)
- Requires more external validation

Think of it as **complementary**. If you can get on Wikipedia, do it. But this method works when Wikipedia isn't an option.

### Will I appear for searches of my real name or just ENS?

Depends on Schema.org configuration:

**If ENS is primary name**:
- Likely appears for: "yourname.eth"
- May appear for: "Your Real Name" (if listed in alternateName)

**If real name is primary**:
- Likely appears for: "Your Real Name"
- May appear for: "yourname.eth" (if in alternateName or identifier)

**For both**: Use real name as primary, ENS in alternateName, and maintain consistency.

### Can I edit my Knowledge Panel once it appears?

Not directly. Google generates KP from sources. To update:

1. Update Schema.org markup on your site
2. Update external sources (GitHub, Dev.to)
3. Submit to Indexing API
4. Wait 1-2 weeks for Google re-crawl

Or suggest edits through "Feedback" link on Knowledge Panel (slow, not guaranteed).

---

## Privacy & Security Questions

For the full policy, see the repository’s [Privacy Notice](../PRIVACY.md).

### Does Dentity verification expose my personal info?

**What Dentity shares publicly**:
- Verification status (10/10 checks)
- "Unique Human" badge
- ENS domain
- Connected social accounts (if you link them)

**What stays private**:
- Government ID details
- Biometric data
- Phone number
- Email address

You can control which verifications to make public in Dentity settings.

### Can someone use this to impersonate me?

No. Key protections:

1. **ENS ownership**: Cryptographically proven on-chain
2. **Dentity**: One identity per human (anti-Sybil)
3. **Cross-platform verification**: Must control listed accounts
4. **Search Console**: Must own domain to submit to Indexing API

Someone could create a fake profile, but:
- Won't have ENS ownership proof
- Can't get Dentity verification for your identity
- Won't match cross-platform consistency
- Google will flag as low-confidence entity

### Is my Ethereum address exposed?

**If you include it in Schema.org**: Yes, publicly visible.

**Alternative**: Reference ENS without explicit address:
```json
"identifier": [{
  "@type": "PropertyValue",
  "propertyID": "ens",
  "value": "yourname.eth"
}]
```

ENS resolves to address on-chain anyway, so determined users can find it. But you don't have to include in Schema.org if concerned.

### What if I want to remove my Knowledge Panel later?

**Options**:

1. **Remove Schema.org markup** from site
2. **Delete external sources** (GitHub, articles)
3. **Request removal** via Google Search Console
4. **Let it expire** - KP disappears if sources go stale

Google re-evaluates entities periodically. Removing validation sources will cause KP to disappear in 3-6 months.

**Better approach**: Keep Schema.org minimal if you want optionality:
```json
{
  "@type": "Person",
  "name": "Your Name",
  "alternateName": "yourname.eth",
  "url": "https://yoursite.com/"
}
```

No personal details, just basic entity declaration.

---

## Advanced Questions

### Can I get a Knowledge Panel for my Web3 project (not person)?

Yes! Change `@type` to Organization:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your DAO / Protocol Name",
  "url": "https://yourproject.com/",
  "logo": "https://yourproject.com/logo.png",
  "sameAs": [
    "https://twitter.com/yourproject",
    "https://github.com/yourproject"
  ]
}
```

Organizations may have higher notability bar, but same architecture applies.

### Can I automate the monitoring?

Yes, use the provided `kg-audit.sh` script:

```bash
# Run daily via cron
0 9 * * * /path/to/kg-audit.sh

# Or GitHub Actions (weekly)
# See examples/github-action-kg-audit.yml
```

Monitor:
- Google indexing status
- Rich Results validation
- External mentions count
- Cross-source consistency

Set up alerts (Slack, email) for status changes.

### How does this interact with AI Overviews?

**Do not rely on `FAQPage` markup.** Google limited FAQ rich results to authoritative
government/health sites in Aug 2023, then fully removed the feature from Search on May 7,
2026 (FAQ structured-data docs removed June 15, 2026); `HowTo` was retired too (Sep 2023). AI
Overviews draw from your **visible, well-structured page content** plus a clean entity
graph (Person/Organization, `sameAs`, verifiable `identifier`/`hasCredential`) — not
from `FAQPage`/`HowTo` JSON-LD. Write clear, factual answers as visible copy, and keep
the structured data to supported entity types.

### Can I combine this with other Schema.org types?

Yes! Use `@graph` for multiple entities:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "#Author"
    },
    {
      "@type": "WebSite",
      "@id": "#Website",
      "author": { "@id": "#Author" }
    },
    {
      "@type": "Blog",
      "@id": "#Blog",
      "author": { "@id": "#Author" }
    }
  ]
}
```

Link entities with `@id` references.

---

## Community Questions

### Can I contribute to this project?

Yes! See [CONTRIBUTING.md](../CONTRIBUTING.md).

Ways to contribute:
- Improve documentation
- Add examples for other static site generators
- Report implementation results
- Submit bug fixes
- Share implementation notes

### Where can I share my success story?

1. **GitHub Discussions** - "Success Stories" category
2. **Twitter** - Tag @ookyet (or project account)
3. **Dev.to** - Write your own tutorial
4. **ENS Discord** - #showcase channel

### Is there a community for Web3 SEO?

Growing! Join:
- **ENS Discord** - #dev channel for technical questions
- **GitHub Discussions** - This repo
- **Twitter** - #Web3SEO hashtag
- **Dentity community** - For verification support

### How can I support this project?

- ⭐ Star the GitHub repository
- 📝 Write about your implementation
- 🐛 Report bugs and issues
- 💡 Suggest improvements
- 🔗 Link to this repo from your implementation

---

## Still Have Questions?

1. **Check the docs**:
   - [Implementation Guide](./implementation-guide.md)
   - [Troubleshooting](./troubleshooting.md)
   - [Main README](../README.md)

2. **Search GitHub Issues**: Someone may have asked already

3. **Open a new issue**: [GitHub Issues](https://github.com/ookyet/web3-identity-seo/issues)

4. **Community discussion**: [GitHub Discussions](https://github.com/ookyet/web3-identity-seo/discussions)

5. **Reference example**: See [ookyet.eth](https://ookyet.com/proof/) for a documented implementation

---

**Last updated**: 2025-10-06
**Project**: Web3 Identity SEO
**License**: MIT
