import { useQuery } from '@tanstack/react-query'
import { db, Transaction, Product } from '@/db'

// Query keys
const WAREHOUSE_STOCK_KEY = ['warehouse-stock'] as const

export interface ProductStock {
  product_id: string
  product: Product
  quantity: number
  raw_quantity: number // Quantità in stato Raw
  cured_quantity: number // Quantità in stato Cured
  value: number // Valore totale (se price_per_gram disponibile)
}

export interface WarehouseStockSummary {
  totalStock: number // Stock totale in grammi
  totalValue: number // Valore totale stock
  activeProducts: number // Numero prodotti con stock > 0
  totalRaw: number // Quantità totale Raw
  totalCured: number // Quantità totale Cured
  products: ProductStock[] // Lista prodotti con stock
}

// Calcola stock dettagliato per magazzino (con stato Raw/Cured)
async function calculateWarehouseStock(warehouseId: number): Promise<WarehouseStockSummary> {
  // Ottieni tutti i prodotti attivi
  const allProducts = await db.products.toArray()
  const products = allProducts.filter(p => p.active !== false)
  
  // Ottieni tutti i movimenti
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  // Mappa per tracciare stock per prodotto
  const stockMap = new Map<string, {
    quantity: number
    raw_quantity: number
    cured_quantity: number
  }>()

  // Inizializza tutti i prodotti
  products.forEach(product => {
    if (product.id) {
      stockMap.set(product.id, {
        quantity: 0,
        raw_quantity: 0,
        cured_quantity: 0,
      })
    }
  })

  // Calcola stock dai movimenti
  for (const transaction of transactions) {
    if (!transaction.quantity || !transaction.product_id) continue

    const productId = transaction.product_id
    const stock = stockMap.get(productId) || { quantity: 0, raw_quantity: 0, cured_quantity: 0 }

    // Entrata nel magazzino
    if (transaction.to_warehouse_id === warehouseId) {
      stock.quantity += transaction.quantity
      
      // Traccia stato Raw/Cured
      if (transaction.product_state === 'raw') {
        stock.raw_quantity += transaction.quantity
      } else if (transaction.product_state === 'cured') {
        stock.cured_quantity += transaction.quantity
      } else {
        // Se non specificato, assumiamo Raw (default)
        stock.raw_quantity += transaction.quantity
      }
    }

    // Uscita dal magazzino
    if (transaction.from_warehouse_id === warehouseId) {
      stock.quantity -= transaction.quantity
      
      // Rimuovi proporzionalmente da Raw/Cured
      // Se non abbiamo tracciato lo stato, assumiamo proporzionale
      if (stock.raw_quantity > 0 || stock.cured_quantity > 0) {
        const totalTracked = stock.raw_quantity + stock.cured_quantity
        if (totalTracked > 0) {
          const rawRatio = stock.raw_quantity / totalTracked
          const curedRatio = stock.cured_quantity / totalTracked
          stock.raw_quantity = Math.max(0, stock.raw_quantity - (transaction.quantity * rawRatio))
          stock.cured_quantity = Math.max(0, stock.cured_quantity - (transaction.quantity * curedRatio))
        }
      } else {
        // Se non abbiamo tracciato, rimuoviamo proporzionalmente
        stock.raw_quantity = Math.max(0, stock.raw_quantity - transaction.quantity)
      }
    }

    stockMap.set(productId, stock)
  }

  // Converti in array e calcola valori
  let totalStock = 0
  let totalValue = 0
  let activeProducts = 0
  let totalRaw = 0
  let totalCured = 0
  const productsList: ProductStock[] = []

  for (const [productId, stock] of stockMap.entries()) {
    const quantity = Math.max(0, stock.quantity)
    const rawQty = Math.max(0, stock.raw_quantity)
    const curedQty = Math.max(0, stock.cured_quantity)
    
    if (quantity > 0) {
      activeProducts++
      totalStock += quantity
      totalRaw += rawQty
      totalCured += curedQty
      
      const product = products.find(p => p.id === productId)
      if (product) {
        const value = product.price_per_gram ? quantity * product.price_per_gram : 0
        totalValue += value
        
        productsList.push({
          product_id: productId,
          product,
          quantity: Math.round(quantity * 100) / 100,
          raw_quantity: Math.round(rawQty * 100) / 100,
          cured_quantity: Math.round(curedQty * 100) / 100,
          value: Math.round(value * 100) / 100,
        })
      }
    }
  }

  // Ordina per quantità decrescente
  productsList.sort((a, b) => b.quantity - a.quantity)

  return {
    totalStock: Math.round(totalStock * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
    activeProducts,
    totalRaw: Math.round(totalRaw * 100) / 100,
    totalCured: Math.round(totalCured * 100) / 100,
    products: productsList,
  }
}

// GET - Stock dettagliato per magazzino
export function useWarehouseStock(warehouseId: number | undefined) {
  return useQuery({
    queryKey: [...WAREHOUSE_STOCK_KEY, warehouseId],
    queryFn: async () => {
      if (!warehouseId) {
        return {
          totalStock: 0,
          totalValue: 0,
          activeProducts: 0,
          totalRaw: 0,
          totalCured: 0,
          products: [],
        } as WarehouseStockSummary
      }
      return await calculateWarehouseStock(warehouseId)
    },
    enabled: !!warehouseId,
  })
}

