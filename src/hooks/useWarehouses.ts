import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Warehouse } from '@/db'
import { logger } from '@/lib/logger'

const WAREHOUSES_QUERY_KEY = ['warehouses']

export function useWarehouses() {
  return useQuery({
    queryKey: WAREHOUSES_QUERY_KEY,
    queryFn: async () => {
      try {
        return await db.warehouses.toArray()
      } catch (error) {
        logger.error('Error loading warehouses', error as Error)
        throw error
      }
    },
  })
}

export function useWarehouse(id: number) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, id],
    queryFn: () => db.warehouses.get(id),
    enabled: !!id,
  })
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (warehouse: Omit<Warehouse, 'id'>) => {
      try {
        return await db.warehouses.add(warehouse)
      } catch (error) {
        logger.error('Error creating warehouse', error as Error, { warehouse })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to create warehouse', error as Error)
    },
  })
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (warehouse: Warehouse) => {
      try {
        if (!warehouse.id) throw new Error('Warehouse ID is required')
        return await db.warehouses.update(warehouse.id, warehouse)
      } catch (error) {
        logger.error('Error updating warehouse', error as Error, { warehouseId: warehouse.id })
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...WAREHOUSES_QUERY_KEY, variables.id] })
      }
    },
    onError: (error) => {
      logger.error('Failed to update warehouse', error as Error)
    },
  })
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        // Verifica se il magazzino è usato in transazioni (da o verso)
        const transactionsFrom = await db.transactions.where('from_warehouse_id').equals(id).count()
        const transactionsTo = await db.transactions.where('to_warehouse_id').equals(id).count()
        const totalTransactions = transactionsFrom + transactionsTo
        
        // Verifica se il magazzino è presente nello stock
        const stockCount = await db.stock.where('warehouse_id').equals(id).count()
        
        if (totalTransactions > 0 || stockCount > 0) {
          const issues: string[] = []
          if (totalTransactions > 0) {
            issues.push(`${totalTransactions} movimento${totalTransactions !== 1 ? 'i' : ''}`)
          }
          if (stockCount > 0) {
            issues.push(`presente nello stock`)
          }
          
          throw new Error(
            `Impossibile eliminare: questo magazzino è utilizzato in ${issues.join(' e ')}. ` +
            'Elimina prima i movimenti correlati o rimuovi il magazzino dallo stock.'
          )
        }
        
        return await db.warehouses.delete(id)
      } catch (error) {
        logger.error('Error deleting warehouse', error as Error, { warehouseId: id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to delete warehouse', error as Error)
    },
  })
}

