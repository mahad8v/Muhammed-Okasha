import Link from "next/link";
import { NewScholarForm } from "./NewScholarForm";

export default function NewScholarPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/scholars"
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          ← Scholars
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Add Scholar
        </h1>
      </div>
      <NewScholarForm />
    </div>
  );
}
