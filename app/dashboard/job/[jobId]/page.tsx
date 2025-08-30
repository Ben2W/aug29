"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { JobPost } from "@/components/job-post/JobPost";
import JobApplications from "@/components/job-applications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const id = Number(jobId);
  if (!Number.isFinite(id)) return notFound();

  const { data, isLoading } = trpc.getJobPost.useQuery({ id });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!data) return notFound();

  return (
    <div className="p-6">
      <Tabs defaultValue="applications" className="w-full">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <JobApplications jobPostId={data.id} />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <JobPost post={data} disableApplicationUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}
