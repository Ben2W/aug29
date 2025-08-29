"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Wrench, Palette, Users, Rocket, Database } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc/client";
type DepartmentMeta = {
  key: "engineering" | "design" | "data" | "people" | "growth";
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const departmentMeta: DepartmentMeta[] = [
  { key: "engineering", name: "Engineering", icon: Wrench },
  { key: "design", name: "Design", icon: Palette },
  { key: "data", name: "Data", icon: Database },
  { key: "people", name: "People Ops", icon: Users },
  { key: "growth", name: "Growth", icon: Rocket },
];

export function AppSidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    engineering: true,
  });

  const pathname = usePathname();

  const { data: posts, isLoading } = trpc.listJobPosts.useQuery();

  // Group jobs by department, and also build a map of jobId to job for selection
  const { grouped, jobIdToJob } = useMemo(() => {
    const map: Record<string, { id: number; name: string }[]> = {};
    const idMap: Record<
      number,
      { id: number; name: string; department: string }
    > = {};
    for (const meta of departmentMeta) map[meta.key] = [];
    for (const p of posts ?? []) {
      map[p.department]?.push({ id: p.id, name: p.name });
      idMap[p.id] = { id: p.id, name: p.name, department: p.department };
    }
    return { grouped: map, jobIdToJob: idMap };
  }, [posts]);

  // Extract selected jobId from pathname, e.g. /dashboard/job/123
  let selectedJobId: number | null = null;
  if (pathname) {
    const match = pathname.match(/\/dashboard\/job\/(\d+)/);
    if (match) {
      selectedJobId = Number(match[1]);
    }
  }

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Jobs</span>
            <Link
              href="/dashboard/create-job"
              className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-muted"
              aria-label="Create job"
            >
              <Plus className="h-3.5 w-3.5" />
              Create
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {departmentMeta.map((dept) => {
              const Icon = dept.icon ?? Wrench;
              const isOpen = !!open[dept.key];
              const jobs = grouped[dept.key] ?? [];
              const count = jobs.length;
              const isDisabled = !isLoading && count === 0;

              return (
                <div key={dept.key} className="mb-1">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() =>
                          !isDisabled &&
                          setOpen((p) => ({ ...p, [dept.key]: !isOpen }))
                        }
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        className={
                          isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }
                      >
                        <Icon />
                        <span>
                          {dept.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({count})
                          </span>
                        </span>
                      </SidebarMenuButton>
                      {isOpen && (
                        <SidebarMenuSub>
                          {isLoading && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton>
                                <span>Loading…</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}

                          {jobs.map((job) => {
                            const isSelected = selectedJobId === job.id;
                            return (
                              <SidebarMenuSubItem key={job.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={
                                    isSelected
                                      ? "bg-muted font-semibold text-primary"
                                      : ""
                                  }
                                  aria-current={isSelected ? "page" : undefined}
                                >
                                  <Link href={`/dashboard/job/${job.id}`}>
                                    <span>{job.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
