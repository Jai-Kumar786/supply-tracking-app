'use client';

import React from 'react';
import { Store, Warehouse, BarChart3 } from 'lucide-react';
import { ActiveTab } from '@/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'shop', label: 'Shop', icon: <Store size={20} strokeWidth={2} /> },
  { id: 'godown', label: 'Godown', icon: <Warehouse size={20} strokeWidth={2} /> },
  { id: 'summary', label: 'Summary', icon: <BarChart3 size={20} strokeWidth={2} /> },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border safe-bottom">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-10 h-6 rounded-full transition-colors',
                  active ? 'bg-primary/10' : ''
                )}
              >
                {tab.icon}
              </span>
              <span className={cn('text-[10px] font-medium leading-tight', active ? 'font-semibold' : '')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
