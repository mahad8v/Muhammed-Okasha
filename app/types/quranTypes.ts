export interface Surah {
  id: number;
  revelation_place: string;
  name_simple: string;
  name_arabic: string;
  name_complex: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}
