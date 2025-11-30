import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Transaction } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const TRANSACTIONS_KEY = ['transactions'] as const

// GET - Lista movimenti
export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: async () => {
      return await db.transactions.orderBy('date').reverse().toArray()
    },
  })
}

// GET - Singolo movimento
export function useTransaction(id: number) {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, id],
    queryFn: async () => {
      const transaction = await db.transactions.get(id)
      if (!transaction) {
        throw new Error('Movimento non trovato')
      }
      return transaction
    },
    enabled: !!id,
  })
}

// CREATE - Crea movimento
export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Transaction, 'id'>) => {
      const id = await db.transactions.add(data as Transaction)
      return { ...data, id } as Transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
      // Invalida anche i debiti tra entità, crediti clienti e stock quando si crea un movimento
      queryClient.invalidateQueries({ queryKey: ['entity-net-balance'] })
      queryClient.invalidateQueries({ queryKey: ['customer-credits'] })
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      toast({
        title: 'Movimento creato',
        description: 'Il movimento è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il movimento.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica movimento
export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Transaction) => {
      if (!id) throw new Error('ID movimento mancante')
      await db.transactions.update(id, data)
      return { id, ...data } as Transaction
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
      queryClient.invalidateQueries({ queryKey: [...TRANSACTIONS_KEY, data.id] })
      // Invalida anche i debiti tra entità, crediti clienti e stock quando si aggiorna un movimento
      queryClient.invalidateQueries({ queryKey: ['entity-net-balance'] })
      queryClient.invalidateQueries({ queryKey: ['customer-credits'] })
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      toast({
        title: 'Movimento aggiornato',
        description: 'Il movimento è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il movimento.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina movimento
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await db.transactions.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
      // Invalida anche stock e calcoli quando si elimina un movimento
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['entity-net-balance'] })
      queryClient.invalidateQueries({ queryKey: ['customer-credits'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio-balance'] })
      toast({
        title: 'Movimento eliminato',
        description: 'Il movimento è stato eliminato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il movimento.',
        variant: 'destructive',
      })
    },
  })
}

