'use client';

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { InventoryItem, Location, FilterState, SummaryStats, TransferPayload, DailyGroup } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { THEME_KEY } from '@/utils/constants';
import {
  applyFilters,
  computeSummary,
  getUniqueCommodityNames,
  groupItemsByDate,
} from '@/utils/helpers';
import * as actions from '@/app/actions';

interface InventoryContextValue {
  items: InventoryItem[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  addItem: (payload: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  transferItem: (payload: TransferPayload) => Promise<void>;
  getFilteredGroups: (location: Location, filter: FilterState) => DailyGroup[];
  summary: SummaryStats;
  commodityNames: string[];
  hydrated: boolean;
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode, hydratedTheme] = useLocalStorage<boolean>(THEME_KEY, false);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [setDarkMode]);

  // Initial fetch from SQLite database
  useEffect(() => {
    async function init() {
      try {
        const data = await actions.getInventoryItems();
        // Cast or Map if needed, but schema matches types
        setItems(data as InventoryItem[]);
      } catch (err) {
        console.error('Failed to load inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const addItem = useCallback(
    async (payload: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newItem = await actions.addItem(payload);
        setItems((prev) => [newItem as InventoryItem, ...prev]);
      } catch (err) {
        console.error('Failed to add item:', err);
      }
    },
    []
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<InventoryItem>) => {
      try {
        const updatedItem = await actions.updateItem(id, updates);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? (updatedItem as InventoryItem) : item))
        );
      } catch (err) {
        console.error('Failed to update item:', err);
      }
    },
    []
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await actions.deleteItem(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (id: string, delta: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const newQty = Math.max(0, item.quantity + delta);
      try {
        const updatedItem = await actions.updateItem(id, { quantity: newQty });
        setItems((prev) =>
          prev.map((i) => (i.id === id ? (updatedItem as InventoryItem) : i))
        );
      } catch (err) {
        console.error('Failed to update quantity:', err);
      }
    },
    [items]
  );

  const transferItem = useCallback(
    async (payload: TransferPayload) => {
      try {
        await actions.transferItem(payload);
        // Refresh items after transfer to ensure sync
        const data = await actions.getInventoryItems();
        setItems(data as InventoryItem[]);
      } catch (err) {
        console.error('Transfer failed:', err);
      }
    },
    []
  );

  const getFilteredGroups = useCallback(
    (location: Location, filter: FilterState): DailyGroup[] => {
      const locationItems = items.filter((i) => i.location === location);
      const filtered = applyFilters(locationItems, filter);
      return groupItemsByDate(filtered);
    },
    [items]
  );

  const summary = useMemo(() => computeSummary(items), [items]);
  const commodityNames = useMemo(() => getUniqueCommodityNames(items), [items]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        darkMode,
        toggleDarkMode,
        addItem,
        updateItem,
        deleteItem,
        updateQuantity,
        transferItem,
        getFilteredGroups,
        summary,
        commodityNames,
        hydrated: hydratedTheme && !loading,
        loading,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}
