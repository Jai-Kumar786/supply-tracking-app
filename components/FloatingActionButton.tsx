'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export default function FloatingActionButton({
  onClick,
  className,
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Add new inventory item"
      className={cn(
        'fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6',
        'flex items-center justify-center w-14 h-14 rounded-full',
        'bg-primary text-primary-foreground shadow-lg',
        'hover:scale-105 active:scale-95 transition-transform duration-150',
        'ring-4 ring-primary/20',
        className
      )}
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}
