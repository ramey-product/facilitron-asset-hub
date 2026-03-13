"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Flashlight, FlashlightOff, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScannerProps {
  onScan: (code: string) => void;
  scanning: boolean;
}

/**
 * Camera viewfinder component with barcode scanning.
 * Uses HTML5 getUserMedia for camera access.
 * Falls back to a mock scanning simulation if camera is unavailable.
 */
export function Scanner({ onScan, scanning }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [mockCountdown, setMockCountdown] = useState<number | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);

        // Check torch support
        const track = stream.getVideoTracks()[0];
        if (!track) return;
        const capabilities = track.getCapabilities?.() as Record<string, unknown> | undefined;
        if (capabilities && "torch" in capabilities) {
          setTorchSupported(true);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to access camera";
      setCameraError(message);
      // Start mock scanning mode
      startMockScan();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });
      setTorchOn(!torchOn);
    } catch {
      // Torch toggle failed silently
    }
  }, [torchOn]);

  const startMockScan = () => {
    setMockCountdown(3);
  };

  // Camera lifecycle
  useEffect(() => {
    if (scanning) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanning, startCamera, stopCamera]);

  // Mock scanning countdown
  useEffect(() => {
    if (mockCountdown === null) return;
    if (mockCountdown <= 0) {
      // Simulate a successful scan with a demo asset barcode
      onScan("WORKS-AST-001");
      setMockCountdown(null);
      return;
    }
    const timer = setTimeout(() => setMockCountdown(mockCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [mockCountdown, onScan]);

  // Simple barcode detection polling using BarcodeDetector API (if available)
  useEffect(() => {
    if (!cameraActive || !scanning) return;

    // Check for BarcodeDetector API
    const BarcodeDetectorAPI = (window as unknown as Record<string, unknown>).BarcodeDetector as
      | (new (options: { formats: string[] }) => {
          detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
        })
      | undefined;

    if (!BarcodeDetectorAPI) {
      // No native barcode detection: fall back to mock after delay
      const timer = setTimeout(() => {
        if (scanning) {
          onScan("WORKS-AST-001");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    const detector = new BarcodeDetectorAPI({
      formats: ["qr_code", "code_128", "code_39", "ean_13"],
    });

    let active = true;
    const poll = async () => {
      if (!active || !videoRef.current) return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0 && barcodes[0]?.rawValue) {
          onScan(barcodes[0].rawValue);
          // Haptic feedback
          if (navigator.vibrate) navigator.vibrate(100);
          return;
        }
      } catch {
        // Detection failed, continue polling
      }
      if (active) {
        requestAnimationFrame(poll);
      }
    };

    const handle = requestAnimationFrame(poll);
    return () => {
      active = false;
      cancelAnimationFrame(handle);
    };
  }, [cameraActive, scanning, onScan]);

  return (
    <div className="relative h-full w-full bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        className={cn(
          "h-full w-full object-cover",
          !cameraActive && "hidden"
        )}
        playsInline
        muted
        aria-label="Camera viewfinder for barcode scanning"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Error / Mock Mode */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <Camera className="h-8 w-8 text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">
              Camera not available
            </p>
            <p className="mt-1 text-xs text-zinc-400">{cameraError}</p>
          </div>
          {mockCountdown !== null && (
            <div className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/20 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
              <span className="text-sm text-white">
                Simulating scan... {mockCountdown}s
              </span>
            </div>
          )}
          {mockCountdown === null && (
            <Button
              size="sm"
              onClick={startMockScan}
              className="mt-2"
            >
              Simulate Scan
            </Button>
          )}
        </div>
      )}

      {/* Scan Zone Overlay */}
      {(cameraActive || !cameraError) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Dimmed corners */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Clear scan zone */}
          <div className="relative h-64 w-64 sm:h-72 sm:w-72">
            <div className="absolute inset-0 bg-transparent" style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)" }} />
            {/* Animated corners */}
            <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-white animate-pulse" />
            <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-white animate-pulse" />
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white animate-pulse" />
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white animate-pulse" />
            {/* Scanning line */}
            <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--primary)]/60 animate-pulse" />
          </div>
        </div>
      )}

      {/* Torch Toggle */}
      {torchSupported && cameraActive && (
        <button
          onClick={toggleTorch}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          aria-label={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
        >
          {torchOn ? (
            <FlashlightOff className="h-5 w-5" />
          ) : (
            <Flashlight className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Status indicator */}
      {cameraActive && (
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-medium text-white">Scanning</span>
        </div>
      )}
    </div>
  );
}
