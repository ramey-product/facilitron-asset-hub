import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ScopeProvider } from "@/components/layout/scope-provider";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Hub",
  description: "Facilitron Asset & Inventory Management",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <Suspense>
              <ScopeProvider>
                <SidebarProvider>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <MainContent>{children}</MainContent>
                  </div>
                </SidebarProvider>
              </ScopeProvider>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
