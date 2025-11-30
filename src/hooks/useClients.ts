import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Customer } from '@/db'
import { logger } from '@/lib/logger'

const CLIENTS_QUERY_KEY = ['clients']

/**
 * Hook per ottenere clienti paginati
 * Carica solo la pagina corrente per performance, a meno che non servano tutti per ricerca
 */
export function useClients(page: number = 1, pageSize: number = 10, loadAll: boolean = false) {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, page, pageSize, loadAll],
    queryFn: async () => {
      try {
        const allClients = await db.customers.toArray()
        const total = allClients.length
        
        // Se loadAll è true, restituisci tutti (per ricerca globale)
        // Altrimenti carica solo la pagina corrente
        let clients: Customer[]
        if (loadAll) {
          clients = allClients
        } else {
          const start = (page - 1) * pageSize
          const end = start + pageSize
          clients = allClients.slice(start, end)
        }
        
        return {
          clients: loadAll ? allClients : clients, // Tutti solo se richiesto
          paginatedClients: clients,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        }
      } catch (error) {
        logger.error('Error loading clients', error as Error, { page, pageSize, loadAll })
        throw error
      }
    },
  })
}

export function useClient(id: number) {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, id],
    queryFn: () => db.customers.get(id),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (client: Omit<Customer, 'id'>) => {
      try {
        return await db.customers.add(client)
      } catch (error) {
        logger.error('Error creating client', error as Error, { client })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to create client', error as Error)
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (client: Customer) => {
      try {
        if (!client.id) throw new Error('Client ID is required')
        return await db.customers.update(client.id, client)
      } catch (error) {
        logger.error('Error updating client', error as Error, { clientId: client.id })
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, variables.id] })
      }
    },
    onError: (error) => {
      logger.error('Failed to update client', error as Error)
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        // Verifica se il cliente è referral e ha altri clienti che lo referenziano
        const client = await db.customers.get(id)
        if (client?.is_referral) {
          const clientsReferredBy = await db.customers.where('referred_by').equals(id).count()
          if (clientsReferredBy > 0) {
            throw new Error(
              `Impossibile eliminare: questo cliente è un referral e ha ${clientsReferredBy} cliente${clientsReferredBy !== 1 ? 'i' : ''} che lo referenziano. ` +
              'Rimuovi prima lo status di referral o modifica i clienti che lo referenziano.'
            )
          }
        }
        
        // Nota: per ora non c'è customer_id nelle transazioni, ma quando verrà aggiunto
        // bisognerà verificare anche lì
        
        return await db.customers.delete(id)
      } catch (error) {
        logger.error('Error deleting client', error as Error, { clientId: id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to delete client', error as Error)
    },
  })
}

