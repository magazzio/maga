import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Customer } from '@/db'

const CLIENTS_QUERY_KEY = ['clients']

export function useClients(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, page, pageSize],
    queryFn: async () => {
      const allClients = await db.customers.toArray()
      
      const total = allClients.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const clients = allClients.slice(start, end)
      
      return {
        clients: allClients,
        paginatedClients: clients,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
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
      return await db.customers.add(client)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (client: Customer) => {
      if (!client.id) throw new Error('Client ID is required')
      return await db.customers.update(client.id, client)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, variables.id] })
      }
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await db.customers.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
    },
  })
}

