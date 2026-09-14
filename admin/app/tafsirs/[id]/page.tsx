import Link from "next/link";
import { notFound } from "next/navigation";
import { getTafsirScholar, removeSurahFromTafsirScholar } from "@/lib/tafsirs";
import { SURAHS, getSurahById } from "@/lib/surahs";
import { EditTafsirForm } from "./EditTafsirForm";
import { AddSurahForm } from "./AddSurahForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { Avatar } from "@/app/components/Avatar";

export default async function TafsirDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scholar = await getTafsirScholar(id);

  if (!scholar) {
    notFound();
  }

  const availableSurahs = SURAHS.filter(
    (surah) => !scholar.availableSurahIds.includes(surah.id),
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/tafsirs"
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          ← Tafsir Scholars
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={scholar.name} avatar={scholar.avatar} size={44} />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {scholar.name}
            </h1>
            <p className="text-sm text-slate-500">{scholar.country}</p>
          </div>
        </div>
      </div>

      <EditTafsirForm scholar={scholar} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Surahs</h2>
          <span className="rounded-full bg-[#8B6F47]/[0.06] px-2.5 py-1 text-xs font-medium text-[#8B6F47]">
            {scholar.availableSurahIds.length}/114 available
          </span>
        </div>

        {scholar.availableSurahIds.length > 0 && (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {scholar.availableSurahIds.map((surahId) => {
              const surah = getSurahById(surahId);
              const url = scholar.audioUrls?.[surahId];
              return (
                <li
                  key={surahId}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B6F47]/[0.06] text-xs font-semibold text-[#8B6F47]">
                      {surahId}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {surah?.name ?? "Unknown"}
                      </p>
                      {url && (
                        <p className="truncate text-xs text-slate-400">
                          {url}
                        </p>
                      )}
                    </div>
                  </div>
                  <DeleteButton
                    action={removeSurahFromTafsirScholar.bind(
                      null,
                      scholar.id,
                      surahId,
                    )}
                    confirmMessage={`Remove tafsir for surah ${surahId} from ${scholar.name}?`}
                  />
                </li>
              );
            })}
          </ul>
        )}

        <AddSurahForm scholarId={scholar.id} availableSurahs={availableSurahs} />
      </section>
    </div>
  );
}
