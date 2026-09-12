// services/scholars.ts
import { Scholar } from '@/types/scholarTypes';

/**
 * Scholar roster is managed through the admin app and hosted as a JSON file
 * in this same repo, served via jsDelivr's CDN — no backend/server needed.
 * Edit `content/scholars.json` (via the admin app) to add scholars without
 * an app rebuild.
 */
const SCHOLARS_JSON_URL =
  'https://cdn.jsdelivr.net/gh/mahad8v/Muhammed-Okasha@master/content/scholars.json';

/** Bundled fallback used only if the remote fetch fails. */
const FALLBACK_SCHOLARS: Scholar[] = [
  {
    id: 'ustaz-bun-jeng',
    name: 'Ustaz Bun Jeng',
    title: 'Ustaz',
    country: 'Gambia',
  },
];

export const fetchScholars = async (): Promise<Scholar[]> => {
  try {
    const response = await fetch(SCHOLARS_JSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch scholars: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Falling back to bundled scholars list:', error);
    return FALLBACK_SCHOLARS;
  }
};
