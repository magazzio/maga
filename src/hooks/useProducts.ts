import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Product, generateProductId } from '@/db'
import { logger } from '@/lib/logger'

const PRODUCTS_QUERY_KEY = ['products']

/**
 * Hook per ottenere prodotti paginati
 * Carica solo la pagina corrente per performance, a meno che non servano tutti per ricerca
 */
export function useProducts(page: number = 1, pageSize: number = 10, activeOnly: boolean = false, loadAll: boolean = false) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, page, pageSize, activeOnly, loadAll],
    queryFn: async () => {
      try {
        let query = db.products.toCollection()
        
        // Filtra solo prodotti attivi se richiesto
        if (activeOnly) {
          query = query.filter(p => p.active !== false)
        }
        
        const allProducts = await query.toArray()
        const total = allProducts.length
        
        // Se loadAll è true, restituisci tutti (per ricerca globale)
        // Altrimenti carica solo la pagina corrente
        let products: Product[]
        if (loadAll) {
          products = allProducts
        } else {
          const start = (page - 1) * pageSize
          const end = start + pageSize
          products = allProducts.slice(start, end)
        }
        
        return {
          products: loadAll ? allProducts : products, // Tutti solo se richiesto
          paginatedProducts: products,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        }
      } catch (error) {
        logger.error('Error loading products', error as Error, { page, pageSize, activeOnly, loadAll })
        throw error
      }
    },
  })
}

// Hook per ottenere solo prodotti attivi (per selezioni)
export function useActiveProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'active'],
    queryFn: async () => {
      const allProducts = await db.products.toArray()
      return allProducts.filter(p => p.active !== false)
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => db.products.get(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      try {
        const id = await generateProductId()
        return await db.products.add({ ...product, id })
      } catch (error) {
        logger.error('Error creating product', error as Error, { product })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to create product', error as Error)
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (product: Product) => {
      try {
        if (!product.id) throw new Error('Product ID is required')
        return await db.products.update(product.id, product)
      } catch (error) {
        logger.error('Error updating product', error as Error, { productId: product.id })
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...PRODUCTS_QUERY_KEY, variables.id] })
      }
    },
    onError: (error) => {
      logger.error('Failed to update product', error as Error)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Verifica se il prodotto è usato in transazioni
        const transactionsCount = await db.transactions.where('product_id').equals(id).count()
        
        // Verifica se il prodotto è presente nello stock
        const stockCount = await db.stock.where('product_id').equals(id).count()
        
        if (transactionsCount > 0 || stockCount > 0) {
          const issues: string[] = []
          if (transactionsCount > 0) {
            issues.push(`${transactionsCount} movimento${transactionsCount !== 1 ? 'i' : ''}`)
          }
          if (stockCount > 0) {
            issues.push(`presente nello stock`)
          }
          
          throw new Error(
            `Impossibile eliminare: questo prodotto è utilizzato in ${issues.join(' e ')}. ` +
            'Elimina prima i movimenti correlati o rimuovi il prodotto dallo stock.'
          )
        }
        
        return await db.products.delete(id)
      } catch (error) {
        logger.error('Error deleting product', error as Error, { productId: id })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
    onError: (error) => {
      logger.error('Failed to delete product', error as Error)
    },
  })
}

