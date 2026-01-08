import apiClient from '@/app/utils/apiClient';
import { Surah } from '@/types/quranTypes';

export const getChapters = async (): Promise<Surah[]> => {
  const res = await apiClient.get('/chapters');
  return res.data.chapters;
};
