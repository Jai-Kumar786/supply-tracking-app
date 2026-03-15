'use client';

import React from 'react';
import { Store, Warehouse, TrendingUp, Package } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { formatCurrency, formatCurrencyCompact } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  accent: 'blue' | 'emerald' | 'amber' | 'purple';
}

function StatCard({ title, value, subValue, icon, accent }: StatCardProps) {
  const accentMap = {
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className={cn('flex items-center justify-center w-8 h-8 rounded-xl', accentMap[accent])}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold font-mono text-foreground leading-tight">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export default function SummaryDashboard() {
  const { summary, items } = useInventory();

  const shopItems = items.filter((i) => i.location === 'shop');
  const godownItems = items.filter((i) => i.location === 'godown');

  // Top 5 commodities by total value
  const commodityMap = new Map<string, number>();
  items.forEach((item) => {
    const val = (commodityMap.get(item.commodityName) ?? 0) + item.price * item.quantity;
    commodityMap.set(item.commodityName, val);
  });
  const topCommodities = Array.from(commodityMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-4 pb-20 lg:pb-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          title="Shop Total Value"
          value={formatCurrencyCompact(summary.shopTotalValue)}
          subValue={`${summary.shopItemCount} units · ${summary.shopUniqueItems} SKUs`}
          icon={<Store size={16} />}
          accent="emerald"
        />
        <StatCard
          title="Godown Total Value"
          value={formatCurrencyCompact(summary.godownTotalValue)}
          subValue={`${summary.godownItemCount} units · ${summary.godownUniqueItems} SKUs`}
          icon={<Warehouse size={16} />}
          accent="amber"
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            title="Combined Inventory Value"
            value={formatCurrencyCompact(summary.combinedTotalValue)}
            subValue={`${summary.shopItemCount + summary.godownItemCount} total units`}
            icon={<TrendingUp size={16} />}
            accent="blue"
          />
        </div>
      </div>

      {/* Shop breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground">Shop Inventory</h3>
          </div>
          {shopItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No shop items</p>
          ) : (
            <div className="space-y-2">
              {shopItems.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm text-foreground truncate">{item.commodityName}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-muted-foreground font-mono">×{item.quantity}</span>
                    <span className="text-sm font-semibold font-mono text-foreground">
                      {formatCurrencyCompact(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              {shopItems.length > 8 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{shopItems.length - 8} more items
                </p>
              )}
            </div>
          )}
        </div>

        {/* Godown breakdown */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">Godown Inventory</h3>
          </div>
          {godownItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No godown items</p>
          ) : (
            <div className="space-y-2">
              {godownItems.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-sm text-foreground truncate">{item.commodityName}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-muted-foreground font-mono">×{item.quantity}</span>
                    <span className="text-sm font-semibold font-mono text-foreground">
                      {formatCurrencyCompact(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              {godownItems.length > 8 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{godownItems.length - 8} more items
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Top commodities */}
      {topCommodities.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Package size={15} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Top Commodities by Value</h3>
          </div>
          <div className="space-y-2.5">
            {topCommodities.map(([name, value], index) => {
              const pct = summary.combinedTotalValue > 0
                ? (value / summary.combinedTotalValue) * 100
                : 0;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-foreground font-medium truncate">{name}</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-foreground shrink-0 ml-2">
                      {formatCurrencyCompact(value)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
