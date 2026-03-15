'use server';

import { prisma } from '@/lib/prisma';
import { InventoryItem, Location, TransferPayload } from '@/types';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all inventory items from the database.
 */
export async function getInventoryItems() {
  try {
    return await prisma.inventoryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('[Actions] Failed to fetch items:', error);
    return [];
  }
}

/**
 * Add a new inventory item.
 */
export async function addItem(payload: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  try {
    const item = await prisma.inventoryItem.create({
      data: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        ...payload,
        createdAt: now,
        updatedAt: now,
      },
    });
    revalidatePath('/');
    return item;
  } catch (error) {
    console.error('[Actions] Failed to add item:', error);
    throw new Error('Failed to create item');
  }
}

/**
 * Update an existing inventory item.
 */
export async function updateItem(id: string, updates: Partial<InventoryItem>) {
  try {
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });
    revalidatePath('/');
    return item;
  } catch (error) {
    console.error('[Actions] Failed to update item:', error);
    throw new Error('Failed to update item');
  }
}

/**
 * Delete an inventory item.
 */
export async function deleteItem(id: string) {
  try {
    await prisma.inventoryItem.delete({
      where: { id },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('[Actions] Failed to delete item:', error);
    throw new Error('Failed to delete item');
  }
}

/**
 * Atomic transfer operation using a database transaction.
 */
export async function transferItem({ itemId, quantity, from, to }: TransferPayload) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get source item
      const sourceItem = await tx.inventoryItem.findUnique({
        where: { id: itemId },
      });

      if (!sourceItem || sourceItem.location !== from) {
        throw new Error('Source item not found');
      }

      const transferQty = Math.min(quantity, sourceItem.quantity);
      const now = new Date().toISOString();

      // 2. Reduce source quantity (or delete if 0)
      if (sourceItem.quantity === transferQty) {
        await tx.inventoryItem.delete({ where: { id: itemId } });
      } else {
        await tx.inventoryItem.update({
          where: { id: itemId },
          data: {
            quantity: sourceItem.quantity - transferQty,
            updatedAt: now,
          },
        });
      }

      // 3. Find if target exists
      const existingDest = await tx.inventoryItem.findFirst({
        where: {
          commodityName: sourceItem.commodityName,
          location: to,
          date: sourceItem.date,
        },
      });

      if (existingDest) {
        await tx.inventoryItem.update({
          where: { id: existingDest.id },
          data: {
            quantity: existingDest.quantity + transferQty,
            updatedAt: now,
          },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            commodityName: sourceItem.commodityName,
            location: to,
            date: sourceItem.date,
            price: sourceItem.price,
            quantity: transferQty,
            createdAt: now,
            updatedAt: now,
          },
        });
      }
    });

    revalidatePath('/');
  } catch (error) {
    console.error('[Actions] Transfer failed:', error);
    throw new Error('Failed to complete transfer');
  }
}
