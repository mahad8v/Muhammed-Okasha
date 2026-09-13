'use server';

import { revalidatePath } from 'next/cache';
import { resolveAudioUrl } from './audioUrl';
import { readJsonFile, writeJsonFile } from './github';
import { DawahItem, Scholar } from './types';

const SCHOLARS_PATH = 'content/scholars.json';

export async function getScholars(): Promise<Scholar[]> {
  const { content } = await readJsonFile<Scholar[]>(SCHOLARS_PATH);
  return content;
}

export async function getScholar(id: string): Promise<Scholar | undefined> {
  const scholars = await getScholars();
  return scholars.find((s) => s.id === id);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface ScholarFormState {
  error?: string;
}

export async function createScholar(
  _prevState: ScholarFormState,
  formData: FormData,
): Promise<ScholarFormState> {
  const name = String(formData.get('name') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const avatar = String(formData.get('avatar') || '').trim();

  if (!name || !country) {
    return { error: 'Name and country are required.' };
  }

  const { content: scholars, sha } =
    await readJsonFile<Scholar[]>(SCHOLARS_PATH);

  const id = slugify(name);
  if (scholars.some((s) => s.id === id)) {
    return { error: `A scholar with id "${id}" already exists.` };
  }

  const newScholar: Scholar = {
    id,
    name,
    country,
    ...(title && { title }),
    ...(avatar && { avatar }),
  };

  const updated = [...scholars, newScholar];
  await writeJsonFile(SCHOLARS_PATH, updated, sha, `Add scholar: ${name}`);

  revalidatePath('/scholars');
  return {};
}

export async function updateScholar(
  id: string,
  _prevState: ScholarFormState,
  formData: FormData,
): Promise<ScholarFormState> {
  const name = String(formData.get('name') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const avatar = String(formData.get('avatar') || '').trim();

  if (!name || !country) {
    return { error: 'Name and country are required.' };
  }

  const { content: scholars, sha } =
    await readJsonFile<Scholar[]>(SCHOLARS_PATH);

  const index = scholars.findIndex((s) => s.id === id);
  if (index === -1) {
    return { error: 'Scholar not found.' };
  }

  scholars[index] = {
    ...scholars[index],
    name,
    country,
    title: title || undefined,
    avatar: avatar || undefined,
  };

  await writeJsonFile(SCHOLARS_PATH, scholars, sha, `Update scholar: ${name}`);

  revalidatePath('/scholars');
  revalidatePath(`/scholars/${id}`);
  return {};
}

export async function deleteScholar(id: string): Promise<void> {
  const { content: scholars, sha } =
    await readJsonFile<Scholar[]>(SCHOLARS_PATH);

  const target = scholars.find((s) => s.id === id);
  const updated = scholars.filter((s) => s.id !== id);

  await writeJsonFile(
    SCHOLARS_PATH,
    updated,
    sha,
    `Remove scholar: ${target?.name ?? id}`,
  );

  revalidatePath('/scholars');
}

export interface AddDawahFormState {
  error?: string;
}

export async function addDawahToScholar(
  scholarId: string,
  _prevState: AddDawahFormState,
  formData: FormData,
): Promise<AddDawahFormState> {
  const title = String(formData.get('title') || '').trim();
  const rawUrl = String(formData.get('url') || '').trim();

  if (!title) {
    return { error: 'Title is required.' };
  }
  if (!rawUrl) {
    return { error: 'URL is required.' };
  }

  const resolved = await resolveAudioUrl(rawUrl);
  if ('error' in resolved) {
    return { error: resolved.error };
  }
  const url = resolved.url;

  const { content: scholars, sha } =
    await readJsonFile<Scholar[]>(SCHOLARS_PATH);

  const index = scholars.findIndex((s) => s.id === scholarId);
  if (index === -1) {
    return { error: 'Scholar not found.' };
  }

  const scholar = scholars[index];
  const newItem: DawahItem = { title, url };

  scholars[index] = {
    ...scholar,
    dawahItems: [...(scholar.dawahItems ?? []), newItem],
  };

  await writeJsonFile(
    SCHOLARS_PATH,
    scholars,
    sha,
    `Add dawah "${title}" for ${scholar.name}`,
  );

  revalidatePath(`/scholars/${scholarId}`);
  return {};
}

export async function removeDawahFromScholar(
  scholarId: string,
  index: number,
): Promise<void> {
  const { content: scholars, sha } =
    await readJsonFile<Scholar[]>(SCHOLARS_PATH);

  const scholarIndex = scholars.findIndex((s) => s.id === scholarId);
  if (scholarIndex === -1) return;

  const scholar = scholars[scholarIndex];
  const dawahItems = (scholar.dawahItems ?? []).filter((_, i) => i !== index);

  scholars[scholarIndex] = { ...scholar, dawahItems };

  await writeJsonFile(
    SCHOLARS_PATH,
    scholars,
    sha,
    `Remove a dawah item from ${scholar.name}`,
  );

  revalidatePath(`/scholars/${scholarId}`);
}
