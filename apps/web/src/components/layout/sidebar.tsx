"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  Package,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wrench,
  Lock,
  Sun,
  Moon,
  ChevronsUpDown,
  Building2,
  MapPin,
  Check,
  Search,
  ScanLine,
  Warehouse,
  Truck,
  FileSearch,
  BarChart3,
  PackageOpen,
  AlertTriangle,
  Bell,
  ArrowLeftRight,
  GitBranch,
  CalendarClock,
  DollarSign,
  TrendingDown,
  Activity,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "./theme-provider";
import { useScope } from "./scope-provider";
import { useSidebar } from "./sidebar-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled: boolean;
}

interface NavSection {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
  /** Route prefixes that determine if this section should auto-expand */
  prefixes: string[];
}

const sections: NavSection[] = [
  {
    label: "Management",
    icon: LayoutDashboard,
    items: [
      { name: "Hub Dashboard", href: "/dashboard", icon: LayoutDashboard, disabled: false },
      { name: "Assets", href: "/assets", icon: Box, disabled: false },
      { name: "Asset Map", href: "/assets/map", icon: MapPin, disabled: false },
      { name: "Scan Asset", href: "/scan", icon: ScanLine, disabled: false },
    ],
    prefixes: ["/dashboard", "/assets", "/scan"],
  },
  {
    label: "Inventory",
    icon: Package,
    items: [
      { name: "Parts Catalog", href: "/inventory", icon: Package, disabled: false },
      { name: "Stock Matrix", href: "/inventory/stock-matrix", icon: Warehouse, disabled: false },
      { name: "Vendor Directory", href: "/procurement/vendors", icon: Truck, disabled: false },
      { name: "Audit Trail", href: "/inventory/audit", icon: FileSearch, disabled: false },
      { name: "Discrepancies", href: "/inventory/discrepancies", icon: AlertTriangle, disabled: false },
      { name: "Reorder Alerts", href: "/inventory/alerts", icon: Bell, disabled: false },
      { name: "Kits", href: "/inventory/kits", icon: Package, disabled: false },
      { name: "Transfers", href: "/inventory/transfers", icon: ArrowLeftRight, disabled: false },
    ],
    prefixes: ["/inventory"],
  },
  {
    label: "Procurement",
    icon: ShoppingCart,
    items: [
      { name: "Purchase Orders", href: "/procurement/orders", icon: ShoppingCart, disabled: false },
      { name: "Receiving", href: "/procurement/receiving", icon: PackageOpen, disabled: false },
      { name: "Spend Reports", href: "/procurement/reports", icon: BarChart3, disabled: false },
    ],
    prefixes: ["/procurement/orders", "/procurement/receiving", "/procurement/reports"],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    items: [
      { name: "Lifecycle", href: "/analytics/lifecycle", icon: GitBranch, disabled: false },
      { name: "Reliability", href: "/analytics/reliability", icon: Activity, disabled: false },
      { name: "TCO Analysis", href: "/analytics/tco", icon: DollarSign, disabled: false },
      { name: "Depreciation", href: "/analytics/depreciation", icon: TrendingDown, disabled: false },
    ],
    prefixes: ["/analytics"],
  },
];

const bottomNav = [
  { name: "Report Schedules", href: "/settings/reports", icon: CalendarClock, disabled: false },
  { name: "Settings", href: "/settings", icon: Settings, disabled: false },
];

// Hardcoded org name for mock auth — will come from auth context later
const ORG_NAME = "Rotten Robbie";

/** Determine which section the current route belongs to */
function activeSectionIndex(pathname: string): number {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i]!.prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return i;
    }
  }
  return 0; // default to Management
}

// ── Collapsible Section with animated expand/collapse ──────────────
function NavGroup({
  section,
  expanded,
  onToggle,
  collapsed,
  pathname,
}: {
  section: NavSection;
  expanded: boolean;
  onToggle: () => void;
  collapsed: boolean;
  pathname: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(expanded ? "auto" : 0);
  const isFirstRender = useRef(true);

  const hasActiveItem = section.items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  // Measure and animate height changes
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      // No animation on first render — just set the correct state
      isFirstRender.current = false;
      setHeight(expanded ? "auto" : 0);
      return;
    }

    if (expanded) {
      // Expanding: measure scrollHeight, animate to it, then set auto
      const scrollH = el.scrollHeight;
      setHeight(scrollH);
      const timer = setTimeout(() => setHeight("auto"), 250);
      return () => clearTimeout(timer);
    } else {
      // Collapsing: set explicit height first so transition can animate from it
      const scrollH = el.scrollHeight;
      setHeight(scrollH);
      // Force reflow before setting to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
        });
      });
    }
  }, [expanded]);

  return (
    <div>
      {/* Section header — clickable to expand/collapse */}
      {!collapsed ? (
        <button
          onClick={onToggle}
          className={cn(
            "group flex w-full items-center justify-between mt-4 mb-1 px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200",
            hasActiveItem && !expanded
              ? "text-[var(--primary)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
          aria-expanded={expanded}
        >
          <span>{section.label}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
              !expanded && "-rotate-90"
            )}
          />
        </button>
      ) : (
        <div className="mt-3" />
      )}

      {/* Animated items container */}
      {!collapsed ? (
        <div
          ref={contentRef}
          style={{
            height: height === "auto" ? "auto" : `${height}px`,
            overflow: "hidden",
            transition: height === "auto" ? "none" : "height 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="space-y-0.5">
            {section.items.map((item, i) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive && !item.disabled
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : item.disabled
                      ? "cursor-not-allowed text-[var(--muted-foreground)]/50"
                      : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                  )}
                  style={{
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? "translateY(0)" : "translateY(-4px)",
                    transition: expanded
                      ? `opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) ${50 + i * 30}ms, transform 200ms cubic-bezier(0.4, 0, 0.2, 1) ${50 + i * 30}ms`
                      : `opacity 150ms cubic-bezier(0.4, 0, 1, 1) ${(section.items.length - 1 - i) * 25}ms, transform 150ms cubic-bezier(0.4, 0, 1, 1) ${(section.items.length - 1 - i) * 25}ms`,
                  }}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  aria-current={isActive && !item.disabled ? "page" : undefined}
                  aria-disabled={item.disabled}
                >
                  {item.disabled ? (
                    <Lock className="h-4 w-4 shrink-0 opacity-40" />
                  ) : (
                    <item.icon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        // Collapsed sidebar — show single section icon
        <div className="flex justify-center">
          <button
            onClick={onToggle}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              hasActiveItem
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
            )}
            title={section.label}
            aria-label={section.label}
          >
            <section.icon className="h-4 w-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed, toggle: toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { propertyID, selectedProperty, properties, setPropertyScope, isLoading } = useScope();
  const [scopePopoverOpen, setScopePopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Track which sections are expanded — default: section containing the active route
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => {
    return new Set([activeSectionIndex("/dashboard")]);
  });

  // Auto-expand section when route changes
  useEffect(() => {
    const idx = activeSectionIndex(pathname);
    setExpandedSections((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, [pathname]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setScopePopoverOpen(false);
        setSearchQuery("");
      }
    }
    if (scopePopoverOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [scopePopoverOpen]);

  // Close popover on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setScopePopoverOpen(false);
        setSearchQuery("");
      }
    }
    if (scopePopoverOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [scopePopoverOpen]);

  // Focus search input when popover opens
  useEffect(() => {
    if (scopePopoverOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [scopePopoverOpen]);

  // Filter and sort properties
  const sortedProperties = useMemo(() => {
    let filtered = [...properties];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [properties, searchQuery]);

  const showSearch = properties.length > 10;

  // Scope indicator label
  const scopeLabel = selectedProperty
    ? `${selectedProperty.name} - ${selectedProperty.city}`
    : `All Properties (${properties.length})`;
  const ScopeIcon = selectedProperty ? MapPin : Building2;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--sidebar-border)] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--foreground)]">WORKS</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Asset Hub
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Scope Selector (expanded) */}
      {!collapsed && (
        <div className="relative shrink-0 mx-4 mt-4" ref={popoverRef}>
          <button
            onClick={() => setScopePopoverOpen(!scopePopoverOpen)}
            className={cn(
              "w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-accent)] p-3 text-left transition-all hover:border-[var(--primary)]/40 hover:bg-[var(--sidebar-accent)]/80",
              scopePopoverOpen && "border-[var(--primary)]/60 ring-1 ring-[var(--primary)]/20"
            )}
            aria-label="Change property scope"
            aria-expanded={scopePopoverOpen}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10">
                  <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Organization
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-[var(--foreground)] truncate">
                    {ORG_NAME}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <ScopeIcon className="h-3 w-3 shrink-0" />
                    <span className="truncate transition-opacity duration-200">
                      {isLoading ? "Loading..." : scopeLabel}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
            </div>
          </button>

          {/* Scope popover */}
          {scopePopoverOpen && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg"
              role="listbox"
              aria-label="Property scope"
            >
              {/* Search (shown when >10 properties) */}
              {showSearch && (
                <div className="sticky top-0 border-b border-[var(--border)] bg-[var(--card)] p-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter properties..."
                      className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                      aria-label="Filter properties"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-[400px] overflow-y-auto">
                {/* All Properties option */}
                <button
                  onClick={() => {
                    setPropertyScope(null);
                    setScopePopoverOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    propertyID === null
                      ? "bg-[var(--primary)]/10"
                      : "hover:bg-[var(--muted)]/50"
                  )}
                  role="option"
                  aria-selected={propertyID === null}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      propertyID === null ? "bg-[var(--primary)]/20" : "bg-[var(--muted)]"
                    )}
                  >
                    <Building2
                      className={cn(
                        "h-3.5 w-3.5",
                        propertyID === null
                          ? "text-[var(--primary)]"
                          : "text-[var(--muted-foreground)]"
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        propertyID === null
                          ? "text-[var(--primary)]"
                          : "text-[var(--foreground)]"
                      )}
                    >
                      All Properties
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {properties.length} total
                    </div>
                  </div>
                  {propertyID === null && (
                    <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                  )}
                </button>

                {/* Divider */}
                <div className="mx-3 border-t border-[var(--border)]" />

                {/* Property list */}
                {isLoading && (
                  <div className="px-3 py-4 text-center text-xs text-[var(--muted-foreground)]">
                    Loading properties...
                  </div>
                )}

                {!isLoading && sortedProperties.length === 0 && searchQuery && (
                  <div className="px-3 py-4 text-center text-xs text-[var(--muted-foreground)]">
                    No properties match &ldquo;{searchQuery}&rdquo;
                  </div>
                )}

                {sortedProperties.map((property) => {
                  const isActive = propertyID === property.id;
                  return (
                    <button
                      key={property.id}
                      onClick={() => {
                        setPropertyScope(property.id);
                        setScopePopoverOpen(false);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                        isActive
                          ? "bg-[var(--primary)]/10"
                          : "hover:bg-[var(--muted)]/50"
                      )}
                      role="option"
                      aria-selected={isActive}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                          isActive ? "bg-[var(--primary)]/20" : "bg-[var(--muted)]"
                        )}
                      >
                        <MapPin
                          className={cn(
                            "h-3.5 w-3.5",
                            isActive
                              ? "text-[var(--primary)]"
                              : "text-[var(--muted-foreground)]"
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-sm font-medium truncate",
                            isActive
                              ? "text-[var(--primary)]"
                              : "text-[var(--foreground)]"
                          )}
                        >
                          {property.name}
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {property.city}, {property.state} · {property.assetCount} assets
                        </div>
                      </div>
                      {isActive && (
                        <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapsed scope icon */}
      {collapsed && (
        <div className="mx-auto mt-4 shrink-0">
          <button
            onClick={() => {
              setCollapsed(false);
              setTimeout(() => setScopePopoverOpen(true), 350);
            }}

            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors"
            title={selectedProperty ? selectedProperty.name : "All Properties"}
            aria-label={`Expand sidebar and change scope. Current: ${selectedProperty ? selectedProperty.name : "All Properties"}`}
          >
            <ScopeIcon className="h-4 w-4 text-[var(--primary)]" />
          </button>
        </div>
      )}

      {/* Navigation — scrollable area */}
      <nav className="mt-2 flex-1 overflow-y-auto px-3 pb-2" aria-label="Main navigation">
        {sections.map((section, index) => (
          <NavGroup
            key={section.label}
            section={section}
            expanded={expandedSections.has(index)}
            onToggle={() => toggleSection(index)}
            collapsed={collapsed}
            pathname={pathname}
          />
        ))}
      </nav>

      {/* Bottom section: theme toggle + settings — always visible */}
      <div className="shrink-0 border-t border-[var(--sidebar-border)] px-3 py-3 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] transition-all"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 shrink-0" />
          ) : (
            <Sun className="h-4 w-4 shrink-0" />
          )}
          {!collapsed && (
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          )}
        </button>

        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
