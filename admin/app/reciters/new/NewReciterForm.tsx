"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createReciter, ReciterFormState } from "@/lib/reciters";
import { TextField } from "@/app/components/TextField";

const initialState: ReciterFormState = {};

export function NewReciterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prevState: ReciterFormState, formData: FormData) => {
      const result = await createReciter(prevState, formData);
      if (!result.error) {
        router.push("/reciters");
      }
      return result;
    },
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <TextField
        label="Name"
        name="name"
        required
        placeholder="e.g. Muhammed Okasha Badjie"
      />
      <TextField label="Country" name="country" required placeholder="e.g. Gambia" />
      <TextField label="Style" name="style" optional />
      <TextField
        label="Avatar URL"
        name="avatar"
        type="url"
        optional
        placeholder="https://..."
      />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[#8B6F47] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6b552f] disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add Reciter"}
      </button>
    </form>
  );
}
