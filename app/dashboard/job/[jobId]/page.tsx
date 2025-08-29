import { notFound } from "next/navigation";

export default function JobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  const id = Number(params.jobId);
  if (!Number.isFinite(id)) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Job #{id}</h1>
      <p className="text-muted-foreground">Details coming soon.</p>
    </div>
  );
}
