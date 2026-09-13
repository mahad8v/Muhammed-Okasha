import Link from "next/link";
import { NewReciterForm } from "./NewReciterForm";

export default function NewReciterPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/reciters"
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          ← Reciters
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Add Reciter
        </h1>
      </div>
      <NewReciterForm />
    </div>
  );
}
