import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Product, generateProductId } from '@/db'

const PRODUCTS_QUERY_KEY = ['products']

export function useProducts(page: number = 1, pageSize: number = 10, activeOnly: boolean = false) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, page, pageSize, activeOnly],
    queryFn: async () => {
      let allProducts = await db.products.toArray()
      
      // Filtra solo prodotti attivi se richiesto
      if (activeOnly) {
        allProducts = allProducts.filter(p => p.active !== false)
      }
      
      const total = allProducts.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const products = allProducts.slice(start, end)
      
      return {
        products: allProducts, // Restituiamo tutti i prodotti per permettere ricerca globale
        paginatedProducts: products, // E anche quelli paginati
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
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
      const id = await generateProductId()
      return await db.products.add({ ...product, id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!product.id) throw new Error('Product ID is required')
      return await db.products.update(product.id, product)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...PRODUCTS_QUERY_KEY, variables.id] })
      }
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await db.products.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}

