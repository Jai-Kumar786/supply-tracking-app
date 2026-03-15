'use client';

import { useState, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLongPress } from '@/hooks/useLongPress';


interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  size = 'md',
  disabled = false,
}: QuantityControlProps) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  const handleIncrement = useCallback(() => {
    onIncrement();
    setFlash('up');
    setTimeout(() => setFlash(null), 300);
  }, [onIncrement]);

  const handleDecrement = useCallback(() => {
    if (quantity <= 0) return;
    onDecrement();
    setFlash('down');
    setTimeout(() => setFlash(null), 300);
  }, [onDecrement, quantity]);

  const incPress = useLongPress(handleIncrement);
  const decPress = useLongPress(handleDecrement);

  const btnBase = cn(
    'flex items-center justify-center rounded-lg font-bold transition-all select-none',
    'disabled:opacity-40 disabled:cursor-not-allowed active:scale-95',
    size === 'sm' && 'w-7 h-7 text-xs',
    size === 'md' && 'w-10 h-10 min-w-[44px] min-h-[44px] text-base',
    size === 'lg' && 'w-12 h-12 min-w-[44px] min-h-[44px] text-lg'
  );

  const numSize = cn(
    'font-mono font-bold tabular-nums text-center min-w-[2.5rem] leading-none',
    size === 'sm' && 'text-sm w-8',
    size === 'md' && 'text-lg w-10',
    size === 'lg' && 'text-xl w-12',
    flash === 'up' && 'text-emerald-500',
    flash === 'down' && 'text-amber-500',
    !flash && 'text-foreground',
    'transition-colors duration-200'
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        {...decPress}
        disabled={disabled || quantity <= 0}
        aria-label="Decrease quantity"
        className={cn(btnBase, 'bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400')}
      >
        <Minus size={size === 'sm' ? 12 : 16} strokeWidth={2.5} />
      </button>

      <span className={numSize}>{quantity}</span>

      <button
        {...incPress}
        disabled={disabled}
        aria-label="Increase quantity"
        className={cn(btnBase, 'bg-muted hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400')}
      >
        <Plus size={size === 'sm' ? 12 : 16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
