import Link from "next/link";
import { notFound } from "next/navigation";
import { getScholar, removeDawahFromScholar } from "@/lib/scholars";
import { EditScholarForm } from "./EditScholarForm";
import { AddDawahForm } from "./AddDawahForm";
import { Avatar } from "@/app/components/Avatar";
import { DeleteButton } from "@/app/components/DeleteButton";

export default async function ScholarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scholar = await getScholar(id);

  if (!scholar) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/scholars"
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          ← Scholars
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={scholar.name} avatar={scholar.avatar} size={44} />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {scholar.name}
            </h1>
            <p className="text-sm text-slate-500">
              {scholar.title ? `${scholar.title} · ` : ""}
              {scholar.country}
            </p>
          </div>
        </div>
      </div>

      <EditScholarForm scholar={scholar} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Dawah</h2>
          <span className="rounded-full bg-[#8B6F47]/[0.06] px-2.5 py-1 text-xs font-medium text-[#8B6F47]">
            {scholar.dawahItems?.length ?? 0} item
            {scholar.dawahItems?.length === 1 ? "" : "s"}
          </span>
        </div>

        {scholar.dawahItems && scholar.dawahItems.length > 0 && (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {scholar.dawahItems.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="truncate text-xs text-slate-400">
                    {item.url}
                  </p>
                </div>
                <DeleteButton
                  action={removeDawahFromScholar.bind(
                    null,
                    scholar.id,
                    index,
                  )}
                  confirmMessage={`Remove "${item.title}" from ${scholar.name}?`}
                />
              </li>
            ))}
          </ul>
        )}

        <AddDawahForm scholarId={scholar.id} />
      </section>
    </div>
  );
}
