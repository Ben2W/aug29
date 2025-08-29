import type { LucideIcon } from "lucide-react";
import { Wrench, Palette, Users, Rocket, Database } from "lucide-react";

export type DepartmentKey =
  | "engineering"
  | "design"
  | "data"
  | "people"
  | "growth";

export const departmentIconMap: Record<DepartmentKey, LucideIcon> = {
  engineering: Wrench,
  design: Palette,
  data: Database,
  people: Users,
  growth: Rocket,
};

export function DepartmentIcon({
  value,
  className,
}: {
  value: DepartmentKey;
  className?: string;
}) {
  const Icon = departmentIconMap[value];
  return <Icon className={className} />;
}
