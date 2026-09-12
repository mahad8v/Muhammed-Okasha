import { notFound } from "next/navigation";
import { getReciter, removeSurahFromReciter } from "@/lib/reciters";
import { SURAHS, getSurahById } from "@/lib/surahs";
import { EditReciterForm } from "./EditReciterForm";
import { AddSurahForm } from "./AddSurahForm";
import { DeleteButton } from "@/app/components/DeleteButton";

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
      <h1 className="text-2xl font-semibold">{reciter.name}</h1>

      <EditReciterForm reciter={reciter} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Surahs ({reciter.availableSurahIds.length}/114)
        </h2>

        {reciter.availableSurahIds.length > 0 && (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {reciter.availableSurahIds.map((surahId) => {
              const surah = getSurahById(surahId);
              const url = reciter.audioUrls?.[surahId];
              return (
                <li
                  key={surahId}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {surahId}. {surah?.name ?? "Unknown"}
                    </p>
                    {url && (
                      <p className="truncate text-xs text-slate-500">{url}</p>
                    )}
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
