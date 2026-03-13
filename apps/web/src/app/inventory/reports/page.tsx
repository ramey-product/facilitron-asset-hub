"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  FileBarChart2,
  MapPin,
  Wrench,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  FileText,
  Save,
  ChevronDown,
  Check,
  Trash2,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useGenerateReport,
  useReportTemplates,
  useCreateReportTemplate,
  useDeleteReportTemplate,
} from "@/hooks/use-inventory-reports";
import type {
  InventoryReportType,
  ReportGroupBy,
  ReportDatePreset,
  ReportFilter,
  InventoryReport,
  ReportRow,
  SavedReportTemplate,
} from "@asset-hub/shared";

// ─── Constants ───────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

const REPORT_TYPES: {
  type: InventoryReportType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  chartType: "bar" | "line";
}[] = [
  {
    type: "usage-by-part",
    label: "Usage by Part",
    description: "Quantity consumed per part over time",
    icon: FileBarChart2,
    chartType: "bar",
  },
  {
    type: "usage-by-location",
    label: "Usage by Location",
    description: "Consumption broken down by stock location",
    icon: MapPin,
    chartType: "bar",
  },
  {
    type: "usage-by-wo-type",
    label: "Usage by WO Type",
    description: "Parts used per work order category",
    icon: Wrench,
    chartType: "bar",
  },
  {
    type: "cost-analysis",
    label: "Cost Analysis",
    description: "Spending trends and cost breakdowns",
    icon: DollarSign,
    chartType: "line",
  },
  {
    type: "vendor-spend",
    label: "Vendor Spend",
    description: "Total spend per vendor with comparison",
    icon: ShoppingCart,
    chartType: "bar",
  },
];

const DATE_PRESETS: { preset: ReportDatePreset; label: string }[] = [
  { preset: "30d", label: "Last 30 Days" },
  { preset: "90d", label: "Last 90 Days" },
  { preset: "ytd", label: "Year to Date" },
  { preset: "12m", label: "Last 12 Months" },
  { preset: "custom", label: "Custom" },
];

const GROUP_OPTIONS: { value: ReportGroupBy; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "category", label: "By Category" },
  { value: "vendor", label: "By Vendor" },
];

// Derive preset date range
function getDateRangeForPreset(preset: Exclude<ReportDatePreset, "custom">): {
  dateStart: string;
  dateEnd: string;
} {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  let start: Date;

  if (preset === "30d") {
    start = new Date(now);
    start.setDate(start.getDate() - 30);
  } else if (preset === "90d") {
    start = new Date(now);
    start.setDate(start.getDate() - 90);
  } else if (preset === "ytd") {
    start = new Date(now.getFullYear(), 0, 1);
  } else {
    // 12m
    start = new Date(now);
    start.setFullYear(start.getFullYear() - 1);
  }

  return { dateStart: start.toISOString().slice(0, 10), dateEnd: end };
}

// ─── Report Type Selector ────────────────────────────────────────────────────

function ReportTypeSelector({
  selected,
  onChange,
}: {
  selected: InventoryReportType;
  onChange: (type: InventoryReportType) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {REPORT_TYPES.map(({ type, label, description, icon: Icon }) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              isActive
                ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--muted)]/40"
            )}
            aria-pressed={isActive}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)]"
                )}
              >
                {label}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                {description}
              </p>
            </div>
            {isActive && (
              <Check className="ml-auto h-3.5 w-3.5 text-[var(--primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Date Range Picker ───────────────────────────────────────────────────────

function DateRangePicker({
  preset,
  customStart,
  customEnd,
  onPresetChange,
  onCustomStartChange,
  onCustomEndChange,
}: {
  preset: ReportDatePreset;
  customStart: string;
  customEnd: string;
  onPresetChange: (p: ReportDatePreset) => void;
  onCustomStartChange: (v: string) => void;
  onCustomEndChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {DATE_PRESETS.map(({ preset: p, label }) => (
          <button
            key={p}
            onClick={() => onPresetChange(p)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              preset === p
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]"
            )}
          >
            <Calendar className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--muted-foreground)]">
              From
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--muted-foreground)]">To</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Grouping Options ─────────────────────────────────────────────────────────

function GroupingOptions({
  value,
  onChange,
}: {
  value: ReportGroupBy;
  onChange: (g: ReportGroupBy) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {GROUP_OPTIONS.map(({ value: v, label }) => (
        <label
          key={v}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            value === v
              ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
              : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
          )}
        >
          <input
            type="radio"
            name="groupBy"
            value={v}
            checked={value === v}
            onChange={() => onChange(v)}
            className="sr-only"
          />
          {label}
        </label>
      ))}
    </div>
  );
}

// ─── Preview Table ────────────────────────────────────────────────────────────

function PreviewTable({
  rows,
  reportType,
}: {
  rows: ReportRow[];
  reportType: InventoryReportType;
}) {
  const costLabel =
    reportType === "vendor-spend" ? "Vendor Spend" : "Total Cost";

  return (
    <div className="overflow-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Label
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Group
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Qty
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {costLabel}
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Avg Cost
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              % of Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-[var(--muted)]/30 transition-colors"
            >
              <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">
                {row.label}
              </td>
              <td className="px-4 py-2.5 text-[var(--muted-foreground)]">
                {row.group}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">
                {row.quantity.toLocaleString()}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">
                {formatCurrency(row.cost)}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">
                {formatCurrency(row.avgCost)}
              </td>
              <td className="px-4 py-2.5 text-right">
                <span className="inline-flex items-center gap-1">
                  <div className="h-1.5 w-16 rounded-full bg-[var(--muted)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{
                        width: `${Math.min(100, row.percentOfTotal)}%`,
                      }}
                    />
                  </div>
                  <span className="tabular-nums text-xs text-[var(--muted-foreground)]">
                    {row.percentOfTotal.toFixed(1)}%
                  </span>
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]"
              >
                No data in this report
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Preview Chart ────────────────────────────────────────────────────────────

function PreviewChart({
  rows,
  reportType,
}: {
  rows: ReportRow[];
  reportType: InventoryReportType;
}) {
  const chartType = REPORT_TYPES.find((r) => r.type === reportType)?.chartType ?? "bar";

  // Aggregate rows by group label, cap at top 8
  const groupTotals = rows.reduce<Record<string, { cost: number; qty: number }>>(
    (acc, row) => {
      const key = row.group || row.label;
      if (!acc[key]) acc[key] = { cost: 0, qty: 0 };
      acc[key].cost += row.cost;
      acc[key].qty += row.quantity;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(groupTotals)
    .sort((a, b) => b[1].cost - a[1].cost)
    .slice(0, 8)
    .map(([name, v]) => ({ name, cost: v.cost, qty: v.qty }));

  const tooltip = {
    contentStyle: {
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      fontSize: 12,
    },
  };

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            {...tooltip}
            formatter={(v: unknown, name?: string | number) => [
              name === "cost" ? formatCurrency(Number(v)) : String(v),
              name === "cost" ? "Total Cost" : "Qty",
            ]}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Line
            type="monotone"
            dataKey="cost"
            name="Total Cost"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          {...tooltip}
          formatter={(v: unknown, name?: string | number) => [
            name === "cost" ? formatCurrency(Number(v)) : String(v),
            name === "cost" ? "Total Cost" : "Qty",
          ]}
        />
        <Bar dataKey="cost" name="Total Cost" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Template Row ─────────────────────────────────────────────────────────────

function TemplateRow({
  template,
  onLoad,
  onDelete,
}: {
  template: SavedReportTemplate;
  onLoad: (t: SavedReportTemplate) => void;
  onDelete: (id: number) => void;
}) {
  const typeMeta = REPORT_TYPES.find((r) => r.type === template.reportType);

  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {typeMeta && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
            <typeMeta.icon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">
            {template.name}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {typeMeta?.label ?? template.reportType}
            {template.isPreBuilt && (
              <span className="ml-1.5 rounded-sm bg-[var(--muted)] px-1 py-0.5 text-[10px] font-medium">
                Pre-built
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLoad(template)}
          className="h-7 text-xs"
        >
          Load
        </Button>
        {!template.isPreBuilt && (
          <button
            onClick={() => onDelete(template.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 transition-colors"
            aria-label={`Delete template ${template.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CSV export ───────────────────────────────────────────────────────────────

function exportToCsv(rows: ReportRow[], reportType: InventoryReportType) {
  const headers = ["Label", "Group", "Quantity", "Cost", "Avg Cost", "% of Total"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${r.label}"`,
        `"${r.group}"`,
        r.quantity,
        r.cost.toFixed(2),
        r.avgCost.toFixed(2),
        r.percentOfTotal.toFixed(2),
      ].join(",")
    ),
  ];
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory-report-${reportType}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InventoryReportsPage() {
  // Filter state
  const [reportType, setReportType] = useState<InventoryReportType>("usage-by-part");
  const [datePreset, setDatePreset] = useState<ReportDatePreset>("30d");
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [customEnd, setCustomEnd] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [groupBy, setGroupBy] = useState<ReportGroupBy>("monthly");

  // Template state
  const [saveTemplateName, setSaveTemplateName] = useState("");
  const [pdfToastVisible, setPdfToastVisible] = useState(false);

  // Hooks
  const generateReport = useGenerateReport();
  const templatesQuery = useReportTemplates();
  const createTemplate = useCreateReportTemplate();
  const deleteTemplate = useDeleteReportTemplate();

  const reportData = generateReport.data as { data: InventoryReport } | undefined;
  const report = reportData?.data;
  const templates = (
    templatesQuery.data as { data: SavedReportTemplate[] } | undefined
  )?.data ?? [];

  // Build filter
  const buildFilter = useCallback((): ReportFilter => {
    let dateStart: string;
    let dateEnd: string;

    if (datePreset === "custom") {
      dateStart = customStart;
      dateEnd = customEnd;
    } else {
      const range = getDateRangeForPreset(datePreset);
      dateStart = range.dateStart;
      dateEnd = range.dateEnd;
    }

    return { reportType, dateStart, dateEnd, datePreset, groupBy };
  }, [reportType, datePreset, customStart, customEnd, groupBy]);

  function handleGenerate() {
    generateReport.mutate(buildFilter());
  }

  function handleLoadTemplate(t: SavedReportTemplate) {
    setReportType(t.reportType);
    if (t.filter.datePreset) setDatePreset(t.filter.datePreset);
    if (t.filter.groupBy) setGroupBy(t.filter.groupBy);
    if (t.filter.dateStart) setCustomStart(t.filter.dateStart);
    if (t.filter.dateEnd) setCustomEnd(t.filter.dateEnd);
  }

  function handleSaveTemplate() {
    if (!saveTemplateName.trim()) return;
    const filter = buildFilter();
    createTemplate.mutate({
      name: saveTemplateName.trim(),
      reportType,
      filter: {
        dateStart: filter.dateStart,
        dateEnd: filter.dateEnd,
        datePreset: filter.datePreset,
        groupBy: filter.groupBy,
      },
    });
    setSaveTemplateName("");
  }

  function handleDeleteTemplate(id: number) {
    deleteTemplate.mutate(id);
  }

  function handlePdfExport() {
    setPdfToastVisible(true);
    setTimeout(() => setPdfToastVisible(false), 4000);
  }

  const rows = report?.rows ?? [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Toast */}
      {pdfToastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-lg text-sm text-[var(--foreground)]"
        >
          <FileText className="h-4 w-4 text-[var(--primary)]" />
          PDF export queued — check your email
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]"
            >
              <Link
                href="/inventory"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Inventory
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">Reports</span>
            </nav>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Inventory Reports
            </h1>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-8">
        {/* ─── Report Builder ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Report Type
              </h3>
              <ReportTypeSelector
                selected={reportType}
                onChange={setReportType}
              />
            </div>

            {/* Date Range */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Date Range
              </h3>
              <DateRangePicker
                preset={datePreset}
                customStart={customStart}
                customEnd={customEnd}
                onPresetChange={setDatePreset}
                onCustomStartChange={setCustomStart}
                onCustomEndChange={setCustomEnd}
              />
            </div>

            {/* Grouping */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Group By
              </h3>
              <GroupingOptions value={groupBy} onChange={setGroupBy} />
            </div>

            {/* Generate */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleGenerate}
                disabled={generateReport.isPending}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                {generateReport.isPending ? "Generating..." : "Generate Report"}
              </Button>

              {generateReport.isError && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Failed to generate report. Ensure the API is running.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ─── Preview ────────────────────────────────────────────────── */}
        {report && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Report Preview
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    Generated {formatDate(report.generatedAt)} &middot;{" "}
                    {report.rows.length} rows &middot; Total cost:{" "}
                    {formatCurrency(report.summary.totalCost)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCsv(rows, reportType)}
                    className="flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePdfExport}
                    className="flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary badges */}
              <div className="flex flex-wrap gap-3">
                <Badge className="border bg-[var(--muted)] text-[var(--foreground)] text-xs">
                  Total Qty: {report.summary.totalQuantity.toLocaleString()}
                </Badge>
                <Badge className="border bg-[var(--muted)] text-[var(--foreground)] text-xs">
                  Total Cost: {formatCurrency(report.summary.totalCost)}
                </Badge>
                <Badge className="border bg-[var(--muted)] text-[var(--foreground)] text-xs">
                  Avg Cost: {formatCurrency(report.summary.avgCost)}
                </Badge>
              </div>

              {/* Chart */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Visualization
                </h3>
                <PreviewChart rows={rows} reportType={reportType} />
              </div>

              {/* Table */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Data Table
                </h3>
                <PreviewTable rows={rows} reportType={reportType} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── Templates ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Save Template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Save as Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-[var(--muted-foreground)]">
                Save the current filter configuration to quickly reload it later.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={saveTemplateName}
                  onChange={(e) => setSaveTemplateName(e.target.value)}
                  placeholder="Template name..."
                  className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTemplate();
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={
                    !saveTemplateName.trim() || createTemplate.isPending
                  }
                  className="flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
              {createTemplate.isSuccess && (
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  Template saved.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Load Template */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Saved Templates
                </CardTitle>
                {templatesQuery.isLoading && (
                  <ChevronDown className="h-4 w-4 animate-bounce text-[var(--muted-foreground)]" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {templates.length === 0 && !templatesQuery.isLoading && (
                <p className="text-xs text-[var(--muted-foreground)]">
                  No saved templates yet.
                </p>
              )}
              {templatesQuery.isLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-14 animate-pulse rounded-lg bg-[var(--muted)]"
                    />
                  ))}
                </div>
              )}
              {!templatesQuery.isLoading && templates.length > 0 && (
                <div className="space-y-2">
                  {templates.map((t) => (
                    <TemplateRow
                      key={t.id}
                      template={t}
                      onLoad={handleLoadTemplate}
                      onDelete={handleDeleteTemplate}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
