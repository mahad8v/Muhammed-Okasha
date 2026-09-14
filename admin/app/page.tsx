import Link from "next/link";
import { getReciters } from "@/lib/reciters";
import { getScholars } from "@/lib/scholars";
import { getTafsirScholars } from "@/lib/tafsirs";
import { getSurahById } from "@/lib/surahs";
import { MicIcon, BookIcon, ScrollIcon, PlayCircleIcon, ChevronRightIcon } from "@/app/components/icons";
import { Avatar } from "@/app/components/Avatar";

export default async function DashboardPage() {
  const [reciters, scholars, tafsirScholars] = await Promise.all([
    getReciters(),
    getScholars(),
    getTafsirScholars(),
  ]);

  const totalSurahsCovered = reciters.reduce(
    (sum, r) => sum + r.availableSurahIds.length,
    0,
  );

  const stats = [
    {
      label: "Reciters",
      value: reciters.length,
      href: "/reciters",
      icon: MicIcon,
    },
    {
      label: "Tafsir Scholars",
      value: tafsirScholars.length,
      href: "/tafsirs",
      icon: ScrollIcon,
    },
    {
      label: "Scholars",
      value: scholars.length,
      href: "/scholars",
      icon: BookIcon,
    },
    {
      label: "Surahs with audio",
      value: `${totalSurahsCovered} / ${reciters.length * 114}`,
      href: "/reciters",
      icon: PlayCircleIcon,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          A snapshot of the content currently live in the app.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#8B6F47]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B6F47]/[0.06] text-[#8B6F47]">
                  <Icon className="h-5 w-5" />
                </span>
                <ChevronRightIcon className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#8B6F47]" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Reciters</h2>
          <Link
            href="/reciters"
            className="text-sm font-medium text-[#8B6F47] hover:text-[#6b552f]"
          >
            View all
          </Link>
        </div>

        {reciters.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">
            No reciters yet — add one to get started.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reciters.slice(0, 5).map((reciter) => (
              <li key={reciter.id}>
                <Link
                  href={`/reciters/${reciter.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={reciter.name} avatar={reciter.avatar} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {reciter.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {reciter.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">
                      {reciter.availableSurahIds.length > 0
                        ? reciter.availableSurahIds
                            .slice(0, 2)
                            .map((id) => getSurahById(id)?.name)
                            .filter(Boolean)
                            .join(", ") +
                          (reciter.availableSurahIds.length > 2
                            ? ` +${reciter.availableSurahIds.length - 2} more`
                            : "")
                        : "No surahs yet"}
                    </span>
                    <StatusBadge count={reciter.availableSurahIds.length} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
        Empty
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {count} live
    </span>
  );
}
