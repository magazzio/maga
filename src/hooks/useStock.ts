import { useQuery } from '@tanstack/react-query'
import { db, Transaction } from '@/db'

// Query keys
const STOCK_KEY = ['stock'] as const

// Calcola stock per magazzino e prodotto
async function calculateStock(warehouseId: number, productId?: string): Promise<number> {
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  // Carica i tipi movimento per verificare trasformazioni
  const transactionTypes = await db.transactionTypes.toArray()
  const typeMap = new Map(transactionTypes.map(t => [t.id, t]))

  let stock = 0

  for (const transaction of transactions) {
    if (!transaction.quantity) continue

    const transactionType = typeMap.get(transaction.type_id)
    const isTransformation = transactionType?.transforms_state
    const isInternalTransformation = isTransformation && 
      transaction.from_warehouse_id === transaction.to_warehouse_id &&
      transaction.from_warehouse_id === warehouseId

    // Trasformazione interna (stesso magazzino): non modifica la quantità, solo lo stato
    if (isInternalTransformation) {
      // Non fare nulla, la quantità rimane invariata
      continue
    }

    // Entrata nel magazzino (to_warehouse_id)
    if (transaction.to_warehouse_id === warehouseId) {
      if (!productId || transaction.product_id === productId) {
        stock += transaction.quantity
      }
    }

    // Uscita dal magazzino (from_warehouse_id)
    if (transaction.from_warehouse_id === warehouseId) {
      if (!productId || transaction.product_id === productId) {
        stock -= transaction.quantity
      }
    }
  }

  return Math.max(0, stock) // Non può essere negativo
}

// Calcola stock totale per magazzino (tutti i prodotti)
async function calculateTotalStock(warehouseId: number): Promise<number> {
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  // Carica i tipi movimento per verificare trasformazioni
  const transactionTypes = await db.transactionTypes.toArray()
  const typeMap = new Map(transactionTypes.map(t => [t.id, t]))

  let stock = 0

  for (const transaction of transactions) {
    if (!transaction.quantity) continue

    const transactionType = typeMap.get(transaction.type_id)
    const isTransformation = transactionType?.transforms_state
    const isInternalTransformation = isTransformation && 
      transaction.from_warehouse_id === transaction.to_warehouse_id &&
      transaction.from_warehouse_id === warehouseId

    // Trasformazione interna (stesso magazzino): non modifica la quantità, solo lo stato
    if (isInternalTransformation) {
      // Non fare nulla, la quantità rimane invariata
      continue
    }

    if (transaction.to_warehouse_id === warehouseId) {
      stock += transaction.quantity
    }
    if (transaction.from_warehouse_id === warehouseId) {
      stock -= transaction.quantity
    }
  }

  return Math.max(0, stock)
}

// GET - Stock per magazzino e prodotto
export function useStockByWarehouseAndProduct(warehouseId: number | undefined, productId: string | undefined) {
  return useQuery({
    queryKey: [...STOCK_KEY, 'warehouse', warehouseId, 'product', productId],
    queryFn: async () => {
      if (!warehouseId || !productId) return 0
      return await calculateStock(warehouseId, productId)
    },
    enabled: !!warehouseId && !!productId,
  })
}

// GET - Stock totale per magazzino
export function useStockByWarehouse(warehouseId: number | undefined) {
  return useQuery({
    queryKey: [...STOCK_KEY, 'warehouse', warehouseId],
    queryFn: async () => {
      if (!warehouseId) return 0
      return await calculateTotalStock(warehouseId)
    },
    enabled: !!warehouseId,
  })
}

// GET - Stock per prodotto (tutti i magazzini)
export function useStockByProduct(productId: string | undefined) {
  return useQuery({
    queryKey: [...STOCK_KEY, 'product', productId],
    queryFn: async () => {
      if (!productId) return 0
      const transactions = await db.transactions
        .where('date')
        .belowOrEqual(new Date())
        .toArray()

      let stock = 0

      for (const transaction of transactions) {
        if (!transaction.quantity || transaction.product_id !== productId) continue

        if (transaction.to_warehouse_id) {
          stock += transaction.quantity
        }
        if (transaction.from_warehouse_id) {
          stock -= transaction.quantity
        }
      }

      return Math.max(0, stock)
    },
    enabled: !!productId,
  })
}

// Calcola stock per entità e prodotto (somma di tutti i magazzini dell'entità)
async function calculateStockByEntity(entityId: number, productId: string): Promise<number> {
  // Trova tutti i magazzini dell'entità
  const warehouses = await db.warehouses.where('entity_id').equals(entityId).toArray()
  
  if (warehouses.length === 0) return 0

  // Calcola lo stock per ogni magazzino e somma
  let totalStock = 0
  for (const warehouse of warehouses) {
    if (warehouse.id) {
      const stock = await calculateStock(warehouse.id, productId)
      totalStock += stock
    }
  }

  return totalStock
}

// GET - Stock per entità e prodotto
export function useStockByEntityAndProduct(entityId: number | undefined, productId: string | undefined) {
  return useQuery({
    queryKey: [...STOCK_KEY, 'entity', entityId, 'product', productId],
    queryFn: async () => {
      if (!entityId || !productId) return 0
      return await calculateStockByEntity(entityId, productId)
    },
    enabled: !!entityId && !!productId,
  })
}

// Calcola stock futuro (per anteprima impatto)
export async function calculateFutureStock(
  warehouseId: number,
  currentStock: number,
  transaction: Partial<Transaction>
): Promise<number> {
  let futureStock = currentStock

  if (!transaction.quantity) return futureStock

  // Verifica se è una trasformazione interna
  if (transaction.type_id) {
    const transactionType = await db.transactionTypes.get(transaction.type_id)
    const isTransformation = transactionType?.transforms_state
    const isInternalTransformation = isTransformation && 
      transaction.from_warehouse_id === transaction.to_warehouse_id &&
      transaction.from_warehouse_id === warehouseId

    // Trasformazione interna: non modifica la quantità
    if (isInternalTransformation) {
      return futureStock
    }
  }

  // Entrata
  if (transaction.to_warehouse_id === warehouseId) {
    futureStock += transaction.quantity
  }

  // Uscita
  if (transaction.from_warehouse_id === warehouseId) {
    futureStock -= transaction.quantity
  }

  return Math.max(0, futureStock)
}

