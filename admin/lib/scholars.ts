'use server';

import { revalidatePath } from 'next/cache';
import { readJsonFile, writeJsonFile } from './github';
import { Scholar } from './types';

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
