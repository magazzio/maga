import { useQuery } from '@tanstack/react-query'
import { db, Transaction } from '@/db'

// Query keys
const PORTFOLIO_BALANCE_KEY = ['portfolio-balance'] as const

export interface PortfolioBalance {
  balance: number // Saldo totale (tutti i metodi pagamento, escluso bancomat)
  cash_balance: number // Solo movimenti cash
  debt_balance: number // Solo debiti pending
}

// Calcola saldi portafoglio
async function calculatePortfolioBalance(portfolioId: number): Promise<PortfolioBalance> {
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  let balance = 0
  let cash_balance = 0
  let debt_balance = 0

  for (const transaction of transactions) {
    if (!transaction.amount) continue

    // Entrata nel portafoglio (to_portfolio_id)
    if (transaction.to_portfolio_id === portfolioId) {
      // Bancomat: tracciato ma NON nel saldo
      if (transaction.payment_method !== 'bancomat') {
        balance += transaction.amount
      }

      // Solo cash
      if (transaction.payment_method === 'cash') {
        cash_balance += transaction.amount
      }

      // Debiti pending
      if (transaction.is_debt && transaction.debt_status === 'pending') {
        debt_balance += transaction.amount
      }
    }

    // Uscita dal portafoglio (from_portfolio_id)
    if (transaction.from_portfolio_id === portfolioId) {
      // Bancomat: tracciato ma NON nel saldo
      if (transaction.payment_method !== 'bancomat') {
        balance -= transaction.amount
      }

      // Solo cash
      if (transaction.payment_method === 'cash') {
        cash_balance -= transaction.amount
      }

      // Debiti pending (solo se è un debito in uscita)
      if (transaction.is_debt && transaction.debt_status === 'pending') {
        debt_balance -= transaction.amount
      }
    }
  }

  return {
    balance: Math.round(balance * 100) / 100, // Arrotonda a 2 decimali
    cash_balance: Math.round(cash_balance * 100) / 100,
    debt_balance: Math.round(debt_balance * 100) / 100,
  }
}

// GET - Saldi portafoglio
export function usePortfolioBalance(portfolioId: number | undefined) {
  return useQuery({
    queryKey: [...PORTFOLIO_BALANCE_KEY, portfolioId],
    queryFn: async () => {
      if (!portfolioId) {
        return { balance: 0, cash_balance: 0, debt_balance: 0 } as PortfolioBalance
      }
      return await calculatePortfolioBalance(portfolioId)
    },
    enabled: !!portfolioId,
  })
}

// Calcola saldi futuri (per anteprima impatto)
export function calculateFutureBalance(
  portfolioId: number,
  currentBalance: PortfolioBalance,
  transaction: Partial<Transaction>
): PortfolioBalance {
  let balance = currentBalance.balance
  let cash_balance = currentBalance.cash_balance
  let debt_balance = currentBalance.debt_balance

  if (!transaction.amount) {
    return { balance, cash_balance, debt_balance }
  }

  const amount = transaction.amount

  // Entrata
  if (transaction.to_portfolio_id === portfolioId) {
    // Bancomat: tracciato ma NON nel saldo
    if (transaction.payment_method !== 'bancomat') {
      balance += amount
    }

    // Solo cash
    if (transaction.payment_method === 'cash') {
      cash_balance += amount
    }

    // Debiti pending
    if (transaction.is_debt && transaction.debt_status === 'pending') {
      debt_balance += amount
    }
  }

  // Uscita
  if (transaction.from_portfolio_id === portfolioId) {
    // Bancomat: tracciato ma NON nel saldo
    if (transaction.payment_method !== 'bancomat') {
      balance -= amount
    }

    // Solo cash
    if (transaction.payment_method === 'cash') {
      cash_balance -= amount
    }

    // Debiti pending
    if (transaction.is_debt && transaction.debt_status === 'pending') {
      debt_balance -= amount
    }
  }

  return {
    balance: Math.round(balance * 100) / 100,
    cash_balance: Math.round(cash_balance * 100) / 100,
    debt_balance: Math.round(debt_balance * 100) / 100,
  }
}

