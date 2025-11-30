/**
 * Funzione per resettare completamente il database
 * Elimina tutte le entità, magazzini e portafogli
 * ATTENZIONE: Questa funzione elimina tutti i dati!
 */

import { db } from './index'
import { logger } from '@/lib/logger'

export async function resetEntitiesAndWarehouses(): Promise<void> {
  try {
    // Elimina tutte le entità (questo eliminerà anche magazzini e portafogli associati tramite cascade)
    const entities = await db.entities.toArray()
    
    for (const entity of entities) {
      if (entity.id) {
        // Trova magazzini e portafogli associati
        const warehouses = await db.warehouses.where('entity_id').equals(entity.id).toArray()
        const portfolios = await db.portfolios.where('entity_id').equals(entity.id).toArray()
        
        // Elimina magazzini
        for (const warehouse of warehouses) {
          if (warehouse.id) {
            await db.warehouses.delete(warehouse.id)
          }
        }
        
        // Elimina portafogli
        for (const portfolio of portfolios) {
          if (portfolio.id) {
            await db.portfolios.delete(portfolio.id)
          }
        }
        
        // Elimina entità
        await db.entities.delete(entity.id)
      }
    }
    
    logger.info('All entities, warehouses and portfolios deleted')
  } catch (error) {
    logger.error('Error resetting entities', error as Error)
    throw error
  }
}

