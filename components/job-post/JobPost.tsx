"use client";

import { useMemo } from "react";
import type { JobPost } from "@/server/db/schema";
import { trpc } from "@/lib/trpc/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  DepartmentIcon,
  departmentIconMap,
  type DepartmentKey,
} from "@/components/department-icon";
import { toast } from "sonner";

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

    toast.success("Application submitted successfully");
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <div className="sticky top-4 rounded-lg p-4">
            <div className="text-xl font-semibold">Role details</div>
            <div className="mt-4 space-y-4">
              {details.map((d, idx) => (
                <div key={d.label}>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {d.label}
                  </div>
                  {d.label === "Department" ? (
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      {post.department in departmentIconMap ? (
                        <DepartmentIcon
                          value={post.department as DepartmentKey}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      ) : null}
                      <span>{post.department}</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm">{d.value}</div>
                  )}
                  {idx !== details.length - 1 ? (
                    <Separator className="my-4" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {post.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="application">Application</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="text-sm text-muted-foreground">Overview</div>
                  <div className="mt-2 whitespace-pre-wrap leading-7">
                    {post.overview}
                  </div>
                </TabsContent>

                <TabsContent value="application" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Application
                  </div>
                  <form
                    className="mt-3 space-y-4"
                    action={async (fd) => {
                      await handleSubmit(fd);
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Jane Doe"
                        disabled={disableApplicationUpload || isSubmitting}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        disabled={disableApplicationUpload || isSubmitting}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        name="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/janedoe"
                        disabled={disableApplicationUpload || isSubmitting}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={disableApplicationUpload || isSubmitting}
                      aria-disabled={disableApplicationUpload || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit application"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default JobPost;
