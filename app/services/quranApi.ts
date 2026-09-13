import apiClient from '@/app/utils/apiClient';
import { Surah } from '@/types/quranTypes';

export const getChapters = async (): Promise<Surah[]> => {
  const res = await apiClient.get('/chapters');
  return res.data.chapters;
};

/**
 * Fetches the Arabic (Uthmani script) text for every verse of a chapter.
 * Uses Al-Quran Cloud API which has a simpler, more reliable response structure.
 */
export const getVerses = async (chapterId: number): Promise<any[]> => {
  const response = await fetch(
    `https://api.alquran.cloud/v1/surah/${chapterId}/quran-uthmani`,
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.data?.ayahs) {
    throw new Error('Invalid API response structure');
  }

  const arabicVerses = data.data.ayahs;

  // The Uthmani script embeds the Bismillah into the text of ayah 1 for
  // every surah except At-Tawbah (9) — but the surah screen already shows
  // it once as a standalone heading above the verses, so strip it back out
  // of ayah 1's text here to avoid displaying it twice. Left untouched for
  // Al-Fatihah, whose ayah 1 *is* the Bismillah and nothing else.
  // NFC-normalized because the API's combining diacritics (e.g. shadda vs.
  // fatha) aren't always in the same order as a hand-typed literal, which
  // otherwise makes startsWith() silently fail despite an identical glyph.
  const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'.normalize('NFC');

  return arabicVerses.map((ayah: any) => {
    let text = ayah.text.replace(/^﻿/, '').normalize('NFC');
    if (
      chapterId !== 9 &&
      ayah.numberInSurah === 1 &&
      text.startsWith(BISMILLAH) &&
      text.trim() !== BISMILLAH
    ) {
      text = text.slice(BISMILLAH.length).trim();
    }

    return {
      id: ayah.number,
      verse_number: ayah.numberInSurah,
      verse_key: `${chapterId}:${ayah.numberInSurah}`,
      text_uthmani: text,
      text,
    };
  });
};
