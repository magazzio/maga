import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Entity } from '@/db'
import { logger } from '@/lib/logger'

const ENTITIES_QUERY_KEY = ['entities']

export function useEntities() {
  return useQuery({
    queryKey: ENTITIES_QUERY_KEY,
    queryFn: async () => {
      try {
        return await db.entities.toArray()
      } catch (error) {
        logger.error('Error loading entities', error as Error)
        throw error
      }
    },
  })
}

export function useEntity(id: number) {
  return useQuery({
    queryKey: [...ENTITIES_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await db.entities.get(id)
      } catch (error) {
        logger.error('Error fetching entity', error as Error, { entityId: id })
        throw error
      }
    },
    enabled: !!id,
  })
}

export function useCreateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (entity: Omit<Entity, 'id'>) => {
      try {
        // Crea l'entità
        const entityId = await db.entities.add(entity)
        
        // Crea automaticamente magazzino e portafoglio associati
        const warehouseName = `Magazzino ${entity.name}`
        const portfolioName = `Portafoglio ${entity.name}`
        
        await db.warehouses.add({
          name: warehouseName,
          description: `Magazzino principale di ${entity.name}`,
          entity_id: entityId as number,
        })
        
        await db.portfolios.add({
          name: portfolioName,
          description: `Cassa per i movimenti di ${entity.name}`,
          entity_id: entityId as number,
        })
        
        logger.info('Entity created with warehouse and portfolio', { entityId, entityName: entity.name })
        
        return entityId
      } catch (error) {
        logger.error('Error creating entity', error as Error, { entityName: entity.name })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
    onError: (error) => {
      logger.error('Failed to create entity', error as Error)
    },
  })
}

export function useUpdateEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (entity: Entity) => {
      try {
        if (!entity.id) {
          logger.error('Attempted to update entity without ID', new Error('Entity ID is required'), { entity })
          throw new Error('Entity ID is required for update')
        }
        
        // Aggiorna l'entità
        await db.entities.update(entity.id, entity)
        
        // Aggiorna anche i nomi di magazzino e portafoglio associati
        const warehouses = await db.warehouses.where('entity_id').equals(entity.id).toArray()
        const portfolios = await db.portfolios.where('entity_id').equals(entity.id).toArray()
        
        for (const warehouse of warehouses) {
          if (warehouse.id) {
            await db.warehouses.update(warehouse.id, {
              name: `Magazzino ${entity.name}`,
              description: `Magazzino principale di ${entity.name}`,
            })
          }
        }
        
        for (const portfolio of portfolios) {
          if (portfolio.id) {
            await db.portfolios.update(portfolio.id, {
              name: `Portafoglio ${entity.name}`,
              description: `Cassa per i movimenti di ${entity.name}`,
            })
          }
        }
        
        return entity.id
      } catch (error) {
        logger.error('Error updating entity', error as Error, { entityId: entity.id, entityName: entity.name })
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...ENTITIES_QUERY_KEY, variables.id] })
      }
    },
    onError: (error) => {
      logger.error('Failed to update entity', error as Error)
    },
  })
}

export function useDeleteEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        // Verifica se l'entità è usata in transazioni (tramite magazzini/portafogli)
        const warehouses = await db.warehouses.where('entity_id').equals(id).toArray()
        const portfolios = await db.portfolios.where('entity_id').equals(id).toArray()
        
        const warehouseIds = warehouses.map(w => w.id).filter((id): id is number => id !== undefined)
        const portfolioIds = portfolios.map(p => p.id).filter((id): id is number => id !== undefined)
        
        // Controlla transazioni che usano questi magazzini
        let transactionsCount = 0
        for (const warehouseId of warehouseIds) {
          const fromCount = await db.transactions.where('from_warehouse_id').equals(warehouseId).count()
          const toCount = await db.transactions.where('to_warehouse_id').equals(warehouseId).count()
          transactionsCount += fromCount + toCount
        }
        
        // Controlla transazioni che usano questi portafogli
        for (const portfolioId of portfolioIds) {
          const fromCount = await db.transactions.where('from_portfolio_id').equals(portfolioId).count()
          const toCount = await db.transactions.where('to_portfolio_id').equals(portfolioId).count()
          transactionsCount += fromCount + toCount
        }
        
        // Permetti eliminazione solo se non ci sono transazioni
        // I magazzini e portafogli associati verranno eliminati automaticamente
        if (transactionsCount > 0) {
          throw new Error(
            `Impossibile eliminare: questa entità è utilizzata in ${transactionsCount} movimento${transactionsCount !== 1 ? 'i' : ''}. ` +
            'Elimina prima i movimenti correlati.'
          )
        }
        
        // Elimina magazzini e portafogli associati
        for (const warehouseId of warehouseIds) {
          await db.warehouses.delete(warehouseId)
        }
        for (const portfolioId of portfolioIds) {
          await db.portfolios.delete(portfolioId)
        }
        
        // Elimina l'entità
        await db.entities.delete(id)
        
        logger.info('Entity deleted with associated warehouse and portfolio', { entityId: id })
      } catch (error) {
        logger.error('Error deleting entity', error as Error, { entityId: id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
    onError: (error) => {
      logger.error('Failed to delete entity', error as Error)
    },
  })
}

