import { useQuery } from '@tanstack/react-query'
import { db } from '@/db'

const CUSTOMER_SPENDING_KEY = ['customer-spending'] as const

// Calcola spesa totale per cliente
async function calculateCustomerSpending(customerId: string): Promise<number> {
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  let totalSpending = 0

  for (const transaction of transactions) {
    if (!transaction.amount || transaction.customer_id !== customerId) continue

    // Somma solo gli importi delle transazioni del cliente
    // Considera sia entrate che uscite (il cliente può avere movimenti in entrambe le direzioni)
    // Per semplicità, consideriamo tutte le transazioni con amount positivo come spesa
    if (transaction.amount > 0) {
      totalSpending += transaction.amount
    }
  }

  return Math.round(totalSpending * 100) / 100
}

// GET - Spesa totale per cliente
export function useCustomerSpending(customerId: string | undefined) {
  return useQuery({
    queryKey: [...CUSTOMER_SPENDING_KEY, customerId],
    queryFn: async () => {
      if (!customerId) return 0
      return await calculateCustomerSpending(customerId)
    },
    enabled: !!customerId,
  })
}

