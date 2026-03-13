"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, SlidersHorizontal, type LucideIcon } from "lucide-react";

interface CollapsibleFilterSidebarProps {
  children: ReactNode;
  storageKey?: string;
  defaultCollapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  collapsedIcon?: LucideIcon;
  collapsedLabel?: string;
  className?: string;
}

export function CollapsibleFilterSidebar({
  children,
  storageKey = "filter-sidebar",
  defaultCollapsed = false,
  width = 224,
  collapsedWidth = 48,
  collapsedIcon: CollapsedIcon = SlidersHorizontal,
  collapsedLabel = "Filters",
  className,
}: CollapsibleFilterSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mounted, setMounted] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState<number>(
    defaultCollapsed ? collapsedWidth : width
  );
  const [settled, setSettled] = useState(true);
  const isFirstRender = useRef(true);

  // Hydration-safe mount + restore from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`works-${storageKey}-collapsed`);
    if (stored !== null) {
      const isCollapsed = stored === "true";
      setCollapsed(isCollapsed);
      setAnimatedWidth(isCollapsed ? collapsedWidth : width);
    }
  }, [storageKey, collapsedWidth, width]);

  // Animate width changes
  useEffect(() => {
    if (!mounted) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSettled(false);

    if (!collapsed) {
      // Expanding: animate to target width
      setAnimatedWidth(width);
      const timer = setTimeout(() => setSettled(true), 260);
      return () => clearTimeout(timer);
    } else {
      // Collapsing: set explicit width first, then animate to collapsed width
      setAnimatedWidth(width);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimatedWidth(collapsedWidth);
        });
      });
      const timer = setTimeout(() => setSettled(true), 260);
      return () => clearTimeout(timer);
    }
  }, [collapsed, width, collapsedWidth, mounted]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(`works-${storageKey}-collapsed`, String(next));
      return next;
    });
  }, [storageKey]);

  // Before mount, render static to avoid hydration mismatch
  if (!mounted) {
    return (
      <aside
        className={cn("hidden lg:block shrink-0 border-r border-[var(--border)]", className)}
        style={{ width }}
      >
        <div className="p-4">{children}</div>
      </aside>
    );
  }

  return (
    <aside
      className={cn("hidden lg:block shrink-0 relative z-10", className)}
      style={{
        width: `${animatedWidth}px`,
        transition: settled ? "none" : "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      role="complementary"
      aria-label="Filter panel"
    >
      {/* Border line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-[var(--border)]" />

      {collapsed ? (
        /* Collapsed: condensed bar with icon + vertical label */
        <div className="flex flex-col items-center pt-4 gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] text-[var(--muted-foreground)] transition-colors"
            title={`Expand ${collapsedLabel.toLowerCase()}`}
            aria-label={`Expand ${collapsedLabel.toLowerCase()}`}
            aria-expanded={false}
          >
            <CollapsedIcon className="h-4 w-4" />
          </button>
          <span
            className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {collapsedLabel}
          </span>
        </div>
      ) : (
        /* Expanded: full filter content with inline collapse button */
        <div className="h-full overflow-hidden">
          <div className="p-4">
            {/* Collapse button — inline at top-right of content */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1" />
              <button
                onClick={toggle}
                className="flex h-5 w-5 items-center justify-center rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors -mr-1 -mt-0.5"
                aria-label="Collapse filter panel"
                aria-expanded={true}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </aside>
  );
}
