import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Product } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const PRODUCTS_KEY = ['products'] as const

// Genera ID prodotto automatico (P + 3 numeri casuali)
async function generateProductId(): Promise<string> {
  let id: string = ''
  let exists = true
  
  while (exists) {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    id = `P${randomNum}`
    const product = await db.products.get(id)
    exists = !!product
  }
  
  return id
}

// GET - Lista prodotti (tutti, filtro nella UI)
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      return await db.products.toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Lista prodotti attivi (per selezioni nei form)
export function useActiveProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, 'active'],
    queryFn: async () => {
      return await db.products.filter(p => p.active !== false).toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Singolo prodotto
export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: async () => {
      const product = await db.products.get(id)
      if (!product) {
        throw new Error('Prodotto non trovato')
      }
      return product
    },
    enabled: !!id,
  })
}

// CREATE - Crea prodotto
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Product, 'id'>) => {
      const id = await generateProductId()
      await db.products.add({ ...data, id } as Product)
      return { ...data, id } as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast({
        title: 'Prodotto creato',
        description: 'Il prodotto è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il prodotto.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica prodotto
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Product) => {
      if (!id) throw new Error('ID prodotto mancante')
      await db.products.update(id, data)
      return { id, ...data } as Product
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...PRODUCTS_KEY, data.id] })
      toast({
        title: 'Prodotto aggiornato',
        description: 'Il prodotto è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il prodotto.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina prodotto definitivamente
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await db.products.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...PRODUCTS_KEY, 'active'] })
      toast({
        title: 'Prodotto eliminato',
        description: 'Il prodotto è stato eliminato definitivamente.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il prodotto.',
        variant: 'destructive',
      })
    },
  })
}

