'use client';

import { useState, useCallback } from 'react';
import { FilterState, SortKey, SortOrder } from '@/types';
import { getTodayISO } from '@/utils/helpers';

const defaultFilter: FilterState = {
  search: '',
  dateFrom: '',
  dateTo: '',
  sortKey: 'date',
  sortOrder: 'desc',
};

export function useFilter() {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  const setSearch = useCallback((search: string) => {
    setFilter((f) => ({ ...f, search }));
  }, []);

  const setDateFrom = useCallback((dateFrom: string) => {
    setFilter((f) => ({ ...f, dateFrom }));
  }, []);

  const setDateTo = useCallback((dateTo: string) => {
    setFilter((f) => ({ ...f, dateTo }));
  }, []);

  const setSortKey = useCallback((sortKey: SortKey) => {
    setFilter((f) => ({
      ...f,
      sortKey,
      sortOrder: f.sortKey === sortKey && f.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setFilter((f) => ({ ...f, sortOrder }));
  }, []);

  const resetFilter = useCallback(() => setFilter(defaultFilter), []);

  const setTodayFilter = useCallback(() => {
    const today = getTodayISO();
    setFilter((f) => ({ ...f, dateFrom: today, dateTo: today }));
  }, []);

  const hasActiveFilters =
    filter.search.trim() !== '' ||
    filter.dateFrom !== '' ||
    filter.dateTo !== '' ||
    filter.sortKey !== 'date' ||
    filter.sortOrder !== 'desc';

  return {
    filter,
    setSearch,
    setDateFrom,
    setDateTo,
    setSortKey,
    setSortOrder,
    resetFilter,
    setTodayFilter,
    hasActiveFilters,
  };
}
