import { useQuery } from '@tanstack/react-query'
import { db } from '@/db'

const CUSTOMER_DEBT_KEY = ['customer-debt'] as const

// Calcola debito totale per cliente (solo debiti pending)
async function calculateCustomerDebt(customerId: string): Promise<number> {
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  let totalDebt = 0

  for (const transaction of transactions) {
    if (!transaction.amount || transaction.customer_id !== customerId) continue

    // Somma solo i debiti pending
    if (transaction.is_debt && transaction.debt_status === 'pending' && transaction.amount > 0) {
      totalDebt += transaction.amount
    }
  }

  return Math.round(totalDebt * 100) / 100
}

// GET - Debito totale per cliente (solo pending)
export function useCustomerDebt(customerId: string | undefined) {
  return useQuery({
    queryKey: [...CUSTOMER_DEBT_KEY, customerId],
    queryFn: async () => {
      if (!customerId) return 0
      return await calculateCustomerDebt(customerId)
    },
    enabled: !!customerId,
  })
}

