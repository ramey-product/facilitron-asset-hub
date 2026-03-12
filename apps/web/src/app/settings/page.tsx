'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FolderTree,
  Gauge,
  RefreshCw,
  Sliders,
  Factory,
} from 'lucide-react';
import { CategoryManager } from '@/components/features/settings/category-manager';
import { ConditionScaleEditor } from '@/components/features/settings/condition-scale-editor';
import { LifecycleEditor } from '@/components/features/settings/lifecycle-editor';
import { GeneralSettings } from '@/components/features/settings/general-settings';
import { ManufacturerTable } from '@/components/features/settings/manufacturer-table';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

type TabId = 'categories' | 'conditions' | 'lifecycle' | 'general' | 'manufacturers';

const TABS: { id: TabId; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderTree,
    description: 'Manage asset categories used for grouping and filtering',
  },
  {
    id: 'conditions',
    label: 'Condition Scale',
    icon: Gauge,
    description: 'Configure the 5-point condition scoring scale',
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle Stages',
    icon: RefreshCw,
    description: 'Define the stages of an asset\'s operational life',
  },
  {
    id: 'general',
    label: 'General',
    icon: Sliders,
    description: 'Barcode settings, defaults, and display preferences',
  },
  {
    id: 'manufacturers',
    label: 'Manufacturers',
    icon: Factory,
    description: 'Browse and manage the manufacturer and model database',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('categories');

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings', 'all'],
    queryFn: () => apiClient.settings.getAll(),
    staleTime: 60_000,
  });

  const activeTabDef = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Page header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Settings</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Configure Asset Hub for your organization
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 px-8 pb-0 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-[var(--primary)] text-[var(--primary)]'
                    : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content area */}
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{activeTabDef.label}</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{activeTabDef.description}</p>
        </div>

        {activeTab === 'categories' && <CategoryManager />}

        {activeTab === 'conditions' && (
          settingsLoading
            ? <SettingsSkeleton />
            : <ConditionScaleEditor settingsData={settingsData as { data: Array<{ settingKey: string; settingValue: string }> } | undefined} />
        )}

        {activeTab === 'lifecycle' && (
          settingsLoading
            ? <SettingsSkeleton />
            : <LifecycleEditor settingsData={settingsData as { data: Array<{ settingKey: string; settingValue: string }> } | undefined} />
        )}

        {activeTab === 'general' && (
          settingsLoading
            ? <SettingsSkeleton />
            : <GeneralSettings settingsData={settingsData as { data: Array<{ settingKey: string; settingValue: string }> } | undefined} />
        )}

        {activeTab === 'manufacturers' && <ManufacturerTable />}
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-3 max-w-2xl">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-16 rounded-xl bg-[var(--muted)]/30 animate-pulse" />
      ))}
    </div>
  );
}
