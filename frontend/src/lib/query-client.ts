import { QueryClient } from '@tanstack/react-query'

// Configurazione ottimizzata per Network Transfer (vedi DECISIONI.md ADR-004)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minuti - dati considerati freschi per 5 min
      gcTime: 10 * 60 * 1000, // 10 minuti - cache garbage collection
      refetchOnWindowFocus: false, // Non refetch automatico al focus (ottimizzazione network)
      retry: 1, // Solo 1 retry in caso di errore
    },
  },
})

