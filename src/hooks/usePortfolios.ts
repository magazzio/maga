import { useQuery } from '@tanstack/react-query'
import { db } from '@/db'
import { logger } from '@/lib/logger'

const PORTFOLIOS_QUERY_KEY = ['portfolios']

export function usePortfolios() {
  return useQuery({
    queryKey: PORTFOLIOS_QUERY_KEY,
    queryFn: async () => {
      try {
        return await db.portfolios.toArray()
      } catch (error) {
        logger.error('Error loading portfolios', error as Error)
        throw error
      }
    },
  })
}

export function usePortfolio(id: number) {
  return useQuery({
    queryKey: [...PORTFOLIOS_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await db.portfolios.get(id)
      } catch (error) {
        logger.error('Error fetching portfolio', error as Error, { portfolioId: id })
        throw error
      }
    },
    enabled: !!id,
  })
}

