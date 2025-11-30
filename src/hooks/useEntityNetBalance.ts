import { useQuery } from '@tanstack/react-query'
import { db, Transaction, Portfolio, Entity } from '@/db'

// Query keys
const ENTITY_NET_BALANCE_KEY = ['entity-net-balance'] as const

export interface EntityNetBalance {
  netBalance: number // Saldo netto: crediti - debiti (positivo = Driplug deve, negativo = Meetdrip deve)
  meetdripCredits: number // Crediti che Meetdrip ha verso Driplug
  meetdripDebts: number // Debiti che Meetdrip ha verso Driplug
}

// Calcola saldo netto tra entità
async function calculateEntityNetBalance(): Promise<EntityNetBalance> {
  // Ottieni tutte le entità
  const entities = await db.entities.toArray()
  const meetdrip = entities.find(e => e.name.toLowerCase().includes('meetdrip'))
  const driplug = entities.find(e => e.name.toLowerCase().includes('driplug'))

  if (!meetdrip || !driplug) {
    return { netBalance: 0, meetdripCredits: 0, meetdripDebts: 0 }
  }

  // Ottieni portafogli delle due entità
  const portfolios = await db.portfolios.toArray()
  const meetdripPortfolios = portfolios.filter(p => p.entity_id === meetdrip.id)
  const driplugPortfolios = portfolios.filter(p => p.entity_id === driplug.id)

  const meetdripPortfolioIds = meetdripPortfolios.map(p => p.id!).filter(Boolean) as number[]
  const driplugPortfolioIds = driplugPortfolios.map(p => p.id!).filter(Boolean) as number[]

  if (meetdripPortfolioIds.length === 0 || driplugPortfolioIds.length === 0) {
    return { netBalance: 0, meetdripCredits: 0, meetdripDebts: 0 }
  }

  // Ottieni tutti i movimenti con debiti pendenti
  const transactions = await db.transactions
    .where('date')
    .belowOrEqual(new Date())
    .toArray()

  let meetdripCredits = 0 // Driplug deve a Meetdrip
  let meetdripDebts = 0 // Meetdrip deve a Driplug

  for (const transaction of transactions) {
    if (!transaction.amount || !transaction.is_debt || transaction.debt_status !== 'pending') {
      continue
    }

    const fromPortfolioId = transaction.from_portfolio_id
    const toPortfolioId = transaction.to_portfolio_id

    // Debito da Meetdrip verso Driplug (Meetdrip deve)
    if (
      fromPortfolioId &&
      toPortfolioId &&
      meetdripPortfolioIds.includes(fromPortfolioId) &&
      driplugPortfolioIds.includes(toPortfolioId)
    ) {
      meetdripDebts += transaction.amount
    }

    // Debito da Driplug verso Meetdrip (Driplug deve = credito per Meetdrip)
    if (
      fromPortfolioId &&
      toPortfolioId &&
      driplugPortfolioIds.includes(fromPortfolioId) &&
      meetdripPortfolioIds.includes(toPortfolioId)
    ) {
      meetdripCredits += transaction.amount
    }
  }

  // Saldo netto: positivo = Driplug deve (Meetdrip ha crediti), negativo = Meetdrip deve
  const netBalance = meetdripCredits - meetdripDebts

  return {
    netBalance: Math.round(netBalance * 100) / 100,
    meetdripCredits: Math.round(meetdripCredits * 100) / 100,
    meetdripDebts: Math.round(meetdripDebts * 100) / 100,
  }
}

// GET - Saldo netto tra entità
export function useEntityNetBalance() {
  return useQuery({
    queryKey: ENTITY_NET_BALANCE_KEY,
    queryFn: calculateEntityNetBalance,
  })
}

