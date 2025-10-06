# Web3 Identity SEO Implementation Guide

Complete step-by-step guide to making your ENS domain Google-visible.

---

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

**Why critical**: Dentity provides "Proof of Humanness" - the strongest anti-spam signal for Google's algorithms. Without it, your entity may be flagged as potential AI-generated spam.

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
  "name": "yourname.eth",
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
      "propertyID": "ens_domain",
      "value": "yourname.eth"
    },
    {
      "@type": "PropertyValue",
      "propertyID": "knowledge_graph_eligible",
      "value": "verified_entity"
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
- `knowledge_graph_eligible`: Google internal flag
- `hasCredential`: Dentity verification link
- `sameAs`: Cross-platform consistency (minimum 5 platforms)

### Step 2.2: Active Trigger Interfaces

Add `ProfilePage` declaration:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://yoursite.com/#KnowledgePanelCandidate",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://yoursite.com/#Author"
  }
}
</script>
```

This signals to Google: "This page is about a Person entity eligible for Knowledge Panel."

### Step 2.3: FAQ Schema for AI Overviews

Create FAQ page (`/about/` or `/faq/`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Who is yourname.eth?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "yourname.eth is a verified Web3 identity..."
    }
  }]
}
</script>
```

**Validation**:
```bash
# Test with Google Rich Results Test
https://search.google.com/test/rich-results?url=https://yoursite.com/
```

Expected results:
- ✅ Person entity detected
- ✅ FAQPage detected
- ✅ 0 errors, 0 warnings

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

---

## Phase 5: Monitoring & Validation (Ongoing)

### Step 5.1: Daily Knowledge Graph Audit

Use the monitoring script:
```bash
# Copy from this repo
cp scripts/kg-audit.sh ~/yourproject/
chmod +x kg-audit.sh

# Run daily
./kg-audit.sh
```

**Key metrics to track**:
- Entity confidence score (target: 95%+)
- Cross-source consistency (target: 99%+)
- External validation count (target: 3+)
- KP trigger probability (target: 90%+)

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

**Timeline expectations**:
- Week 1-2: No results (normal)
- Week 3-4: Possible candidate appearance
- Week 5-8: Full Knowledge Panel (if all signals met)

---

## Troubleshooting

See [troubleshooting.md](./troubleshooting.md) for common issues and solutions.

---

## Success Checklist

**Technical Infrastructure** (Week 1):
- [ ] ENS domain registered and configured
- [ ] Dentity Unique Human verification complete
- [ ] Schema.org Person entity implemented
- [ ] ProfilePage + knowledge_graph_eligible flag added
- [ ] FAQ Schema created
- [ ] Google Indexing API configured and submitted
- [ ] IndexNow configured for Bing/Yandex

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

**Expected Timeline**:
- Week 1: Technical setup complete
- Week 2: Content published
- Week 3: External authority building
- Week 4-8: Knowledge Panel activation

---

## Advanced Optimization

### Cross-Platform Unification
Ensure consistent identity across:
1. ENS App profile
2. GitHub profile
3. Twitter bio
4. LinkedIn profile
5. Personal website
6. Dentity profile
7. OpenSea (if NFT avatar)
8. Mirror.xyz / Paragraph
9. Farcaster
10. Lens Protocol

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
  "name": "yourname.eth",
  "disambiguatingDescription": "Web3 developer specializing in ENS and decentralized identity"
}
```

---

## Next Steps

After implementation:
1. Wait 2-4 weeks for Google indexing
2. Monitor daily with kg-audit.sh
3. Maintain external authority (don't delete articles)
4. Keep cross-platform consistency
5. Publish regular content (1+ per month)

**Expected Knowledge Panel probability**: 85-95% after 4-8 weeks

For support and questions, open an issue in the GitHub repository.
