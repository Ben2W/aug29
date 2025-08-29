import Link from "next/link";
import {
  DepartmentIcon,
  departmentIconMap,
} from "@/components/department-icon";

const departments = [
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design" },
  { key: "data", label: "Data" },
  { key: "people", label: "People" },
  { key: "growth", label: "Growth" },
] as const;

export default function JobBoardHome() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Choose the field</h1>
        <p className="mt-2 text-muted-foreground">
          Explore open roles by department
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((d) => (
          <Link
            key={d.key}
            href={`/department/${d.key}`}
            className="group rounded-xl border p-6 hover:shadow-sm transition-colors hover:border-foreground/20"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg border flex items-center justify-center">
                <DepartmentIcon
                  value={d.key as keyof typeof departmentIconMap}
                  className="size-6"
                />
              </div>
              <div>
                <div className="text-lg font-medium">{d.label}</div>
                <div className="text-sm text-muted-foreground">View roles</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
