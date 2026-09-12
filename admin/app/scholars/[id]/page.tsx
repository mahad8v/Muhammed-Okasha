import { notFound } from "next/navigation";
import { getScholar } from "@/lib/scholars";
import { EditScholarForm } from "./EditScholarForm";

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
      <h1 className="text-2xl font-semibold">{scholar.name}</h1>
      <EditScholarForm scholar={scholar} />
    </div>
  );
}
