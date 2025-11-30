import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Entity } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const ENTITIES_KEY = ['entities'] as const

// GET - Lista entità
export function useEntities() {
  return useQuery({
    queryKey: ENTITIES_KEY,
    queryFn: async () => {
      return await db.entities.toArray()
    },
    staleTime: 5 * 60 * 1000, // 5 minuti - dati cambiano raramente
  })
}

// GET - Singola entità
export function useEntity(id: number) {
  return useQuery({
    queryKey: [...ENTITIES_KEY, id],
    queryFn: async () => {
      const entity = await db.entities.get(id)
      if (!entity) {
        throw new Error('Entità non trovata')
      }
      return entity
    },
    enabled: !!id,
  })
}

// CREATE - Crea entità
export function useCreateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Entity, 'id'>) => {
      const id = await db.entities.add(data as Entity)
      return { ...data, id } as Entity
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITIES_KEY })
      toast({
        title: 'Entità creata',
        description: 'L\'entità è stata creata con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare l\'entità.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica entità
export function useUpdateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Entity) => {
      if (!id) throw new Error('ID entità mancante')
      await db.entities.update(id, data)
      return { id, ...data } as Entity
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ENTITIES_KEY })
      queryClient.invalidateQueries({ queryKey: [...ENTITIES_KEY, data.id] })
      toast({
        title: 'Entità aggiornata',
        description: 'L\'entità è stata aggiornata con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare l\'entità.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina entità
export function useDeleteEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await db.entities.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITIES_KEY })
      toast({
        title: 'Entità eliminata',
        description: 'L\'entità è stata eliminata con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare l\'entità.',
        variant: 'destructive',
      })
    },
  })
}

