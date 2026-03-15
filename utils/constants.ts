export const STORAGE_KEY = 'shop_inventory_items';
export const THEME_KEY = 'shop_inventory_theme';
export const COLLAPSED_DATES_KEY = 'shop_inventory_collapsed_dates';

export const LOCATION_LABELS: Record<string, string> = {
  shop: 'Shop',
  godown: 'Godown',
};

export const LOCATION_COLORS: Record<string, string> = {
  shop: 'emerald',
  godown: 'amber',
};

export const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'quantity', label: 'Quantity' },
] as const;

export const LONG_PRESS_DELAY = 500; // ms before rapid increment
export const LONG_PRESS_INTERVAL = 80; // ms between rapid increments
