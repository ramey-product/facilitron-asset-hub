import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ScopeProvider } from "@/components/layout/scope-provider";
import { Sidebar } from "@/components/layout/sidebar";
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
                <div className="flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1 ml-[260px] transition-all duration-300">
                    {children}
                  </main>
                </div>
              </ScopeProvider>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
