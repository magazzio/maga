import { useQuery } from '@tanstack/react-query'
import { db, Transaction, Portfolio, Entity } from '@/db'

// Query keys
const CUSTOMER_CREDITS_KEY = ['customer-credits'] as const

// Calcola crediti totali con clienti (solo per Meetdrip)
async function calculateCustomerCredits(): Promise<number> {
  // Ottieni entità Meetdrip
  const entities = await db.entities.toArray()
  const meetdrip = entities.find(e => e.name.toLowerCase().includes('meetdrip'))

  if (!meetdrip) {
    return 0
  }

  // Ottieni portafogli di Meetdrip
  const portfolios = await db.portfolios.toArray()
  const meetdripPortfolios = portfolios.filter(p => p.entity_id === meetdrip.id)
  const meetdripPortfolioIds = meetdripPortfolios.map(p => p.id!).filter(Boolean) as number[]

  if (meetdripPortfolioIds.length === 0) {
    return 0
  }

  // Ottieni tutti i movimenti con debiti pendenti dei clienti
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  let totalCredits = 0

  for (const transaction of transactions) {
    // Solo movimenti che coinvolgono portafogli Meetdrip e hanno un cliente
    if (
      !transaction.amount ||
      !transaction.customer_id ||
      !transaction.is_debt ||
      transaction.debt_status !== 'pending'
    ) {
      continue
    }

    // Se il movimento è verso un portafoglio Meetdrip (entrata), è un credito
    if (transaction.to_portfolio_id && meetdripPortfolioIds.includes(transaction.to_portfolio_id)) {
      totalCredits += transaction.amount
    }
  }

  return Math.round(totalCredits * 100) / 100
}

// GET - Crediti totali con clienti (solo per Meetdrip)
export function useCustomerCredits() {
  return useQuery({
    queryKey: CUSTOMER_CREDITS_KEY,
    queryFn: calculateCustomerCredits,
  })
}

