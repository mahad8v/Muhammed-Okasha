export interface Surah {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

// Updated to match actual Quran.com API v4 response
export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  ruku_number?: number;
  manzil_number?: number;
  sajdah_number?: number | null;
  page_number?: number;
  juz_number?: number;

  // Different text formats available in the API
  text_uthmani?: string;
  text_indopak?: string;
  text_imlaei?: string;

  // Words array (if words=true parameter is used)
  words?: Array<{
    id: number;
    position: number;
    audio_url: string;
    char_type_name: string;
    text_uthmani: string;
    page_number: number;
    line_number: number;
    text: string;
    translation: {
      text: string;
      language_name: string;
    };
    transliteration: {
      text: string;
      language_name: string;
    };
  }>;

  // Translations array
  translations?: Translation[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  language_name?: string;
  resource_name?: string;
}

export interface VerseResponse {
  verses: Verse[];
  pagination?: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}
