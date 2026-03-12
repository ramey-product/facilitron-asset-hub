'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ConditionLevel {
  key: string;
  label: string;
  score: number;
  color: string;
  description: string;
}

// The 5-point condition scale — these are stored as settings with keys like
// asset.condition.label.5, asset.condition.color.5, etc.
const DEFAULT_SCALE: ConditionLevel[] = [
  { key: '5', label: 'Excellent', score: 5, color: '#22C55E', description: 'New or like-new condition, no defects' },
  { key: '4', label: 'Good',      score: 4, color: '#84CC16', description: 'Minor wear, fully functional' },
  { key: '3', label: 'Fair',      score: 3, color: '#F59E0B', description: 'Visible wear, may need minor repair' },
  { key: '2', label: 'Poor',      score: 2, color: '#F97316', description: 'Significant wear, repair needed soon' },
  { key: '1', label: 'Critical',  score: 1, color: '#EF4444', description: 'Failing or failed, immediate action required' },
];

interface SettingsResponse {
  data: Array<{ settingKey: string; settingValue: string }>;
}

function useConditionScale(settingsData: SettingsResponse | undefined): ConditionLevel[] {
  if (!settingsData?.data) return DEFAULT_SCALE;
  return DEFAULT_SCALE.map(level => {
    const labelKey = `asset.condition.label.${level.key}`;
    const colorKey = `asset.condition.color.${level.key}`;
    const labelRecord = settingsData.data.find(s => s.settingKey === labelKey);
    const colorRecord = settingsData.data.find(s => s.settingKey === colorKey);
    return {
      ...level,
      label: labelRecord?.settingValue ?? level.label,
      color: colorRecord?.settingValue ?? level.color,
    };
  });
}

interface ConditionScaleEditorProps {
  settingsData: SettingsResponse | undefined;
}

export function ConditionScaleEditor({ settingsData }: ConditionScaleEditorProps) {
  const queryClient = useQueryClient();
  const scale = useConditionScale(settingsData);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');

  const updateMutation = useMutation({
    mutationFn: async ({ key, label, color }: { key: string; label: string; color: string }) => {
      await Promise.all([
        apiClient.settings.update(`asset.condition.label.${key}`, label),
        apiClient.settings.update(`asset.condition.color.${key}`, color),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'all'] });
      setEditingKey(null);
    },
  });

  function startEdit(level: ConditionLevel) {
    setEditingKey(level.key);
    setEditLabel(level.label);
    setEditColor(level.color);
  }

  function cancelEdit() {
    setEditingKey(null);
  }

  function saveEdit() {
    if (!editingKey) return;
    updateMutation.mutate({ key: editingKey, label: editLabel, color: editColor });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        The 5-point condition scale is used across all asset tracking, condition logs, and reports.
        Customize the label and color for each level.
      </p>

      {/* Visual preview bar */}
      <div className="flex rounded-xl overflow-hidden border border-[var(--border)] h-10">
        {scale.map((level) => (
          <div
            key={level.key}
            className="flex-1 flex items-center justify-center text-xs font-semibold text-white"
            style={{ backgroundColor: level.color }}
            title={`${level.score} — ${level.label}`}
          >
            {level.label.slice(0, 3)}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {scale.map((level) => {
          const isEditing = editingKey === level.key;

          if (isEditing) {
            return (
              <div
                key={level.key}
                className="flex items-center gap-4 rounded-xl border-2 border-[var(--primary)]/30 bg-[var(--card)] px-4 py-3"
              >
                <div
                  className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: editColor }}
                >
                  {level.score}
                </div>

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
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEdit}>
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
              key={level.key}
              className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
            >
              <div
                className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: level.color }}
              >
                {level.score}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">{level.label}</span>
                  <Badge
                    className="text-[10px] border-0"
                    style={{ backgroundColor: level.color + '22', color: level.color }}
                  >
                    Score {level.score}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{level.description}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => startEdit(level)}
                aria-label={`Edit ${level.label}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-[var(--muted)]/30 px-4 py-3 text-xs text-[var(--muted-foreground)]">
        Changing labels affects how conditions appear across the system, including existing records.
        Color changes take effect immediately in all views.
      </div>
    </div>
  );
}
