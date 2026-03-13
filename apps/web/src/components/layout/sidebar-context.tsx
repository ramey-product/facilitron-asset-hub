"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  width: number;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggle: () => {},
  width: 260,
});

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 68;

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("works-sidebar-collapsed");
    if (stored === "true") {
      setCollapsedState(true);
    }
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    localStorage.setItem("works-sidebar-collapsed", String(value));
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      localStorage.setItem("works-sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  // Prevent flash of wrong state on mount
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, width }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
