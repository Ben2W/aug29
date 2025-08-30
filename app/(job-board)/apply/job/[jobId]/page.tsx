"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { JobPost } from "@/components/job-post/JobPost";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplyJobPage() {
  const params = useParams<{ jobId: string }>();
  const id = Number(params?.jobId ?? "");

  const query = trpc.getJobPost.useQuery(
    { id },
    {
      enabled: Number.isFinite(id) && id > 0,
    }
  );

  const post = query.data;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Apply to job</h1>
        <Button asChild variant="outline" size="sm">
          <Link href={`/department/${post?.department ?? "engineering"}`}>
            Back to jobs
          </Link>
        </Button>
      </div>
      {query.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : !post ? (
        <div className="text-sm text-muted-foreground">Job not found.</div>
      ) : (
        <JobPost post={post} />
      )}
    </div>
  );
}
