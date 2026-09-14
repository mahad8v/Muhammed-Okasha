'use server';

import { revalidatePath } from 'next/cache';
import { resolveAudioUrl } from './audioUrl';
import { readJsonFile, writeJsonFile } from './github';
import { TafsirScholar } from './types';

const TAFSIRS_PATH = 'content/tafsirs.json';

export async function getTafsirScholars(): Promise<TafsirScholar[]> {
  const { content } = await readJsonFile<TafsirScholar[]>(TAFSIRS_PATH);
  return content;
}

export async function getTafsirScholar(
  id: string,
): Promise<TafsirScholar | undefined> {
  const scholars = await getTafsirScholars();
  return scholars.find((s) => s.id === id);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface TafsirScholarFormState {
  error?: string;
}

export async function createTafsirScholar(
  _prevState: TafsirScholarFormState,
  formData: FormData,
): Promise<TafsirScholarFormState> {
  const name = String(formData.get('name') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const avatar = String(formData.get('avatar') || '').trim();

  if (!name || !country) {
    return { error: 'Name and country are required.' };
  }

  const { content: scholars, sha } =
    await readJsonFile<TafsirScholar[]>(TAFSIRS_PATH);

  const id = slugify(name);
  if (scholars.some((s) => s.id === id)) {
    return { error: `A tafsir scholar with id "${id}" already exists.` };
  }

  const newScholar: TafsirScholar = {
    id,
    name,
    country,
    ...(title && { title }),
    ...(avatar && { avatar }),
    availableSurahIds: [],
    audioUrls: {},
  };

  const updated = [...scholars, newScholar];
  await writeJsonFile(
    TAFSIRS_PATH,
    updated,
    sha,
    `Add tafsir scholar: ${name}`,
  );

  revalidatePath('/tafsirs');
  return {};
}

export async function updateTafsirScholar(
  id: string,
  _prevState: TafsirScholarFormState,
  formData: FormData,
): Promise<TafsirScholarFormState> {
  const name = String(formData.get('name') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const avatar = String(formData.get('avatar') || '').trim();

  if (!name || !country) {
    return { error: 'Name and country are required.' };
  }

  const { content: scholars, sha } =
    await readJsonFile<TafsirScholar[]>(TAFSIRS_PATH);

  const index = scholars.findIndex((s) => s.id === id);
  if (index === -1) {
    return { error: 'Tafsir scholar not found.' };
  }

  scholars[index] = {
    ...scholars[index],
    name,
    country,
    title: title || undefined,
    avatar: avatar || undefined,
  };

  await writeJsonFile(
    TAFSIRS_PATH,
    scholars,
    sha,
    `Update tafsir scholar: ${name}`,
  );

  revalidatePath('/tafsirs');
  revalidatePath(`/tafsirs/${id}`);
  return {};
}

export async function deleteTafsirScholar(id: string): Promise<void> {
  const { content: scholars, sha } =
    await readJsonFile<TafsirScholar[]>(TAFSIRS_PATH);

  const target = scholars.find((s) => s.id === id);
  const updated = scholars.filter((s) => s.id !== id);

  await writeJsonFile(
    TAFSIRS_PATH,
    updated,
    sha,
    `Remove tafsir scholar: ${target?.name ?? id}`,
  );

  revalidatePath('/tafsirs');
}

export interface AddTafsirSurahFormState {
  error?: string;
}

export async function addSurahToTafsirScholar(
  scholarId: string,
  _prevState: AddTafsirSurahFormState,
  formData: FormData,
): Promise<AddTafsirSurahFormState> {
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

  const { content: scholars, sha } =
    await readJsonFile<TafsirScholar[]>(TAFSIRS_PATH);

  const index = scholars.findIndex((s) => s.id === scholarId);
  if (index === -1) {
    return { error: 'Tafsir scholar not found.' };
  }

  const scholar = scholars[index];
  const availableSurahIds = scholar.availableSurahIds.includes(surahId)
    ? scholar.availableSurahIds
    : [...scholar.availableSurahIds, surahId].sort((a, b) => a - b);

  scholars[index] = {
    ...scholar,
    availableSurahIds,
    audioUrls: { ...scholar.audioUrls, [surahId]: url },
  };

  await writeJsonFile(
    TAFSIRS_PATH,
    scholars,
    sha,
    `Add tafsir for surah ${surahId} by ${scholar.name}`,
  );

  revalidatePath(`/tafsirs/${scholarId}`);
  return {};
}

export async function removeSurahFromTafsirScholar(
  scholarId: string,
  surahId: number,
): Promise<void> {
  const { content: scholars, sha } =
    await readJsonFile<TafsirScholar[]>(TAFSIRS_PATH);

  const index = scholars.findIndex((s) => s.id === scholarId);
  if (index === -1) return;

  const scholar = scholars[index];
  const audioUrls = { ...scholar.audioUrls };
  delete audioUrls[surahId];

  scholars[index] = {
    ...scholar,
    availableSurahIds: scholar.availableSurahIds.filter(
      (id) => id !== surahId,
    ),
    audioUrls,
  };

  await writeJsonFile(
    TAFSIRS_PATH,
    scholars,
    sha,
    `Remove tafsir for surah ${surahId} from ${scholar.name}`,
  );

  revalidatePath(`/tafsirs/${scholarId}`);
}
