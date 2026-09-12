import apiClient from '@/app/utils/apiClient';
import { Surah } from '@/types/quranTypes';

export const getChapters = async (): Promise<Surah[]> => {
  const res = await apiClient.get('/chapters');
  return res.data.chapters;
};

/**
 * Fetches verses for a given chapter with Arabic text and English translation
 * Uses Al-Quran Cloud API which has a simpler, more reliable response structure
 */

// services/quranApi.ts

export const getVerses = async (chapterId: number): Promise<any[]> => {
  // Fetch Arabic text, translation, and audio
  const response = await fetch(
    `https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-uthmani,en.asad,ar.alafasy`,
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.data || data.data.length < 3) {
    throw new Error('Invalid API response structure');
  }

  const arabicVerses = data.data[0].ayahs;
  const englishVerses = data.data[1].ayahs;
  const audioVerses = data.data[2].ayahs;

  // Fetch word-by-word data from quran.com API
  const wordTimingsPromises = arabicVerses.map(async (ayah: any) => {
    try {
      const wordResponse = await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${chapterId}:${ayah.numberInSurah}?words=true&word_fields=text_uthmani,audio_url&audio=7`,
      );
      const wordData = await wordResponse.json();
      return wordData.verse;
    } catch (error) {
      console.error('Error fetching word timings:', error);
      return null;
    }
  });

  const wordTimingsData = await Promise.all(wordTimingsPromises);

  return arabicVerses.map((ayah: any, index: number) => ({
    id: ayah.number,
    verse_number: ayah.numberInSurah,
    verse_key: `${chapterId}:${ayah.numberInSurah}`,
    text_uthmani: ayah.text,
    text: ayah.text,
    audio: audioVerses[index]?.audio,
    words: wordTimingsData[index]?.words || [],
    translations: [
      {
        id: index,
        resource_id: 1,
        text: englishVerses[index]?.text || '',
      },
    ],
  }));
};
