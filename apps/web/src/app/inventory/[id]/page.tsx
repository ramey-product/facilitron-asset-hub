"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Box, TrendingDown, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { usePartDetail } from "@/hooks/use-inventory";
import { StockLevels } from "@/components/features/inventory/stock-levels";
import { ConsumptionHistory } from "@/components/features/inventory/consumption-history";
import { ConsumptionChart } from "@/components/features/inventory/consumption-chart";
import { ForecastWidget } from "@/components/features/inventory/forecast-widget";

const tabs = [
  { id: "overview", label: "Overview", icon: Package },
  { id: "stock", label: "Stock", icon: Box },
  { id: "consumption", label: "Consumption", icon: TrendingDown },
  { id: "vendor", label: "Vendor", icon: Truck },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function PartDetailPage() {
  const params = useParams();
  const partId = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { data, isLoading, isError } = usePartDetail(partId);

  const part = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-8">
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
          <Card>
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !part) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Part not found</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Could not load part details. The part may have been removed.
            </p>
            <Link href="/inventory">
              <Button className="mt-4" size="sm" variant="outline">
                Back to catalog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/inventory">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                  {part.name}
                </h1>
                <Badge
                  className={cn(
                    "text-[10px] border",
                    part.isActive
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20"
                      : "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20"
                  )}
                >
                  {part.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                SKU: {part.sku} | {part.categoryName}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-8 gap-1" role="tablist" aria-label="Part detail tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                  Part Details
                </h2>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">SKU</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)] font-mono">{part.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Category</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">{part.categoryName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Unit Cost</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">{formatCurrency(part.unitCost)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Unit of Measure</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">{part.unitOfMeasure}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Vendor</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">{part.vendorName ?? "---"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Storage Location</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">{part.storageLocation ?? "---"}</dd>
                  </div>
                  {part.description && (
                    <div className="col-span-2">
                      <dt className="text-xs text-[var(--muted-foreground)]">Description</dt>
                      <dd className="text-sm text-[var(--foreground)] mt-1">{part.description}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                    Reorder Thresholds
                  </h2>
                  <dl className="space-y-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-xs text-[var(--muted-foreground)]">Min Qty</dt>
                      <dd className="text-sm font-medium text-[var(--foreground)]">{part.minQty}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-xs text-[var(--muted-foreground)]">Max Qty</dt>
                      <dd className="text-sm font-medium text-[var(--foreground)]">{part.maxQty}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-xs text-[var(--muted-foreground)]">Reorder Point</dt>
                      <dd className="text-sm font-bold text-[var(--primary)]">{part.reorderPoint}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              <ForecastWidget partId={partId} />
            </div>
          </div>
        )}

        {/* Stock Tab */}
        {activeTab === "stock" && (
          <StockLevels partId={partId} reorderPoint={part.reorderPoint} />
        )}

        {/* Consumption Tab */}
        {activeTab === "consumption" && (
          <div className="space-y-6">
            <ConsumptionChart partId={partId} />
            <ConsumptionHistory partId={partId} />
          </div>
        )}

        {/* Vendor Tab */}
        {activeTab === "vendor" && (
          <div>
            {part.vendorId ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Vendor Information
                    </h2>
                    <Link href={`/procurement/vendors/${part.vendorId}`}>
                      <Button variant="outline" size="sm">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <dt className="text-xs text-[var(--muted-foreground)]">Vendor Name</dt>
                      <dd className="text-sm font-medium text-[var(--foreground)]">{part.vendorName}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="mx-auto h-8 w-8 text-[var(--muted-foreground)] mb-3" />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No vendor assigned to this part.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
