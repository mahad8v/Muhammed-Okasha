import Link from "next/link";
import { getReciters } from "@/lib/reciters";
import { getScholars } from "@/lib/scholars";

export default async function DashboardPage() {
  const [reciters, scholars] = await Promise.all([
    getReciters(),
    getScholars(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/reciters"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-sm font-medium text-slate-500">Reciters</p>
          <p className="mt-2 text-3xl font-semibold">{reciters.length}</p>
          <p className="mt-1 text-sm text-emerald-700">Manage reciters →</p>
        </Link>
        <Link
          href="/scholars"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-sm font-medium text-slate-500">Scholars</p>
          <p className="mt-2 text-3xl font-semibold">{scholars.length}</p>
          <p className="mt-1 text-sm text-emerald-700">Manage scholars →</p>
        </Link>
      </div>
    </div>
  );
}
