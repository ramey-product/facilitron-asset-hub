"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InventoryOverviewError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[InventoryOverview] page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Failed to load Inventory Overview
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {error.message ?? "An unexpected error occurred. Make sure the API server is running on port 3001."}
            </p>
            {error.digest && (
              <p className="mt-1 font-mono text-xs text-[var(--muted-foreground)]">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <Button size="sm" onClick={reset}>
              Try Again
            </Button>
            <Link href="/inventory">
              <Button variant="outline" size="sm">
                Back to Catalog
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
