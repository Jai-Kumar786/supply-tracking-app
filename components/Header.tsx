'use client';

import { Moon, Sun, Package, BarChart3 } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

export default function Header() {
  const { darkMode, toggleDarkMode } = useInventory();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shrink-0">
            <Package size={17} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-foreground leading-tight truncate font-sans">
              StockTrack
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
              Shop &amp; Godown Inventory
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
