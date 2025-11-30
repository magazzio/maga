import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, TransactionType } from '@/db'
import { logger } from '@/lib/logger'

const TRANSACTION_TYPES_QUERY_KEY = ['transactionTypes']

export function useTransactionTypes() {
  return useQuery({
    queryKey: TRANSACTION_TYPES_QUERY_KEY,
    queryFn: async () => {
      try {
        return await db.transactionTypes.toArray()
      } catch (error) {
        logger.error('Error loading transaction types', error as Error)
        throw error
      }
    },
  })
}

export function useTransactionType(id: number) {
  return useQuery({
    queryKey: [...TRANSACTION_TYPES_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await db.transactionTypes.get(id)
      } catch (error) {
        logger.error('Error fetching transaction type', error as Error, { transactionTypeId: id })
        throw error
      }
    },
    enabled: !!id,
  })
}

export function useCreateTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactionType: Omit<TransactionType, 'id'>) => {
      try {
        const id = await db.transactionTypes.add(transactionType)
        return id
      } catch (error) {
        logger.error('Error creating transaction type', error as Error, { transactionTypeName: transactionType.name })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TYPES_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to create transaction type', error as Error)
    },
  })
}

export function useUpdateTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactionType: TransactionType) => {
      try {
        if (!transactionType.id) {
          logger.error('Attempted to update transaction type without ID', new Error('TransactionType ID is required'), { transactionType })
          throw new Error('TransactionType ID is required for update')
        }
        return await db.transactionTypes.update(transactionType.id, transactionType)
      } catch (error) {
        logger.error('Error updating transaction type', error as Error, { transactionTypeId: transactionType.id })
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TYPES_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...TRANSACTION_TYPES_QUERY_KEY, variables.id] })
      }
    },
    onError: (error) => {
      logger.error('Failed to update transaction type', error as Error)
    },
  })
}

export function useDeleteTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        // Verifica se il tipo movimento è usato in transazioni
        const transactionsCount = await db.transactions.where('type_id').equals(id).count()

        if (transactionsCount > 0) {
          throw new Error(
            `Impossibile eliminare: questo tipo movimento è utilizzato in ${transactionsCount} movimento${transactionsCount !== 1 ? 'i' : ''}. ` +
            'Elimina prima i movimenti che lo utilizzano.'
          )
        }

        return await db.transactionTypes.delete(id)
      } catch (error) {
        logger.error('Error deleting transaction type', error as Error, { transactionTypeId: id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TYPES_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to delete transaction type', error as Error)
    },
  })
}

