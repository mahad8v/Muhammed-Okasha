export interface Reciter {
  id: string;
  name: string;
  country: string;
  style?: string;
  /** Profile image URL; falls back to the reciter's initials when omitted. */
  avatar?: string;
  /**
   * Surah ids (1-114) that have a recorded audio file for this reciter.
   * Anything not in this list is shown as "Coming soon" in the UI.
   */
  availableSurahIds: number[];
  /**
   * Explicit surah id -> direct audio URL overrides, for files that don't
   * follow the `{bucket}/{reciterId}/surah-XXX.mp3` R2 naming convention
   * (e.g. one-off Internet Archive uploads with their own filenames).
   */
  audioUrls?: Record<number, string>;
}
