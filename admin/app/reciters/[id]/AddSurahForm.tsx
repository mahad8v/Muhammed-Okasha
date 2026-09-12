"use client";

import { useActionState } from "react";
import { addSurahToReciter, AddSurahFormState } from "@/lib/reciters";
import { SurahRef } from "@/lib/surahs";

const initialState: AddSurahFormState = {};

export function AddSurahForm({
  reciterId,
  availableSurahs,
}: {
  reciterId: string;
  availableSurahs: SurahRef[];
}) {
  const boundAction = addSurahToReciter.bind(null, reciterId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  if (availableSurahs.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        All 114 surahs have been added for this reciter.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-end"
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
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
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
          Audio URL
        </label>
        <input
          name="url"
          type="url"
          required
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
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
