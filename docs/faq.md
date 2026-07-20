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

**Long-term** (months, not weeks):
1. Knowledge Graph API returns your entity (the reference implementation took ~11 months from first indexing)
2. The KG node grows fields over time — read them in priority order: `url` (entity home bound) → `image` → `resultScore` rising → `detailedDescription` (encyclopedic-source gated, often never for niche entities)
3. A Knowledge Panel remains a separate, notability-driven decision — do not put it on a calendar

Use the `kg-audit.sh` script for monitoring — **weekly is enough** once a node exists (KG ingestion is not real-time; same-day repeat queries return identical results). GSC tip: **Test Live URL is read-only** (safe to click, sends no signal); only *Request Indexing* actively queues a crawl.

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

### My entity shows in an AI Overview but there's no Knowledge Panel — why?

These are different outcomes, and AI Overview recognition is the more attainable one:

- **AI Overview entity recognition** means Google has *resolved and understood* your entity — it can name you, your ENS, your avatar, and cite your sources. This is achievable with a clean entity graph plus cross-source consistency, and for a **niche or individual entity it is the realistic ceiling**.
- **A formal Knowledge Panel** is a separate, automatic decision driven mainly by **notability** — being covered or referenced by enough *independent* third parties. Markup cannot force it; it is earned over time.

Don't read "no Knowledge Panel" as failure. If AI Overviews and SERP features (sitelinks, thumbnails) already recognize your entity, the architecture is working as intended.

### The SERP already shows an Images pack for my name — is that the Knowledge Panel image?

No — they come from two different systems, and confusing them leads to false "almost there" readings:

- The **SERP Images pack** is the *image retrieval* system: "people searching this query may want pictures," pulled from pages that rank for the term. It neither reads nor writes the Knowledge Graph.
- The **Knowledge Panel photo** comes from the KG node's `image` property, selected by the entity pipeline (check it via the KG Search API — the pack can appear while the node's `image` is still empty, as observed on the reference implementation).

The pack is still genuinely useful: if it shows one consistent avatar from multiple independent domains (own site + social + dev platforms), Google's visual systems have an unambiguous candidate pool for the day the entity pipeline picks a node image — and it is one more block of SERP real estate answering "who is this" before a panel exists.

### I rank #1 on Google but barely appear on other search engines — is something wrong?

Nothing is broken — you are looking at two different layers, and both readings are true at once:

- **Ranking layer**: a coined, zero-competition name plus a well-optimized entity home makes you #1 on Google. Nothing can outrank you for your own term.
- **Corpus layer**: how much content about you *exists anywhere*. Other engines crawl shallower, don't reward your markup the same way, and expose how thin the underlying corpus is (often your entity home won't even make their top 10 — self-authored articles and profile pages will).

A thin corpus does not hurt your ranking (there is nothing to outrank you), but it is exactly what slows KG node growth and Knowledge Panel confidence — there is nothing new to ingest. Two symptoms worth knowing: aggregators and AI assistants **fill gaps with guesses** when a corpus is thin (the reference implementation found a fabricated wallet address attributed to its ENS name in one engine's AI summary), and your loudest self-published article stays the dominant narrative long after it goes stale. The fix is **content supply, not more markup**: authored, crawlable content under your byline.

### Once I have a Knowledge Panel, how do I claim or correct it?

Per [Google's official documentation](https://support.google.com/knowledgepanel/answer/7534902), Knowledge Panels are **auto-generated** — you cannot create one or edit its facts directly. When one appears for you:

1. Search your name; if a panel appears, click **"Claim this knowledge panel."**
2. Verify by signing in to an official channel: **Search Console, YouTube, X, or Facebook.**
3. You can then **suggest** changes through **Feedback** (Google reviews them) and add authorized managers — but you cannot directly overwrite facts.

Not all panels are claimable yet, and verification lets you *suggest* corrections, not control the content.

### How many third-party citations do I need for a Knowledge Panel?

"You need 30+ references" is not a Google threshold — no such number is published, and eligibility is a fuzzy confidence judgment. But calling it pure folklore was too dismissive (this guide did, in earlier versions): one consultancy's cohort data (Kalicube Pro, across their client base) puts the observed average at **~20 consistent corroborating sources** — around six when Wikipedia/Wikidata carry the weight, around thirty when they don't. Two refinements matter more than the number itself. First, **consistent profile pages count**: converging your own second-party profiles (LinkedIn, directories, forums) onto one exact factual description measurably raises confidence — the sources don't all have to be editorial. Second, **authority is a multiplier**: one recognized organization referencing you outweighs dozens of anonymous reposts and pulls the required count down. So converge every surface you control, add real anchors, and let **quality × time × stability** compound. Don't chase the count — but don't dismiss it as myth either.

### Does a unique or coined name help?

Yes — significantly, but understand *how*. A rare/coined name (vs. a common name shared by many people) gives you **zero disambiguation**: you rank #1 for the term and Google never has to decide "which person." This does not *trigger* a Knowledge Panel by itself (ranking ≠ panel), but it acts as a **multiplier** — every external signal converts cleanly and you need less corroboration than someone with a contested name. It is the strongest structural advantage a niche personal entity can have, and it is fully white-hat (you are simply unambiguous).

### Should my display name include my real name on every platform?

Only where a real name reads natively — Instagram (`Real Name (@handle)`), and forum
profiles with a separate Name field (Discourse puts it on every post page). On
handle-native platforms (Bluesky, Mastodon, YouTube), keep the handle as the display
name and open the bio with the real name instead, one controlled sentence reused
verbatim: `Real Name, known online as yourhandle — … · ENS yourname.eth · yoursite.com`.

What entity reconciliation actually reads is the **profile page**, and that page still
carries all four tokens (real name, handle, ENS name, domain) either way; the per-post
byline is a volume amplifier, not a requirement. Forcing a shape that feels wrong is how
profiles end up quietly reverted and inconsistent — pick what you can hold for years.
Bonus if you own a domain: Bluesky accepts it as your handle via DNS verification, which
binds account to entity home harder than any bio link.

### I registered extra domains for my name — should I build anything on them?

No. Defensive domains (`yourname.net` next to your `.com`) have exactly one correct
configuration: **301 redirect to your entity home, nothing else**. A second domain with
content is a second entity-home candidate — it dilutes the one signal this whole
architecture concentrates ("this domain is the canonical home of this entity").

Three rules: redirect apex and www to the canonical site; never leave a registrar
parking page with ads sitting on your own brand query; keep auto-renew on (an expired
defensive domain in a squatter's hands is worse than never owning it). Registering them
is still worthwhile — impersonation defense matters for an identity project — but they
never appear in `sameAs` or anywhere in your markup.

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

### My AI Overview appears instantly and reads identically every time — what does that mean?

AI Overviews are served two ways: generated on the fly (slower, streamed, wording drifts
between sessions) or from a cached, precomputed answer (instant, verbatim-stable). If your
entity query returns the same definition in under a second, on desktop and mobile alike,
Google has stopped re-reasoning about who you are and is serving a converged answer
(observed on the reference entity from 2026-07-17: two different entity queries, both
definition-grade, both cached). That matters twice. First, it is strong interface-layer
evidence that the "does Google understand this entity" question is settled — the remaining
gap to a Knowledge Panel is the graph-side field binding and the notability threshold, not
comprehension. Second, whatever that cached answer says is now the *standard answer* every
searcher gets — which is the payoff of a controlled vocabulary: the definition Google
locked in is assembled from sentences you wrote. It is still an answer-layer artifact, not
a Knowledge Graph node change; keep reading the node fields separately. And with AI
answers increasingly drawn from the same entity understanding (Knowledge Graph → AI
answers is one pipeline now), a converged, correct cached definition is worth more than
most rich results ever were.

### A "People also search for" box appeared for my name — is that meaningful?

Mildly, yes: it means Google treats the query as an entity-shaped query with a refinement
cluster — one more interface-layer sign of entity processing, in the same family as an
image pack. Read the variants critically, though. On the reference entity the box showed
one genuine vocabulary echo (`ookyet eth` — a real token pair from the corpus) and two
template-generated commercial suffixes (`… wallet`, `… review`) that Google auto-appends
to entity-like queries in this niche. Template variants are not evidence of real search
demand; do not build content for them.

### My ENS app profile page (app.ens.domains) got indexed — how much does that help?

It is a consistency-layer anchor, not a notability signal. The page carries your handle
and records on an official, high-authority domain — better than aggregator mirrors, and
one more block of the search page that is about you. But its content is self-declared
(your own ENS records), usually with no real name and no third-party editorial judgment,
so it corroborates identity consistency without advancing the independent-coverage
threshold that actually gates panels. Welcome it, count it, and do not mistake it for a
trigger.

### I'm a well-known pseudonymous creator — why don't I have a Knowledge Panel (or why did mine disappear)?

Because fame is not the input. The graph's gating question for a Person entity is
*which verifiable human is this?* — and a purely pseudonymous identity gives Google no
way to answer it. Measured on real cases (2026-07-19/20, anonymized): a Web3-era creator
with mainstream press coverage and seven-figure sales returns *empty* for both real-name
and handle queries, while an entrenched same-name legacy entity owns the alias outright.

Three mechanics produce that outcome:

1. **Person reconciliation never completes.** With no real-name binding on authority
   surfaces (LinkedIn, ORCID), there is no anchor to reconcile against. Press coverage
   of a pseudonym corroborates a *name*, not a confirmed person.
2. **Hype-cycle panels are shallow.** A panel can appear during a fame burst on
   query-level mapping alone, with no reconciled entity underneath. Those are the first
   casualties of a recalibration — while panels backed by completed reconciliation
   survive years of dormancy untouched.
3. **Walled-garden activity doesn't convert.** Posting weekly inside login-walled
   platforms is high-volume, zero-conversion supply; the graph never sees it.

The fix is not abandoning the pseudonym. It is the dual-layer pattern this playbook
documents: keep the handle as the public display name everywhere, and complete the
machine layer with a real name on authority anchors ([Step 4.3](implementation-guide.md)).
Reconciliation before display.

### Google shows a page full of rich results about me — why is there still no panel?

Because those are two different pipelines. The **document pipeline** (crawl → index →
rank) is per-page: marketplaces, press, and video platforms rank their own pages about
you, and the rich snippets come from *their* per-page markup. A rich SERP proves this
pipeline works. The **entity pipeline** (reconcile → node → fields → panel) is what a
panel renders from, and it starts with Person reconciliation. Measured case
(2026-07-20): the pseudonymous creator from the previous answer has an abundant,
high-authority SERP — and still returns *empty* from the KG API. Their corroboration
*material* exceeds any threshold; it simply has no anchor to reconcile to.
Corroboration without an anchor is sand; an entity home without corroboration is an
island. Build the anchor — your material may already be waiting.

### Someone who shares my name or alias has a panel — what does that mean for me?

Three things, measured on a real shared-alias case (2026-07-20):

1. **Vertical feeds change the rules.** The same-alias panel belongs to a modestly
   known film director with no Wikipedia article — fed by the movies vertical, where
   IMDb plays the role ORCID plays for research: an authoritative structured feed.
   Vertical-fed entities can display **full panels while their KG API fields look
   sparse** (that node reads as name + type only — no url, no image, no description —
   yet renders a photo and a filmography carousel). Feed membership gated the panel;
   fame did not.
2. **Occupation is permanent.** A displayed panel re-wins the query↔entity association
   with every impression. An occupied alias is effectively gone; signals you emit under
   it route into a contested namespace.
3. **The move is to change keys, not to fight.** Bind your identity to an uncontested
   key — a unique handle plus real-name anchors — and read your own monitoring gauges
   against general-web entities, never against vertical-fed ones.

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

**Last updated**: 2026-07-12
**Project**: Web3 Identity SEO
**License**: MIT (code) · CC BY 4.0 (documentation)
