// upload-to-r2.js
/**
 * Cloudflare R2 Upload Script (Node.js version)
 *
 * This script uploads all your Quran audio files to Cloudflare R2 using Wrangler
 *
 * PREREQUISITES:
 * 1. Install Wrangler: npm install -g wrangler
 * 2. Login to Cloudflare: wrangler login
 * 3. Create R2 bucket in Cloudflare dashboard
 *
 * USAGE:
 * node upload-to-r2.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ⚠️ CONFIGURATION - Update these ⚠️
const CONFIG = {
  bucketName: 'quran-audio', // Your R2 bucket name
  audioFolder: './', // Folder containing your MP3 files (current directory)
  filePattern: /^surah-\d{3}\.mp3$/, // Only upload files matching this pattern
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'blue');
  console.log('='.repeat(60) + '\n');
}

function checkWranglerInstalled() {
  try {
    execSync('wrangler --version', { stdio: 'ignore' });
    log('✅ Wrangler CLI found', 'green');
    return true;
  } catch (error) {
    log('❌ Wrangler CLI is not installed', 'red');
    log('Install it with: npm install -g wrangler', 'yellow');
    return false;
  }
}

function checkWranglerLogin() {
  try {
    execSync('wrangler whoami', { stdio: 'ignore' });
    log('✅ Logged in to Cloudflare', 'green');
    return true;
  } catch (error) {
    log('❌ Not logged in to Cloudflare', 'red');
    log('Login with: wrangler login', 'yellow');
    return false;
  }
}

function getAudioFiles() {
  const files = fs
    .readdirSync(CONFIG.audioFolder)
    .filter((file) => {
      const isMP3 = file.endsWith('.mp3');
      const matchesPattern = CONFIG.filePattern.test(file);
      return isMP3 && matchesPattern;
    })
    .sort();

  return files;
}

function uploadFile(fileName) {
  const filePath = path.join(CONFIG.audioFolder, fileName);
  const r2Path = `${CONFIG.bucketName}/${fileName}`;

  try {
    log(`📤 Uploading: ${fileName}`, 'blue');

    execSync(`wrangler r2 object put "${r2Path}" --file="${filePath}"`, {
      stdio: 'pipe',
    });

    log(`✅ Success: ${fileName}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Failed: ${fileName}`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  logHeader('Cloudflare R2 Upload Script');

  // Pre-flight checks
  log('Running pre-flight checks...', 'yellow');

  if (!checkWranglerInstalled()) {
    process.exit(1);
  }

  if (!checkWranglerLogin()) {
    process.exit(1);
  }

  // Get files to upload
  const files = getAudioFiles();

  if (files.length === 0) {
    log('\n❌ No audio files found matching the pattern', 'red');
    log(
      `   Looking for files like: surah-001.mp3, surah-002.mp3, etc.`,
      'yellow',
    );
    log(`   In directory: ${path.resolve(CONFIG.audioFolder)}`, 'yellow');
    process.exit(1);
  }

  log(`\n✅ Found ${files.length} file(s) to upload`, 'green');
  log(`📦 Bucket: ${CONFIG.bucketName}`, 'blue');

  console.log('\nFiles to upload:');
  files.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });

  // Confirm upload
  console.log('\n');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question('Continue with upload? (y/n): ', (answer) => {
    readline.close();

    if (answer.toLowerCase() !== 'y') {
      log('\n❌ Upload cancelled', 'red');
      process.exit(0);
    }

    // Start upload
    logHeader('Starting Upload');

    let successCount = 0;
    let failureCount = 0;

    files.forEach((file, index) => {
      console.log(`\n[${index + 1}/${files.length}]`);

      if (uploadFile(file)) {
        successCount++;
      } else {
        failureCount++;
      }
    });

    // Summary
    logHeader('Upload Summary');

    log(`✅ Successfully uploaded: ${successCount} file(s)`, 'green');

    if (failureCount > 0) {
      log(`❌ Failed: ${failureCount} file(s)`, 'red');
    } else {
      log('🎉 All files uploaded successfully!', 'green');
    }

    console.log('\nNext steps:');
    log('1. Go to Cloudflare Dashboard → R2 → ' + CONFIG.bucketName, 'yellow');
    log('2. Enable public access or set up custom domain', 'yellow');
    log("3. Copy your bucket's public URL", 'yellow');
    log('4. Update audioService.ts with the URL', 'yellow');
    console.log('');
  });
}

// Run the script
main().catch((error) => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
