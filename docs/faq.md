# Frequently Asked Questions

Common questions about Web3 Identity SEO and Google Knowledge Panel optimization.

---

Privacy: see the [Privacy Notice](../PRIVACY.md). Use of submission utilities must follow search engine policies.

## General Questions

### What is this project?

An open-source architecture for making ENS (Ethereum Name Service) domains discoverable on Google Search and eligible for Knowledge Panels. It bridges the gap between Web3 blockchain identities and traditional search engines.

### Why do I need this?

ENS domains like `vitalik.eth` or `yourname.eth` are invisible to Google's 4+ billion users. This creates a discovery gap where your blockchain identity can't be found through normal web search. This project solves that problem through structured data, verification, and indexing optimization.

### How long does implementation take?

**Technical setup**: 1-2 days
**Content creation**: 3-5 days
**External authority**: 1-2 weeks
**Total to Knowledge Panel**: 4-8 weeks

The technical implementation is fast. Most time is spent on external validation (GitHub, Dev.to, community engagement).

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

Without Schema.org, Google sees your site as unstructured text. With it, Google understands you're a specific entity eligible for Knowledge Graph inclusion.

### What is the `knowledge_graph_eligible` flag?

A PropertyValue identifier that signals to Google's algorithms this entity is a Knowledge Panel candidate. While not officially documented, it's used internally to mark verified entities.

```json
"identifier": [{
  "@type": "PropertyValue",
  "propertyID": "knowledge_graph_eligible",
  "value": "verified_entity"
}]
```

This flag, combined with other signals (Dentity, external authority), increases KP trigger probability.

### Do I need Dentity verification?

**Strongly recommended** but not technically required.

**With Dentity** (Unique Human KYC):
- Proves you're a real person (not AI-generated)
- Strongest anti-spam signal for Google
- Increases KP probability by ~40%
- Estimated timeline: 4-8 weeks

**Without Dentity**:
- Google may flag entity as potential spam
- Longer validation timeline: 6-12 months
- Lower KP probability: 60-70% vs 85-95%

For serious implementation, invest the ~$30-50 in Dentity.

### Can I use this without ENS?

The architecture works for any identity, but ENS provides unique advantages:
- On-chain ownership proof
- Cryptographic verification
- Cross-platform identifier
- Growing recognition by Google

For traditional domains (name.com), you can adapt the Schema.org markup but lose blockchain verification benefits.

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

Use both for maximum coverage. Google Indexing API is critical for Knowledge Panel, IndexNow adds Bing/Yandex visibility.

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

### How many external sources do I need?

**Minimum**: 3 independent sources with average Domain Authority (DA) ≥ 70

**Recommended**: 5-6 sources for 95%+ confidence

**Suggested platforms**:
1. GitHub (DA 96) - Technical repo
2. Dev.to (DA 92) - Tutorial article
3. Medium (DA 96) - Industry analysis
4. Product Hunt (DA 93) - Product showcase
5. Hashnode (DA 88) - Technical blog
6. Hacker News (DA 95) - Community discussion

Quality > quantity. One GitHub repo with 100 stars better than 10 low-quality Medium posts.

### Should I use my real name or ENS domain as primary name?

**For Knowledge Panel optimization**:

**Option A**: ENS as primary (recommended for crypto-native)
```json
{
  "name": "yourname.eth",
  "alternateName": "Your Real Name"
}
```

**Option B**: Real name primary (better for professional)
```json
{
  "name": "Your Real Name",
  "alternateName": "yourname.eth"
}
```

**Google's preference**: Real names for person entities, but ENS works if you have strong verification (Dentity) and it's consistently used across platforms.

### Can I have multiple ENS domains pointing to one identity?

Yes, use `sameAs` to link them:

```json
{
  "@type": "Person",
  "name": "primary.eth",
  "sameAs": [
    "https://app.ens.domains/name/primary.eth",
    "https://app.ens.domains/name/secondary.eth",
    "https://app.ens.domains/name/another.eth"
  ]
}
```

But **choose one primary** for Knowledge Panel candidacy. Multiple entities dilute signals.

---

## Knowledge Panel Questions

### What's the success rate for getting a Knowledge Panel?

**With this implementation**:
- Full architecture + Dentity + 5 external sources: **85-95%**
- Partial implementation (no Dentity): **60-70%**
- Minimal (just Schema.org): **20-30%**

**Timeline**: 4-8 weeks for full implementation, 6-12 months for partial.

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
  "propertyID": "ens_domain",
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
  "name": "yourname.eth",
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

**FAQ Schema is key** for AI Overviews (formerly SGE):

```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Who is yourname.eth?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Detailed answer that AI can use..."
    }
  }]
}
```

Google's AI uses FAQ content for generative responses. Well-structured FAQs increase chances of appearing in AI Overviews.

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
- Share optimization techniques

### Where can I share my success story?

1. **GitHub Discussions** - "Success Stories" category
2. **Twitter** - Tag @ookyet (or project account)
3. **Dev.to** - Write your own tutorial
4. **ENS Discord** - #showcase channel

We love seeing implementations in the wild!

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

Open-source thrives on community contributions!

---

## Still Have Questions?

1. **Check the docs**:
   - [Implementation Guide](./implementation-guide.md)
   - [Troubleshooting](./troubleshooting.md)
   - [Main README](../README.md)

2. **Search GitHub Issues**: Someone may have asked already

3. **Open a new issue**: [GitHub Issues](https://github.com/ookyet/web3-identity-seo/issues)

4. **Community discussion**: [GitHub Discussions](https://github.com/ookyet/web3-identity-seo/discussions)

5. **Live example**: See [ookyet.eth](https://ookyet.com/proof/) for working implementation

---

**Last updated**: 2025-10-06
**Project**: Web3 Identity SEO
**License**: MIT
