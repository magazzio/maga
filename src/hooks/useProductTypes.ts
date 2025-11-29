import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, ProductType, ProductTypeColor } from '@/db'

const PRODUCT_TYPES_QUERY_KEY = ['productTypes']

export function useProductTypes() {
  return useQuery({
    queryKey: PRODUCT_TYPES_QUERY_KEY,
    queryFn: () => db.productTypes.toArray(),
  })
}

export function useProductType(id: number) {
  return useQuery({
    queryKey: [...PRODUCT_TYPES_QUERY_KEY, id],
    queryFn: () => db.productTypes.get(id),
    enabled: !!id,
  })
}

export function useCreateProductType() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (productType: Omit<ProductType, 'id'>) => {
      try {
        const dataToAdd = {
          name: productType.name.trim(),
          color: productType.color,
        }
        const id = await db.productTypes.add(dataToAdd)
        return id
      } catch (error) {
        console.error('Error in useCreateProductType:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY })
    },
  })
}

export function useUpdateProductType() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...productType }: ProductType) => {
      if (!id) throw new Error('ProductType ID is required')
      return await db.productTypes.update(id, productType)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: [...PRODUCT_TYPES_QUERY_KEY, variables.id] })
      }
    },
  })
}

export function useDeleteProductType() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await db.productTypes.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY })
    },
  })
}

