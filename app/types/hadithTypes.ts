export interface HadithBook {
  id: number;
  bookName: string;
  writerName: string;
  bookSlug: string;
  hadiths_count: number;
  chapters_count: number;
}

export interface HadithChapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterArabic: string;
  bookSlug: string;
}

export type HadithGrade = 'Sahih' | 'Hasan' | 'Da`eef';

export interface HadithItem {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  status: HadithGrade | string;
  bookSlug: string;
  chapter: HadithChapter;
}

export interface HadithPage {
  data: HadithItem[];
  current_page: number;
  last_page: number;
}
