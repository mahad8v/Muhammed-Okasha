export interface TafsirScholar {
  id: string;
  name: string;
  country: string;
  title?: string;
  /** Profile image URL; falls back to the scholar's initials when omitted. */
  avatar?: string;
  /**
   * Surah ids (1-114) that have a recorded tafsir audio file for this
   * scholar. Anything not in this list is shown as "Coming soon" in the UI.
   */
  availableSurahIds: number[];
  /** Surah id -> direct tafsir audio URL. */
  audioUrls: Record<number, string>;
}
