import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, TransactionType } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const TRANSACTION_TYPES_KEY = ['transactionTypes'] as const

// GET - Lista tipi movimento
export function useTransactionTypes() {
  return useQuery({
    queryKey: TRANSACTION_TYPES_KEY,
    queryFn: async () => {
      return await db.transactionTypes.toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Singolo tipo movimento
export function useTransactionType(id: number) {
  return useQuery({
    queryKey: [...TRANSACTION_TYPES_KEY, id],
    queryFn: async () => {
      const type = await db.transactionTypes.get(id)
      if (!type) {
        throw new Error('Tipo movimento non trovato')
      }
      return type
    },
    enabled: !!id,
  })
}

// CREATE - Crea tipo movimento
export function useCreateTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<TransactionType, 'id'>) => {
      const id = await db.transactionTypes.add(data as TransactionType)
      return { ...data, id } as TransactionType
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TYPES_KEY })
      toast({
        title: 'Tipo movimento creato',
        description: 'Il tipo movimento è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il tipo movimento.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica tipo movimento
export function useUpdateTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: TransactionType) => {
      if (!id) throw new Error('ID tipo movimento mancante')
      await db.transactionTypes.update(id, data)
      return { id, ...data } as TransactionType
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TYPES_KEY })
      queryClient.invalidateQueries({ queryKey: [...TRANSACTION_TYPES_KEY, data.id] })
      toast({
        title: 'Tipo movimento aggiornato',
        description: 'Il tipo movimento è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il tipo movimento.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina tipo movimento
export function useDeleteTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await db.transactionTypes.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TYPES_KEY })
      toast({
        title: 'Tipo movimento eliminato',
        description: 'Il tipo movimento è stato eliminato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il tipo movimento.',
        variant: 'destructive',
      })
    },
  })
}

