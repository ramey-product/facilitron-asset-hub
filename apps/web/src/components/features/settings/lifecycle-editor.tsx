'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Pencil, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface LifecycleStage {
  key: string;
  label: string;
  color: string;
  isDefault: boolean;
  isSystem: boolean; // system stages cannot be deleted
  description: string;
}

const SYSTEM_STAGES: LifecycleStage[] = [
  {
    key: 'Active',
    label: 'Active',
    color: '#22C55E',
    isDefault: true,
    isSystem: true,
    description: 'Asset is operational and in service',
  },
  {
    key: 'UnderMaintenance',
    label: 'Under Maintenance',
    color: '#3B82F6',
    isDefault: false,
    isSystem: true,
    description: 'Asset is temporarily out of service for maintenance',
  },
  {
    key: 'FlaggedForReplacement',
    label: 'Flagged for Replacement',
    color: '#F97316',
    isDefault: false,
    isSystem: true,
    description: 'Asset has been identified for replacement planning',
  },
  {
    key: 'Decommissioned',
    label: 'Decommissioned',
    color: '#6B7280',
    isDefault: false,
    isSystem: true,
    description: 'Asset has been taken permanently out of service',
  },
];

interface EditingStage {
  key: string;
  label: string;
  color: string;
}

interface SettingsResponse {
  data: Array<{ settingKey: string; settingValue: string }>;
}

interface LifecycleEditorProps {
  settingsData: SettingsResponse | undefined;
}

export function LifecycleEditor({ settingsData }: LifecycleEditorProps) {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#8B5CF6');

  // Read the default stage from settings
  const defaultStage = settingsData?.data.find(
    s => s.settingKey === 'asset.defaultLifecycleStatus'
  )?.settingValue ?? 'Active';

  const updateMutation = useMutation({
    mutationFn: (payload: { key: string; value: string }) =>
      apiClient.settings.update(payload.key, payload.value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'all'] });
      setEditingKey(null);
    },
  });

  function startEdit(stage: LifecycleStage) {
    setEditingKey(stage.key);
    setEditLabel(stage.label);
    setEditColor(stage.color);
  }

  function saveEdit() {
    if (!editingKey) return;
    updateMutation.mutate({
      key: `asset.lifecycle.label.${editingKey}`,
      value: editLabel,
    });
  }

  function setDefault(key: string) {
    updateMutation.mutate({ key: 'asset.defaultLifecycleStatus', value: key });
  }

  function saveNewStage() {
    if (!newLabel.trim()) return;
    updateMutation.mutate({
      key: `asset.lifecycle.custom.${Date.now()}`,
      value: JSON.stringify({ label: newLabel, color: newColor }),
    });
    setShowNewForm(false);
    setNewLabel('');
    setNewColor('#8B5CF6');
  }

  // Merge custom stages from settings
  const customStages: LifecycleStage[] = (settingsData?.data ?? [])
    .filter(s => s.settingKey.startsWith('asset.lifecycle.custom.'))
    .map(s => {
      try {
        const parsed = JSON.parse(s.settingValue);
        return {
          key: s.settingKey,
          label: parsed.label ?? s.settingKey,
          color: parsed.color ?? '#8B5CF6',
          isDefault: defaultStage === s.settingKey,
          isSystem: false,
          description: 'Custom lifecycle stage',
        };
      } catch {
        return null;
      }
    })
    .filter((s): s is LifecycleStage => s !== null);

  const allStages = [
    ...SYSTEM_STAGES.map(s => ({ ...s, isDefault: defaultStage === s.key })),
    ...customStages,
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          Lifecycle stages track where an asset is in its operational life. The default stage is applied to newly registered assets.
        </p>
        <Button size="sm" variant="outline" onClick={() => setShowNewForm(true)} disabled={showNewForm}>
          <Plus className="mr-1.5 h-4 w-4" />
          Custom Stage
        </Button>
      </div>

      {showNewForm && (
        <div className="rounded-xl border-2 border-[var(--primary)]/30 bg-[var(--card)] p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">New Custom Stage</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--foreground)]">Label *</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. In Storage"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--foreground)]">Color</label>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="h-8 w-full rounded-lg border border-[var(--border)] cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowNewForm(false)}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button size="sm" onClick={saveNewStage} disabled={!newLabel.trim() || updateMutation.isPending}>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Save Stage
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {allStages.map((stage) => {
          const isEditing = editingKey === stage.key;

          if (isEditing) {
            return (
              <div
                key={stage.key}
                className="flex items-center gap-4 rounded-xl border-2 border-[var(--primary)]/30 bg-[var(--card)] px-4 py-3"
              >
                <div
                  className="h-4 w-4 rounded-full shrink-0"
                  style={{ backgroundColor: editColor }}
                />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">Label</label>
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">Color</label>
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="h-8 w-full rounded-lg border border-[var(--border)] cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingKey(null)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" className="h-8 w-8" onClick={saveEdit} disabled={updateMutation.isPending}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={stage.key}
              className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
            >
              <div
                className="h-4 w-4 rounded-full shrink-0"
                style={{ backgroundColor: stage.color }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">{stage.label}</span>
                  {stage.isDefault && (
                    <Badge
                      className="text-[10px] gap-1 border-0"
                      style={{ backgroundColor: '#F59E0B22', color: '#F59E0B' }}
                    >
                      <Star className="h-2.5 w-2.5" />
                      Default
                    </Badge>
                  )}
                  {stage.isSystem && (
                    <Badge variant="secondary" className="text-[10px]">System</Badge>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{stage.description}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!stage.isDefault && (
                  <button
                    onClick={() => setDefault(stage.key)}
                    className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--accent)]"
                    title="Set as default"
                  >
                    Set default
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEdit(stage)}
                  aria-label={`Edit ${stage.label}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
