import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Transaction } from '@/db'
import { logger } from '@/lib/logger'

const TRANSACTIONS_QUERY_KEY = ['transactions']

export function useTransactions(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, page, pageSize],
    queryFn: async () => {
      try {
        const allTransactions = await db.transactions.orderBy('date').reverse().toArray()
        const total = allTransactions.length
        
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedTransactions = allTransactions.slice(start, end)
        
        return {
          transactions: paginatedTransactions,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        }
      } catch (error) {
        logger.error('Error loading transactions', error as Error, { page, pageSize })
        throw error
      }
    },
  })
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await db.transactions.get(id)
      } catch (error) {
        logger.error('Error fetching transaction', error as Error, { transactionId: id })
        throw error
      }
    },
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id'>) => {
      try {
        const id = await db.transactions.add(transaction)
        return id
      } catch (error) {
        logger.error('Error creating transaction', error as Error, { transactionTypeId: transaction.type_id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['stock'] }) // Invalida stock perché viene calcolato dai movimenti
    },
    onError: (error) => {
      logger.error('Failed to create transaction', error as Error)
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      try {
        if (!transaction.id) {
          logger.error('Attempted to update transaction without ID', new Error('Transaction ID is required'), { transaction })
          throw new Error('Transaction ID is required for update')
        }
        return await db.transactions.update(transaction.id, transaction)
      } catch (error) {
        logger.error('Error updating transaction', error as Error, { transactionId: transaction.id })
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['stock'] }) // Invalida stock perché viene calcolato dai movimenti
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...TRANSACTIONS_QUERY_KEY, variables.id] })
      }
    },
    onError: (error) => {
      logger.error('Failed to update transaction', error as Error)
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await db.transactions.delete(id)
      } catch (error) {
        logger.error('Error deleting transaction', error as Error, { transactionId: id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['stock'] }) // Invalida stock perché viene calcolato dai movimenti
    },
    onError: (error) => {
      logger.error('Failed to delete transaction', error as Error)
    },
  })
}

