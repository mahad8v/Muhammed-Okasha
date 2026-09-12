import Link from "next/link";
import { getReciters } from "@/lib/reciters";
import { DeleteButton } from "@/app/components/DeleteButton";
import { deleteReciter } from "@/lib/reciters";

export default async function RecitersPage() {
  const reciters = await getReciters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reciters</h1>
        <Link
          href="/reciters/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          + Add Reciter
        </Link>
      </div>

      {reciters.length === 0 ? (
        <p className="text-sm text-slate-500">No reciters yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {reciters.map((reciter) => (
            <li
              key={reciter.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <Link
                href={`/reciters/${reciter.id}`}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-slate-900">{reciter.name}</p>
                <p className="text-sm text-slate-500">
                  {reciter.country} · {reciter.availableSurahIds.length}/114
                  surahs
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href={`/reciters/${reciter.id}`}
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteReciter.bind(null, reciter.id)}
                  confirmMessage={`Delete reciter "${reciter.name}"? This cannot be undone.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
