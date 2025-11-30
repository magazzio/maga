import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Portfolio } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const PORTFOLIOS_KEY = ['portfolios'] as const

// GET - Lista portafogli
export function usePortfolios() {
  return useQuery({
    queryKey: PORTFOLIOS_KEY,
    queryFn: async () => {
      return await db.portfolios.toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Singolo portafoglio
export function usePortfolio(id: number) {
  return useQuery({
    queryKey: [...PORTFOLIOS_KEY, id],
    queryFn: async () => {
      const portfolio = await db.portfolios.get(id)
      if (!portfolio) {
        throw new Error('Portafoglio non trovato')
      }
      return portfolio
    },
    enabled: !!id,
  })
}

// GET - Portafogli per entità
export function usePortfoliosByEntity(entityId: number) {
  return useQuery({
    queryKey: [...PORTFOLIOS_KEY, 'entity', entityId],
    queryFn: async () => {
      return await db.portfolios.where('entity_id').equals(entityId).toArray()
    },
    enabled: !!entityId,
  })
}

// CREATE - Crea portafoglio
export function useCreatePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Portfolio, 'id'>) => {
      const id = await db.portfolios.add(data as Portfolio)
      return { ...data, id } as Portfolio
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIOS_KEY })
      toast({
        title: 'Portafoglio creato',
        description: 'Il portafoglio è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il portafoglio.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica portafoglio
export function useUpdatePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Portfolio) => {
      if (!id) throw new Error('ID portafoglio mancante')
      await db.portfolios.update(id, data)
      return { id, ...data } as Portfolio
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIOS_KEY })
      queryClient.invalidateQueries({ queryKey: [...PORTFOLIOS_KEY, data.id] })
      toast({
        title: 'Portafoglio aggiornato',
        description: 'Il portafoglio è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il portafoglio.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina portafoglio
export function useDeletePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await db.portfolios.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIOS_KEY })
      toast({
        title: 'Portafoglio eliminato',
        description: 'Il portafoglio è stato eliminato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il portafoglio.',
        variant: 'destructive',
      })
    },
  })
}

