"use client";

import { useActionState } from "react";
import { TafsirScholar } from "@/lib/types";
import { updateTafsirScholar, TafsirScholarFormState } from "@/lib/tafsirs";
import { TextField } from "@/app/components/TextField";

const initialState: TafsirScholarFormState = {};

export function EditTafsirForm({ scholar }: { scholar: TafsirScholar }) {
  const boundAction = updateTafsirScholar.bind(null, scholar.id);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Scholar details
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">
          {scholar.id}
        </span>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <TextField label="Name" name="name" required defaultValue={scholar.name} />
      <TextField
        label="Country"
        name="country"
        required
        defaultValue={scholar.country}
      />
      <TextField
        label="Title"
        name="title"
        optional
        defaultValue={scholar.title ?? ""}
      />
      <TextField
        label="Avatar URL"
        name="avatar"
        type="url"
        optional
        defaultValue={scholar.avatar ?? ""}
      />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[#8B6F47] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6b552f] disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
