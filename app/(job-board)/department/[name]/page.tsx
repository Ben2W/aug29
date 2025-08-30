"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import JobPostPreview from "@/components/job-post-preview";
import {
  DepartmentIcon,
  type DepartmentKey,
} from "@/components/department-icon";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const validDepartments: DepartmentKey[] = [
  "engineering",
  "design",
  "data",
  "people",
  "growth",
];

const validDepartmentsSchema = z.enum(validDepartments);

export default function DepartmentPage() {
  const params = useParams<{ name: string }>();
  const department = validDepartmentsSchema.parse(String(params?.name ?? ""));

  const query = trpc.listJobPostsByDepartment.useQuery({
    department: department,
  });

  const posts = query.data ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg border flex items-center justify-center">
          <DepartmentIcon
            value={department as DepartmentKey}
            className="size-5"
          />
        </div>
        <h1 className="text-2xl font-semibold capitalize">{department}</h1>
        <div className="ml-auto">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 text-muted-foreground">
        Browse all open roles in this department across organizations.
      </div>

      <div className="mt-8 max-h-[70vh] overflow-auto pr-1 space-y-4">
        {query.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading roles…</div>
        ) : posts.length === 0 ? (
          <div className="text-sm text-muted-foreground">No roles yet.</div>
        ) : (
          posts.map((p) => <JobPostPreview key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
}
