'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DailyGroup, InventoryItem } from '@/types';
import { formatDateLabel, formatCurrency } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import InventoryCard from './InventoryCard';

interface DateGroupProps {
  group: DailyGroup;
  onEdit: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
  defaultExpanded?: boolean;
}

export default function DateGroup({
  group,
  onEdit,
  onTransfer,
  defaultExpanded = true,
}: DateGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const dateLabel = formatDateLabel(group.date);

  return (
    <div className="mb-3">
      {/* Date header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors group"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground transition-transform duration-200">
            {expanded ? <ChevronDown size={16} strokeWidth={2} /> : <ChevronRight size={16} strokeWidth={2} />}
          </span>
          <span className="text-sm font-semibold text-foreground">{dateLabel}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {group.items.length} item{group.items.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground leading-tight">Subtotal</p>
            <p className="text-sm font-bold font-mono text-foreground">
              {formatCurrency(group.totalValue)}
            </p>
          </div>
        </div>
      </button>

      {/* Items */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          expanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col gap-2 pt-1 pb-1">
          {group.items.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onTransfer={onTransfer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
