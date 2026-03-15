'use client';

import React from 'react';
import { InventoryProvider } from '@/context/InventoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <InventoryProvider>{children}</InventoryProvider>;
}
