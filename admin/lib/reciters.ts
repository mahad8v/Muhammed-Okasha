'use server';

import { revalidatePath } from 'next/cache';
import { resolveAudioUrl } from './audioUrl';
import { readJsonFile, writeJsonFile } from './github';
import { Reciter } from './types';

const RECITERS_PATH = 'content/reciters.json';

export async function getReciters(): Promise<Reciter[]> {
  const { content } = await readJsonFile<Reciter[]>(RECITERS_PATH);
  return content;
}

export async function getReciter(id: string): Promise<Reciter | undefined> {
  const reciters = await getReciters();
  return reciters.find((r) => r.id === id);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface ReciterFormState {
  error?: string;
}

export async function createReciter(
  _prevState: ReciterFormState,
  formData: FormData,
): Promise<ReciterFormState> {
  const name = String(formData.get('name') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const style = String(formData.get('style') || '').trim();
  const avatar = String(formData.get('avatar') || '').trim();

  if (!name || !country) {
    return { error: 'Name and country are required.' };
  }

  const { content: reciters, sha } =
    await readJsonFile<Reciter[]>(RECITERS_PATH);

  const id = slugify(name);
  if (reciters.some((r) => r.id === id)) {
    return { error: `A reciter with id "${id}" already exists.` };
  }

  const newReciter: Reciter = {
    id,
    name,
    country,
    ...(style && { style }),
    ...(avatar && { avatar }),
    availableSurahIds: [],
    audioUrls: {},
  };

  const updated = [...reciters, newReciter];
  await writeJsonFile(
    RECITERS_PATH,
    updated,
    sha,
    `Add reciter: ${name}`,
  );

  revalidatePath('/reciters');
  return {};
}

export async function updateReciter(
  id: string,
  _prevState: ReciterFormState,
  formData: FormData,
): Promise<ReciterFormState> {
  const name = String(formData.get('name') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const style = String(formData.get('style') || '').trim();
  const avatar = String(formData.get('avatar') || '').trim();

  if (!name || !country) {
    return { error: 'Name and country are required.' };
  }

  const { content: reciters, sha } =
    await readJsonFile<Reciter[]>(RECITERS_PATH);

  const index = reciters.findIndex((r) => r.id === id);
  if (index === -1) {
    return { error: 'Reciter not found.' };
  }

  reciters[index] = {
    ...reciters[index],
    name,
    country,
    style: style || undefined,
    avatar: avatar || undefined,
  };

  await writeJsonFile(
    RECITERS_PATH,
    reciters,
    sha,
    `Update reciter: ${name}`,
  );

  revalidatePath('/reciters');
  revalidatePath(`/reciters/${id}`);
  return {};
}

export async function deleteReciter(id: string): Promise<void> {
  const { content: reciters, sha } =
    await readJsonFile<Reciter[]>(RECITERS_PATH);

  const target = reciters.find((r) => r.id === id);
  const updated = reciters.filter((r) => r.id !== id);

  await writeJsonFile(
    RECITERS_PATH,
    updated,
    sha,
    `Remove reciter: ${target?.name ?? id}`,
  );

  revalidatePath('/reciters');
}

export interface AddSurahFormState {
  error?: string;
}

export async function addSurahToReciter(
  reciterId: string,
  _prevState: AddSurahFormState,
  formData: FormData,
): Promise<AddSurahFormState> {
  const surahId = Number(formData.get('surahId'));
  const rawUrl = String(formData.get('url') || '').trim();

  if (!surahId || surahId < 1 || surahId > 114) {
    return { error: 'Pick a valid surah.' };
  }
  if (!rawUrl) {
    return { error: 'Audio URL is required.' };
  }

  const resolved = await resolveAudioUrl(rawUrl);
  if ('error' in resolved) {
    return { error: resolved.error };
  }
  const url = resolved.url;

  const { content: reciters, sha } =
    await readJsonFile<Reciter[]>(RECITERS_PATH);

  const index = reciters.findIndex((r) => r.id === reciterId);
  if (index === -1) {
    return { error: 'Reciter not found.' };
  }

  const reciter = reciters[index];
  const availableSurahIds = reciter.availableSurahIds.includes(surahId)
    ? reciter.availableSurahIds
    : [...reciter.availableSurahIds, surahId].sort((a, b) => a - b);

  reciters[index] = {
    ...reciter,
    availableSurahIds,
    audioUrls: { ...reciter.audioUrls, [surahId]: url },
  };

  await writeJsonFile(
    RECITERS_PATH,
    reciters,
    sha,
    `Add surah ${surahId} for ${reciter.name}`,
  );

  revalidatePath(`/reciters/${reciterId}`);
  return {};
}

export async function removeSurahFromReciter(
  reciterId: string,
  surahId: number,
): Promise<void> {
  const { content: reciters, sha } =
    await readJsonFile<Reciter[]>(RECITERS_PATH);

  const index = reciters.findIndex((r) => r.id === reciterId);
  if (index === -1) return;

  const reciter = reciters[index];
  const audioUrls = { ...reciter.audioUrls };
  delete audioUrls[surahId];

  reciters[index] = {
    ...reciter,
    availableSurahIds: reciter.availableSurahIds.filter(
      (id) => id !== surahId,
    ),
    audioUrls,
  };

  await writeJsonFile(
    RECITERS_PATH,
    reciters,
    sha,
    `Remove surah ${surahId} from ${reciter.name}`,
  );

  revalidatePath(`/reciters/${reciterId}`);
}
