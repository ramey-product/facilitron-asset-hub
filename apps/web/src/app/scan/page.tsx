"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, ScanLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scanner } from "@/components/features/scan/scanner";
import { ScanResult } from "@/components/features/scan/scan-result";
import { ManualEntry } from "@/components/features/scan/manual-entry";

/**
 * Full-screen mobile scanning page.
 * Uses device camera (or mock scanner fallback) to scan QR/barcodes
 * and look up assets. Includes manual entry fallback.
 */
export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [resolvedAssetId, setResolvedAssetId] = useState<number | null>(null);

  const handleScan = useCallback((code: string) => {
    setScanning(false);
    setScannedCode(code);

    // Parse asset ID from scanned code
    // Format: works://asset/{id} or WORKS-AST-{id} or just numeric
    let assetId: number | null = null;
    const worksProtocolMatch = code.match(/works:\/\/asset\/(\d+)/);
    const worksTagMatch = code.match(/WORKS-AST-(\d+)/);
    const numericMatch = code.match(/^(\d+)$/);

    if (worksProtocolMatch?.[1]) {
      assetId = parseInt(worksProtocolMatch[1], 10);
    } else if (worksTagMatch?.[1]) {
      assetId = parseInt(worksTagMatch[1], 10);
    } else if (numericMatch?.[1]) {
      assetId = parseInt(numericMatch[1], 10);
    } else {
      // For demo: default to asset 1
      assetId = 1;
    }

    setResolvedAssetId(assetId);
  }, []);

  const handleDismiss = useCallback(() => {
    setScannedCode(null);
    setResolvedAssetId(null);
    setScanning(true);
  }, []);

  const handleManualEntry = useCallback(
    (code: string) => {
      handleScan(code);
    },
    [handleScan]
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black ml-0">
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/assets">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">Scan Asset</span>
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Camera / Scanner Area */}
      <div className="flex-1">
        <Scanner onScan={handleScan} scanning={scanning} />
      </div>

      {/* Manual Entry (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-12">
        <p className="mb-2 text-center text-xs text-zinc-400">
          Point camera at a QR or barcode, or enter manually:
        </p>
        <ManualEntry onSubmit={handleManualEntry} />
      </div>

      {/* Scan Result Bottom Sheet */}
      {scannedCode && (
        <ScanResult
          scannedCode={scannedCode}
          assetId={resolvedAssetId}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
}
