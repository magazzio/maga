import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Customer } from '@/db'
import { toast } from '@/hooks/use-toast'

// Query keys
const CUSTOMERS_KEY = ['customers'] as const

// Genera ID cliente automatico (C + 3 numeri casuali)
async function generateCustomerId(): Promise<string> {
  let id: string = ''
  let exists = true
  
  while (exists) {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    id = `C${randomNum}`
    const customer = await db.customers.get(id)
    exists = !!customer
  }
  
  return id
}

// GET - Lista clienti (tutti, filtro nella UI)
export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_KEY,
    queryFn: async () => {
      return await db.customers.toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Lista clienti attivi (per selezioni nei form)
export function useActiveCustomers() {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, 'active'],
    queryFn: async () => {
      return await db.customers.filter(c => c.active !== false).toArray()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// GET - Singolo cliente
export function useCustomer(id: string) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, id],
    queryFn: async () => {
      const customer = await db.customers.get(id)
      if (!customer) {
        throw new Error('Cliente non trovato')
      }
      return customer
    },
    enabled: !!id,
  })
}

// CREATE - Crea cliente
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Customer, 'id'>) => {
      const id = await generateCustomerId()
      await db.customers.add({ ...data, id, active: data.active !== false } as Customer)
      return { ...data, id, active: data.active !== false } as Customer
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY })
      toast({
        title: 'Cliente creato',
        description: 'Il cliente è stato creato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile creare il cliente.',
        variant: 'destructive',
      })
    },
  })
}

// UPDATE - Modifica cliente
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Customer) => {
      if (!id) throw new Error('ID cliente mancante')
      await db.customers.update(id, data)
      return { id, ...data } as Customer
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY })
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_KEY, data.id] })
      toast({
        title: 'Cliente aggiornato',
        description: 'Il cliente è stato aggiornato con successo.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare il cliente.',
        variant: 'destructive',
      })
    },
  })
}

// DELETE - Elimina cliente definitivamente
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await db.customers.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY })
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_KEY, 'active'] })
      toast({
        title: 'Cliente eliminato',
        description: 'Il cliente è stato eliminato definitivamente.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare il cliente.',
        variant: 'destructive',
      })
    },
  })
}

