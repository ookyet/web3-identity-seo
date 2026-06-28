# Examples

This directory contains ready-to-use examples for implementing Web3 identity SEO.

Privacy: see the repository’s [Privacy Notice](../PRIVACY.md). Examples that submit URLs (Indexing API/IndexNow) do not read personal data and must be used in line with search engine policies.

## 📋 Files

### 1. `schema-person.json`
Complete Schema.org Person entity markup (**Person-first**) with:
- `name` = person/handle (primary key); ENS goes in `alternateName` + `identifier` (not the name)
- Dentity credential integration (`hasCredential`)
- Cross-platform `sameAs` links

**Usage**:
```html
<script type="application/ld+json">
  <!-- Copy the entity from schema-person.json (drop the leading "_NOTE" key) -->
</script>
```

### 2. `schema-faq.json` — ⚠️ RETIRED, do not deploy
Kept for historical context only. **Google removed FAQ rich results (Aug 2023) and
retired the FAQ docs (2026-06-15)** — emitting `FAQPage` no longer yields a rich
result and may surface as a Search Console issue. Keep FAQ content as **visible page
copy** instead. (`HowTo` also retired Sep 2023; `QAPage` only for a single
user-submitted Q&A page.) The file's top-level is intentionally wrapped so it cannot
be pasted as valid markup.

### 3. `indexing-api.js`
Google Indexing API implementation for fast indexing (24-48h vs 7-30 days).

**Setup**:
```bash
# 1. Install dependencies
npm install googleapis

# 2. Configure service account
# Download service-account.json from Google Cloud Console
# Place in same directory as indexing-api.js

# 3. Update configuration
# Edit SITE_URL and URLS_TO_SUBMIT in indexing-api.js

# 4. Run
node indexing-api.js submit  # Submit URLs
node indexing-api.js status  # Check status
```

Compliance note: Google’s Indexing API is intended for specific content types (e.g., JobPosting, live streams). For general pages, prefer sitemaps and normal crawling. Use responsibly and follow Google policies.

## 🔧 Customization

Replace the following placeholders:
- `yoursite.com` → Your domain
- `yourname.eth` → Your ENS domain
- `0xYourEthereumAddress` → Your Ethereum address
- `yourusername` → Your social media usernames

## 📚 More Resources

- [Main README](../README.md) - Complete implementation guide
- [Documentation](../docs/) - Detailed setup instructions
- [Live Example](https://ookyet.com/proof/) - Working implementation

## ⚠️ Important Notes

1. **Schema.org validation**: Always test with [Google Rich Results Test](https://search.google.com/test/rich-results)
2. **Indexing API quota**: 200 URLs/day limit per project
3. **Service account**: Must be added as owner in Google Search Console
4. **ENS verification**: Ensure ENS domain actually resolves to your address
5. **Secrets**: Do not commit `service-account.json` or API keys. See project `.gitignore`.

## 💡 Tips

- Stick to standard Schema.org vocabulary; avoid non-standard `propertyID` values such as a fictional `knowledge_graph_eligible` flag — Google does not recognize undocumented properties and may treat them as performative SEO signals
- Include Dentity verification in `hasCredential` as a real `EducationalOccupationalCredential` (not a free-text string)
- Maintain cross-platform consistency in `sameAs` links (same display name, avatar, bio across all listed profiles)
- Do **not** emit `FAQPage`/`HowTo` (retired by Google) — keep FAQ/how-to as visible page content; use `QAPage` only for a single user-submitted Q&A page
- Keep the `Person` your single primary entity: `name` = person/handle, ENS in `alternateName` + `identifier`; one `ProfilePage` (`mainEntity` → Person) on the about page
- Submit only public, eligible pages to the Indexing API; for general content prefer sitemaps and standard crawling per Google policy
