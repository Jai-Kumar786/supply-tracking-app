export interface InventoryItem {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  commodityName: string;
  price: number;
  quantity: number;
  location: 'shop' | 'godown';
  createdAt: string;
  updatedAt: string;
}

export interface DailyGroup {
  date: string;
  items: InventoryItem[];
  totalValue: number;
  totalItems: number;
}

export type Location = 'shop' | 'godown';
export type ActiveTab = 'shop' | 'godown' | 'summary';
export type SortKey = 'date' | 'name' | 'price' | 'quantity';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
}

export interface TransferPayload {
  itemId: string;
  quantity: number;
  from: Location;
  to: Location;
}

export interface SummaryStats {
  shopItemCount: number;
  godownItemCount: number;
  shopTotalValue: number;
  godownTotalValue: number;
  combinedTotalValue: number;
  shopUniqueItems: number;
  godownUniqueItems: number;
}
