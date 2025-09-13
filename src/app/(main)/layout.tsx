import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <MainSidebar />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-8 pt-0">{children}</main>
      </SidebarInset>
      <ThemeToggle />
    </SidebarProvider>
  );
}
