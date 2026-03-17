'use client';

import { useState } from 'react';
import { Pencil, Trash2, ArrowLeftRight, Copy, Check } from 'lucide-react';
import { InventoryItem } from '@/types';
import { useInventory } from '@/context/InventoryContext';
import { formatCurrency } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import QuantityControl from './QuantityControl';

interface InventoryCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
}

export default function InventoryCard({ item, onEdit, onTransfer }: InventoryCardProps) {
  const { updateQuantity, deleteItem, addItem } = useInventory();
  const [deleting, setDeleting] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const isShop = item.location === 'shop';
  const accentColor = isShop ? 'emerald' : 'amber';

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => deleteItem(item.id), 300);
  };

  const handleCopy = async () => {
    if (copied) return;
    setCopied(true);
    
    try {
      // Create a duplicate by stripping unique fields
      const { id, createdAt, updatedAt, ...payload } = item;
      await addItem(payload);
      // Wait a bit to show success icon
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to duplicate!', err);
      setCopied(false);
    }
  };

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.touches[0].clientX - touchStartX;
    // Allow swipe left (negative) up to -80px, right up to 80px
    const clamped = Math.max(-80, Math.min(80, delta));
    setSwipeOffset(clamped);
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -60) {
      handleDelete();
    } else if (swipeOffset > 60) {
      onEdit(item);
    }
    setSwipeOffset(0);
    setTouchStartX(null);
  };

  const totalValue = item.price * item.quantity;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300',
        deleting && 'opacity-0 scale-95 translate-x-4'
      )}
      style={{ transform: swipeOffset !== 0 ? `translateX(${swipeOffset}px)` : undefined }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe hint backgrounds */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <div className="flex items-center gap-2 text-emerald-600 opacity-60">
          <Pencil size={18} />
          <span className="text-sm font-medium">Edit</span>
        </div>
        <div className="flex items-center gap-2 text-red-500 opacity-60">
          <span className="text-sm font-medium">Delete</span>
          <Trash2 size={18} />
        </div>
      </div>

      {/* Card Content */}
      <div className="relative bg-card p-3.5">
        {/* Top row: name + actions */}
        <div className="flex items-start gap-2 mb-2.5">
          {/* Color accent bar */}
          <div
            className={cn(
              'w-1 self-stretch rounded-full shrink-0 mt-0.5',
              accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
            )}
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm leading-tight truncate">
              {item.commodityName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              ₹{item.price.toFixed(2)} / unit
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              aria-label="Copy item details"
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                copied 
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              onClick={() => onTransfer(item)}
              aria-label="Transfer item"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <ArrowLeftRight size={14} />
            </button>
            <button
              onClick={() => onEdit(item)}
              aria-label="Edit item"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete item"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Bottom row: qty control + total value */}
        <div className="flex items-center justify-between gap-3 pl-3">
          <QuantityControl
            quantity={item.quantity}
            onIncrement={() => updateQuantity(item.id, 1)}
            onDecrement={() => updateQuantity(item.id, -1)}
            size="md"
          />

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="font-bold text-foreground font-mono text-sm">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
