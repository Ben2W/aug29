"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

  const { data: posts, isLoading } = trpc.listJobPosts.useQuery();

  const grouped = useMemo(() => {
    const map: Record<string, { id: number; label: string }[]> = {};
    for (const meta of departmentMeta) map[meta.key] = [];
    for (const p of posts ?? []) {
      const label = `Job #${p.id} • ${p.location}`;
      (map[p.department] ?? (map[p.department] = [])).push({ id: p.id, label });
    }
    return map;
  }, [posts]);

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
              return (
                <div key={dept.key} className="mb-1">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() =>
                          setOpen((p) => ({ ...p, [dept.key]: !isOpen }))
                        }
                      >
                        <Icon />
                        <span>{dept.name}</span>
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
                          {!isLoading && grouped[dept.key]?.length === 0 && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton>
                                <span>No jobs</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}
                          {grouped[dept.key]?.map((job) => (
                            <SidebarMenuSubItem key={job.id}>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/dashboard/job/${job.id}`}>
                                  <span>{job.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
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
