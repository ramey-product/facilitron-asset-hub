'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsErrorProps {
  error: Error;
  reset: () => void;
}

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--destructive)]/10 mb-4">
          <AlertTriangle className="h-7 w-7 text-[var(--destructive)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          Unable to load Settings
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          {error.message ?? 'An unexpected error occurred while loading settings. Please try again.'}
        </p>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
