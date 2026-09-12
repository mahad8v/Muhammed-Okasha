import Link from "next/link";
import { getScholars, deleteScholar } from "@/lib/scholars";
import { DeleteButton } from "@/app/components/DeleteButton";

export default async function ScholarsPage() {
  const scholars = await getScholars();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Scholars</h1>
        <Link
          href="/scholars/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          + Add Scholar
        </Link>
      </div>

      {scholars.length === 0 ? (
        <p className="text-sm text-slate-500">No scholars yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {scholars.map((scholar) => (
            <li
              key={scholar.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <Link href={`/scholars/${scholar.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">{scholar.name}</p>
                <p className="text-sm text-slate-500">
                  {scholar.title ? `${scholar.title} · ` : ""}
                  {scholar.country}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href={`/scholars/${scholar.id}`}
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteScholar.bind(null, scholar.id)}
                  confirmMessage={`Delete scholar "${scholar.name}"? This cannot be undone.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
