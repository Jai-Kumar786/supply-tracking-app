'use client';

import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterState, SortKey } from '@/types';
import { useState } from 'react';
import { SORT_OPTIONS } from '@/utils/constants';

interface SearchBarProps {
  filter: FilterState;
  onSearchChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onSortKeyChange: (k: SortKey) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function SearchBar({
  filter,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onSortKeyChange,
  onReset,
  hasActiveFilters,
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search commodities..."
            value={filter.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground text-foreground transition-all"
          />
          {filter.search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg border transition-colors shrink-0',
            showFilters || hasActiveFilters
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted border-border text-muted-foreground hover:text-foreground'
          )}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shrink-0"
            aria-label="Clear all filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-muted/50 rounded-xl border border-border p-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Date range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">From</label>
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">To</label>
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Sort by</label>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortKeyChange(opt.value as SortKey)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    filter.sortKey === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:text-foreground'
                  )}
                >
                  {opt.label}
                  {filter.sortKey === opt.value && (
                    <ArrowUpDown size={10} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
