export interface Reciter {
  id: string;
  name: string;
  country: string;
  style?: string;
  avatar?: string;
  availableSurahIds: number[];
  audioUrls?: Record<string, string>;
}

export interface Scholar {
  id: string;
  name: string;
  title?: string;
  country: string;
  avatar?: string;
}
