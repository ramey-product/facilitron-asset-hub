import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { OrgProvider } from "@/components/layout/org-provider";
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
            <OrgProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-[260px] transition-all duration-300">
                  {children}
                </main>
              </div>
            </OrgProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
