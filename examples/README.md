# Examples

This directory contains ready-to-use examples for implementing Web3 identity SEO.

Privacy: see the repository’s [Privacy Notice](../PRIVACY.md). Examples that submit URLs (Indexing API/IndexNow) do not read personal data and must be used in line with search engine policies.

## 📋 Files

### 1. `schema-person.json`
Complete Schema.org Person entity markup with:
- ENS domain identifier
- Dentity credential integration
- Knowledge Graph eligibility flag
- Cross-platform sameAs links

**Usage**:
```html
<script type="application/ld+json">
  <!-- Copy contents of schema-person.json here -->
</script>
```

### 2. `schema-faq.json`
FAQ Schema for AI Overviews optimization with:
- Identity verification questions
- Expertise area descriptions
- Cross-platform proof explanations

**Usage**:
```html
<script type="application/ld+json">
  <!-- Copy contents of schema-faq.json here -->
</script>
```

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

- Use `knowledge_graph_eligible` flag in identifier array
- Include Dentity verification in hasCredential
- Maintain cross-platform consistency in sameAs links
- Update FAQ content based on actual common queries
- Submit key pages only to Indexing API (homepage, proof page, about)
