import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, ProductType } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const PRODUCT_TYPES_KEY = ['productTypes'] as const

// GET - Lista tipi prodotto
export function useProductTypes() {
  return useQuery({
    queryKey: PRODUCT_TYPES_KEY,
    queryFn: async () => {
      return await db.productTypes.toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Singolo tipo prodotto
export function useProductType(id: number) {
  return useQuery({
    queryKey: [...PRODUCT_TYPES_KEY, id],
    queryFn: async () => {
      const type = await db.productTypes.get(id)
      if (!type) {
        throw new Error('Tipo prodotto non trovato')
      }
      return type
    },
    enabled: !!id,
  })
}

// CREATE - Crea tipo prodotto
export function useCreateProductType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<ProductType, 'id'>) => {
      const id = await db.productTypes.add(data as ProductType)
      return { ...data, id } as ProductType
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY })
      toast({
        title: 'Tipo prodotto creato',
        description: 'Il tipo prodotto è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il tipo prodotto.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica tipo prodotto
export function useUpdateProductType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: ProductType) => {
      if (!id) throw new Error('ID tipo prodotto mancante')
      await db.productTypes.update(id, data)
      return { id, ...data } as ProductType
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY })
      queryClient.invalidateQueries({ queryKey: [...PRODUCT_TYPES_KEY, data.id] })
      toast({
        title: 'Tipo prodotto aggiornato',
        description: 'Il tipo prodotto è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il tipo prodotto.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina tipo prodotto
export function useDeleteProductType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await db.productTypes.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY })
      toast({
        title: 'Tipo prodotto eliminato',
        description: 'Il tipo prodotto è stato eliminato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il tipo prodotto.',
        variant: 'destructive',
      })
    },
  })
}

