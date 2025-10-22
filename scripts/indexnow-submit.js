#!/usr/bin/env node
/**
 * IndexNow Submission Script
 *
 * Submits key pages to Bing/Yandex via IndexNow API
 * Faster alternative to waiting for crawlers (instant indexing)
 *
 * Usage: node scripts/indexnow-submit.js
 */

const https = require('https');
const crypto = require('crypto');

// Configuration
const SITE_URL = 'https://ookyet.com';
const KEY_LOCATION = `${SITE_URL}/indexnow-key.txt`;

// Generate or use existing API key (must be saved to static/indexnow-key.txt)
const API_KEY = process.env.INDEXNOW_KEY || crypto.randomBytes(16).toString('hex');

// Priority URLs to submit
const URLS_TO_SUBMIT = [
  `${SITE_URL}/`,
  `${SITE_URL}/proof/`,
  `${SITE_URL}/gallery/`,
  `${SITE_URL}/about/`,
  `${SITE_URL}/press/`,
  `${SITE_URL}/blog/`,
  `${SITE_URL}/blog/identity-through-ens/`,
  `${SITE_URL}/blog/ookyet-mindset/`,
  `${SITE_URL}/blog/web3-identity-journey/`,
];

// IndexNow API endpoints
const INDEXNOW_ENDPOINTS = [
  'api.indexnow.org',  // General endpoint
  'www.bing.com',      // Bing
  'yandex.com'         // Yandex
];

/**
 * Submit URLs to IndexNow API
 */
async function submitToIndexNow(endpoint) {
  const payload = JSON.stringify({
    host: 'ookyet.com',
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS_TO_SUBMIT
  });

  const options = {
    hostname: endpoint,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ ${endpoint}: Success (${res.statusCode})`);
          resolve({ endpoint, status: res.statusCode, success: true });
        } else {
          console.log(`⚠️  ${endpoint}: ${res.statusCode} - ${data}`);
          resolve({ endpoint, status: res.statusCode, success: false, error: data });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${endpoint}: ${error.message}`);
      reject({ endpoint, error: error.message });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 IndexNow Submission Starting...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  if (process.env.INDEXNOW_VERBOSE === '1') {
    console.log(`🔑 API Key (prefix): ${API_KEY.substring(0, 4)}…`);
  }
  console.log(`📄 URLs: ${URLS_TO_SUBMIT.length}`);
  console.log('---\n');

  // Check if API key file exists
  console.log('📋 Remember to create: static/indexnow-key.txt');
  if (process.env.INDEXNOW_VERBOSE === '1') {
    console.log(`   Content: ${API_KEY}\n`);
  } else {
    console.log('   Content: <your-secret-key> (hidden; set INDEXNOW_VERBOSE=1 to print)\n');
  }

  // Submit to all endpoints
  const results = [];
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const result = await submitToIndexNow(endpoint);
      results.push(result);
    } catch (error) {
      results.push({ endpoint, success: false, error });
    }
  }

  // Summary
  console.log('\n📊 Submission Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`   ✅ Successful: ${successful}/${INDEXNOW_ENDPOINTS.length}`);
  console.log(`   ❌ Failed: ${failed}/${INDEXNOW_ENDPOINTS.length}`);

  if (successful > 0) {
    console.log('\n🎉 IndexNow submission complete!');
    console.log('⏱️  Expected indexing: 5-15 minutes (much faster than crawl)');
  } else {
    console.log('\n⚠️  All submissions failed. Check API key and network.');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitToIndexNow, API_KEY };
