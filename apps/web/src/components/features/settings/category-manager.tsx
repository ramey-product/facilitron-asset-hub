'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface CategoriesResponse {
  data: CategoryRecord[];
}

const DEFAULT_COLORS = [
  '#3B82F6', '#F59E0B', '#06B6D4', '#EF4444',
  '#8B5CF6', '#22C55E', '#EC4899', '#F97316',
];

const ICON_OPTIONS = [
  'Thermometer', 'Zap', 'Droplets', 'Flame',
  'Building2', 'Trees', 'Wrench', 'Shield',
  'Package', 'Cpu', 'Gauge', 'Settings',
];

interface EditingCategory {
  id: number | null; // null = new
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder?: number;
}

const emptyEdit = (): EditingCategory => ({
  id: null,
  name: '',
  slug: '',
  description: '',
  icon: 'Package',
  color: '#3B82F6',
});

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function CategoryManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<EditingCategory | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError } = useQuery<CategoriesResponse>({
    queryKey: ['settings', 'categories'],
    queryFn: () => apiClient.settings.categories.list() as Promise<CategoriesResponse>,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (input: EditingCategory) =>
      apiClient.settings.categories.create({
        name: input.name,
        slug: input.slug,
        description: input.description || undefined,
        icon: input.icon || undefined,
        color: input.color || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'categories'] });
      setShowForm(false);
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EditingCategory> }) =>
      apiClient.settings.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'categories'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.settings.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'categories'] });
    },
  });

  const categories = data?.data ?? [];

  function handleSave() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.slug.trim()) return;

    if (editing.id === null) {
      createMutation.mutate(editing);
    } else {
      updateMutation.mutate({ id: editing.id, data: editing });
    }
  }

  function startEdit(cat: CategoryRecord) {
    setShowForm(false);
    setEditing({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      icon: cat.icon ?? 'Package',
      color: cat.color ?? '#3B82F6',
    });
  }

  function startNew() {
    setEditing(null);
    setShowForm(true);
  }

  function cancelEdit() {
    setEditing(null);
    setShowForm(false);
  }

  function handleMoveUp(index: number) {
    const cat = categories[index];
    const above = categories[index - 1];
    if (!cat || !above) return;
    updateMutation.mutate({ id: cat.id, data: { sortOrder: above.sortOrder } });
    updateMutation.mutate({ id: above.id, data: { sortOrder: cat.sortOrder } });
  }

  function handleMoveDown(index: number) {
    const cat = categories[index];
    const below = categories[index + 1];
    if (!cat || !below) return;
    updateMutation.mutate({ id: cat.id, data: { sortOrder: below.sortOrder } });
    updateMutation.mutate({ id: below.id, data: { sortOrder: cat.sortOrder } });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 rounded-xl bg-[var(--muted)]/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--muted-foreground)]">
        Failed to load categories. Please refresh.
      </div>
    );
  }

  const activeForm = editing ?? (showForm ? emptyEdit() : null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Categories group assets by type. They appear in filters, reports, and the asset registration form.
          </p>
        </div>
        <Button size="sm" onClick={startNew} disabled={showForm || editing !== null}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <CategoryForm
          value={emptyEdit()}
          onChange={(v) => setEditing(v)}
          onSave={() => {
            if (editing) handleSave();
            else {
              const fresh = emptyEdit();
              setEditing(fresh);
            }
          }}
          onCancel={cancelEdit}
          isSaving={createMutation.isPending}
          isNew
        />
      )}

      <div className="space-y-2">
        {categories.map((cat, index) => {
          const isEditing = editing?.id === cat.id;

          if (isEditing && editing) {
            return (
              <CategoryForm
                key={cat.id}
                value={editing}
                onChange={setEditing}
                onSave={handleSave}
                onCancel={cancelEdit}
                isSaving={updateMutation.isPending}
                isNew={false}
              />
            );
          }

          return (
            <div
              key={cat.id}
              className={cn(
                'flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3',
                !cat.isActive && 'opacity-50'
              )}
            >
              {/* Color dot */}
              <div
                className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center"
                style={{ backgroundColor: (cat.color ?? '#94a3b8') + '22', border: `2px solid ${cat.color ?? '#94a3b8'}` }}
              >
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color ?? '#94a3b8' }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">{cat.name}</span>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">/{cat.slug}</span>
                  {!cat.isActive && (
                    <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
                  )}
                </div>
                {cat.description && (
                  <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{cat.description}</p>
                )}
              </div>

              {/* Sort controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="rounded p-0.5 hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === categories.length - 1}
                  className="rounded p-0.5 hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEdit(cat)}
                  aria-label="Edit category"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-[var(--destructive)]"
                  onClick={() => deleteMutation.mutate(cat.id)}
                  aria-label="Delete category"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && !showForm && (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">No categories yet.</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={startNew}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first category
          </Button>
        </div>
      )}
    </div>
  );
}

interface CategoryFormProps {
  value: EditingCategory;
  onChange: (v: EditingCategory) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isNew: boolean;
}

function CategoryForm({ value, onChange, onSave, onCancel, isSaving, isNew }: CategoryFormProps) {
  function update(patch: Partial<EditingCategory>) {
    const next = { ...value, ...patch };
    if ('name' in patch && isNew) {
      next.slug = toSlug(patch.name ?? '');
    }
    onChange(next);
  }

  const isValid = value.name.trim().length > 0 && value.slug.trim().length > 0;

  return (
    <div className="rounded-xl border-2 border-[var(--primary)]/30 bg-[var(--card)] p-4 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {isNew ? 'New Category' : 'Edit Category'}
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--foreground)]">Name *</label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. HVAC"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--foreground)]">Slug *</label>
          <input
            type="text"
            value={value.slug}
            onChange={(e) => update({ slug: toSlug(e.target.value) })}
            placeholder="e.g. hvac"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] font-mono placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--foreground)]">Description</label>
        <input
          type="text"
          value={value.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Optional description"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--foreground)]">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.color}
              onChange={(e) => update({ color: e.target.value })}
              className="h-8 w-8 rounded cursor-pointer border border-[var(--border)]"
            />
            <div className="flex gap-1">
              {DEFAULT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => update({ color: c })}
                  className={cn(
                    'h-5 w-5 rounded-full transition-transform hover:scale-110',
                    value.color === c && 'ring-2 ring-offset-1 ring-[var(--foreground)]'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Use color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button size="sm" onClick={onSave} disabled={!isValid || isSaving}>
          <Check className="mr-1.5 h-3.5 w-3.5" />
          {isSaving ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </div>
  );
}
