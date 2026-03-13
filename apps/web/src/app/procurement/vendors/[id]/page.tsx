"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  AlertTriangle as AlertIcon,
  ShoppingCart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { getTooltipStyle, resolveVar } from "@/lib/chart-theme";
import { useVendorDetail, useVendorPerformance } from "@/hooks/use-vendors";

function renderStars(rating: number | null) {
  if (rating === null) return <span className="text-xs text-[var(--muted-foreground)]">No rating</span>;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-amber-400 text-amber-400" : "text-[var(--muted-foreground)]/30"
          )}
        />
      ))}
    </div>
  );
}

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = Number(params.id);
  const { data, isLoading, isError } = useVendorDetail(vendorId);
  const { data: perfData, isLoading: perfLoading } = useVendorPerformance(vendorId);

  const vendor = data?.data;
  const performance = perfData?.data;

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

  if (isError || !vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Vendor not found</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Could not load vendor details.
            </p>
            <Link href="/procurement/vendors">
              <Button className="mt-4" size="sm" variant="outline">Back to directory</Button>
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
            <Link href="/procurement/vendors">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[var(--foreground)]">{vendor.name}</h1>
                <Badge className={cn("text-[10px] border", vendor.isActive
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20"
                  : "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20"
                )}>
                  {vendor.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {vendor.category === "both" ? "Parts & Service" : vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)} Vendor
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Contact Info + Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                Contact Information
              </h2>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <dt className="text-xs text-[var(--muted-foreground)]">Contact Name</dt>
                  <dd className="text-sm font-medium text-[var(--foreground)]">{vendor.contactName ?? "---"}</dd>
                </div>
                {vendor.email && (
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Email</dt>
                    <dd className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                      <Mail className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      <a href={`mailto:${vendor.email}`} className="hover:text-[var(--primary)]">{vendor.email}</a>
                    </dd>
                  </div>
                )}
                {vendor.phone && (
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Phone</dt>
                    <dd className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                      <Phone className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      {vendor.phone}
                    </dd>
                  </div>
                )}
                {vendor.website && (
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Website</dt>
                    <dd className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                      <Globe className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">
                        {vendor.website}
                      </a>
                    </dd>
                  </div>
                )}
                {vendor.address && (
                  <div className="col-span-2">
                    <dt className="text-xs text-[var(--muted-foreground)]">Address</dt>
                    <dd className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                      <MapPin className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      {vendor.address}
                    </dd>
                  </div>
                )}
                {vendor.contractExpiry && (
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Contract Expiry</dt>
                    <dd className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                      <Calendar className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      {formatDate(vendor.contractExpiry)}
                    </dd>
                  </div>
                )}
              </dl>
              {vendor.notes && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <dt className="text-xs text-[var(--muted-foreground)]">Notes</dt>
                  <dd className="text-sm text-[var(--foreground)] mt-1">{vendor.notes}</dd>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                Rating
              </h2>
              <div className="flex items-center gap-3">
                {renderStars(vendor.rating)}
                {vendor.rating !== null && (
                  <span className="text-lg font-bold text-[var(--foreground)]">{vendor.rating}/5</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        {!perfLoading && performance && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">On-Time Delivery</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{performance.onTimeDeliveryPct}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">Avg Lead Time</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{performance.avgLeadTimeDays} days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertIcon className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">Defect Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{performance.defectRatePct}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">Total Spend</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(performance.totalSpend)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Trend Chart */}
            {performance.monthlyTrend.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                    12-Month Performance Trend
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performance.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke={resolveVar("--border")} />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: resolveVar("--muted-foreground") }}
                          tickLine={false}
                          axisLine={{ stroke: resolveVar("--border") }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: resolveVar("--muted-foreground") }}
                          tickLine={false}
                          axisLine={{ stroke: resolveVar("--border") }}
                        />
                        <Tooltip contentStyle={getTooltipStyle()} />
                        <Line
                          type="monotone"
                          dataKey="onTimePct"
                          name="On-Time %"
                          stroke={resolveVar("--primary")}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="leadTimeDays"
                          name="Lead Time (days)"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {perfLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-[var(--muted-foreground)]">Loading performance data...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
