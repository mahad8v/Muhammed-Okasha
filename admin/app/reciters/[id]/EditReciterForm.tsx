"use client";

import { useActionState } from "react";
import { Reciter } from "@/lib/types";
import { updateReciter, ReciterFormState } from "@/lib/reciters";

const initialState: ReciterFormState = {};

export function EditReciterForm({ reciter }: { reciter: Reciter }) {
  const boundAction = updateReciter.bind(null, reciter.id);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
    >
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {!state.error && (
        <p className="text-xs text-slate-400">id: {reciter.id}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          name="name"
          required
          defaultValue={reciter.name}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Country
        </label>
        <input
          name="country"
          required
          defaultValue={reciter.country}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Style <span className="text-slate-400">(optional)</span>
        </label>
        <input
          name="style"
          defaultValue={reciter.style ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Avatar URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          name="avatar"
          type="url"
          defaultValue={reciter.avatar ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
