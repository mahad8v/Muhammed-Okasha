"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createScholar, ScholarFormState } from "@/lib/scholars";

const initialState: ScholarFormState = {};

export function NewScholarForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prevState: ScholarFormState, formData: FormData) => {
      const result = await createScholar(prevState, formData);
      if (!result.error) {
        router.push("/scholars");
      }
      return result;
    },
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

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="e.g. Ustaz Bun Jeng"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Title <span className="text-slate-400">(optional)</span>
        </label>
        <input
          name="title"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="e.g. Ustaz, Imam, Sheikh"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Country
        </label>
        <input
          name="country"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="e.g. Gambia"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Avatar URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          name="avatar"
          type="url"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add Scholar"}
      </button>
    </form>
  );
}
