'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeftRight, Store, Warehouse } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { InventoryItem } from '@/types';
import { cn } from '@/lib/utils';
import QuantityControl from './QuantityControl';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export default function TransferModal({ open, onClose, item }: TransferModalProps) {
  const { transferItem } = useInventory();
  const [quantity, setQuantity] = useState(1);
  const [transferDate, setTransferDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(Math.min(1, item.quantity));
      setTransferDate(item.date);
      setError('');
    }
  }, [item, open]);

  if (!open || !item) return null;

  const toLocation = item.location === 'shop' ? 'godown' : 'shop';
  const maxQty = item.quantity;

  const handleTransfer = () => {
    if (quantity <= 0) {
      setError('Quantity must be at least 1');
      return;
    }
    if (quantity > maxQty) {
      setError(`Max available: ${maxQty}`);
      return;
    }
    if (!transferDate) {
      setError('Please select a date');
      return;
    }
    transferItem({
      itemId: item.id,
      quantity,
      from: item.location,
      to: toLocation,
      date: transferDate,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-sm bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 sm:fade-in sm:zoom-in-95 duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={18} className="text-primary" />
            <h2 id="transfer-title" className="text-base font-semibold text-foreground">
              Transfer Item
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Item name */}
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Transferring</p>
            <p className="font-semibold text-foreground">{item.commodityName}</p>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              Available: {item.quantity} units
            </p>
          </div>

          {/* Direction */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm',
                item.location === 'shop'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              )}
            >
              {item.location === 'shop' ? <Store size={15} /> : <Warehouse size={15} />}
              {item.location === 'shop' ? 'Shop' : 'Godown'}
            </div>

            <ArrowLeftRight size={20} className="text-muted-foreground shrink-0" />

            <div
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm',
                toLocation === 'shop'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              )}
            >
              {toLocation === 'shop' ? <Store size={15} /> : <Warehouse size={15} />}
              {toLocation === 'shop' ? 'Shop' : 'Godown'}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Quantity to Transfer
              </label>
              <div className="flex items-center gap-3">
                <QuantityControl
                  quantity={quantity}
                  onIncrement={() => {
                    setQuantity((q) => Math.min(maxQty, q + 1));
                    setError('');
                  }}
                  onDecrement={() => {
                    setQuantity((q) => Math.max(1, q - 1));
                    setError('');
                  }}
                  size="lg"
                />
                <button
                  onClick={() => setQuantity(maxQty)}
                  className="ml-auto text-xs text-primary font-medium border border-primary/30 rounded-lg px-2.5 py-1.5 hover:bg-primary/5 transition-colors"
                >
                  Max ({maxQty})
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="transfer-date" className="text-xs font-medium text-muted-foreground mb-2 block">
                Transfer Date
              </label>
              <input
                id="transfer-date"
                type="date"
                value={transferDate}
                onChange={(e) => {
                  setTransferDate(e.target.value);
                  setError('');
                }}
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeftRight size={15} />
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
