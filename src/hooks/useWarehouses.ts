import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Warehouse } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const WAREHOUSES_KEY = ['warehouses'] as const

// GET - Lista magazzini
export function useWarehouses() {
  return useQuery({
    queryKey: WAREHOUSES_KEY,
    queryFn: async () => {
      return await db.warehouses.toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Singolo magazzino
export function useWarehouse(id: number) {
  return useQuery({
    queryKey: [...WAREHOUSES_KEY, id],
    queryFn: async () => {
      const warehouse = await db.warehouses.get(id)
      if (!warehouse) {
        throw new Error('Magazzino non trovato')
      }
      return warehouse
    },
    enabled: !!id,
  })
}

// GET - Magazzini per entità
export function useWarehousesByEntity(entityId: number) {
  return useQuery({
    queryKey: [...WAREHOUSES_KEY, 'entity', entityId],
    queryFn: async () => {
      return await db.warehouses.where('entity_id').equals(entityId).toArray()
    },
    enabled: !!entityId,
  })
}

// CREATE - Crea magazzino
export function useCreateWarehouse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Warehouse, 'id'>) => {
      const id = await db.warehouses.add(data as Warehouse)
      return { ...data, id } as Warehouse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast({
        title: 'Magazzino creato',
        description: 'Il magazzino è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il magazzino.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica magazzino
export function useUpdateWarehouse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Warehouse) => {
      if (!id) throw new Error('ID magazzino mancante')
      await db.warehouses.update(id, data)
      return { id, ...data } as Warehouse
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      queryClient.invalidateQueries({ queryKey: [...WAREHOUSES_KEY, data.id] })
      toast({
        title: 'Magazzino aggiornato',
        description: 'Il magazzino è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il magazzino.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina magazzino
export function useDeleteWarehouse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await db.warehouses.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY })
      toast({
        title: 'Magazzino eliminato',
        description: 'Il magazzino è stato eliminato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il magazzino.',
        variant: 'destructive',
      })
    },
  })
}

