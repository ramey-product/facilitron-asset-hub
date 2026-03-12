"use client";

import Link from "next/link";
import { Plus, Upload, Search, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onSearchFocus?: () => void;
}

export function QuickActions({ onSearchFocus }: QuickActionsProps) {
  const showComingSoon = (feature: string) => {
    // Simple toast-like alert for prototype
    alert(`${feature} is coming soon!`);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Quick Actions
          </span>
          <div className="flex flex-wrap gap-2">
            <Link href="/assets/new">
              <Button variant="outline" size="sm" className="text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Asset
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => showComingSoon("Import Assets")}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Import Assets
            </Button>

            <Link href="/assets">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={onSearchFocus}
              >
                <Search className="mr-1.5 h-3.5 w-3.5" />
                Search Assets
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => showComingSoon("Barcode Scanner")}
            >
              <QrCode className="mr-1.5 h-3.5 w-3.5" />
              Scan Barcode
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
