import type { JobPost } from "@/server/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DepartmentIcon,
  type DepartmentKey,
} from "@/components/department-icon";
import Link from "next/link";

export function JobPostPreview({ post }: { post: JobPost }) {
  const department = post.department as DepartmentKey;
  return (
    <Link href={`/apply/job/${post.id}`} className="block">
      <Card className="hover:border-foreground/30 transition-colors">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">{post.name}</CardTitle>
            <CardDescription className="mt-1">
              Org: {post.organizationId}
            </CardDescription>
          </div>
          <div className="text-muted-foreground">
            <DepartmentIcon value={department} className="size-6" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Department</div>
              <div className="mt-0.5 capitalize">{post.department}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Location</div>
              <div className="mt-0.5">{post.location}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Employment Type</div>
              <div className="mt-0.5 capitalize">{post.employmentType}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Location Type</div>
              <div className="mt-0.5 capitalize">{post.locationType}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default JobPostPreview;
