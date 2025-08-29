"use client";

import { useMemo } from "react";
import type { JobPost } from "@/server/db/schema";
import { trpc } from "@/lib/trpc/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function JobPost({
  post,
  disableApplicationUpload = false,
}: {
  post: JobPost;
  disableApplicationUpload?: boolean;
}) {
  const createApplication = trpc.createJobApplication.useMutation();

  const isSubmitting = createApplication.isPending;

  const handleSubmit = async (formData: FormData) => {
    if (disableApplicationUpload) return;

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const linkedinUrl = String(formData.get("linkedinUrl") ?? "");

    await createApplication.mutateAsync({
      jobPostId: post.id,
      name,
      email,
      linkedinUrl,
    });
  };

  const details = useMemo(
    () => [
      { label: "Location", value: post.location },
      { label: "Employment Type", value: post.employmentType },
      { label: "Location Type", value: post.locationType },
      { label: "Department", value: post.department },
    ],
    [post]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="text-2xl font-semibold">
          {post.department} — Software Engineer
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {details.map((d) => (
            <div key={d.label} className="text-sm">
              <div className="text-muted-foreground">{d.label}</div>
              <div>{d.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="text-sm text-muted-foreground">Overview</div>
          <div className="mt-2 whitespace-pre-wrap leading-7">
            {post.overview}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Overview</div>
            <div className="mt-2 whitespace-pre-wrap leading-7">
              {post.overview}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="application">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Application</div>
            <form
              className="mt-3 space-y-3"
              action={async (fd) => {
                await handleSubmit(fd);
              }}
            >
              <Input
                name="name"
                placeholder="Full name"
                disabled={disableApplicationUpload || isSubmitting}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                disabled={disableApplicationUpload || isSubmitting}
                required
              />
              <Input
                name="linkedinUrl"
                type="url"
                placeholder="LinkedIn URL"
                disabled={disableApplicationUpload || isSubmitting}
                required
              />
              <Button
                type="submit"
                disabled={disableApplicationUpload || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit application"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default JobPost;
