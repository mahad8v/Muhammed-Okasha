import Link from "next/link";
import { notFound } from "next/navigation";
import { getReciter, removeSurahFromReciter } from "@/lib/reciters";
import { SURAHS, getSurahById } from "@/lib/surahs";
import { EditReciterForm } from "./EditReciterForm";
import { AddSurahForm } from "./AddSurahForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { Avatar } from "@/app/components/Avatar";

export default async function ReciterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reciter = await getReciter(id);

  if (!reciter) {
    notFound();
  }

  const availableSurahs = SURAHS.filter(
    (surah) => !reciter.availableSurahIds.includes(surah.id),
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/reciters"
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          ← Reciters
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={reciter.name} avatar={reciter.avatar} size={44} />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {reciter.name}
            </h1>
            <p className="text-sm text-slate-500">{reciter.country}</p>
          </div>
        </div>
      </div>

      <EditReciterForm reciter={reciter} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Surahs</h2>
          <span className="rounded-full bg-[#8B6F47]/[0.06] px-2.5 py-1 text-xs font-medium text-[#8B6F47]">
            {reciter.availableSurahIds.length}/114 available
          </span>
        </div>

        {reciter.availableSurahIds.length > 0 && (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {reciter.availableSurahIds.map((surahId) => {
              const surah = getSurahById(surahId);
              const url = reciter.audioUrls?.[surahId];
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
                    action={removeSurahFromReciter.bind(
                      null,
                      reciter.id,
                      surahId,
                    )}
                    confirmMessage={`Remove surah ${surahId} from ${reciter.name}?`}
                  />
                </li>
              );
            })}
          </ul>
        )}

        <AddSurahForm reciterId={reciter.id} availableSurahs={availableSurahs} />
      </section>
    </div>
  );
}
