'use client';

import React, { useState, useEffect } from 'react';
import { Store, Warehouse, BarChart3 } from 'lucide-react';
import { Providers } from './providers';
import { useInventory } from '@/context/InventoryContext';
import type { ActiveTab, InventoryItem, Location } from '@/types';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import InventoryList from '@/components/InventoryList';
import SummaryDashboard from '@/components/SummaryDashboard';
import FloatingActionButton from '@/components/FloatingActionButton';
import AddItemModal from '@/components/AddItemModal';
import TransferModal from '@/components/TransferModal';

// --- Inner app that has access to context ---
function AppContent() {
  const { darkMode, summary } = useInventory();
  const [activeTab, setActiveTab] = useState<ActiveTab>('shop');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDefaultLocation, setAddDefaultLocation] = useState<Location>('shop');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [transferItem, setTransferItem] = useState<InventoryItem | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleOpenAdd = (location?: Location) => {
    setEditItem(null);
    setAddDefaultLocation(location ?? (activeTab === 'godown' ? 'godown' : 'shop'));
    setAddModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setAddDefaultLocation(item.location);
    setAddModalOpen(true);
  };

  const handleTransfer = (item: InventoryItem) => {
    setTransferItem(item);
    setTransferModalOpen(true);
  };

  const desktopTabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'shop', label: 'Shop', icon: <Store size={16} />, count: summary.shopUniqueItems },
    { id: 'godown', label: 'Godown', icon: <Warehouse size={16} />, count: summary.godownUniqueItems },
    { id: 'summary', label: 'Summary', icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className={cn('min-h-screen bg-background transition-colors duration-300')}>
      <Header />

      {/* Desktop tab bar */}
      <div className="hidden lg:block sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-0">
            {desktopTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Mobile: single panel */}
        <div className="lg:hidden">
          {activeTab === 'shop' && (
            <InventoryList
              location="shop"
              onEdit={handleEdit}
              onTransfer={handleTransfer}
              onAddNew={() => handleOpenAdd('shop')}
            />
          )}
          {activeTab === 'godown' && (
            <InventoryList
              location="godown"
              onEdit={handleEdit}
              onTransfer={handleTransfer}
              onAddNew={() => handleOpenAdd('godown')}
            />
          )}
          {activeTab === 'summary' && <SummaryDashboard />}
        </div>

        {/* Desktop: side-by-side or summary */}
        <div className="hidden lg:block">
          {activeTab === 'summary' ? (
            <SummaryDashboard />
          ) : activeTab === 'shop' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <InventoryList
                  location="shop"
                  onEdit={handleEdit}
                  onTransfer={handleTransfer}
                  onAddNew={() => handleOpenAdd('shop')}
                />
              </div>
              <div>
                <InventoryList
                  location="godown"
                  onEdit={handleEdit}
                  onTransfer={handleTransfer}
                  onAddNew={() => handleOpenAdd('godown')}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <InventoryList
                  location="godown"
                  onEdit={handleEdit}
                  onTransfer={handleTransfer}
                  onAddNew={() => handleOpenAdd('godown')}
                />
              </div>
              <div>
                <InventoryList
                  location="shop"
                  onEdit={handleEdit}
                  onTransfer={handleTransfer}
                  onAddNew={() => handleOpenAdd('shop')}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating Action Button */}
      {activeTab !== 'summary' && (
        <FloatingActionButton onClick={() => handleOpenAdd()} />
      )}

      {/* Modals */}
      <AddItemModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditItem(null);
        }}
        editItem={editItem}
        defaultLocation={addDefaultLocation}
      />

      <TransferModal
        open={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false);
          setTransferItem(null);
        }}
        item={transferItem}
      />
    </div>
  );
}

// --- Root export wrapped with providers ---
export default function Page() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
