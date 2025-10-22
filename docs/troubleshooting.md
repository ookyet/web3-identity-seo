# Troubleshooting Guide

Common issues and solutions when implementing Web3 Identity SEO.

---

Privacy: see the repository’s [Privacy Notice](../PRIVACY.md). Indexing/IndexNow tools submit public URLs and do not process personal data; use in line with search engine policies.

## Schema.org Issues

### ❌ Google Rich Results Test shows errors

**Problem**: "Invalid object type for field X"

**Solution**:
```json
// ❌ Wrong: String instead of object
"hasCredential": "Dentity Verified"

// ✅ Correct: Proper EducationalOccupationalCredential object
"hasCredential": [{
  "@type": "EducationalOccupationalCredential",
  "name": "Dentity Verified Human"
}]
```

**Validation**:
1. Copy schema to [Schema.org validator](https://validator.schema.org/)
2. Check for type mismatches
3. Ensure all required properties present

---

### ❌ Person entity not detected

**Problem**: Rich Results Test doesn't show Person type

**Possible causes**:
1. **Missing @context**:
```json
// ❌ Missing context
{
  "@type": "Person",
  "name": "yourname.eth"
}

// ✅ Correct
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "yourname.eth"
}
```

2. **Malformed JSON-LD**:
```bash
# Test JSON validity
cat your-schema.json | jq .
```

3. **Script tag issues**:
```html
<!-- ❌ Wrong type -->
<script type="application/json">

<!-- ✅ Correct -->
<script type="application/ld+json">
```

---

### ❌ FAQ Schema not appearing

**Problem**: FAQPage entity not detected

**Requirements**:
- Minimum 2 questions
- Each question must have acceptedAnswer
- Text content must be substantive (50+ characters)

```json
// ❌ Too short
"text": "A Web3 developer."

// ✅ Sufficient detail
"text": "yourname.eth is a verified Web3 identity holder with ENS domain ownership since 2023. The identity is verified through Dentity's Unique Human KYC process..."
```

---

## Google Indexing API Issues

⚖️ Compliance reminder: Ensure your use of Indexing API matches Google’s allowed content types (e.g., JobPosting, live streams). For general pages, prefer sitemaps and standard crawling.

### ❌ "Permission denied" error

**Problem**:
```
Error 403: The caller does not have permission
```

**Solution checklist**:
1. Service account added to Search Console as **Owner** (not just User)
2. Correct project ID in service-account.json
3. Indexing API enabled in Google Cloud Console
4. Wait 5-10 minutes after adding to Search Console

**Verification**:
```bash
# Check service account email
cat service-account.json | jq -r .client_email

# Should match email in Search Console Users
```

---

### ❌ "Invalid URL" error

**Problem**:
```
Error 400: URL is not allowed for this project
```

**Causes**:
1. URL not in verified Search Console property
2. Typo in URL (http vs https)
3. Trailing slash mismatch

**Solution**:
```javascript
// Ensure exact match with Search Console property
const SITE_URL = 'https://yoursite.com';  // No trailing slash

// If property has trailing slash, add it:
const SITE_URL = 'https://yoursite.com/';
```

---

### ❌ Rate limit exceeded

**Problem**:
```
Error 429: Quota exceeded
```

**Limits**:
- 200 URLs per day per project
- ~600 requests per minute

**Solution**:
```javascript
// Add delays between submissions
for (const url of urls) {
  await submitUrl(url);
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
}
```

---

## ENS Configuration Issues

### ❌ ENS not resolving to website

**Problem**: app.ens.domains shows no URL record

**Solution**:
```bash
1. Visit app.ens.domains/name/yourname.eth
2. Click "Add/Edit Record"
3. Add "Website" record: https://yoursite.com
4. Save and wait for transaction confirmation
5. Test after 5-10 minutes
```

---

### ❌ ENS avatar not displaying

**Problem**: Avatar shows as blank

**Possible causes**:

1. **Invalid NFT format**:
```bash
# ❌ Wrong format
avatar: https://opensea.io/...

# ✅ Correct format (EIP-721)
avatar: eip155:1/erc721:0xCONTRACTADDRESS/TOKENID

# Example for Lil Ghosts #761:
avatar: eip155:1/erc721:0x9401518f4ebba857baa879d9f76e1cc8b31ed197/761
```

2. **NFT not owned by address**:
```bash
# Verify ownership on Etherscan
https://etherscan.io/token/0xCONTRACT?a=YOURADDRESS#inventory
```

3. **IPFS gateway issues**:
```bash
# If using IPFS, try different gateway
ipfs://QmHash
# or
https://ipfs.io/ipfs/QmHash
```

---

## Dentity Verification Issues

### ❌ Can't complete KYC verification

**Common issues**:

1. **Government ID rejected**:
   - Ensure ID is clear, not blurry
   - All corners visible
   - No glare or shadows
   - Use passport or driver's license

2. **Biometric liveness fails**:
   - Good lighting
   - Face fully visible
   - Follow on-screen instructions exactly
   - Remove glasses if prompted

3. **Phone verification issues**:
   - Use real phone number (no VoIP)
   - Check SMS spam folder
   - Try different number if persistent issues

---

### ❌ Dentity profile not public

**Problem**: https://dentity.com/yourname.eth shows 404

**Solution**:
1. Complete all 10 verification checks
2. Achieve "Unique Human" status
3. Ensure ENS domain set as primary name
4. Wait 24 hours for profile activation

**Workaround if profile stays private**:
```json
// Reference verification without direct link
"hasCredential": [{
  "@type": "EducationalOccupationalCredential",
  "name": "Dentity Verified Human - 10/10 Checks",
  "credentialCategory": "Identity Verification",
  "recognizedBy": {
    "@type": "Organization",
    "name": "Dentity"
  }
}]
```

---

## Knowledge Panel Not Appearing

### After 4+ weeks, still no KP

**Diagnostic checklist**:

1. **Check Rich Results Test**:
```bash
https://search.google.com/test/rich-results?url=https://yoursite.com/

Expected:
✅ Person entity detected
✅ 0 errors
```

2. **Verify indexing**:
```bash
# Search on Google
site:yoursite.com

# Should show all key pages indexed
```

3. **External authority check**:
```bash
# Minimum requirements:
- 3+ independent sources
- Average DA ≥ 70
- Articles still live (not deleted)
```

4. **Cross-platform consistency**:
```bash
# All platforms must show:
- Same name (or name + ENS)
- Same avatar
- Links to other platforms
- ENS domain mentioned
```

5. **Run KG audit**:
```bash
./scripts/kg-audit.sh

# Check output:
TRIGGER_SCORE: >90 (good)
SPAM_FILTER_STATUS: LEGITIMATE (not SUSPECT)
EXTERNAL_MENTIONS: ≥3
```

---

### KP appears then disappears

**Possible causes**:

1. **External source deleted**:
   - Check all Medium/Dev.to articles still live
   - GitHub repo not deleted
   - Product Hunt listing active

2. **Schema.org changed**:
   - Verify markup still present: `view-source:yoursite.com`
   - Re-test with Rich Results Test

3. **Cross-platform inconsistency**:
   - Check if you changed name/avatar on any platform
   - Restore consistency across all 10+ platforms

4. **Website downtime**:
   - Ensure site had no extended downtime
   - Check uptime monitoring

**Recovery**:
```bash
# Resubmit to Indexing API
node examples/indexing-api.js submit

# Wait 7-14 days for re-evaluation
```

---

## IndexNow Issues

### ❌ IndexNow submission fails

**Problem**:
```
Error 403: Key not found
```

**Solution**:
1. Verify key file exists:
```bash
curl https://yoursite.com/.well-known/indexnow-key.txt
# Should return your key
```

2. Ensure key in POST matches file:
```json
{
  "key": "EXACT_SAME_KEY_AS_IN_FILE",
  "keyLocation": "https://yoursite.com/.well-known/indexnow-key.txt"
}
```

3. Check file permissions (if self-hosted):
```bash
chmod 644 static/.well-known/indexnow-key.txt
```

---

### ❌ No confirmation from IndexNow

**Expected behavior**: HTTP 200 or 202 with no body

**If getting errors**:
1. Validate JSON payload
2. Check host matches domain
3. Ensure HTTPS (not HTTP)
4. Try submitting to different endpoint:
```bash
# Try Bing directly
https://www.bing.com/indexnow

# Or Yandex
https://yandex.com/indexnow
```

---

## Hugo/Static Site Issues

### ❌ Schema not appearing in production

**Common causes**:

1. **Partial not included**:
```go
// Check layouts/partials/head.html or similar
{{ partial "schema-person.html" . }}
```

2. **Conditional rendering**:
```go
// Ensure condition is met
{{ if .IsHome }}
  {{ partial "schema-person.html" . }}
{{ end }}
```

3. **Build not deployed**:
```bash
# Rebuild and deploy
hugo --gc --minify
# Then deploy to Netlify/Vercel/etc.

# Verify on live site
curl -s https://yoursite.com/ | grep -A 20 'application/ld+json'
```

---

### ❌ Variables not interpolating

**Problem**: Schema shows `{{ .Site.BaseURL }}` instead of actual URL

**Hugo context issue**:
```go
// ❌ Wrong: Partial called without context
{{ partial "schema.html" }}

// ✅ Correct: Pass context with dot
{{ partial "schema.html" . }}
```

---

## Performance Issues

### ❌ Multiple large JSON-LD blocks slow page

**Solution**: Combine into single @graph:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://yoursite.com/#Author"
    },
    {
      "@type": "WebSite",
      "@id": "https://yoursite.com/#Website"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yoursite.com/faq/#FAQPage"
    }
  ]
}
```

**Minification**:
```bash
# Minify JSON-LD (remove whitespace)
echo '{"@context": "https://schema.org", ...}' | jq -c .
```

---

## Getting Help

If issue persists:

1. **Check GitHub Issues**: [Link to repo issues]
2. **Google Search Central Community**: [Link]
3. **Schema.org GitHub**: For schema questions
4. **ENS Discord**: For ENS-specific issues
5. **Dentity Support**: For verification problems

---

## Debug Checklist Template

When reporting issues, include:

```markdown
**Environment**:
- Site URL: https://yoursite.com
- ENS Domain: yourname.eth
- Hugo version (if applicable):
- Dentity verification: ✅/❌

**Issue**:
[Describe problem]

**Rich Results Test**:
- URL tested:
- Person detected: ✅/❌
- Errors: [paste errors]

**Schema.org**:
[Paste relevant JSON-LD]

**Indexing Status**:
- Pages indexed: X / Y
- Last indexed date:
- Indexing API used: ✅/❌

**External Authority**:
- GitHub repo: [link]
- Dev.to article: [link]
- Other sources: [links]

**Already tried**:
- [ ] Validated JSON with jq
- [ ] Tested Rich Results
- [ ] Checked Search Console
- [ ] Verified ENS records
- [ ] Ran kg-audit.sh
```

This helps diagnose issues faster.
