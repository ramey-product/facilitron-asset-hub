"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { MapPin, Filter, X, Circle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFloorPlans, useFloorPlan, useCreateAssetPin } from "@/hooks/use-mapping";
import type { AssetPin, FloorPlan } from "@asset-hub/shared";

// --- Helpers ---

type ConditionColor = "Good" | "Fair" | "Poor" | null;

function pinColor(condition: ConditionColor, status: "online" | "offline" | null): string {
  if (status === "offline") return "#6b7280"; // gray-500
  switch (condition) {
    case "Good": return "#22c55e";  // green-500
    case "Fair": return "#eab308";  // yellow-500
    case "Poor": return "#ef4444";  // red-500
    default: return "#94a3b8";      // slate-400
  }
}

function conditionBadge(condition: ConditionColor) {
  if (!condition) return null;
  const classes: Record<string, string> = {
    Good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400",
    Fair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-400",
    Poor: "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400",
  };
  return (
    <Badge className={cn("text-[10px]", classes[condition])}>{condition}</Badge>
  );
}

const CATEGORIES = ["HVAC", "Electrical", "Plumbing", "Fire Safety", "Structural", "Security"];
const CONDITIONS: ConditionColor[] = ["Good", "Fair", "Poor"];

// --- Sub-components ---

interface PinPopupProps {
  pin: AssetPin;
  onClose: () => void;
}

function PinPopup({ pin, onClose }: PinPopupProps) {
  return (
    <div
      className="absolute z-50 w-56 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl p-3 space-y-2"
      style={{
        left: `calc(${pin.x}% + 14px)`,
        top: `calc(${pin.y}% - 20px)`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)] leading-tight truncate">
            {pin.assetName}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">{pin.categoryName}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          aria-label="Close popup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {conditionBadge(pin.condition)}
        {pin.status && (
          <Badge
            className={cn(
              "text-[10px]",
              pin.status === "online"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-400"
            )}
          >
            {pin.status}
          </Badge>
        )}
      </div>
      <Link href={`/assets/${pin.assetId}`}>
        <Button size="sm" variant="outline" className="w-full h-7 text-xs">
          View Details
        </Button>
      </Link>
    </div>
  );
}

// --- Main page ---

export default function AssetMapPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number>(1);
  const [selectedMapId, setSelectedMapId] = useState<number>(1);
  const [selectedPin, setSelectedPin] = useState<AssetPin | null>(null);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterCondition, setFilterCondition] = useState<ConditionColor[]>([]);
  const [filterOffline, setFilterOffline] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [placeMode, setPlaceMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: floorPlansData, isLoading: plansLoading } = useFloorPlans({ propertyId: selectedPropertyId });
  const { data: floorPlanData, isLoading: mapLoading } = useFloorPlan(selectedMapId);
  const createPin = useCreateAssetPin(selectedMapId);

  const floorPlans = floorPlansData?.data ?? [];
  const floorPlan = floorPlanData?.data;
  const allPins = floorPlan?.pins ?? [];

  // Group floor plans by property for the dropdown
  const propertyGroups = floorPlans.reduce<Record<number, { name: string; plans: FloorPlan[] }>>(
    (acc, fp) => {
      if (!acc[fp.propertyId]) {
        acc[fp.propertyId] = { name: fp.propertyName, plans: [] };
      }
      acc[fp.propertyId]!.plans.push(fp);
      return acc;
    },
    {}
  );

  // Apply filters
  const filteredPins = allPins.filter((pin) => {
    if (filterCategory.length > 0 && !filterCategory.includes(pin.categoryName)) return false;
    if (filterCondition.length > 0 && !filterCondition.includes(pin.condition)) return false;
    if (filterOffline && pin.status !== "offline") return false;
    return true;
  });

  const handleMapClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!placeMode) return;
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

      // In a real implementation, we'd show a dialog to pick the asset.
      // For prototype, place a demo pin.
      createPin.mutate({ assetId: 999, x, y, iconType: "generic" });
      setPlaceMode(false);
    },
    [placeMode, createPin]
  );

  // Stats summary
  const goodCount = allPins.filter((p) => p.condition === "Good").length;
  const fairCount = allPins.filter((p) => p.condition === "Fair").length;
  const poorCount = allPins.filter((p) => p.condition === "Poor").length;
  const offlineCount = allPins.filter((p) => p.status === "offline").length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Asset Map</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                {floorPlan ? `${floorPlan.propertyName} — ${floorPlan.floorName}` : "Floor Plan Viewer"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={placeMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPlaceMode(!placeMode)}
            >
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {placeMode ? "Cancel Placement" : "Place Asset"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filters
              {(filterCategory.length > 0 || filterCondition.length > 0 || filterOffline) && (
                <Badge className="ml-1.5 h-4 px-1 text-[9px] bg-[var(--primary)] text-white">
                  {filterCategory.length + filterCondition.length + (filterOffline ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left sidebar: floor plan selector + filters */}
        <div className="w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--card)] p-4 space-y-4">
          {/* Floor selector */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Floor Plans
            </p>
            {plansLoading ? (
              <div className="space-y-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-[var(--muted)]" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(propertyGroups).map(([propId, group]) => (
                  <div key={propId}>
                    <p className="text-xs font-medium text-[var(--foreground)] mb-1 truncate">
                      {group.name}
                    </p>
                    <div className="space-y-1">
                      {group.plans.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => {
                            setSelectedPropertyId(plan.propertyId);
                            setSelectedMapId(plan.id);
                            setSelectedPin(null);
                          }}
                          className={cn(
                            "w-full rounded-md px-3 py-2 text-left text-xs transition-colors",
                            selectedMapId === plan.id
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{plan.floorName}</span>
                            <span className="text-[10px] opacity-70">{plan.pinCount} pins</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          {floorPlan && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                Summary
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                    Good condition
                  </span>
                  <span className="font-medium">{goodCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    Fair condition
                  </span>
                  <span className="font-medium">{fairCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                    Poor condition
                  </span>
                  <span className="font-medium">{poorCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Circle className="h-3 w-3 fill-gray-500 text-gray-500" />
                    Offline
                  </span>
                  <span className="font-medium">{offlineCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Filters (collapsible) */}
          {filtersOpen && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Filters
                </p>
                <button
                  onClick={() => {
                    setFilterCategory([]);
                    setFilterCondition([]);
                    setFilterOffline(false);
                  }}
                  className="text-[10px] text-[var(--primary)] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Category filter */}
              <div>
                <p className="text-xs font-medium text-[var(--foreground)] mb-1">Category</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterCategory.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterCategory((prev) => [...prev, cat]);
                          } else {
                            setFilterCategory((prev) => prev.filter((c) => c !== cat));
                          }
                        }}
                        className="rounded"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition filter */}
              <div>
                <p className="text-xs font-medium text-[var(--foreground)] mb-1">Condition</p>
                <div className="space-y-1">
                  {CONDITIONS.map((cond) => (
                    <label key={cond ?? "none"} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterCondition.includes(cond)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterCondition((prev) => [...prev, cond]);
                          } else {
                            setFilterCondition((prev) => prev.filter((c) => c !== cond));
                          }
                        }}
                        className="rounded"
                      />
                      {cond}
                    </label>
                  ))}
                </div>
              </div>

              {/* Offline filter */}
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOffline}
                  onChange={(e) => setFilterOffline(e.target.checked)}
                  className="rounded"
                />
                Offline only
              </label>
            </div>
          )}

          {/* Legend */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Legend
            </p>
            <div className="space-y-1">
              {[
                { color: "#22c55e", label: "Good condition / Online" },
                { color: "#eab308", label: "Fair condition" },
                { color: "#ef4444", label: "Poor condition" },
                { color: "#6b7280", label: "Offline" },
                { color: "#94a3b8", label: "Unknown" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border border-white"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[var(--muted-foreground)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 overflow-hidden relative">
          {placeMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium shadow-lg">
              Click anywhere on the map to place an asset pin
            </div>
          )}

          {mapLoading ? (
            <div className="h-full animate-pulse bg-[var(--muted)]" />
          ) : (
            <div className="relative h-full w-full overflow-hidden bg-[var(--muted)]/30">
              {/* SVG floor plan simulation */}
              <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className={cn(
                  "h-full w-full",
                  placeMode && "cursor-crosshair"
                )}
                onClick={handleMapClick}
                aria-label={`Floor plan: ${floorPlan?.floorName}`}
                role="img"
              >
                {/* Background grid — simulates floor plan */}
                <rect x="0" y="0" width="100" height="100" fill="var(--muted)" />

                {/* Grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <g key={i}>
                    <line
                      x1={i * 10} y1="0" x2={i * 10} y2="100"
                      stroke="var(--border)" strokeWidth="0.3" strokeOpacity="0.6"
                    />
                    <line
                      x1="0" y1={i * 10} x2="100" y2={i * 10}
                      stroke="var(--border)" strokeWidth="0.3" strokeOpacity="0.6"
                    />
                  </g>
                ))}

                {/* Simulated room outlines */}
                <rect x="5" y="5" width="35" height="30" rx="1" fill="none" stroke="var(--border)" strokeWidth="0.8" />
                <rect x="45" y="5" width="30" height="25" rx="1" fill="none" stroke="var(--border)" strokeWidth="0.8" />
                <rect x="80" y="5" width="15" height="40" rx="1" fill="none" stroke="var(--border)" strokeWidth="0.8" />
                <rect x="5" y="40" width="25" height="30" rx="1" fill="none" stroke="var(--border)" strokeWidth="0.8" />
                <rect x="35" y="35" width="40" height="35" rx="1" fill="none" stroke="var(--border)" strokeWidth="0.8" />
                <rect x="5" y="75" width="90" height="20" rx="1" fill="none" stroke="var(--border)" strokeWidth="0.8" />

                {/* Room labels */}
                <text x="22" y="21" fontSize="2.5" fill="var(--muted-foreground)" textAnchor="middle" opacity="0.8">Main Office</text>
                <text x="60" y="18" fontSize="2.5" fill="var(--muted-foreground)" textAnchor="middle" opacity="0.8">Conference</text>
                <text x="87" y="26" fontSize="2.5" fill="var(--muted-foreground)" textAnchor="middle" opacity="0.8">Mech</text>
                <text x="17" y="56" fontSize="2.5" fill="var(--muted-foreground)" textAnchor="middle" opacity="0.8">Storage</text>
                <text x="55" y="53" fontSize="2.5" fill="var(--muted-foreground)" textAnchor="middle" opacity="0.8">Open Area</text>
                <text x="50" y="86" fontSize="2.5" fill="var(--muted-foreground)" textAnchor="middle" opacity="0.8">Corridor</text>

                {/* Scale indicator */}
                <line x1="5" y1="97" x2="25" y2="97" stroke="var(--foreground)" strokeWidth="0.5" />
                <line x1="5" y1="96" x2="5" y2="98" stroke="var(--foreground)" strokeWidth="0.5" />
                <line x1="25" y1="96" x2="25" y2="98" stroke="var(--foreground)" strokeWidth="0.5" />
                <text x="15" y="99.5" fontSize="1.8" fill="var(--muted-foreground)" textAnchor="middle">{floorPlan?.scale}</text>

                {/* Asset pins */}
                {filteredPins.map((pin) => {
                  const color = pinColor(pin.condition, pin.status);
                  const isSelected = selectedPin?.id === pin.id;
                  return (
                    <g
                      key={pin.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${pin.assetName} — ${pin.condition ?? "Unknown"} condition`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPin(selectedPin?.id === pin.id ? null : pin);
                      }}
                      className="cursor-pointer"
                      style={{ outline: "none" }}
                    >
                      {/* Outer ring when selected */}
                      {isSelected && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r="3.5"
                          fill="none"
                          stroke={color}
                          strokeWidth="0.8"
                          opacity="0.5"
                        />
                      )}
                      {/* Pin circle */}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r="2"
                        fill={color}
                        stroke="white"
                        strokeWidth="0.5"
                        opacity={isSelected ? 1 : 0.85}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Pin popup (rendered as HTML overlay) */}
              {selectedPin && (
                <div
                  className="absolute"
                  style={{
                    left: `${selectedPin.x}%`,
                    top: `${selectedPin.y}%`,
                  }}
                >
                  <PinPopup
                    pin={selectedPin}
                    onClose={() => setSelectedPin(null)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel: filter results count when filters active */}
        {(filterCategory.length > 0 || filterCondition.length > 0 || filterOffline) && (
          <div className="absolute bottom-6 right-6 z-20">
            <Card className="shadow-lg">
              <CardContent className="py-2 px-3 text-xs text-[var(--muted-foreground)]">
                Showing <span className="font-semibold text-[var(--foreground)]">{filteredPins.length}</span> of{" "}
                {allPins.length} pins
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom info bar when floor plan is loaded */}
      {floorPlan && (
        <div className="absolute bottom-0 left-64 right-0 border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm px-6 py-2 flex items-center gap-4">
          <Info className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          <span className="text-xs text-[var(--muted-foreground)]">
            {floorPlan.propertyName} · {floorPlan.floorName} · {allPins.length} assets pinned · Scale: {floorPlan.scale}
          </span>
          <span className="text-xs text-[var(--muted-foreground)] ml-auto">
            Uploaded by {floorPlan.uploadedBy} · {new Date(floorPlan.uploadedAt).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
