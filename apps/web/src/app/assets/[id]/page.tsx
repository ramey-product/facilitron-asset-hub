"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Activity,
  Wrench,
  FileText,
  Clock,
  GitBranch,
  BarChart2,
  Camera,
  Settings2,
  ClipboardCheck,
  ScanLine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate, getConditionBg, getLifecycleBg } from "@/lib/utils";
import { useAsset, conditionLabel, lifecycleLabel } from "@/hooks/use-assets";
import { useConditionStats } from "@/hooks/use-conditions";
import { ConditionCard } from "@/components/features/conditions/condition-card";
import { StatusToggle } from "@/components/features/status/status-toggle";
import { CostSummaryCard } from "@/components/features/costs/cost-summary-card";
import { CostHistoryChart } from "@/components/features/costs/cost-history-chart";
import { AssetTree } from "@/components/features/hierarchies/asset-tree";
import { PhotoGallery } from "@/components/features/assets/photo-gallery";
import { DocumentList } from "@/components/features/assets/document-list";
import { CustomFields } from "@/components/features/assets/custom-fields";
import { FitSummaryCard } from "@/components/features/assets/fit-summary";

interface PageProps {
  params: Promise<{ id: string }>;
}

const tabs = [
  { key: "overview", label: "Overview", icon: Activity },
  { key: "photos", label: "Photos", icon: Camera },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "custom-fields", label: "Custom Fields", icon: Settings2 },
  { key: "inspections", label: "Inspections", icon: ClipboardCheck },
  { key: "costs", label: "Costs", icon: BarChart2 },
  { key: "hierarchy", label: "Hierarchy", icon: GitBranch },
  { key: "workorders", label: "Work Orders", icon: Wrench },
  { key: "timeline", label: "Timeline", icon: Clock },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AssetDetailPage({ params }: PageProps) {
  const { id: idStr } = use(params);
  const id = parseInt(idStr, 10);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const { data: assetData, isLoading, isError } = useAsset(id);
  const { data: conditionData } = useConditionStats(id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !assetData?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Asset not found
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              The asset you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/assets">
              <Button className="mt-4" size="sm">
                Back to Assets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const asset = assetData.data;
  const stats = conditionData?.data;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                  {asset.equipmentName}
                </h1>
                <Badge
                  className={cn(
                    "text-[10px] border",
                    getConditionBg(conditionLabel(asset.conditionRating))
                  )}
                >
                  {conditionLabel(asset.conditionRating)}
                </Badge>
                <Badge
                  className={cn(
                    "text-[10px] border",
                    getLifecycleBg(lifecycleLabel(asset.lifecycleStatus))
                  )}
                >
                  {lifecycleLabel(asset.lifecycleStatus)}
                </Badge>
                {/* Online/offline status toggle */}
                <StatusToggle assetId={id} />
              </div>
              {asset.equipmentBarCodeID && (
                <p className="text-xs font-mono text-[var(--muted-foreground)]">
                  {asset.equipmentBarCodeID}
                  {asset.serialNumber && ` · S/N: ${asset.serialNumber}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/scan">
              <Button variant="outline" size="sm" className="sm:hidden">
                <ScanLine className="mr-2 h-3.5 w-3.5" />
                Scan
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-[var(--destructive)]">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Decommission
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] px-4 sm:px-8 overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.key
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info — 2 cols on desktop */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {asset.equipmentDescription && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {asset.equipmentDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Details Grid */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
                    Asset Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                      icon={<MapPin className="h-3.5 w-3.5" />}
                      label="Property"
                      value={asset.propertyName ?? "—"}
                    />
                    <DetailRow
                      icon={<MapPin className="h-3.5 w-3.5" />}
                      label="Location"
                      value={asset.locationName ?? "—"}
                    />
                    <DetailRow
                      icon={<Wrench className="h-3.5 w-3.5" />}
                      label="Category"
                      value={asset.categoryName ?? asset.equipmentTypeName ?? "—"}
                    />
                    <DetailRow
                      icon={<Wrench className="h-3.5 w-3.5" />}
                      label="Manufacturer"
                      value={asset.manufacturerName ?? "—"}
                    />
                    <DetailRow
                      icon={<Wrench className="h-3.5 w-3.5" />}
                      label="Model"
                      value={asset.modelNumber ?? "—"}
                    />
                    <DetailRow
                      icon={<Shield className="h-3.5 w-3.5" />}
                      label="Serial Number"
                      value={asset.serialNumber ?? "—"}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Financial */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
                    Financial
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailRow
                      icon={<DollarSign className="h-3.5 w-3.5" />}
                      label="Acquisition Cost"
                      value={
                        asset.acquisitionCost
                          ? formatCurrency(asset.acquisitionCost)
                          : "—"
                      }
                    />
                    <DetailRow
                      icon={<Calendar className="h-3.5 w-3.5" />}
                      label="Purchase Date"
                      value={
                        asset.acquisitionDate
                          ? formatDate(asset.acquisitionDate)
                          : "—"
                      }
                    />
                    <DetailRow
                      icon={<Shield className="h-3.5 w-3.5" />}
                      label="Warranty Expiration"
                      value={
                        asset.warrantyExpiration
                          ? formatDate(asset.warrantyExpiration)
                          : "—"
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {asset.notes && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">
                      Notes
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-wrap">
                      {asset.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar — 1 col */}
            <div className="space-y-6">
              {/* Condition Card */}
              <ConditionCard assetId={id} stats={stats ?? null} />

              {/* Cost Summary Card */}
              <CostSummaryCard assetId={id} />

              {/* Quick Info */}
              <Card>
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Lifecycle
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">
                        Status
                      </span>
                      <Badge
                        className={cn(
                          "text-[10px] border",
                          getLifecycleBg(lifecycleLabel(asset.lifecycleStatus))
                        )}
                      >
                        {lifecycleLabel(asset.lifecycleStatus)}
                      </Badge>
                    </div>
                    {asset.expectedLifeYears && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--muted-foreground)]">
                          Expected Life
                        </span>
                        <span className="text-[var(--foreground)]">
                          {asset.expectedLifeYears} years
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">
                        Created
                      </span>
                      <span className="text-[var(--foreground)]">
                        {formatDate(asset.dateCreated)}
                      </span>
                    </div>
                    {asset.dateModified && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--muted-foreground)]">
                          Last Modified
                        </span>
                        <span className="text-[var(--foreground)]">
                          {formatDate(asset.dateModified)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "costs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CostHistoryChart assetId={id} />
              </div>
              <div>
                <CostSummaryCard assetId={id} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "hierarchy" && (
          <div className="max-w-2xl">
            <AssetTree assetId={id} />
          </div>
        )}

        {activeTab === "photos" && (
          <PhotoGallery assetId={id} />
        )}

        {activeTab === "documents" && (
          <DocumentList assetId={id} />
        )}

        {activeTab === "custom-fields" && (
          <CustomFields assetId={id} editable />
        )}

        {activeTab === "inspections" && (
          <FitSummaryCard assetId={id} />
        )}

        {activeTab === "workorders" && (
          <Card>
            <CardContent className="p-8 text-center">
              <Wrench className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
              <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                Work Orders
              </h3>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Work order integration coming in Phase 3.
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === "timeline" && (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
              <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                Activity Timeline
              </h3>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Full audit trail coming in Phase 4.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-[var(--muted-foreground)]">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </div>
        <div className="text-sm text-[var(--foreground)]">{value}</div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8 gap-4">
          <div className="h-8 w-16 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-6 w-64 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </header>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardContent className="p-5 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
