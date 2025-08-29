import { ClerkProvider } from "@clerk/nextjs";
import { AppSidebar } from "./_components/sidebar";
import { Header } from "./_components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <div className="flex min-h-dvh w-full">
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="flex-1">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ClerkProvider>
  );
}
