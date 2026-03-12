import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]",
    secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]",
    outline: "border-[var(--border)] text-[var(--foreground)]",
    destructive: "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)]",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props} />
  );
}

export { Badge };
