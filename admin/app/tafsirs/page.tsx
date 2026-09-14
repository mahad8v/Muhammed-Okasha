import Link from "next/link";
import { getTafsirScholars, deleteTafsirScholar } from "@/lib/tafsirs";
import { DeleteButton } from "@/app/components/DeleteButton";
import { Avatar } from "@/app/components/Avatar";
import { PlusIcon, PencilIcon } from "@/app/components/icons";

export default async function TafsirsPage() {
  const scholars = await getTafsirScholars();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Tafsir Scholars
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {scholars.length} scholar{scholars.length === 1 ? "" : "s"}{" "}
            configured
          </p>
        </div>
        <Link
          href="/tafsirs/new"
          className="flex items-center gap-2 rounded-lg bg-[#8B6F47] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6b552f]"
        >
          <PlusIcon className="h-4 w-4" />
          Add Scholar
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {scholars.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            No tafsir scholars yet — add one to get started.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3 font-medium">Scholar</th>
                <th className="px-6 py-3 font-medium">Country</th>
                <th className="px-6 py-3 font-medium">Surahs</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scholars.map((scholar) => (
                <tr key={scholar.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/tafsirs/${scholar.id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar name={scholar.name} avatar={scholar.avatar} />
                      <span className="font-medium text-slate-900">
                        {scholar.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {scholar.country}
                  </td>
                  <td className="px-6 py-4">
                    {scholar.availableSurahIds.length > 0 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {scholar.availableSurahIds.length}/114
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        Empty
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/tafsirs/${scholar.id}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`Edit ${scholar.name}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <DeleteButton
                        action={deleteTafsirScholar.bind(null, scholar.id)}
                        confirmMessage={`Delete tafsir scholar "${scholar.name}"? This cannot be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
