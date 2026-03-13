"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PartDetailErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--destructive)]/10">
            <AlertTriangle className="h-6 w-6 text-[var(--destructive)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Failed to load part details</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{error.message}</p>
          <Button onClick={reset} className="mt-4" size="sm">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
