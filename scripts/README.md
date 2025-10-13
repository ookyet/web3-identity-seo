# Scripts

Monitoring and automation scripts for Web3 Identity SEO.

## 📋 Files

### 1. `kg-audit.sh`
Daily Knowledge Graph and SERP monitoring script.

**Features**:
- Knowledge Graph API entity check
- SERP feature detection (KP, PAA, Rich Results, FAQ)
- Google Indexing API status
- Rich Results Test validation
- Cross-source consistency check
- Entity score calculation
- Automated alerts (Slack/email)

**Setup**:
```bash
# 1. Make executable
chmod +x scripts/kg-audit.sh

# 2. Set environment variables
export KG_API_KEY="your-google-api-key"
export SITE_URL="https://yoursite.com"

# 3. Run manually
./scripts/kg-audit.sh

# 4. Schedule daily (cron)
0 8 * * * /path/to/scripts/kg-audit.sh
```

**Output**:
```
docs/entity-audit/YYYYMMDD/
├── kg/
│   └── api-response.json
├── serp/
│   ├── raw.html
│   └── features.json
├── indexing/
│   └── status.json
├── rich-results/
│   └── validation.json
└── summary.txt
```

**Monitoring Metrics**:
- Entity Confidence Score (target: 96%+)
- Cross-source Consistency (target: 99%+)
- KP Trigger Probability (target: 90%+)
- Spam Filter Status (target: LEGITIMATE)

### 2. `indexnow-submit.js`
IndexNow protocol submission for Bing/Yandex instant indexing.

**Features**:
- Batch URL submission
- Multiple search engine support (Bing, Yandex)
- API key validation
- Rate limit handling
- Status checking

**Setup**:
```bash
# 1. Install dependencies
npm install node-fetch

# 2. Generate API key
openssl rand -hex 32 > indexnow-key.txt

# 3. Place key file in website
cp indexnow-key.txt static/.well-known/

# 4. Configure script
# Edit SITE_URL and API_KEY in indexnow-submit.js

# 5. Run
node scripts/indexnow-submit.js
```

**Configuration**:
```javascript
const SITE_URL = 'https://yoursite.com';
const API_KEY = 'your-indexnow-key';
const KEY_LOCATION = `${SITE_URL}/.well-known/indexnow-key.txt`;

const URLS_TO_SUBMIT = [
  `${SITE_URL}/`,
  `${SITE_URL}/proof/`,
  `${SITE_URL}/about/`,
];
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "URLs submitted to IndexNow"
}
```

---

## 🔧 Environment Variables

Create `.env` file or export in shell:

```bash
# Google Knowledge Graph API
export KG_API_KEY="AIza..."

# Your website
export SITE_URL="https://yoursite.com"

# IndexNow API Key
export INDEXNOW_KEY="3f8a7b2c..."

# Optional: Alerts
export SLACK_WEBHOOK="https://hooks.slack.com/..."
export ALERT_EMAIL="you@example.com"
```

---

## 📊 Automated Monitoring Setup

### Daily Cron Job (Recommended)

```bash
# Edit crontab
crontab -e

# Add daily audit at 8 AM
0 8 * * * cd /path/to/project && ./scripts/kg-audit.sh >> logs/kg-audit.log 2>&1

# Add weekly IndexNow resubmission
0 9 * * 1 cd /path/to/project && node scripts/indexnow-submit.js >> logs/indexnow.log 2>&1
```

### GitHub Actions (CI/CD)

Create `.github/workflows/kg-monitoring.yml`:

```yaml
name: Knowledge Graph Monitoring

on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8 AM UTC
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run KG Audit
        env:
          KG_API_KEY: ${{ secrets.KG_API_KEY }}
          SITE_URL: ${{ secrets.SITE_URL }}
        run: |
          chmod +x scripts/kg-audit.sh
          ./scripts/kg-audit.sh

      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: kg-audit-results
          path: docs/entity-audit/
```

### Netlify Build Hook (On Deploy)

Add to `netlify.toml`:

```toml
[build]
  command = "hugo --gc --minify && node scripts/indexnow-submit.js"
  publish = "public"

[build.environment]
  INDEXNOW_KEY = "your-key-here"
  SITE_URL = "https://yoursite.com"
```

---

## 🔔 Alert Configuration

### Slack Notifications

Add to `kg-audit.sh`:

```bash
# At end of script
if [ $TRIGGER_SCORE -gt 90 ] && [ "$KG_FOUND" != "NOT_FOUND" ]; then
  curl -X POST $SLACK_WEBHOOK -H 'Content-Type: application/json' -d '{
    "text": "🎉 Knowledge Panel triggered! Entity: '"$ENTITY"', Score: '"$TRIGGER_SCORE"'"
  }'
fi
```

### Email Alerts

```bash
# Install mailutils
sudo apt-get install mailutils

# Add to kg-audit.sh
if [ $SPAM_FILTER_STATUS == "SUSPECT" ]; then
  echo "Warning: Entity flagged as spam suspect" | mail -s "KG Alert: $ENTITY" $ALERT_EMAIL
fi
```

---

## 📈 Interpreting Results

### Entity Score Calculation

```bash
TRIGGER_SCORE = (CONFIDENCE × 0.25) +
                (CONSISTENCY × 0.30) +
                (INTENT_MATCH × 0.20) +
                (SALIENCE × 0.15) +
                (UNIQUENESS × 0.10)
```

**Target**: 90+ for Knowledge Panel eligibility

### Spam Filter Status

- `LEGITIMATE`: ✅ All clear, KP eligible
- `REVIEWING`: ⚠️ Under evaluation, needs more signals
- `SUSPECT`: ❌ Blocked, increase external authority

### KP Trigger Probability

- **0-40%**: Early stage, more work needed
- **40-70%**: Good progress, add external sources
- **70-85%**: High probability, expect KP in 4-8 weeks
- **85-95%**: Very high, expect KP in 1-4 weeks
- **95%+**: Imminent, monitor daily

---

## 🐛 Troubleshooting

### kg-audit.sh fails with "KG_API_KEY not set"

```bash
# Export key before running
export KG_API_KEY="AIza..."
./scripts/kg-audit.sh

# Or add to ~/.bashrc
echo 'export KG_API_KEY="AIza..."' >> ~/.bashrc
source ~/.bashrc
```

### indexnow-submit.js returns 403

**Check**:
1. Key file exists: `curl https://yoursite.com/.well-known/indexnow-key.txt`
2. Key in script matches file
3. HTTPS (not HTTP)

### Cron job doesn't run

**Debug**:
```bash
# Check cron logs
grep CRON /var/log/syslog

# Test manually
/bin/bash -c "cd /path/to/project && ./scripts/kg-audit.sh"

# Ensure executable
chmod +x scripts/kg-audit.sh
```

### No SERP features detected but manually visible

**Cause**: Google serves different results to bots

**Solution**:
```bash
# Use headless browser instead
npm install puppeteer
# See examples/serp-screenshot.js
```

---

## 🔐 Security Notes

### API Key Protection

**Never commit keys to Git**:

```bash
# Add to .gitignore
.env
indexnow-key.txt
service-account.json
```

**Use environment variables**:
```bash
# In CI/CD, use secrets
# Locally, use .env file (gitignored)
```

### Rate Limits

- **Knowledge Graph API**: 100,000 queries/day (free tier)
- **Indexing API**: 200 URLs/day per project
- **IndexNow**: No hard limit, but respect 1 req/sec

Scripts include delays to avoid rate limiting.

---

## 📚 Additional Resources

- [Main README](../README.md) - Project overview
- [Implementation Guide](../docs/implementation-guide.md) - Setup instructions
- [Troubleshooting](../docs/troubleshooting.md) - Common issues

---

## 💡 Tips

1. **Run daily**: Consistent monitoring catches issues early
2. **Save results**: Historical data shows progress
3. **Set alerts**: Don't manually check, get notified
4. **Monitor trends**: One bad day is OK, trends matter
5. **Automate everything**: Scripts should run without intervention

---

**Last updated**: 2025-10-06
**Compatibility**: Linux, macOS, WSL
**Dependencies**: bash, curl, jq, node.js (for IndexNow)
