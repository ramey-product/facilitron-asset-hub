import type {
  SettingsProvider,
  SettingRecord,
  CategoryRecord,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/providers.js";
import { mockSettings } from "./data/settings.js";
import { mockCategories } from "./data/categories.js";

// Working copies for in-memory mutations
const settings = [...mockSettings];
let nextSettingId = Math.max(...settings.map((s) => s.id)) + 1;

const categories = [...mockCategories];
let nextCategoryId = Math.max(...categories.map((c) => c.id)) + 1;

export const mockSettingsProvider: SettingsProvider = {
  async getAll(customerID: number): Promise<SettingRecord[]> {
    return settings.filter((s) => s.customerId === customerID);
  },

  async getByKey(
    customerID: number,
    key: string
  ): Promise<SettingRecord | null> {
    return (
      settings.find(
        (s) => s.customerId === customerID && s.settingKey === key
      ) ?? null
    );
  },

  async upsert(
    customerID: number,
    contactId: number,
    key: string,
    value: string
  ): Promise<SettingRecord> {
    const now = new Date().toISOString();
    const existingIdx = settings.findIndex(
      (s) => s.customerId === customerID && s.settingKey === key
    );

    if (existingIdx !== -1) {
      const updated: SettingRecord = {
        ...settings[existingIdx]!,
        settingValue: value,
        updatedBy: contactId,
        updatedAt: now,
      };
      settings[existingIdx] = updated;
      return updated;
    }

    const newSetting: SettingRecord = {
      id: nextSettingId++,
      customerId: customerID,
      settingKey: key,
      settingValue: value,
      updatedBy: contactId,
      updatedAt: now,
    };
    settings.push(newSetting);
    return newSetting;
  },

  async listCategories(customerID: number): Promise<CategoryRecord[]> {
    return categories
      .filter((c) => c.customerId === customerID && c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async createCategory(
    customerID: number,
    _contactId: number,
    data: CreateCategoryInput
  ): Promise<CategoryRecord> {
    const now = new Date().toISOString();
    const newCategory: CategoryRecord = {
      id: nextCategoryId++,
      customerId: customerID,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      icon: data.icon ?? null,
      color: data.color ?? null,
      sortOrder: data.sortOrder ?? categories.length + 1,
      isActive: true,
      createdAt: now,
      updatedAt: null,
    };
    categories.push(newCategory);
    return newCategory;
  },

  async updateCategory(
    customerID: number,
    id: number,
    data: UpdateCategoryInput
  ): Promise<CategoryRecord | null> {
    const idx = categories.findIndex(
      (c) => c.customerId === customerID && c.id === id
    );
    if (idx === -1) return null;

    const now = new Date().toISOString();
    const existing = categories[idx]!;
    const updated: CategoryRecord = {
      id: existing.id,
      customerId: existing.customerId,
      name: data.name ?? existing.name,
      slug: data.slug ?? existing.slug,
      description: data.description !== undefined ? data.description : existing.description,
      icon: data.icon !== undefined ? data.icon : existing.icon,
      color: data.color !== undefined ? data.color : existing.color,
      sortOrder: data.sortOrder ?? existing.sortOrder,
      isActive: existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: now,
    };
    categories[idx] = updated;
    return updated;
  },

  async deleteCategory(customerID: number, id: number): Promise<boolean> {
    const idx = categories.findIndex(
      (c) => c.customerId === customerID && c.id === id
    );
    if (idx === -1) return false;

    categories[idx] = { ...categories[idx]!, isActive: false };
    return true;
  },
};
