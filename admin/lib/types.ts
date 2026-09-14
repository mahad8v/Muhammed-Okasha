export interface Reciter {
  id: string;
  name: string;
  country: string;
  style?: string;
  avatar?: string;
  availableSurahIds: number[];
  audioUrls?: Record<string, string>;
}

export interface DawahItem {
  title: string;
  url: string;
}

export interface Scholar {
  id: string;
  name: string;
  title?: string;
  country: string;
  avatar?: string;
  dawahItems?: DawahItem[];
}

export interface TafsirScholar {
  id: string;
  name: string;
  country: string;
  title?: string;
  avatar?: string;
  availableSurahIds: number[];
  audioUrls?: Record<string, string>;
}
