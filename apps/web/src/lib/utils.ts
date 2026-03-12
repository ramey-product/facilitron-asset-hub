import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case "Excellent": return "text-emerald-900 dark:text-emerald-400";
    case "Good": return "text-green-900 dark:text-green-400";
    case "Fair": return "text-amber-900 dark:text-yellow-400";
    case "Poor": return "text-orange-900 dark:text-orange-400";
    case "Critical": return "text-red-900 dark:text-red-400";
    default: return "text-zinc-800 dark:text-zinc-400";
  }
}

export function getConditionBg(condition: string): string {
  switch (condition) {
    case "Excellent": return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20";
    case "Good": return "bg-green-100 text-green-900 border-green-300 dark:bg-green-400/10 dark:text-green-400 dark:border-green-400/20";
    case "Fair": return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20";
    case "Poor": return "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20";
    case "Critical": return "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20";
    default: return "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20";
  }
}

export function getLifecycleBg(stage: string): string {
  switch (stage) {
    case "Active": return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20";
    case "Under Maintenance": return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20";
    case "Flagged for Replacement": return "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20";
    case "Decommissioned": return "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20";
    default: return "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20";
  }
}

/**
 * Returns the base API URL from environment variables.
 */
export function getApiUrl(): string {
  return process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";
}
