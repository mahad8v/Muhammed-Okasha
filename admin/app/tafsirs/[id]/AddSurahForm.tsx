"use client";

import { useActionState } from "react";
import { addSurahToTafsirScholar, AddTafsirSurahFormState } from "@/lib/tafsirs";
import { SurahRef } from "@/lib/surahs";

const initialState: AddTafsirSurahFormState = {};

export function AddSurahForm({
  scholarId,
  availableSurahs,
}: {
  scholarId: string;
  availableSurahs: SurahRef[];
}) {
  const boundAction = addSurahToTafsirScholar.bind(null, scholarId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  if (availableSurahs.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        All 114 surahs have been added for this scholar.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 sm:flex-row sm:items-end"
    >
      {state.error && (
        <p className="w-full rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-700 sm:hidden">
          {state.error}
        </p>
      )}

      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-600">
          Surah
        </label>
        <select
          name="surahId"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/15"
        >
          {availableSurahs.map((surah) => (
            <option key={surah.id} value={surah.id}>
              {surah.id}. {surah.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-[2]">
        <label className="block text-xs font-medium text-slate-600">
          Tafsir Audio URL
        </label>
        <input
          name="url"
          type="url"
          required
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/15"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[#8B6F47] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6b552f] disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add"}
      </button>

      {state.error && (
        <p className="hidden w-full text-sm text-red-700 sm:block">
          {state.error}
        </p>
      )}
    </form>
  );
}
