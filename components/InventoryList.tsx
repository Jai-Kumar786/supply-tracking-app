'use client';

import { useInventory } from '@/context/InventoryContext';
import { useFilter } from '@/hooks/useFilter';
import { Location, InventoryItem } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';
import DateGroup from './DateGroup';
import EmptyState from './EmptyState';

interface InventoryListProps {
  location: Location;
  onEdit: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
  onAddNew: () => void;
}

export default function InventoryList({
  location,
  onEdit,
  onTransfer,
  onAddNew,
}: InventoryListProps) {
  const { getFilteredGroups, hydrated } = useInventory();
  const {
    filter,
    setSearch,
    setDateFrom,
    setDateTo,
    setSortKey,
    resetFilter,
    hasActiveFilters,
  } = useFilter();

  const groups = getFilteredGroups(location, filter);
  const isShop = location === 'shop';
  const totalValue = groups.reduce((s, g) => s + g.totalValue, 0);
  const totalItems = groups.reduce((s, g) => s + g.items.length, 0);

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              isShop ? 'bg-emerald-500' : 'bg-amber-500'
            )}
          />
          <h2 className="text-sm font-semibold text-foreground">
            {isShop ? 'Shop' : 'Godown'} Inventory
          </h2>
          {totalItems > 0 && (
            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
        {totalValue > 0 && (
          <p className="text-xs font-semibold font-mono text-foreground">
            {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      {/* Search + Filter */}
      <SearchBar
        filter={filter}
        onSearchChange={setSearch}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSortKeyChange={setSortKey}
        onReset={resetFilter}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Groups or empty */}
      {groups.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No results found' : `No ${isShop ? 'shop' : 'godown'} items`}
          description={
            hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : `Tap the + button to add your first ${isShop ? 'shop' : 'godown'} item.`
          }
          action={
            !hasActiveFilters ? (
              <button
                onClick={onAddNew}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Add First Item
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="pb-20 lg:pb-4">
          {groups.map((group, i) => (
            <DateGroup
              key={group.date}
              group={group}
              onEdit={onEdit}
              onTransfer={onTransfer}
              defaultExpanded={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
