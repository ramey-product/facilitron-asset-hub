'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  ExternalLink,
  X,
  Check,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ManufacturerRecord {
  manufacturerRecordID: number;
  manufacturerName: string;
  contactInfo: string | null;
  website: string | null;
  isActive: boolean;
}

interface ModelRecord {
  id: number;
  manufacturerRecordId: number;
  modelName: string;
  modelNumber: string | null;
  categorySlug: string | null;
  specifications: string | null;
  isActive: boolean;
}

interface ManufacturersResponse {
  data: ManufacturerRecord[];
}

interface ModelsResponse {
  data: ModelRecord[];
}

export function ManufacturerTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContactInfo, setNewContactInfo] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  const { data, isLoading, isError } = useQuery<ManufacturersResponse>({
    queryKey: ['manufacturers', 'list', search],
    queryFn: () => apiClient.manufacturers.search(search) as Promise<ManufacturersResponse>,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient.manufacturers.create({
        manufacturerName: newName,
        contactInfo: newContactInfo || undefined,
        website: newWebsite || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'] });
      setShowAddForm(false);
      setNewName('');
      setNewContactInfo('');
      setNewWebsite('');
    },
  });

  const manufacturers = data?.data ?? [];

  function toggleExpand(id: number) {
    setExpandedId(prev => prev === id ? null : id);
  }

  if (isLoading && !search) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-14 rounded-xl bg-[var(--muted)]/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--muted-foreground)]">
        Failed to load manufacturers. Please refresh.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manufacturers..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <Button size="sm" onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Manufacturer
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-xl border-2 border-[var(--primary)]/30 bg-[var(--card)] p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            New Manufacturer
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--foreground)]">Name *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Carrier"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--foreground)]">Contact Info</label>
              <input
                type="text"
                value={newContactInfo}
                onChange={(e) => setNewContactInfo(e.target.value)}
                placeholder="Phone or email"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--foreground)]">Website</label>
              <input
                type="url"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setNewName(''); }}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => createMutation.mutate()}
              disabled={!newName.trim() || createMutation.isPending}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_160px_80px] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        <span>Manufacturer</span>
        <span>Contact</span>
        <span className="text-right">Models</span>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {manufacturers.map((mfr) => (
          <ManufacturerRow
            key={mfr.manufacturerRecordID}
            manufacturer={mfr}
            isExpanded={expandedId === mfr.manufacturerRecordID}
            onToggle={() => toggleExpand(mfr.manufacturerRecordID)}
          />
        ))}
      </div>

      {manufacturers.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
          <Package className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-3" />
          <p className="text-sm text-[var(--muted-foreground)]">
            {search ? `No manufacturers matching "${search}"` : 'No manufacturers yet.'}
          </p>
          {!search && (
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setShowAddForm(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add first manufacturer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Manufacturer row with expandable models ----

function ManufacturerRow({
  manufacturer,
  isExpanded,
  onToggle,
}: {
  manufacturer: ManufacturerRecord;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const queryClient = useQueryClient();
  const [showAddModel, setShowAddModel] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelNumber, setNewModelNumber] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');

  const { data: modelsData, isLoading: modelsLoading } = useQuery<ModelsResponse>({
    queryKey: ['manufacturers', manufacturer.manufacturerRecordID, 'models'],
    queryFn: () => apiClient.manufacturers.getModels(manufacturer.manufacturerRecordID) as Promise<ModelsResponse>,
    enabled: isExpanded,
    staleTime: 60_000,
  });

  const addModelMutation = useMutation({
    mutationFn: () =>
      apiClient.manufacturers.createModel(manufacturer.manufacturerRecordID, {
        modelName: newModelName,
        modelNumber: newModelNumber || undefined,
        categorySlug: newCategorySlug || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['manufacturers', manufacturer.manufacturerRecordID, 'models'],
      });
      setShowAddModel(false);
      setNewModelName('');
      setNewModelNumber('');
      setNewCategorySlug('');
    },
  });

  const models = modelsData?.data ?? [];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-[var(--accent)]/40 transition-colors"
      >
        <div className="shrink-0 text-[var(--muted-foreground)]">
          {isExpanded
            ? <ChevronDown className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />
          }
        </div>

        {/* Name + website */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {manufacturer.manufacturerName}
            </span>
            {!manufacturer.isActive && (
              <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
            )}
          </div>
          {manufacturer.contactInfo && (
            <span className="text-xs text-[var(--muted-foreground)]">{manufacturer.contactInfo}</span>
          )}
        </div>

        {/* Website */}
        {manufacturer.website && (
          <a
            href={manufacturer.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline shrink-0"
          >
            <ExternalLink className="h-3 w-3" />
            Website
          </a>
        )}

        {/* Model count badge */}
        <div className="shrink-0 w-12 text-right">
          <Badge variant="outline" className="text-xs">
            {isExpanded ? (models.length || '...') : '—'}
          </Badge>
        </div>
      </button>

      {/* Expanded models panel */}
      {isExpanded && (
        <div className="border-t border-[var(--border)] bg-[var(--background)]/50">
          <div className="px-10 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Models ({models.length})
              </h4>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setShowAddModel(true)}
                disabled={showAddModel}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Model
              </Button>
            </div>

            {showAddModel && (
              <div className="rounded-lg border border-[var(--primary)]/30 bg-[var(--card)] p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">Model Name *</label>
                    <input
                      type="text"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder="e.g. WeatherExpert 48TC"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">Model Number</label>
                    <input
                      type="text"
                      value={newModelNumber}
                      onChange={(e) => setNewModelNumber(e.target.value)}
                      placeholder="e.g. 48TC-D16A"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">Category</label>
                    <input
                      type="text"
                      value={newCategorySlug}
                      onChange={(e) => setNewCategorySlug(e.target.value)}
                      placeholder="e.g. hvac"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowAddModel(false)}>
                    <X className="mr-1 h-3 w-3" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addModelMutation.mutate()}
                    disabled={!newModelName.trim() || addModelMutation.isPending}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    {addModelMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            )}

            {modelsLoading && (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 rounded-lg bg-[var(--muted)]/30 animate-pulse" />
                ))}
              </div>
            )}

            {!modelsLoading && models.length === 0 && !showAddModel && (
              <p className="text-xs text-[var(--muted-foreground)] py-2">
                No models listed for this manufacturer.
              </p>
            )}

            {!modelsLoading && models.length > 0 && (
              <div className="space-y-1">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--accent)]/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--foreground)]">{model.modelName}</span>
                        {model.modelNumber && (
                          <span className="text-xs font-mono text-[var(--muted-foreground)]">{model.modelNumber}</span>
                        )}
                      </div>
                      {model.specifications && (
                        <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{model.specifications}</p>
                      )}
                    </div>
                    {model.categorySlug && (
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {model.categorySlug}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
