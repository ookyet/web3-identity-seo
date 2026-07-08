#!/usr/bin/env node
/**
 * Knowledge Graph monitor — self-maintained signal inventory + optional live node check.
 *
 * Two modes:
 *   1. Inventory mode (default, no network): reports the Signal Index — a relative
 *      checklist of the identity signals you maintain yourself (entity home, sameAs
 *      anchors, credentials, consistency). Runs in CI with no secrets.
 *   2. Live mode (KG_API_KEY set): additionally queries the Google Knowledge Graph
 *      Search API and reports the entity node's growth fields in staircase order:
 *      url -> image -> resultScore -> detailedDescription.
 *
 * DISCLAIMER: The Signal Index is a heuristic produced locally by this script.
 * It is NOT a metric published or exposed by Google. Google does not provide a
 * "Knowledge Panel probability" or "entity confidence" score; Knowledge Panel
 * display is a non-public, notability-driven decision that markup cannot force.
 * Treat the number only as a relative completeness checklist of signals you
 * control — not as a probability, prediction, or guarantee.
 *
 * Usage:
 *   node scripts/kg-monitor.js                   # inventory mode
 *   KG_API_KEY=... node scripts/kg-monitor.js    # inventory + live node check
 *   KG_MONITOR_LOG=1 node scripts/kg-monitor.js  # also write .monitoring-logs/*.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Signal inventory for the reference implementation. Every entry here must be a
// real, live, identity-consistent surface — this file follows the same honesty
// rule as the docs: never list an anchor that does not exist or is abandoned.
const CONFIG = {
  entity: 'ookyet',
  query: 'ookyet',
  domain: 'ookyet.com',
  checklist: {
    entityHome: true,            // canonical site with Person-first @graph
    profilePage: true,           // exactly one ProfilePage with typed mainEntity
    sameAsAnchors: 10,           // live, identity-consistent profiles in sameAs
    highAuthorityAnchors: 2,     // LinkedIn + ORCID (KG reconciliation sources)
    thirdPartyCredential: true,  // Dentity Unique Human (hasCredential)
    onChainIdentifiers: true,    // ENS + wallet + NFT avatar in identifier
    crossSourceNameConsistent: true, // same name/handle/avatar on every anchor
    kgNodeConfirmed: true        // /g/ MID returned for the query (2026-07-02)
  }
};

const colors = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bold');
  log('='.repeat(60), 'cyan');
}

function subheader(title) {
  log(`\n${title}`, 'blue');
  log('-'.repeat(60), 'blue');
}

/**
 * Signal Index: share of self-maintained signals that are in place.
 * Pure checklist arithmetic over CONFIG — nothing here measures Google.
 */
function calculateSignalIndex() {
  const c = CONFIG.checklist;
  const items = [
    { name: 'Entity home (Person-first @graph)', done: c.entityHome, weight: 3 },
    { name: 'ProfilePage with typed mainEntity', done: c.profilePage, weight: 2 },
    { name: 'sameAs anchors (live + consistent)', done: c.sameAsAnchors >= 5, weight: 2 },
    { name: 'High-authority anchors (LinkedIn/ORCID)', done: c.highAuthorityAnchors >= 1, weight: 2 },
    { name: 'Third-party credential (KYC)', done: c.thirdPartyCredential, weight: 1 },
    { name: 'On-chain identifiers (ENS/wallet/NFT)', done: c.onChainIdentifiers, weight: 1 },
    { name: 'Cross-source name/avatar consistency', done: c.crossSourceNameConsistent, weight: 3 },
    { name: 'KG entity node confirmed via API', done: c.kgNodeConfirmed, weight: 2 }
  ];
  const total = items.reduce((s, i) => s + i.weight, 0);
  const scored = items.reduce((s, i) => s + (i.done ? i.weight : 0), 0);
  return { items, score: Math.round((scored / total) * 100) };
}

/**
 * Live mode: query the KG Search API and read the node in staircase order.
 * Requires KG_API_KEY. Keys expire — an error response means "renew the key",
 * not "the entity disappeared".
 */
function queryKnowledgeGraph(apiKey) {
  const url = `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(CONFIG.query)}&limit=3&key=${apiKey}`;
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function reportNode(result) {
  const items = result.itemListElement || [];
  if (result.error) {
    log(`API error: ${result.error.message}`, 'red');
    log('(KG API keys expire — renew before reading anything into this.)', 'yellow');
    return null;
  }
  if (items.length === 0) {
    log('No entity returned for the query — normal for pre-node stages.', 'yellow');
    return null;
  }
  const top = items[0];
  const node = top.result || {};
  const fields = {
    mid: node['@id'] || null,
    name: node.name || null,
    resultScore: top.resultScore || 0,
    url: node.url || null,
    image: Boolean(node.image),
    detailedDescription: Boolean(node.detailedDescription)
  };
  log(`Node: ${fields.mid}  (name: ${fields.name})`, 'green');
  subheader('Growth staircase (read in this order)');
  log(`1. url:                 ${fields.url ? fields.url : 'not yet (entity home not bound)'}`, fields.url ? 'green' : 'yellow');
  log(`2. image:               ${fields.image ? 'present' : 'not yet'}`, fields.image ? 'green' : 'yellow');
  log(`3. resultScore:         ${fields.resultScore}`, 'reset');
  log(`4. detailedDescription: ${fields.detailedDescription ? 'present' : 'not yet (encyclopedic-source gated; often never for niche entities)'}`, fields.detailedDescription ? 'green' : 'yellow');
  log('\nNo change week over week is the normal case, not a negative signal.', 'cyan');
  return fields;
}

async function runEvaluation() {
  header('Knowledge Graph monitor');
  log(`Entity: ${CONFIG.entity}`, 'cyan');
  log(`Query:  ${CONFIG.query}`, 'cyan');
  log(`Run:    ${new Date().toISOString()}`, 'cyan');

  subheader('Signal Index (self-maintained signals — not a Google metric)');
  const signal = calculateSignalIndex();
  signal.items.forEach(i => {
    log(`  ${i.done ? '[x]' : '[ ]'} (w${i.weight}) ${i.name}`, i.done ? 'green' : 'yellow');
  });
  log(`\nSignal Index: ${signal.score}/100`, signal.score >= 90 ? 'green' : 'yellow');
  log('(Checklist of signals you control. Saturating it does not trigger a', 'cyan');
  log('Knowledge Panel — remaining growth comes from independent coverage + time.)', 'cyan');

  let node = null;
  const apiKey = process.env.KG_API_KEY || '';
  if (apiKey) {
    subheader('Live Knowledge Graph node check');
    try {
      node = reportNode(await queryKnowledgeGraph(apiKey));
    } catch (e) {
      log(`Live check failed: ${e.message}`, 'red');
    }
  } else {
    log('\n(Set KG_API_KEY to add a live KG Search API node check.)', 'yellow');
  }

  header('Done');

  return {
    timestamp: new Date().toISOString(),
    entity: CONFIG.entity,
    signalIndex: signal.score,
    node
  };
}

if (require.main === module) {
  runEvaluation().then(result => {
    if (process.env.KG_MONITOR_LOG === '1') {
      const logDir = path.join(__dirname, '..', '.monitoring-logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const logFile = path.join(logDir, `kg-monitor-${new Date().toISOString().split('T')[0]}.json`);
      fs.writeFileSync(logFile, JSON.stringify(result, null, 2));
      log(`Log written: ${logFile}`, 'cyan');
    } else {
      log('Local log skipped (set KG_MONITOR_LOG=1 to enable; see PRIVACY.md).', 'yellow');
    }
    process.exit(0);
  }).catch(error => {
    log(`Monitor failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runEvaluation, calculateSignalIndex };
