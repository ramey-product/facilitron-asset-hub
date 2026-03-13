"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-[68px]" : "ml-[260px]"
      )}
    >
      {children}
    </main>
  );
}
