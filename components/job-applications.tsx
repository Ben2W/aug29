"use client";

import type { JobApplication } from "@/server/db/schema";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function JobApplications({ jobPostId }: { jobPostId: number }) {
  const { data, isLoading } = trpc.listJobApplications.useQuery({ jobPostId });
  const applications: JobApplication[] = data ?? [];

  return (
    <div className="space-y-4 max-h-[70vh] overflow-auto pr-1">
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading applications…
        </div>
      ) : applications.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No applications yet.
        </div>
      ) : (
        applications.map((app) => (
          <Card key={app.id} className="">
            <CardHeader>
              <CardTitle className="text-base">{app.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div className="mt-0.5 break-all">
                    <a
                      href={`mailto:${app.email}`}
                      className="underline underline-offset-4"
                    >
                      {app.email}
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">LinkedIn</div>
                  <div className="mt-0.5 break-all">
                    <a
                      href={app.linkedinUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-4"
                    >
                      {app.linkedinUrl}
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Submitted</div>
                  <div className="mt-0.5">
                    {new Date(app.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Application ID</div>
                  <div className="mt-0.5">{app.id}</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">
                Job ID: {app.jobPostId}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default JobApplications;
