"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Box,
  TrendingDown,
  Truck,
  FileText,
  Download,
  Upload,
  SlidersHorizontal,
  ShoppingCart,
  ArrowRightLeft,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn, formatCurrency } from "@/lib/utils";
import { usePartDetail } from "@/hooks/use-inventory";
import { StockLevels } from "@/components/features/inventory/stock-levels";
import { ConsumptionHistory } from "@/components/features/inventory/consumption-history";
import { ConsumptionChart } from "@/components/features/inventory/consumption-chart";
import { ForecastWidget } from "@/components/features/inventory/forecast-widget";

// ─── Tab definitions ───────────────────────────────────────────────────────

const tabs = [
  { id: "overview", label: "Overview", icon: Package },
  { id: "stock", label: "Stock", icon: Box },
  { id: "consumption", label: "Consumption", icon: TrendingDown },
  { id: "vendor", label: "Vendor", icon: Truck },
  { id: "documents", label: "Documents", icon: FileText },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ─── Mock document data for prototype ──────────────────────────────────────

const MOCK_DOCUMENTS = [
  {
    id: 1,
    name: "Product_Spec_Sheet.pdf",
    type: "Spec Sheet",
    uploadDate: "2025-11-03",
    size: "1.2 MB",
  },
  {
    id: 2,
    name: "Safety_Data_Sheet_SDS.pdf",
    type: "SDS",
    uploadDate: "2025-09-17",
    size: "840 KB",
  },
  {
    id: 3,
    name: "Vendor_Warranty_Certificate.pdf",
    type: "Warranty",
    uploadDate: "2025-08-22",
    size: "310 KB",
  },
];

const DOC_TYPE_CLASSES: Record<string, string> = {
  "Spec Sheet":
    "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
  SDS: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20",
  Warranty:
    "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
};

// ─── Modal state type ───────────────────────────────────────────────────────

type ModalId = "adjust" | "createPO" | "transfer" | "edit" | null;

// ─── Toast helper (lightweight, no external dep) ───────────────────────────

function showToast(message: string) {
  const el = document.createElement("div");
  el.textContent = message;
  el.className = [
    "fixed bottom-6 right-6 z-[200] rounded-lg border border-[var(--border)]",
    "bg-[var(--card)] px-4 py-3 text-sm font-medium text-[var(--foreground)] shadow-lg",
    "animate-in slide-in-from-bottom-2 duration-200",
  ].join(" ");
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Modal forms ───────────────────────────────────────────────────────────

function AdjustStockModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [location, setLocation] = useState("Main Warehouse");
  const [qty, setQty] = useState("0");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    console.log("[AdjustStock]", { location, qty, reason });
    showToast("Stock adjustment saved.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <div className="pr-6">
            <DialogTitle>Adjust Stock</DialogTitle>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Record a positive or negative quantity change.
            </p>
          </div>
        </DialogHeader>
        <div className="px-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            >
              <option>Main Warehouse</option>
              <option>Site A Storage</option>
              <option>Site B Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Quantity Change (use negative to decrement)
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain the reason for this adjustment..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            Save Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreatePOModal({
  open,
  onClose,
  defaultVendor,
}: {
  open: boolean;
  onClose: () => void;
  defaultVendor?: string | null;
}) {
  const [vendor, setVendor] = useState(defaultVendor ?? "");
  const [qty, setQty] = useState("10");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    console.log("[CreatePO]", { vendor, qty, notes });
    showToast("Purchase order created.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <div className="pr-6">
            <DialogTitle>Create Purchase Order</DialogTitle>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Generate a new PO for this part.
            </p>
          </div>
        </DialogHeader>
        <div className="px-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Vendor
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Select or enter vendor name..."
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional notes for the PO..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Create PO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fromLocation, setFromLocation] = useState("Main Warehouse");
  const [toLocation, setToLocation] = useState("Site A Storage");
  const [qty, setQty] = useState("5");

  const handleSubmit = () => {
    console.log("[Transfer]", { fromLocation, toLocation, qty });
    showToast("Transfer request created.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <div className="pr-6">
            <DialogTitle>Transfer Stock</DialogTitle>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Move inventory between locations.
            </p>
          </div>
        </DialogHeader>
        <div className="px-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              From Location
            </label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            >
              <option>Main Warehouse</option>
              <option>Site A Storage</option>
              <option>Site B Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              To Location
            </label>
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            >
              <option>Main Warehouse</option>
              <option>Site A Storage</option>
              <option>Site B Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleSubmit}
          >
            Request Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditPartModal({
  open,
  onClose,
  part,
}: {
  open: boolean;
  onClose: () => void;
  part: { name: string; unitCost: number; description?: string | null };
}) {
  const [name, setName] = useState(part.name);
  const [cost, setCost] = useState(String(part.unitCost));
  const [description, setDescription] = useState(part.description ?? "");

  const handleSubmit = () => {
    console.log("[EditPart]", { name, cost, description });
    showToast("Part updated.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <div className="pr-6">
            <DialogTitle>Edit Part</DialogTitle>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Update part details.
            </p>
          </div>
        </DialogHeader>
        <div className="px-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Unit Cost ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe this part..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-zinc-700 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Documents Tab ──────────────────────────────────────────────────────────

function DocumentsTab() {
  const handleUploadClick = () => {
    showToast("Document upload coming soon.");
  };

  return (
    <div className="space-y-4">
      {/* Upload bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          {MOCK_DOCUMENTS.length} document{MOCK_DOCUMENTS.length !== 1 ? "s" : ""} attached
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          className="gap-2"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Document
        </Button>
      </div>

      <Card>
        <div className="divide-y divide-[var(--border)]">
          {MOCK_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-[var(--muted)]/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)]">
                  <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {doc.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Uploaded {doc.uploadDate} · {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    "text-[10px] border",
                    DOC_TYPE_CLASSES[doc.type] ??
                      "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20"
                  )}
                >
                  {doc.type}
                </Badge>
                <button
                  onClick={() => showToast("Download coming soon.")}
                  className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  aria-label={`Download ${doc.name}`}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty-state placeholder hint */}
      <p className="text-center text-xs text-[var(--muted-foreground)] pt-2">
        Attach spec sheets, safety data sheets, warranties, and other reference documents.
      </p>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function PartDetailPage() {
  const params = useParams();
  const partId = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [openModal, setOpenModal] = useState<ModalId>(null);

  const { data, isLoading, isError } = usePartDetail(partId);
  const part = data?.data;

  const closeModal = () => setOpenModal(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-8">
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
          <Card>
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse rounded bg-[var(--muted)]"
                />
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
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Part not found
            </h2>
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
      {/* Modals */}
      <AdjustStockModal
        open={openModal === "adjust"}
        onClose={closeModal}
      />
      <CreatePOModal
        open={openModal === "createPO"}
        onClose={closeModal}
        defaultVendor={part.vendorName}
      />
      <TransferModal open={openModal === "transfer"} onClose={closeModal} />
      <EditPartModal
        open={openModal === "edit"}
        onClose={closeModal}
        part={{
          name: part.name,
          unitCost: part.unitCost,
          description: part.description,
        }}
      />

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

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-orange-500 text-white hover:bg-orange-600 gap-1.5"
              onClick={() => setOpenModal("adjust")}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Adjust Stock
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setOpenModal("createPO")}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Create PO
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5"
              onClick={() => setOpenModal("transfer")}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Transfer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setOpenModal("edit")}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
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
                    <dd className="text-sm font-medium text-[var(--foreground)] font-mono">
                      {part.sku}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Category</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">
                      {part.categoryName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Unit Cost</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">
                      {formatCurrency(part.unitCost)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Unit of Measure</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">
                      {part.unitOfMeasure}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Vendor</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">
                      {part.vendorName ?? "---"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">Storage Location</dt>
                    <dd className="text-sm font-medium text-[var(--foreground)]">
                      {part.storageLocation ?? "---"}
                    </dd>
                  </div>
                  {part.description && (
                    <div className="col-span-2">
                      <dt className="text-xs text-[var(--muted-foreground)]">Description</dt>
                      <dd className="text-sm text-[var(--foreground)] mt-1">
                        {part.description}
                      </dd>
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
                      <dd className="text-sm font-medium text-[var(--foreground)]">
                        {part.minQty}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-xs text-[var(--muted-foreground)]">Max Qty</dt>
                      <dd className="text-sm font-medium text-[var(--foreground)]">
                        {part.maxQty}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-xs text-[var(--muted-foreground)]">Reorder Point</dt>
                      <dd className="text-sm font-bold text-[var(--primary)]">
                        {part.reorderPoint}
                      </dd>
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
                      <dd className="text-sm font-medium text-[var(--foreground)]">
                        {part.vendorName}
                      </dd>
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

        {/* Documents Tab */}
        {activeTab === "documents" && <DocumentsTab />}
      </div>
    </div>
  );
}
