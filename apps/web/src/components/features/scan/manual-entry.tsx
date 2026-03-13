"use client";

import { useState } from "react";
import { Search, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManualEntryProps {
  onSubmit: (code: string) => void;
}

export function ManualEntry({ onSubmit }: ManualEntryProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setCode("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Keyboard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter barcode or asset tag..."
          className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          aria-label="Manual barcode or asset tag entry"
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={!code.trim()}
        className="h-11 px-4"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
