// services/tafsirs.ts
import { TafsirScholar } from '@/types/tafsirTypes';

/**
 * Tafsir scholar roster is managed through the admin app and hosted as a
 * JSON file in this same repo, served via jsDelivr's CDN — no backend
 * needed. Edit `content/tafsirs.json` (via the admin app) to add scholars
 * or surahs without an app rebuild.
 */
const TAFSIRS_JSON_URL =
  'https://cdn.jsdelivr.net/gh/mahad8v/Muhammed-Okasha@master/content/tafsirs.json';

/**
 * Bundled fallback used only if the remote fetch fails (offline, first-ever
 * launch before any cache exists, jsDelivr hiccup, etc.) so the app never
 * shows a blank tafsir list.
 */
const FALLBACK_TAFSIRS: TafsirScholar[] = [];

export const fetchTafsirScholars = async (): Promise<TafsirScholar[]> => {
  try {
    const response = await fetch(TAFSIRS_JSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch tafsir scholars: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Falling back to bundled tafsir scholars list:', error);
    return FALLBACK_TAFSIRS;
  }
};

export const isSurahAvailableForTafsirScholar = (
  scholar: TafsirScholar,
  surahId: number,
): boolean => scholar.availableSurahIds.includes(surahId);

export const getTafsirScholarSurahAudioUrl = (
  scholar: TafsirScholar,
  surahId: number,
): string => scholar.audioUrls[surahId] ?? '';
