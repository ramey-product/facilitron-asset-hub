'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface SettingRecord {
  settingKey: string;
  settingValue: string;
}

interface SettingsResponse {
  data: SettingRecord[];
}

interface GeneralSettingsProps {
  settingsData: SettingsResponse | undefined;
}

interface FormState {
  barcodePrefix: string;
  autoGenerateBarcodes: boolean;
  warrantyAlertDays: string;
  conditionTrackingEnabled: boolean;
  defaultPageSize: string;
  requireSerialNumber: boolean;
  enableDocumentUploads: boolean;
}

function getSetting(data: SettingRecord[], key: string): string {
  return data.find(s => s.settingKey === key)?.settingValue ?? '';
}

function buildFormState(data: SettingRecord[] | undefined): FormState {
  if (!data) {
    return {
      barcodePrefix: 'AST',
      autoGenerateBarcodes: true,
      warrantyAlertDays: '90',
      conditionTrackingEnabled: true,
      defaultPageSize: '20',
      requireSerialNumber: false,
      enableDocumentUploads: true,
    };
  }
  return {
    barcodePrefix: getSetting(data, 'asset.barcode.prefix') || 'AST',
    autoGenerateBarcodes: getSetting(data, 'asset.barcode.autoGenerate') === 'true',
    warrantyAlertDays: getSetting(data, 'asset.warrantyAlertDays') || '90',
    conditionTrackingEnabled: getSetting(data, 'asset.condition.trackingEnabled') === 'true',
    defaultPageSize: getSetting(data, 'asset.listDefaultPageSize') || '20',
    requireSerialNumber: getSetting(data, 'asset.requireSerialNumber') === 'true',
    enableDocumentUploads: getSetting(data, 'asset.enableDocumentUploads') === 'true',
  };
}

export function GeneralSettings({ settingsData }: GeneralSettingsProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(buildFormState(settingsData?.data));
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Sync when data loads
  useEffect(() => {
    if (settingsData?.data) {
      setForm(buildFormState(settingsData.data));
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiClient.settings.update(key, value),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'all'] });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    },
  });

  function save(key: string, value: string) {
    updateMutation.mutate({ key, value });
  }

  function update(patch: Partial<FormState>) {
    setForm(prev => ({ ...prev, ...patch }));
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-[var(--muted-foreground)]">
        Global settings that apply to all assets in your organization.
        Changes take effect immediately.
      </p>

      {/* Barcode Settings */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Barcode / Asset Tag</h3>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
          <SettingRow
            label="Asset Tag Prefix"
            description="Prefix prepended to all auto-generated asset tags (e.g. AST-001234)"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={form.barcodePrefix}
                onChange={(e) => update({ barcodePrefix: e.target.value.toUpperCase() })}
                maxLength={8}
                className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-mono text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <SaveButton
                onClick={() => save('asset.barcode.prefix', form.barcodePrefix)}
                saved={savedKey === 'asset.barcode.prefix'}
                isPending={updateMutation.isPending && updateMutation.variables?.key === 'asset.barcode.prefix'}
              />
            </div>
          </SettingRow>

          <SettingRow
            label="Auto-Generate Barcodes"
            description="Automatically generate a unique asset tag when registering new assets"
          >
            <Toggle
              checked={form.autoGenerateBarcodes}
              onChange={(v) => {
                update({ autoGenerateBarcodes: v });
                save('asset.barcode.autoGenerate', String(v));
              }}
            />
          </SettingRow>
        </div>
      </section>

      {/* Condition Tracking */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Condition Tracking</h3>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
          <SettingRow
            label="Enable Condition Tracking"
            description="Show condition score fields and logging on asset detail pages"
          >
            <Toggle
              checked={form.conditionTrackingEnabled}
              onChange={(v) => {
                update({ conditionTrackingEnabled: v });
                save('asset.condition.trackingEnabled', String(v));
              }}
            />
          </SettingRow>
        </div>
      </section>

      {/* Warranty */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Warranty Alerts</h3>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
          <SettingRow
            label="Alert Lead Time"
            description="Days before warranty expiration to show an alert in the asset list"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.warrantyAlertDays}
                onChange={(e) => update({ warrantyAlertDays: e.target.value })}
                min={0}
                max={365}
                className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <span className="text-sm text-[var(--muted-foreground)]">days</span>
              <SaveButton
                onClick={() => save('asset.warrantyAlertDays', form.warrantyAlertDays)}
                saved={savedKey === 'asset.warrantyAlertDays'}
                isPending={updateMutation.isPending && updateMutation.variables?.key === 'asset.warrantyAlertDays'}
              />
            </div>
          </SettingRow>
        </div>
      </section>

      {/* List & Display */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">List & Display</h3>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
          <SettingRow
            label="Default Page Size"
            description="Number of assets shown per page in the asset list"
          >
            <div className="flex items-center gap-2">
              <select
                value={form.defaultPageSize}
                onChange={(e) => {
                  update({ defaultPageSize: e.target.value });
                  save('asset.listDefaultPageSize', e.target.value);
                }}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              {savedKey === 'asset.listDefaultPageSize' && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
          </SettingRow>

          <SettingRow
            label="Require Serial Number"
            description="Make the serial number field required when registering a new asset"
          >
            <Toggle
              checked={form.requireSerialNumber}
              onChange={(v) => {
                update({ requireSerialNumber: v });
                save('asset.requireSerialNumber', String(v));
              }}
            />
          </SettingRow>

          <SettingRow
            label="Enable Document Uploads"
            description="Allow attaching files (manuals, invoices, photos) to asset records"
          >
            <Toggle
              checked={form.enableDocumentUploads}
              onChange={(v) => {
                update({ enableDocumentUploads: v });
                save('asset.enableDocumentUploads', String(v));
              }}
            />
          </SettingRow>
        </div>
      </section>
    </div>
  );
}

// ---- Sub-components ----

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1',
        checked ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
      )}
    >
      <span
        className={cn(
          'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-1'
        )}
      />
    </button>
  );
}

function SaveButton({
  onClick,
  saved,
  isPending,
}: {
  onClick: () => void;
  saved: boolean;
  isPending: boolean;
}) {
  if (saved) {
    return (
      <span className="text-xs text-emerald-600 flex items-center gap-1">
        <Check className="h-3 w-3" /> Saved
      </span>
    );
  }
  return (
    <Button size="sm" variant="outline" onClick={onClick} disabled={isPending}>
      <Save className="h-3.5 w-3.5 mr-1.5" />
      {isPending ? 'Saving...' : 'Save'}
    </Button>
  );
}
