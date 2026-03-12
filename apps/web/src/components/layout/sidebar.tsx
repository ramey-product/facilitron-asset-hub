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
  Wrench,
  Lock,
  Sun,
  Moon,
  ChevronsUpDown,
  Building2,
  GraduationCap,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { useOrg } from "./org-provider";

const navigation = [
  { name: "Hub Dashboard", href: "/dashboard", icon: LayoutDashboard, disabled: false },
  { name: "Assets", href: "/assets", icon: Box, disabled: false },
  { name: "Inventory", href: "/inventory", icon: Package, disabled: true, badge: "Coming Soon" },
  { name: "Procurement", href: "/procurement", icon: ShoppingCart, disabled: true, badge: "Coming Soon" },
];

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings, disabled: false },
];

const sectorIcons: Record<string, typeof Building2> = {
  commercial: Building2,
  education: GraduationCap,
  municipal: Building2,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentOrg, allOrgs, switchOrg } = useOrg();
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOrgDropdownOpen(false);
      }
    }
    if (orgDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [orgDropdownOpen]);

  const SectorIcon = sectorIcons[currentOrg.sector] ?? Building2;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--sidebar-border)] px-4">
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

      {/* Organization Switcher */}
      {!collapsed && (
        <div className="relative mx-4 mt-4" ref={dropdownRef}>
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className={cn(
              "w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-accent)] p-3 text-left transition-all hover:border-[var(--primary)]/40 hover:bg-[var(--sidebar-accent)]/80",
              orgDropdownOpen && "border-[var(--primary)]/60 ring-1 ring-[var(--primary)]/20"
            )}
            aria-label="Switch organization"
            aria-expanded={orgDropdownOpen}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10">
                  <SectorIcon className="h-3.5 w-3.5 text-[var(--primary)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Organization
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-[var(--foreground)] truncate">
                    {currentOrg.name}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {currentOrg.propertyCount} {currentOrg.propertyLabel}
                  </div>
                </div>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
            </div>
          </button>

          {/* Dropdown */}
          {orgDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg" role="listbox" aria-label="Organizations">
              <div className="px-3 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Switch Organization
                </span>
              </div>
              {allOrgs.map((org) => {
                const Icon = sectorIcons[org.sector] ?? Building2;
                const isActive = org.id === currentOrg.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrg(org.id);
                      setOrgDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      isActive
                        ? "bg-[var(--primary)]/10"
                        : "hover:bg-[var(--muted)]/50"
                    )}
                    role="option"
                    aria-selected={isActive}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      isActive ? "bg-[var(--primary)]/20" : "bg-[var(--muted)]"
                    )}>
                      <Icon className={cn("h-4 w-4", isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={cn("text-sm font-medium truncate", isActive ? "text-[var(--primary)]" : "text-[var(--foreground)]")}>
                        {org.name}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {org.propertyCount} {org.propertyLabel} · {org.sector === "education" ? "Public Sector" : "Commercial"}
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Collapsed org icon */}
      {collapsed && (
        <div className="mx-auto mt-4">
          <button
            onClick={() => {
              setCollapsed(false);
              setTimeout(() => setOrgDropdownOpen(true), 350);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors"
            title={currentOrg.name}
            aria-label={`Expand sidebar and switch organization. Current: ${currentOrg.name}`}
          >
            <SectorIcon className="h-4 w-4 text-[var(--primary)]" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-3" aria-label="Main navigation">
        {!collapsed && (
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Management
          </div>
        )}
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive && !item.disabled
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : item.disabled
                  ? "cursor-not-allowed text-[var(--muted-foreground)]/50"
                  : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
              aria-current={isActive && !item.disabled ? "page" : undefined}
              aria-disabled={item.disabled}
            >
              {item.disabled ? (
                <Lock className="h-4 w-4 shrink-0 opacity-40" />
              ) : (
                <item.icon className="h-4 w-4 shrink-0" />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: theme toggle + settings */}
      <div className="border-t border-[var(--sidebar-border)] px-3 py-3 space-y-1">
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
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
