"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AssetDetailErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--destructive)]/10">
            <AlertTriangle className="h-6 w-6 text-[var(--destructive)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Failed to load asset details
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {error.message}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button onClick={reset} size="sm">
              Try again
            </Button>
            <Link href="/assets">
              <Button variant="outline" size="sm">
                Back to Assets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
