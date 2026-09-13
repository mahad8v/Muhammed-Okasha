"use client";

import { useActionState } from "react";
import { addDawahToScholar, AddDawahFormState } from "@/lib/scholars";

const initialState: AddDawahFormState = {};

export function AddDawahForm({ scholarId }: { scholarId: string }) {
  const boundAction = addDawahToScholar.bind(null, scholarId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

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
          Title
        </label>
        <input
          name="title"
          required
          placeholder="e.g. The Importance of Sincerity"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/15"
        />
      </div>

      <div className="flex-[2]">
        <label className="block text-xs font-medium text-slate-600">
          Audio/Video URL
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
