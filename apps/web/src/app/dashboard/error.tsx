"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-orange-500" />
          <h2 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
            Dashboard failed to load
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {error.message ?? "An unexpected error occurred while loading the dashboard."}
          </p>
          <Button
            className="mt-6"
            size="sm"
            onClick={reset}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
