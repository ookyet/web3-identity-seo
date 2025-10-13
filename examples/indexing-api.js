/**
 * Google Indexing API - Submit URLs for fast indexing
 *
 * Prerequisites:
 * 1. Create Google Cloud project
 * 2. Enable Indexing API
 * 3. Create service account
 * 4. Download JSON key file
 * 5. Add service account email to Search Console as owner
 *
 * Installation:
 * npm install googleapis
 */

const { google } = require('googleapis');
const path = require('path');

// Configuration
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');
const SITE_URL = 'https://yoursite.com';

// URLs to submit (prioritize key pages)
const URLS_TO_SUBMIT = [
  `${SITE_URL}/`,
  `${SITE_URL}/proof/`,
  `${SITE_URL}/about/`,
  `${SITE_URL}/blog/`,
];

/**
 * Submit a single URL to Google Indexing API
 * @param {string} url - The URL to submit
 * @param {string} type - 'URL_UPDATED' or 'URL_DELETED'
 */
async function submitUrl(url, type = 'URL_UPDATED') {
  try {
    // Authenticate with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // Create indexing client
    const indexing = google.indexing({ version: 'v3', auth });

    // Submit URL
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log(`✅ Successfully submitted: ${url}`);
    console.log(`   Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error submitting ${url}:`, error.message);
    if (error.response) {
      console.error('   Details:', error.response.data);
    }
    throw error;
  }
}

/**
 * Get metadata for a submitted URL
 * @param {string} url - The URL to check
 */
async function getUrlStatus(url) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({ version: 'v3', auth });

    const response = await indexing.urlNotifications.getMetadata({
      url: url,
    });

    console.log(`📊 Status for ${url}:`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error getting status for ${url}:`, error.message);
    return null;
  }
}

/**
 * Submit all configured URLs
 */
async function submitAllUrls() {
  console.log('🚀 Starting URL submission to Google Indexing API...\n');

  for (const url of URLS_TO_SUBMIT) {
    try {
      await submitUrl(url);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to submit ${url}, continuing...`);
    }
  }

  console.log('\n✅ Batch submission complete!');
  console.log('⏰ Expected indexing time: 24-48 hours');
  console.log('📝 Check status in Google Search Console');
}

/**
 * Check status of all submitted URLs
 */
async function checkAllStatus() {
  console.log('📊 Checking status of submitted URLs...\n');

  for (const url of URLS_TO_SUBMIT) {
    await getUrlStatus(url);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Main execution
if (require.main === module) {
  const action = process.argv[2] || 'submit';

  if (action === 'submit') {
    submitAllUrls().catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  } else if (action === 'status') {
    checkAllStatus().catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  } else {
    console.log('Usage: node indexing-api.js [submit|status]');
    console.log('  submit - Submit URLs to Indexing API (default)');
    console.log('  status - Check status of submitted URLs');
  }
}

module.exports = {
  submitUrl,
  getUrlStatus,
  submitAllUrls,
  checkAllStatus,
};
