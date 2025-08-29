"use client";

import type { JobPost } from "@/server/db/schema";

export function JobPostPreview({ post }: { post: JobPost }) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="text-sm text-muted-foreground">Preview</div>
      <div className="text-xl font-semibold">{post.department} role</div>
      <div className="text-sm">Organization: {post.organizationId}</div>
      <div className="text-sm">Location: {post.location}</div>
      <div className="text-sm">Employment: {post.employmentType}</div>
      <div className="text-sm">Work Mode: {post.locationType}</div>
      <div className="pt-2 whitespace-pre-wrap">{post.overview}</div>
    </div>
  );
}
