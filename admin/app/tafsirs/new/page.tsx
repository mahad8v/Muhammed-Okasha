import Link from "next/link";
import { NewTafsirForm } from "./NewTafsirForm";

export default function NewTafsirPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/tafsirs"
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          ← Tafsir Scholars
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Add Tafsir Scholar
        </h1>
      </div>
      <NewTafsirForm />
    </div>
  );
}
