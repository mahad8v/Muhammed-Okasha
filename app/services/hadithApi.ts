import { HadithBook, HadithGrade, HadithPage } from '@/types/hadithTypes';

/**
 * hadithapi.com — requires a free API key (EXPO_PUBLIC_HADITH_API_KEY in .env).
 * Supports real server-side search, grade filtering, and pagination.
 * https://hadithapi.com/docs
 */
const HADITH_API_BASE = 'https://hadithapi.com/api';
const API_KEY = process.env.EXPO_PUBLIC_HADITH_API_KEY;

/** Thrown when the API responds 404 — e.g. an unknown book slug. */
export class HadithNotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'HadithNotFoundError';
  }
}

export const fetchHadithBooks = async (): Promise<HadithBook[]> => {
  const response = await fetch(
    `${HADITH_API_BASE}/books?apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch hadith books: ${response.status}`);
  }

  const json = await response.json();
  return json.books;
};

interface FetchHadithsParams {
  bookSlug: string;
  page?: number;
  paginate?: number;
  status?: HadithGrade;
  searchEnglish?: string;
}

export const fetchHadiths = async ({
  bookSlug,
  page = 1,
  paginate = 25,
  status,
  searchEnglish,
}: FetchHadithsParams): Promise<HadithPage> => {
  const params = new URLSearchParams({
    apiKey: API_KEY ?? '',
    book: bookSlug,
    paginate: paginate.toString(),
    page: page.toString(),
  });

  if (status) {
    params.set('status', status);
  }

  if (searchEnglish) {
    params.set('hadithEnglish', searchEnglish);
  }

  const response = await fetch(
    `${HADITH_API_BASE}/hadiths/?${params.toString()}`,
    { redirect: 'follow' },
  );

  if (response.status === 404) {
    throw new HadithNotFoundError(`No hadiths found for "${bookSlug}"`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch hadiths: ${response.status}`);
  }

  const json = await response.json();
  return json.hadiths;
};
