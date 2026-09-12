// services/reciters.ts
import { Reciter } from '@/types/reciterTypes';
import { getR2BucketUrl } from '@/services/audioService';

/**
 * Reciter roster is managed through the admin app and hosted as a JSON file
 * in this same repo, served via jsDelivr's CDN — no backend/server needed.
 * Edit `content/reciters.json` (via the admin app) to add reciters/surahs
 * without an app rebuild.
 */
const RECITERS_JSON_URL =
  'https://cdn.jsdelivr.net/gh/mahad8v/Muhammed-Okasha@master/content/reciters.json';

/**
 * Bundled fallback used only if the remote fetch fails (offline, first-ever
 * launch before any cache exists, jsDelivr hiccup, etc.) so the app never
 * shows a blank reciters list.
 */
const FALLBACK_RECITERS: Reciter[] = [
  {
    id: 'muhammed-okasha-badjie',
    name: 'Muhammed Okasha Badjie',
    country: 'Gambia',
    avatar:
      'https://cdn.jsdelivr.net/gh/mahad8v/Muhammed-Okasha@master/app/assets/images/muhammed-okasha-badjie.jpeg',
    availableSurahIds: [12],
    audioUrls: {
      12: 'https://archive.org/download/muhammed-okasha-badjiesurah-012.mp3/Beautiful%20Recitation%20Of%20Surah%20Yusuf%20%2019%20Minute%20%20By%20Muhammad%20Okasha%20Badjie.mp3',
    },
  },
];

export const fetchReciters = async (): Promise<Reciter[]> => {
  try {
    const response = await fetch(RECITERS_JSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch reciters: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Falling back to bundled reciters list:', error);
    return FALLBACK_RECITERS;
  }
};

export const getReciterById = (
  reciters: Reciter[],
  reciterId: string,
): Reciter | undefined =>
  reciters.find((reciter) => reciter.id === reciterId);

export const isSurahAvailableForReciter = (
  reciter: Reciter,
  surahId: number,
): boolean => reciter.availableSurahIds.includes(surahId);

/**
 * Builds the audio URL for a given reciter/surah. Checks the reciter's
 * `audioUrls` overrides first (e.g. one-off Internet Archive uploads), then
 * falls back to the R2 bucket convention: `${R2_BUCKET_URL}/${reciterId}/surah-001.mp3`.
 */
export const getReciterSurahAudioUrl = (
  reciter: Reciter,
  surahId: number,
): string => {
  if (surahId < 1 || surahId > 114) {
    console.warn(`⚠️ Invalid surah ID: ${surahId}. Must be between 1 and 114.`);
    return '';
  }

  const override = reciter.audioUrls?.[surahId];
  if (override) {
    return override;
  }

  const paddedId = surahId.toString().padStart(3, '0');
  return `${getR2BucketUrl()}/${reciter.id}/surah-${paddedId}.mp3`;
};
