import Dexie, { Table } from 'dexie'

// Types
export type ProductTypeColor = 'blue' | 'green' | 'amber' | 'red' | 'purple'
export type ReferralColor = 'cyan' | 'indigo' | 'pink' | 'orange' | 'yellow'

export interface ProductType {
  id?: number
  name: string
  color: ProductTypeColor
}

// Colori predefiniti per i tipi prodotto
export const PRODUCT_TYPE_COLORS: Record<ProductTypeColor, { label: string; bg: string; text: string }> = {
  blue: { label: 'Blu', bg: 'bg-blue-100', text: 'text-blue-800' },
  green: { label: 'Verde', bg: 'bg-green-100', text: 'text-green-800' },
  amber: { label: 'Ambra', bg: 'bg-amber-100', text: 'text-amber-800' },
  red: { label: 'Rosso', bg: 'bg-red-100', text: 'text-red-800' },
  purple: { label: 'Viola', bg: 'bg-purple-100', text: 'text-purple-800' },
}

// Colori predefiniti per i referral clienti
export const REFERRAL_COLORS: Record<ReferralColor, { label: string; bg: string; text: string }> = {
  cyan: { label: 'Ciano', bg: 'bg-cyan-100', text: 'text-cyan-800' },
  indigo: { label: 'Indaco', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  pink: { label: 'Rosa', bg: 'bg-pink-100', text: 'text-pink-800' },
  orange: { label: 'Arancione', bg: 'bg-orange-100', text: 'text-orange-800' },
  yellow: { label: 'Giallo', bg: 'bg-yellow-100', text: 'text-yellow-800' },
}

export interface Product {
  id: string // Formato "P" + 3 numeri (es. P123)
  tipo_id: number // Riferimento a ProductType
  strain: string // Nome/Strain del prodotto
  note?: string
  active: boolean // Stato attivo/inattivo (default: true)
  price_per_gram?: number // Costo per grammo (€/g) - costo fisso quando acquista da Driplug
}

export interface Warehouse {
  id?: number
  name: string
  description?: string
  owner: 'Driplug' | 'Meetdrip'
}

export interface Portfolio {
  id?: number
  name: string
  description?: string
  owner: 'Driplug' | 'Meetdrip'
}

export interface TransactionType {
  id?: number
  name: string
  description?: string
  affects_warehouse: boolean
  affects_portfolio: boolean
  payment_type?: 'monthly' | 'instant'
  custom_fields?: Record<string, any>
}

export interface Transaction {
  id?: number
  type_id: number
  date: Date
  product_id?: string // Cambiato da number a string
  quantity?: number
  from_warehouse_id?: number
  to_warehouse_id?: number
  from_portfolio_id?: number
  to_portfolio_id?: number
  amount?: number
  payment_method?: 'cash' | 'bancomat' | 'debito'
  is_debt?: boolean
  debt_status?: 'pending' | 'paid'
  debt_paid_date?: Date
  notes?: string
  metadata?: Record<string, any>
}

export interface Stock {
  id?: number
  product_id: string // Cambiato da number a string
  warehouse_id: number
  quantity: number // Calcolata dai movimenti
  reserved_quantity?: number
  batch?: string
  cut?: string
  state?: 'Raw' | 'Cured'
  notes?: string
}

export interface Customer {
  id?: number
  name: string
  contact_info?: string
  notes?: string
  is_referral?: boolean // Se true, questo cliente è un referral
  referral_color?: ReferralColor // Colore del referral (solo se is_referral = true)
  referred_by?: number // ID del cliente referral che lo ha referenziato (opzionale)
}

export interface StockMovement {
  id?: number
  transaction_id: number
  product_id: string // Cambiato da number a string
  warehouse_id: number
  quantity_change: number
  quantity_before: number
  quantity_after: number
  date: Date
}

class MagazzDatabase extends Dexie {
  productTypes!: Table<ProductType>
  products!: Table<Product>
  warehouses!: Table<Warehouse>
  portfolios!: Table<Portfolio>
  transactionTypes!: Table<TransactionType>
  transactions!: Table<Transaction>
  stock!: Table<Stock>
  customers!: Table<Customer>
  stockMovements!: Table<StockMovement>

  constructor() {
    super('MagazzDatabase')
    
    this.version(1).stores({
      products: '++id, name, owner',
      warehouses: '++id, name, owner',
      portfolios: '++id, name, owner',
      transactionTypes: '++id, name',
      transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
      stock: '++id, product_id, warehouse_id',
      customers: '++id, name',
      stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
    })
    
    // Versione 2: nuovo schema prodotti
    this.version(2)
      .stores({
        productTypes: '++id, name',
        products: 'id, tipo_id, strain',
        warehouses: '++id, name, owner',
        portfolios: '++id, name, owner',
        transactionTypes: '++id, name',
        transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
        stock: '++id, product_id, warehouse_id',
        customers: '++id, name',
        stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
      })
      .upgrade(async (tx) => {
        // Migrazione: elimina vecchi prodotti se esistono (schema incompatibile)
        // L'utente dovrà ricreare i prodotti con il nuovo schema
        await tx.table('products').clear()
      })
    
    // Versione 3: aggiunto campo color ai ProductType
    this.version(3)
      .stores({
        productTypes: '++id, name, color',
        products: 'id, tipo_id, strain',
        warehouses: '++id, name, owner',
        portfolios: '++id, name, owner',
        transactionTypes: '++id, name',
        transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
        stock: '++id, product_id, warehouse_id',
        customers: '++id, name',
        stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
      })
      .upgrade(async (tx) => {
        // Migrazione: assegna colore di default 'blue' ai tipi esistenti
        const productTypes = await tx.table('productTypes').toArray()
        for (const type of productTypes) {
          if (!type.color) {
            await tx.table('productTypes').update(type.id!, { color: 'blue' })
          }
        }
      })
    
    // Versione 4: aggiunto campo active ai Product
    this.version(4)
      .stores({
        productTypes: '++id, name, color',
        products: 'id, tipo_id, strain, active',
        warehouses: '++id, name, owner',
        portfolios: '++id, name, owner',
        transactionTypes: '++id, name',
        transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
        stock: '++id, product_id, warehouse_id',
        customers: '++id, name',
        stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
      })
      .upgrade(async (tx) => {
        // Migrazione: assegna active: true ai prodotti esistenti
        const products = await tx.table('products').toArray()
        for (const product of products) {
          if (product.active === undefined) {
            await tx.table('products').update(product.id!, { active: true })
          }
        }
      })
    
    // Versione 5: aggiunto campo price_per_gram ai Product
    this.version(5)
      .stores({
        productTypes: '++id, name, color',
        products: 'id, tipo_id, strain, active',
        warehouses: '++id, name, owner',
        portfolios: '++id, name, owner',
        transactionTypes: '++id, name',
        transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
        stock: '++id, product_id, warehouse_id',
        customers: '++id, name',
        stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
      })
      .upgrade(async (tx) => {
        // Migrazione: i prodotti esistenti avranno price_per_gram undefined (opzionale)
        // Nessuna modifica necessaria
      })
    
    // Versione 6: aggiunto campi referral ai Customer
    this.version(6)
      .stores({
        productTypes: '++id, name, color',
        products: 'id, tipo_id, strain, active',
        warehouses: '++id, name, owner',
        portfolios: '++id, name, owner',
        transactionTypes: '++id, name',
        transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
        stock: '++id, product_id, warehouse_id',
        customers: '++id, name, is_referral, referred_by',
        stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
      })
      .upgrade(async (tx) => {
        // Migrazione: i clienti esistenti avranno is_referral, referral_color e referred_by undefined (opzionali)
        // Nessuna modifica necessaria
      })
  }
}

// Funzione per generare ID prodotto unico (P + 3 numeri)
export async function generateProductId(): Promise<string> {
  let attempts = 0
  const maxAttempts = 100
  
  while (attempts < maxAttempts) {
    const randomNum = Math.floor(Math.random() * 1000)
    const id = `P${randomNum.toString().padStart(3, '0')}`
    
    const exists = await db.products.get(id)
    if (!exists) {
      return id
    }
    
    attempts++
  }
  
  throw new Error('Impossibile generare ID prodotto unico')
}

export const db = new MagazzDatabase()

// Funzione per forzare l'aggiornamento del database preservando i dati
export async function forceDatabaseUpgrade(): Promise<{ preserved: number; lost: number }> {
  try {
    // Salva i dati che vogliamo preservare
    const productTypes = await db.productTypes.toArray().catch(() => [])
    const warehouses = await db.warehouses.toArray().catch(() => [])
    const portfolios = await db.portfolios.toArray().catch(() => [])
    const transactionTypes = await db.transactionTypes.toArray().catch(() => [])
    const customers = await db.customers.toArray().catch(() => [])
    
    // Conta quanti prodotti verranno persi (schema incompatibile)
    const products = await db.products.toArray().catch(() => [])
    const lostCount = products.length
    
    // Chiudiamo il database corrente
    await db.close()
    
    // Eliminiamo il database esistente
    await indexedDB.deleteDatabase('MagazzDatabase')
    
    // Riapriamo il database (verrà creata la versione più recente)
    await db.open()
    
    // Ripristina i dati preservati, aggiungendo color ai ProductType se mancante
    if (productTypes.length > 0) {
      const productTypesToAdd = productTypes.map(type => ({
        ...type,
        color: type.color || 'blue' as ProductTypeColor
      }))
      await db.productTypes.bulkAdd(productTypesToAdd)
    }
    
    // Nota: i prodotti non vengono preservati perché lo schema è incompatibile
    if (warehouses.length > 0) {
      await db.warehouses.bulkAdd(warehouses)
    }
    if (portfolios.length > 0) {
      await db.portfolios.bulkAdd(portfolios)
    }
    if (transactionTypes.length > 0) {
      await db.transactionTypes.bulkAdd(transactionTypes)
    }
    if (customers.length > 0) {
      await db.customers.bulkAdd(customers)
    }
    
    const preservedCount = productTypes.length + warehouses.length + portfolios.length + 
                          transactionTypes.length + customers.length
    
    return {
      preserved: preservedCount,
      lost: lostCount
    }
  } catch (error) {
    console.error('Error upgrading database:', error)
    throw error
  }
}

