import { useQuery } from '@tanstack/react-query'
import { db } from '@/db'

const CUSTOMER_REFERRALS_KEY = ['customer-referrals'] as const

// Conta quanti clienti sono stati referenziati da questo cliente
async function countCustomerReferrals(customerId: string): Promise<number> {
  const referrals = await db.customers
    .where('referred_by')
    .equals(customerId)
    .count()

  return referrals
}

// GET - Numero di clienti referiti
export function useCustomerReferrals(customerId: string | undefined) {
  return useQuery({
    queryKey: [...CUSTOMER_REFERRALS_KEY, customerId],
    queryFn: async () => {
      if (!customerId) return 0
      return await countCustomerReferrals(customerId)
    },
    enabled: !!customerId,
  })
}

