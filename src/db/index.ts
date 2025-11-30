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
  price_per_gram?: number // Costo per grammo (€/g)
}

export interface Entity {
  id?: number
  name: string
  description?: string
}

export interface Warehouse {
  id?: number
  name: string
  description?: string
  entity_id: number // Riferimento all'entità
}

export interface Portfolio {
  id?: number
  name: string
  description?: string
  entity_id: number // Riferimento all'entità
}

export interface TransactionType {
  id?: number
  name: string
  description?: string
  affects_warehouse: boolean
  affects_portfolio: boolean
  payment_type?: 'monthly' | 'instant'
  warehouse_direction?: 'in' | 'out' | 'transfer'
  portfolio_direction?: 'in' | 'out' | 'transfer'
  suggested_from_warehouse_id?: number
  suggested_to_warehouse_id?: number
  suggested_from_portfolio_id?: number
  suggested_to_portfolio_id?: number
  requires_product?: boolean
  transforms_state?: boolean // Indica se questo movimento trasforma lo stato del prodotto
  from_state?: 'raw' | 'cured' // Stato iniziale (solo se transforms_state = true)
  to_state?: 'raw' | 'cured' // Stato finale (solo se transforms_state = true)
  custom_fields?: Record<string, any>
}

export interface Transaction {
  id?: number
  type_id: number
  date: Date
  product_id?: string
  quantity?: number
  product_state?: 'raw' | 'cured'
  from_warehouse_id?: number
  to_warehouse_id?: number
  from_portfolio_id?: number
  to_portfolio_id?: number
  customer_id?: string // Riferimento al cliente (opzionale)
  amount?: number
  payment_method?: 'cash' | 'bancomat' | 'debito'
  is_debt?: boolean
  debt_status?: 'pending' | 'paid'
  debt_paid_date?: Date
  notes?: string
  metadata?: Record<string, any>
}

export interface Customer {
  id?: string // Formato "C" + 3 numeri (es. C123)
  name: string
  contact_info?: string
  notes?: string
  active?: boolean // Stato attivo/inattivo (default: true)
  is_referral?: boolean
  referral_color?: ReferralColor
  referred_by?: string // Riferimento a Customer.id
}

export interface StockMovement {
  id?: number
  transaction_id: number
  product_id: string
  warehouse_id: number
  quantity_change: number
  quantity_before: number
  quantity_after: number
  date: Date
}

class MagazzDatabase extends Dexie {
  productTypes!: Table<ProductType>
  products!: Table<Product>
  entities!: Table<Entity>
  warehouses!: Table<Warehouse>
  portfolios!: Table<Portfolio>
  transactionTypes!: Table<TransactionType>
  transactions!: Table<Transaction>
  customers!: Table<Customer>
  stockMovements!: Table<StockMovement>

  constructor() {
    super('MagazzDatabase')
    
    // Versione 100: Schema base (versione aumentata per risolvere conflitti)
    this.version(100).stores({
      productTypes: '++id, name, color',
      products: 'id, tipo_id, strain, active',
      entities: '++id, name',
      warehouses: '++id, name, entity_id',
      portfolios: '++id, name, entity_id',
      transactionTypes: '++id, name',
      transactions: '++id, type_id, date, product_id, from_warehouse_id, to_warehouse_id',
      customers: 'id, name, is_referral, referred_by',
      stockMovements: '++id, transaction_id, product_id, warehouse_id, date'
    })
  }
}

export const db = new MagazzDatabase()
