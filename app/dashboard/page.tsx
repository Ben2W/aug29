import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <main className="flex items-center justify-center min-h-[60vh] p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
          <CardDescription>
            Select one of the jobs in the sidebar to view or manage it, or
            create a new job to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/create-job">
            <Button className="w-full" variant="default">
              Create Job
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
