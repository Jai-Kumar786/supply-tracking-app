'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save, Store, Warehouse } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { InventoryItem, Location } from '@/types';
import { getTodayISO } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import QuantityControl from './QuantityControl';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  editItem?: InventoryItem | null;
  defaultLocation?: Location;
}

export default function AddItemModal({
  open,
  onClose,
  editItem,
  defaultLocation = 'shop',
}: AddItemModalProps) {
  const { addItem, updateItem, commodityNames } = useInventory();

  const [location, setLocation] = useState<Location>(defaultLocation);
  const [date, setDate] = useState(getTodayISO());
  const [commodityName, setCommodityName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editItem;

  // Populate form when editing
  useEffect(() => {
    if (editItem) {
      setLocation(editItem.location);
      setDate(editItem.date);
      setCommodityName(editItem.commodityName);
      setPrice(String(editItem.price));
      setQuantity(editItem.quantity);
    } else {
      setLocation(defaultLocation);
      setDate(getTodayISO());
      setCommodityName('');
      setPrice('');
      setQuantity(1);
    }
    setErrors({});
  }, [editItem, defaultLocation, open]);

  // Focus name input when modal opens
  useEffect(() => {
    if (open && !editItem) {
      setTimeout(() => nameInputRef.current?.focus(), 150);
    }
  }, [open, editItem]);

  const filteredSuggestions = commodityNames.filter(
    (n) =>
      n.toLowerCase().includes(commodityName.toLowerCase()) &&
      n.toLowerCase() !== commodityName.toLowerCase()
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!commodityName.trim()) e.name = 'Commodity name is required';
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      e.price = 'Enter a valid price';
    if (quantity < 0) e.quantity = 'Quantity must be 0 or more';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      date,
      commodityName: commodityName.trim(),
      price: parseFloat(price),
      quantity,
      location,
    };

    if (isEditing && editItem) {
      updateItem(editItem.id, payload);
    } else {
      addItem(payload);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 sm:fade-in sm:zoom-in-95 duration-300">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 id="modal-title" className="text-base font-semibold text-foreground">
            {isEditing ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Location toggle */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['shop', 'godown'] as Location[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-xl border font-medium text-sm transition-all',
                    location === loc
                      ? loc === 'shop'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-amber-500 text-white border-amber-500'
                      : 'bg-muted text-muted-foreground border-border hover:border-foreground/30'
                  )}
                >
                  {loc === 'shop' ? <Store size={15} /> : <Warehouse size={15} />}
                  {loc === 'shop' ? 'Shop' : 'Godown'}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="item-date" className="text-xs font-medium text-muted-foreground mb-2 block">
              Date
            </label>
            <input
              id="item-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
            />
          </div>

          {/* Commodity name */}
          <div className="relative">
            <label htmlFor="commodity-name" className="text-xs font-medium text-muted-foreground mb-2 block">
              Commodity Name
            </label>
            <input
              id="commodity-name"
              ref={nameInputRef}
              type="text"
              value={commodityName}
              onChange={(e) => {
                setCommodityName(e.target.value);
                setShowSuggestions(true);
                if (errors.name) setErrors((p) => ({ ...p, name: '' }));
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="e.g. Rice, Sugar, Oil..."
              autoComplete="off"
              className={cn(
                'w-full px-3 py-2.5 text-sm bg-muted rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground',
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
              )}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}

            {/* Autocomplete */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full top-full mt-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                {filteredSuggestions.slice(0, 6).map((name) => (
                  <button
                    key={name}
                    onMouseDown={() => {
                      setCommodityName(name);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-foreground transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="item-price" className="text-xs font-medium text-muted-foreground mb-2 block">
              Price per Unit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
                ₹
              </span>
              <input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((p) => ({ ...p, price: '' }));
                }}
                placeholder="0.00"
                className={cn(
                  'w-full pl-7 pr-3 py-2.5 text-sm bg-muted rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-mono placeholder:text-muted-foreground',
                  errors.price ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                )}
              />
            </div>
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <QuantityControl
                quantity={quantity}
                onIncrement={() => setQuantity((q) => q + 1)}
                onDecrement={() => setQuantity((q) => Math.max(0, q - 1))}
                size="lg"
              />
              {price && quantity > 0 && (
                <div className="ml-auto text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-base font-bold font-mono text-foreground">
                    ₹{(parseFloat(price || '0') * quantity).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-border bg-background">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-98 transition-all"
          >
            <Save size={15} />
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
