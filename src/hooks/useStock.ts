import { useQuery } from '@tanstack/react-query'
import { db, Stock, Product, Warehouse } from '@/db'
import { logger } from '@/lib/logger'

const STOCK_QUERY_KEY = ['stock']

export interface StockWithDetails extends Stock {
  product?: Product
  warehouse?: Warehouse
}

/**
 * Calcola lo stock totale per prodotto e magazzino dai movimenti
 */
async function calculateStock(productId: string, warehouseId: number): Promise<number> {
  try {
    // Calcola stock dai movimenti
    const transactions = await db.transactions
      .where('product_id')
      .equals(productId)
      .toArray()
    
    let stock = 0
    
    for (const tx of transactions) {
      // Se il movimento va verso questo magazzino, aggiungi
      if (tx.to_warehouse_id === warehouseId && tx.quantity) {
        stock += tx.quantity
      }
      // Se il movimento parte da questo magazzino, sottrai
      if (tx.from_warehouse_id === warehouseId && tx.quantity) {
        stock -= tx.quantity
      }
    }
    
    return Math.max(0, stock) // Non può essere negativo
  } catch (error) {
    logger.error('Error calculating stock', error as Error, { productId, warehouseId })
    return 0
  }
}

/**
 * Hook per ottenere stock per magazzino
 */
export function useStockByWarehouse(warehouseId?: number) {
  return useQuery({
    queryKey: [...STOCK_QUERY_KEY, 'warehouse', warehouseId],
    queryFn: async () => {
      if (!warehouseId) return []
      
      try {
        // Ottieni tutti i prodotti attivi
        const products = await db.products.filter(p => p.active !== false).toArray()
        const warehouse = await db.warehouses.get(warehouseId)
        
        // Calcola stock per ogni prodotto
        const stockItems: StockWithDetails[] = []
        
        for (const product of products) {
          const quantity = await calculateStock(product.id, warehouseId)
          if (quantity > 0) {
            stockItems.push({
              product_id: product.id,
              warehouse_id: warehouseId,
              quantity,
              product,
              warehouse: warehouse || undefined,
            })
          }
        }
        
        return stockItems
      } catch (error) {
        logger.error('Error loading stock by warehouse', error as Error, { warehouseId })
        throw error
      }
    },
    enabled: !!warehouseId,
  })
}

/**
 * Hook per ottenere stock totale per prodotto (tutti i magazzini)
 */
export function useStockByProduct(productId?: string) {
  return useQuery({
    queryKey: [...STOCK_QUERY_KEY, 'product', productId],
    queryFn: async () => {
      if (!productId) return []
      
      try {
        const warehouses = await db.warehouses.toArray()
        const stockItems: StockWithDetails[] = []
        
        for (const warehouse of warehouses) {
          if (warehouse.id) {
            const quantity = await calculateStock(productId, warehouse.id)
            if (quantity > 0) {
              stockItems.push({
                product_id: productId,
                warehouse_id: warehouse.id,
                quantity,
                warehouse,
              })
            }
          }
        }
        
        return stockItems
      } catch (error) {
        logger.error('Error loading stock by product', error as Error, { productId })
        throw error
      }
    },
    enabled: !!productId,
  })
}

