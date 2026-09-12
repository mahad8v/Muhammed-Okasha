// services/audioService.ts

/**
 * Cloudflare R2 Audio Service
 *
 * This service handles audio streaming from Cloudflare R2 storage.
 * R2 is perfect for audio because:
 * - Fast global CDN
 * - No egress fees (free downloads)
 * - Reliable streaming
 * - S3-compatible
 *
 * SETUP INSTRUCTIONS:
 * ===================
 *
 * 1. Create a Cloudflare R2 bucket (e.g., "quran-audio")
 * 2. Upload your audio files with naming: surah-001.mp3, surah-002.mp3, etc.
 * 3. Make the bucket public OR set up a custom domain
 * 4. Get your public URL and update R2_BUCKET_URL below
 *
 * PUBLIC BUCKET URL FORMAT:
 * https://pub-YOUR_ACCOUNT_ID.r2.dev/BUCKET_NAME
 *
 * CUSTOM DOMAIN FORMAT:
 * https://cdn.yourapp.com
 *
 * Example:
 * https://pub-abc123xyz.r2.dev/quran-audio
 */

// ⚠️ UPDATE THIS WITH YOUR R2 BUCKET URL ⚠️
const R2_BUCKET_URL = 'https://pub-YOUR_ACCOUNT_ID.r2.dev/quran-audio';

// Alternative: If using custom domain
// const R2_BUCKET_URL = 'https://cdn.yourapp.com';

/**
 * Gets the full audio URL for a specific surah from Cloudflare R2
 *
 * @param surahId - The surah number (1-114)
 * @returns Full URL to the audio file on R2
 *
 * @example
 * getSurahAudioUrl(1)
 * // Returns: "https://pub-xxx.r2.dev/quran-audio/surah-001.mp3"
 */
export const getSurahAudioUrl = (surahId: number): string => {
  if (surahId < 1 || surahId > 114) {
    console.warn(`⚠️ Invalid surah ID: ${surahId}. Must be between 1 and 114.`);
    return '';
  }

  // Pad the surah number with zeros (1 -> 001, 13 -> 013, 114 -> 114)
  const paddedId = surahId.toString().padStart(3, '0');

  // Construct filename following the naming convention
  const fileName = `surah-${paddedId}.mp3`;

  // Build full URL
  const url = `${R2_BUCKET_URL}/${fileName}`;

  console.log(`🎵 Audio URL for Surah ${surahId}: ${url}`);

  return url;
};

/**
 * Check if audio is available for a specific surah
 *
 * @param surahId - The surah number to check
 * @returns true if audio is available, false otherwise
 *
 * Note: Update the max value based on how many surahs you've uploaded
 */
export const hasAudioForSurah = (surahId: number): boolean => {
  // Update this range based on how many surahs you've uploaded
  // For example, if you've uploaded surahs 1-13:
  const MIN_SURAH = 1;
  const MAX_SURAH = 13; // ⚠️ UPDATE THIS as you upload more surahs

  return surahId >= MIN_SURAH && surahId <= MAX_SURAH;
};

/**
 * Get list of all available surah IDs
 *
 * @returns Array of surah IDs that have audio files
 */
export const getAvailableSurahIds = (): number[] => {
  const MIN_SURAH = 1;
  const MAX_SURAH = 13; // ⚠️ UPDATE THIS as you upload more surahs

  const ids: number[] = [];
  for (let i = MIN_SURAH; i <= MAX_SURAH; i++) {
    ids.push(i);
  }

  return ids;
};

/**
 * Get the total count of available surahs
 *
 * @returns Number of surahs with audio
 */
export const getAvailableSurahCount = (): number => {
  return getAvailableSurahIds().length;
};

/**
 * Test if a surah audio URL is accessible
 * Useful for debugging
 *
 * @param surahId - The surah number to test
 * @returns Promise that resolves to true if accessible
 */
export const testSurahAudioUrl = async (surahId: number): Promise<boolean> => {
  const url = getSurahAudioUrl(surahId);

  if (!url) {
    console.error(`❌ No URL generated for Surah ${surahId}`);
    return false;
  }

  try {
    console.log(`🧪 Testing URL: ${url}`);

    const response = await fetch(url, { method: 'HEAD' });

    if (response.ok) {
      console.log(`✅ Surah ${surahId} audio is accessible`);
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
      console.log(
        `📊 Content-Length: ${response.headers.get('content-length')} bytes`,
      );
      return true;
    } else {
      console.error(`❌ Surah ${surahId} returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing Surah ${surahId}:`, error);
    return false;
  }
};

/**
 * Batch test multiple surah URLs
 * Useful for verifying your R2 setup
 *
 * @param surahIds - Array of surah IDs to test (defaults to first 3)
 */
export const testMultipleSurahs = async (surahIds: number[] = [1, 2, 3]) => {
  console.log('🧪 Testing multiple surah URLs...\n');

  for (const id of surahIds) {
    await testSurahAudioUrl(id);
    console.log('---');
  }

  console.log('✅ Test complete!');
};

/**
 * Get surah metadata (optional - for display purposes)
 * You can expand this with more info if needed
 */
export const getSurahMetadata = (surahId: number) => {
  // Basic metadata - you can expand this
  return {
    id: surahId,
    audioUrl: getSurahAudioUrl(surahId),
    isAvailable: hasAudioForSurah(surahId),
    fileName: `surah-${surahId.toString().padStart(3, '0')}.mp3`,
  };
};

// Export the base URL for reference
export const getR2BucketUrl = (): string => R2_BUCKET_URL;
