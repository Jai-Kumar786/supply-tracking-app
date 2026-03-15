import type { InventoryItem, DailyGroup, FilterState, SummaryStats } from '@/types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDateLabel(dateStr: string): string {
  const today = getTodayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === yesterdayISO) return 'Yesterday';

  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(2)}`;
}

export function groupItemsByDate(items: InventoryItem[]): DailyGroup[] {
  const map = new Map<string, InventoryItem[]>();

  for (const item of items) {
    const dateKey = item.date;
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(item);
  }

  const groups: DailyGroup[] = [];
  map.forEach((dateItems, date) => {
    groups.push({
      date,
      items: dateItems,
      totalValue: dateItems.reduce((s, i) => s + i.price * i.quantity, 0),
      totalItems: dateItems.reduce((s, i) => s + i.quantity, 0),
    });
  });

  // Sort groups: most recent first
  groups.sort((a, b) => b.date.localeCompare(a.date));
  return groups;
}

export function applyFilters(
  items: InventoryItem[],
  filter: FilterState
): InventoryItem[] {
  let result = [...items];

  if (filter.search.trim()) {
    const q = filter.search.toLowerCase();
    result = result.filter((i) =>
      i.commodityName.toLowerCase().includes(q)
    );
  }

  if (filter.dateFrom) {
    result = result.filter((i) => i.date >= filter.dateFrom);
  }
  if (filter.dateTo) {
    result = result.filter((i) => i.date <= filter.dateTo);
  }

  result.sort((a, b) => {
    let cmp = 0;
    switch (filter.sortKey) {
      case 'date':
        cmp = a.date.localeCompare(b.date);
        break;
      case 'name':
        cmp = a.commodityName.localeCompare(b.commodityName);
        break;
      case 'price':
        cmp = a.price - b.price;
        break;
      case 'quantity':
        cmp = a.quantity - b.quantity;
        break;
    }
    return filter.sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}

export function computeSummary(items: InventoryItem[]): SummaryStats {
  const shopItems = items.filter((i) => i.location === 'shop');
  const godownItems = items.filter((i) => i.location === 'godown');

  const shopTotalValue = shopItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const godownTotalValue = godownItems.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    shopItemCount: shopItems.reduce((s, i) => s + i.quantity, 0),
    godownItemCount: godownItems.reduce((s, i) => s + i.quantity, 0),
    shopTotalValue,
    godownTotalValue,
    combinedTotalValue: shopTotalValue + godownTotalValue,
    shopUniqueItems: shopItems.length,
    godownUniqueItems: godownItems.length,
  };
}

export function getUniqueCommodityNames(items: InventoryItem[]): string[] {
  const names = new Set(items.map((i) => i.commodityName));
  return Array.from(names).sort();
}
