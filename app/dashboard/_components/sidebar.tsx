"use client";

import { useState } from "react";
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

type Job = { id: string; title: string };
type Department = {
  key: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  jobs: Job[];
};

const departments: Department[] = [
  {
    key: "engineering",
    name: "Engineering",
    icon: Wrench,
    jobs: [
      { id: "eng-fe-sr", title: "Senior Frontend Engineer" },
      { id: "eng-be-sr", title: "Senior Backend Engineer" },
      { id: "eng-fe-mid", title: "Frontend Engineer" },
      { id: "eng-platform", title: "Platform Engineer" },
    ],
  },
  {
    key: "design",
    name: "Design",
    icon: Palette,
    jobs: [
      { id: "design-product", title: "Product Designer" },
      { id: "design-uxr", title: "UX Researcher" },
    ],
  },
  {
    key: "data",
    name: "Data",
    icon: Database,
    jobs: [
      { id: "data-eng", title: "Data Engineer" },
      { id: "data-science", title: "Data Scientist" },
    ],
  },
  {
    key: "people",
    name: "People Ops",
    icon: Users,
    jobs: [{ id: "recruiter", title: "Technical Recruiter" }],
  },
  {
    key: "growth",
    name: "Growth",
    icon: Rocket,
    jobs: [
      { id: "growth-lead", title: "Growth Lead" },
      { id: "seo", title: "SEO Specialist" },
    ],
  },
];

export function AppSidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    engineering: true,
  });

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Jobs</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-muted"
              onClick={() => {}}
              aria-label="Create job"
            >
              <Plus className="h-3.5 w-3.5" />
              Create
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {departments.map((dept) => {
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
                          {dept.jobs.map((job) => (
                            <SidebarMenuSubItem key={job.id}>
                              <SidebarMenuSubButton asChild>
                                <a href="#" aria-disabled>
                                  <span>{job.title}</span>
                                </a>
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
