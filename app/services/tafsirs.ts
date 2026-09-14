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

/**
 * Backfills a stable id for any tafsir item missing one (e.g. items added
 * before `id` existed in the schema). Downloads and playback both key off
 * this id, and crash on `undefined`, so this must run before the data is
 * used anywhere else.
 */
const withItemIds = (scholars: TafsirScholar[]): TafsirScholar[] =>
  scholars.map((scholar) => ({
    ...scholar,
    tafsirItems: (scholar.tafsirItems ?? []).map((item, index) =>
      item.id ? item : { ...item, id: `${scholar.id}-item-${index}` },
    ),
  }));

export const fetchTafsirScholars = async (): Promise<TafsirScholar[]> => {
  try {
    const response = await fetch(TAFSIRS_JSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch tafsir scholars: ${response.status}`);
    }
    const data: TafsirScholar[] = await response.json();
    return withItemIds(data);
  } catch (error) {
    console.warn('Falling back to bundled tafsir scholars list:', error);
    return FALLBACK_TAFSIRS;
  }
};

