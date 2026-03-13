"use client";

import { useState, useEffect } from "react";
import { Search, Download, FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { useAuditTrail } from "@/hooks/use-consumption";

const changeTypes = ["consumption", "adjustment", "reversal", "receiving", "transfer"] as const;

function changeTypeBadge(type: string) {
  const map: Record<string, string> = {
    consumption: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
    adjustment: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20",
    reversal: "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
    receiving: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
    transfer: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/20",
  };
  return (
    <Badge className={cn("text-[10px] border capitalize", map[type] ?? "")}>
      {type}
    </Badge>
  );
}

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [changeType, setChangeType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params: Record<string, string | number> = { page, limit };
  if (debouncedSearch) params.search = debouncedSearch;
  if (changeType !== "all") params.changeType = changeType;
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;

  const { data, isLoading, isError } = useAuditTrail(params);
  const records = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 50, total: 0, totalPages: 0 };

  const handleExportCsv = () => {
    if (records.length === 0) return;
    const headers = ["Date", "Part", "Location", "Change Type", "Qty Before", "Qty After", "Change", "Reason", "Reference", "Changed By"];
    const rows = records.map((r) => [
      r.changedAt,
      r.partName,
      r.locationName,
      r.changeType,
      r.qtyBefore,
      r.qtyAfter,
      r.qtyChanged,
      r.reason,
      r.referenceId ?? "",
      r.changedBy,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Inventory Audit Trail</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {meta.total} records
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={records.length === 0}>
            <Download className="mr-2 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by part, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Search audit trail"
            />
          </div>

          <select
            value={changeType}
            onChange={(e) => {
              setChangeType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Filter by change type"
          >
            <option value="all">All Types</option>
            {changeTypes.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label htmlFor="date-from" className="text-xs text-[var(--muted-foreground)]">From</label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="date-to" className="text-xs text-[var(--muted-foreground)]">To</label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-5 w-20 animate-pulse rounded-md bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error */}
        {isError && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-[var(--destructive)]">Failed to load audit trail.</p>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Part</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Location</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Type</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Before</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">After</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Change</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Reason</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Ref</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">By</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                        {formatDate(record.changedAt)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                        {record.partName}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                        {record.locationName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {changeTypeBadge(record.changeType)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-[var(--muted-foreground)]">
                        {record.qtyBefore}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-[var(--foreground)]">
                        {record.qtyAfter}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          "text-sm font-medium",
                          record.qtyChanged > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                        )}>
                          {record.qtyChanged > 0 ? "+" : ""}{record.qtyChanged}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] max-w-[200px] truncate">
                        {record.reason}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--muted-foreground)]">
                        {record.referenceId ?? "---"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                        {record.changedBy}
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <FileSearch className="mx-auto h-8 w-8 text-[var(--muted-foreground)] mb-3" />
                        <p className="text-sm text-[var(--muted-foreground)]">No audit records found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && !isError && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[var(--muted-foreground)]">
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
