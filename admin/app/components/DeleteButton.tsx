"use client";

import { TrashIcon } from "./icons";

export function DeleteButton({
  action,
  confirmMessage,
  label,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={label ?? "Delete"}
        className="flex items-center gap-1.5 rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
      >
        <TrashIcon className="h-4 w-4" />
        {label && <span className="text-sm font-medium">{label}</span>}
      </button>
    </form>
  );
}
