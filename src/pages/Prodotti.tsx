import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Bookmark, BookmarkCheck, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProductTypeSelect } from '@/components/ui/select-product-type'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select-product-type'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts'
import { useQueryClient } from '@tanstack/react-query'
import { useProductTypes } from '@/hooks/useProductTypes'
import { Product, PRODUCT_TYPE_COLORS, db } from '@/db'
import { useToast } from '@/hooks/use-toast'

type SortField = 'id' | 'strain' | 'tipo' | 'price_per_gram' | 'active' | null
type SortDirection = 'asc' | 'desc' | null

// Helper function per ottenere le classi CSS delle card basate sul colore del tipo prodotto
function getCardColorClasses(color: string | undefined): string {
  if (!color) return ''
  
  const colorMap: Record<string, { bg: string; border: string }> = {
    blue: { bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-l-4 border-blue-500' },
    green: { bg: 'bg-green-50/50 dark:bg-green-950/20', border: 'border-l-4 border-green-500' },
    amber: { bg: 'bg-amber-50/50 dark:bg-amber-950/20', border: 'border-l-4 border-amber-500' },
    red: { bg: 'bg-red-50/50 dark:bg-red-950/20', border: 'border-l-4 border-red-500' },
    purple: { bg: 'bg-purple-50/50 dark:bg-purple-950/20', border: 'border-l-4 border-purple-500' },
  }
  
  return colorMap[color] ? `${colorMap[color].bg} ${colorMap[color].border}` : ''
}

// Componente per il contenuto dettagliato del prodotto
function ProductDetailsContent({ product, typeInfo }: { product: Product; typeInfo: { name: string; color: { bg: string; text: string } | null } }) {
  const [stockData, setStockData] = useState<{ total: number; byWarehouse: Array<{ warehouse: string; quantity: number; state?: string; cut?: string }> }>({ total: 0, byWarehouse: [] })
  const [transactionsData, setTransactionsData] = useState<{ total: number; lastTransaction?: { date: Date; type: string; quantity: number } }>({ total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDetails() {
      setLoading(true)
      try {
        // Carica stock per questo prodotto
        const stock = await db.stock.where('product_id').equals(product.id).toArray()
        const warehouses = await db.warehouses.toArray()
        const warehouseMap = new Map(warehouses.map(w => [w.id, w.name]))
        
        const byWarehouse = stock.map(s => ({
          warehouse: warehouseMap.get(s.warehouse_id) || `Magazzino ${s.warehouse_id}`,
          quantity: s.quantity,
          state: s.state,
          cut: s.cut,
        }))
        
        const total = stock.reduce((sum, s) => sum + s.quantity, 0)

        // Carica transazioni per questo prodotto
        const transactions = await db.transactions.where('product_id').equals(product.id).toArray()
        const transactionTypes = await db.transactionTypes.toArray()
        const typeMap = new Map(transactionTypes.map(t => [t.id, t.name]))
        
        const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const lastTransaction = sortedTransactions[0] ? {
          date: new Date(sortedTransactions[0].date),
          type: typeMap.get(sortedTransactions[0].type_id) || 'Sconosciuto',
          quantity: sortedTransactions[0].quantity || 0,
        } : undefined

        setStockData({ total, byWarehouse })
        setTransactionsData({ total: transactions.length, lastTransaction })
      } catch (error) {
        console.error('Errore nel caricamento dettagli:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (product.id) {
      loadDetails()
    }
  }, [product.id])

  const totalValue = product.price_per_gram && stockData.total ? (stockData.total * product.price_per_gram).toFixed(2) : null

  return (
    <div className="space-y-6 py-4">
      {/* Statistiche principali */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Stock Totale</Label>
          <p className="text-2xl font-bold mt-1">{loading ? '...' : `${stockData.total}g`}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Valore Stock</Label>
          <p className="text-2xl font-bold mt-1">
            {loading ? '...' : totalValue ? `€${totalValue}` : '-'}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Transazioni</Label>
          <p className="text-2xl font-bold mt-1">{loading ? '...' : transactionsData.total}</p>
        </div>
      </div>

      {/* Stock per magazzino */}
      {!loading && stockData.byWarehouse.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Stock per Magazzino</Label>
          <div className="space-y-2">
            {stockData.byWarehouse.map((item, idx) => (
              <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.warehouse}</p>
                  <div className="flex gap-2 mt-1">
                    {item.state && (
                      <span className="text-xs text-muted-foreground">Stato: {item.state}</span>
                    )}
                    {item.cut && (
                      <span className="text-xs text-muted-foreground">Taglio: {item.cut}</span>
                    )}
                  </div>
                </div>
                <p className="text-lg font-semibold">{item.quantity}g</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ultima transazione */}
      {!loading && transactionsData.lastTransaction && (
        <div className="p-4 border rounded-lg">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Ultima Transazione</Label>
          <div className="space-y-1">
            <p className="font-medium">{transactionsData.lastTransaction.type}</p>
            <p className="text-sm text-muted-foreground">
              {transactionsData.lastTransaction.quantity}g - {transactionsData.lastTransaction.date.toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      )}

      {/* Informazioni base (solo se necessario) */}
      <div className="pt-4 border-t">
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Informazioni Base</Label>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tipo:</span>{' '}
            {typeInfo.color ? (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ml-1 ${typeInfo.color.bg} ${typeInfo.color.text}`}>
                {typeInfo.name}
              </span>
            ) : (
              <span className="ml-1">{typeInfo.name}</span>
            )}
          </div>
          {product.price_per_gram && (
            <div>
              <span className="text-muted-foreground">Prezzo:</span>{' '}
              <span className="font-medium">€{product.price_per_gram.toFixed(2)}/g</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Prodotti() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    tipo_id: 0,
    strain: '',
    note: '',
    active: true,
    price_per_gram: undefined,
  })
  
  // Filtri avanzati
  const [filterTipo, setFilterTipo] = useState<number | 'all'>('all')
  const [filterStato, setFilterStato] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterPriceMin, setFilterPriceMin] = useState<string>('')
  const [filterPriceMax, setFilterPriceMax] = useState<string>('')
  
  // Ordinamento
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  
  // AlertDialog states
  const [confirmToggleDialog, setConfirmToggleDialog] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null })
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; productId: string | null }>({ open: false, productId: null })
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null })

  // Validazione form
  const [formErrors, setFormErrors] = useState<{ strain?: string; tipo_id?: string; price_per_gram?: string }>({})
  
  // Dimensioni pagina
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem('prodotti-page-size')
    return saved ? parseInt(saved) : 10
  })
  
  // Filtri salvati
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: any }>>(() => {
    const saved = localStorage.getItem('prodotti-saved-filters')
    return saved ? JSON.parse(saved) : []
  })
  const { data, isLoading, error } = useProducts(page, pageSize)
  const { data: productTypes } = useProductTypes()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Debounce ricerca (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(1) // Reset pagina quando cambia ricerca
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset pagina quando cambiano filtri
  useEffect(() => {
    setPage(1)
  }, [filterTipo, filterStato, filterPriceMin, filterPriceMax])

  // Salva dimensione pagina
  useEffect(() => {
    localStorage.setItem('prodotti-page-size', pageSize.toString())
  }, [pageSize])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F o Cmd+F per focus ricerca
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Cerca"]') as HTMLInputElement
        searchInput?.focus()
      }
      // Ctrl+N o Cmd+N per nuovo prodotto
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        if (!isDialogOpen) {
          handleOpenDialog()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen])

  // Validazione form in tempo reale
  const validateForm = () => {
    const errors: { strain?: string; tipo_id?: string; price_per_gram?: string } = {}
    
    if (!formData.strain.trim()) {
      errors.strain = 'Il nome strain è obbligatorio'
    }
    
    if (!formData.tipo_id || formData.tipo_id === 0) {
      errors.tipo_id = 'Seleziona un tipo prodotto'
    }
    
    if (formData.price_per_gram !== undefined && formData.price_per_gram !== null) {
      if (formData.price_per_gram < 0) {
        errors.price_per_gram = 'Il prezzo non può essere negativo'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validazione in tempo reale
  useEffect(() => {
    if (isDialogOpen) {
      validateForm()
    }
  }, [formData, isDialogOpen])

  // Funzione helper per ottenere informazioni tipo prodotto
  const getProductTypeInfo = (tipoId: number) => {
    const tipo = productTypes?.find((t) => t.id === tipoId)
    if (!tipo) return { name: 'N/A', color: null }
    const colorInfo = tipo.color ? PRODUCT_TYPE_COLORS[tipo.color] : null
    return {
      name: tipo.name,
      color: colorInfo,
    }
  }

  // Filtraggio e ordinamento prodotti
  const filteredAndSortedProducts = useMemo(() => {
    let products = data?.products || []
    
    // Filtro ricerca
    if (debouncedSearchTerm.trim()) {
      const search = debouncedSearchTerm.toLowerCase()
      products = products.filter(
        (product) =>
          product.strain.toLowerCase().includes(search) ||
          product.id.toLowerCase().includes(search) ||
          (product.note && product.note.toLowerCase().includes(search))
      )
    }
    
    // Filtro tipo
    if (filterTipo !== 'all') {
      products = products.filter((p) => p.tipo_id === filterTipo)
    }
    
    // Filtro stato
    if (filterStato === 'active') {
      products = products.filter((p) => p.active !== false)
    } else if (filterStato === 'inactive') {
      products = products.filter((p) => p.active === false)
    }
    
    // Filtro prezzo
    if (filterPriceMin) {
      const min = parseFloat(filterPriceMin)
      if (!isNaN(min)) {
        products = products.filter(
          (p) => p.price_per_gram !== undefined && p.price_per_gram !== null && p.price_per_gram >= min
        )
      }
    }
    if (filterPriceMax) {
      const max = parseFloat(filterPriceMax)
      if (!isNaN(max)) {
        products = products.filter(
          (p) => p.price_per_gram !== undefined && p.price_per_gram !== null && p.price_per_gram <= max
        )
      }
    }
    
    // Ordinamento
    if (sortField && sortDirection) {
      products = [...products].sort((a, b) => {
        let aVal: any
        let bVal: any
        
        switch (sortField) {
          case 'id':
            aVal = a.id
            bVal = b.id
            break
          case 'strain':
            aVal = a.strain.toLowerCase()
            bVal = b.strain.toLowerCase()
            break
          case 'tipo':
            aVal = getProductTypeInfo(a.tipo_id).name
            bVal = getProductTypeInfo(b.tipo_id).name
            break
          case 'price_per_gram':
            aVal = a.price_per_gram ?? 0
            bVal = b.price_per_gram ?? 0
            break
          case 'active':
            aVal = a.active ? 1 : 0
            bVal = b.active ? 1 : 0
            break
          default:
            return 0
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return products
  }, [data?.products, debouncedSearchTerm, filterTipo, filterStato, filterPriceMin, filterPriceMax, sortField, sortDirection, productTypes])

  // Paginazione
  const hasFilters = debouncedSearchTerm.trim() || filterTipo !== 'all' || filterStato !== 'all' || filterPriceMin || filterPriceMax
  const paginatedProducts = hasFilters
    ? filteredAndSortedProducts.slice((page - 1) * pageSize, page * pageSize)
    : data?.paginatedProducts || []
  
  const displayProducts = hasFilters ? paginatedProducts : filteredAndSortedProducts.slice((page - 1) * pageSize, page * pageSize)
  const totalFiltered = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalFiltered / pageSize)

  // Statistiche
  const stats = useMemo(() => {
    const all = data?.products || []
    const statsByType = productTypes?.map((type) => {
      const count = all.filter((p) => p.tipo_id === type.id).length
      return {
        type,
        count,
        colorInfo: type.color ? PRODUCT_TYPE_COLORS[type.color] : null,
      }
    }) || []
    
    return {
      total: all.length,
      byType: statsByType,
    }
  }, [data?.products, productTypes])

  // Gestione ordinamento colonne
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    if (sortDirection === 'asc') return <ArrowUp className="ml-1 h-3 w-3" />
    return <ArrowDown className="ml-1 h-3 w-3" />
  }

  const handleToggleActive = (product: Product) => {
    const newActiveState = !product.active
    
    // Conferma se si sta disattivando
    if (!newActiveState) {
      setConfirmToggleDialog({ open: true, product })
      return
    }
    
    // Attiva direttamente senza conferma
    performToggleActive(product, newActiveState)
  }

  const performToggleActive = async (product: Product, newActiveState: boolean) => {
    try {
      await updateMutation.mutateAsync({
        ...product,
        active: newActiveState,
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Stato aggiornato',
        description: `Prodotto ${newActiveState ? 'attivato' : 'disattivato'} con successo`,
        variant: 'success',
      })
      setConfirmToggleDialog({ open: false, product: null })
    } catch (error) {
      console.error('Error toggling product active:', error)
      toast({
        title: 'Errore',
        description: 'Errore nell\'aggiornamento dello stato del prodotto',
        variant: 'destructive',
      })
    }
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        tipo_id: product.tipo_id,
        strain: product.strain,
        note: product.note || '',
        active: product.active !== false,
        price_per_gram: product.price_per_gram,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        tipo_id: 0,
        strain: '',
        note: '',
        active: true,
        price_per_gram: undefined,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    setFormErrors({})
    setFormData({
      tipo_id: 0,
      strain: '',
      note: '',
      active: true,
      price_per_gram: undefined,
    })
  }

  // Gestione filtri salvati
  const saveCurrentFilters = () => {
    const filterName = prompt('Nome per questo filtro:')
    if (!filterName) return
    
    const newFilter = {
      name: filterName,
      filters: {
        searchTerm,
        filterTipo,
        filterStato,
        filterPriceMin,
        filterPriceMax,
        sortField,
        sortDirection,
      }
    }
    
    const updated = [...savedFilters, newFilter]
    setSavedFilters(updated)
    localStorage.setItem('prodotti-saved-filters', JSON.stringify(updated))
    toast({
      title: 'Filtro salvato',
      description: `Filtro "${filterName}" salvato con successo`,
      variant: 'success',
    })
  }

  const loadSavedFilter = (filter: any) => {
    setSearchTerm(filter.filters.searchTerm || '')
    setFilterTipo(filter.filters.filterTipo || 'all')
    setFilterStato(filter.filters.filterStato || 'all')
    setFilterPriceMin(filter.filters.filterPriceMin || '')
    setFilterPriceMax(filter.filters.filterPriceMax || '')
    setSortField(filter.filters.sortField || null)
    setSortDirection(filter.filters.sortDirection || null)
    setPage(1)
    toast({
      title: 'Filtro caricato',
      description: `Filtro "${filter.name}" caricato`,
      variant: 'success',
    })
  }

  const deleteSavedFilter = (index: number) => {
    const updated = savedFilters.filter((_, i) => i !== index)
    setSavedFilters(updated)
    localStorage.setItem('prodotti-saved-filters', JSON.stringify(updated))
    toast({
      title: 'Filtro eliminato',
      description: 'Filtro salvato eliminato',
      variant: 'success',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Errore di validazione',
        description: 'Controlla i campi evidenziati',
        variant: 'destructive',
      })
      return
    }
    
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({
          ...editingProduct,
          ...formData,
        })
        toast({
          title: 'Prodotto aggiornato',
          description: 'Le modifiche sono state salvate con successo',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Prodotto creato',
          description: 'Il nuovo prodotto è stato aggiunto con successo',
          variant: 'success',
        })
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Errore',
        description: 'Errore nel salvataggio del prodotto',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: string) => {
    setConfirmDeleteDialog({ open: true, productId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.productId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.productId)
      toast({
        title: 'Prodotto eliminato',
        description: 'Il prodotto è stato eliminato con successo',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, productId: null })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Errore',
        description: 'Errore nell\'eliminazione del prodotto',
        variant: 'destructive',
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setFilterTipo('all')
    setFilterStato('all')
    setFilterPriceMin('')
    setFilterPriceMax('')
    setSortField(null)
    setSortDirection(null)
    setPage(1)
  }

  const hasActiveFilters = filterTipo !== 'all' || filterStato !== 'all' || filterPriceMin || filterPriceMax || debouncedSearchTerm.trim()

  if (productTypes && productTypes.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Devi prima creare almeno un tipo prodotto.
              </p>
              <p className="text-sm text-muted-foreground">
                Vai in Impostazioni per creare i tipi prodotto.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Statistiche */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `1.5fr repeat(${stats.byType.length}, 1fr)` }}>
          <Card className="bg-muted/50 dark:bg-muted/30 border-l-[6px] border-muted-foreground/60 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">Totale Prodotti</p>
              </div>
            </CardContent>
          </Card>
          {stats.byType.map(({ type, count, colorInfo }) => (
            <Card key={type.id} className={getCardColorClasses(type.color)}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                    {colorInfo && (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                        {type.name}
                      </span>
                    )}
                    {!colorInfo && <span>{type.name}</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista Prodotti</CardTitle>
                <CardDescription>
                  {hasActiveFilters
                    ? `${totalFiltered} risultati${totalFiltered !== stats.total ? ` (${stats.total} totali)` : ''}`
                    : `${stats.total} prodotti totali`}
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo prodotto">
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Prodotto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Ricerca e Filtri */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per ID, strain o note..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Cerca prodotti"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <Select value={filterTipo === 'all' ? 'all' : filterTipo.toString()} onValueChange={(v) => setFilterTipo(v === 'all' ? 'all' : parseInt(v))}>
                  <SelectTrigger aria-label="Filtra per tipo prodotto">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i tipi</SelectItem>
                    {productTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id!.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStato} onValueChange={(v) => setFilterStato(v as 'all' | 'active' | 'inactive')}>
                  <SelectTrigger aria-label="Filtra per stato">
                    <SelectValue placeholder="Stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti</SelectItem>
                    <SelectItem value="active">Attivi</SelectItem>
                    <SelectItem value="inactive">Inattivi</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Prezzo min (€/g)"
                  value={filterPriceMin}
                  onChange={(e) => setFilterPriceMin(e.target.value)}
                  aria-label="Prezzo minimo"
                />
                
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Prezzo max (€/g)"
                  value={filterPriceMax}
                  onChange={(e) => setFilterPriceMax(e.target.value)}
                  aria-label="Prezzo massimo"
                />
              </div>
              
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Rimuovi filtri
                  </Button>
                )}
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={saveCurrentFilters}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Salva filtri
                  </Button>
                )}
                {savedFilters.length > 0 && (
                  <Select value="" onValueChange={(v) => {
                    if (v === '') return
                    const filter = savedFilters[parseInt(v)]
                    if (filter) loadSavedFilter(filter)
                  }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtri salvati" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedFilters.map((filter, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {filter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Caricamento...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Errore nel caricamento dei prodotti
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  {hasActiveFilters ? 'Nessun prodotto trovato' : 'Nessun prodotto ancora'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? 'Prova a modificare i filtri di ricerca o rimuoverli per vedere tutti i prodotti.'
                    : 'Inizia creando il tuo primo prodotto usando il pulsante "Nuovo Prodotto" in alto.'}
                </p>
                {!hasActiveFilters && (
                  <Button onClick={() => handleOpenDialog()} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Crea primo prodotto
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">
                          <button
                            onClick={() => handleSort('id')}
                            className="flex items-center justify-center w-full hover:text-foreground"
                            aria-label="Ordina per ID"
                          >
                            ID {getSortIcon('id')}
                          </button>
                        </TableHead>
                        <TableHead className="text-center">
                          <button
                            onClick={() => handleSort('tipo')}
                            className="flex items-center justify-center w-full hover:text-foreground"
                            aria-label="Ordina per Tipo"
                          >
                            Tipo {getSortIcon('tipo')}
                          </button>
                        </TableHead>
                        <TableHead className="text-center">
                          <button
                            onClick={() => handleSort('strain')}
                            className="flex items-center justify-center w-full hover:text-foreground"
                            aria-label="Ordina per Strain"
                          >
                            Strain {getSortIcon('strain')}
                          </button>
                        </TableHead>
                        <TableHead className="text-center">
                          <button
                            onClick={() => handleSort('price_per_gram')}
                            className="flex items-center justify-center w-full hover:text-foreground"
                            aria-label="Ordina per Prezzo"
                          >
                            €/g {getSortIcon('price_per_gram')}
                          </button>
                        </TableHead>
                        <TableHead className="text-center">Note</TableHead>
                        <TableHead className="text-center">
                          <button
                            onClick={() => handleSort('active')}
                            className="flex items-center justify-center w-full hover:text-foreground"
                            aria-label="Ordina per Stato"
                          >
                            Stato {getSortIcon('active')}
                          </button>
                        </TableHead>
                        <TableHead className="text-center">Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="text-center align-middle font-mono font-medium">
                            {product.id}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            {(() => {
                              const typeInfo = getProductTypeInfo(product.tipo_id)
                              if (typeInfo.color) {
                                return (
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.color.bg} ${typeInfo.color.text}`}>
                                    {typeInfo.name}
                                  </span>
                                )
                              }
                              return typeInfo.name
                            })()}
                          </TableCell>
                          <TableCell className="text-center align-middle font-medium">
                            <button
                              onClick={() => setDetailsDialog({ open: true, product })}
                              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
                              aria-label={`Visualizza dettagli prodotto ${product.strain}`}
                            >
                              {product.strain}
                            </button>
                          </TableCell>
                          <TableCell className="text-center align-middle font-medium">
                            {product.price_per_gram !== undefined && product.price_per_gram !== null
                              ? `€${product.price_per_gram.toFixed(2)}`
                              : '-'}
                          </TableCell>
                          <TableCell className="text-center align-middle max-w-xs">
                            {product.note ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="truncate cursor-help">
                                    {product.note}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{product.note}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            <div className="flex justify-center">
                              <Switch
                                checked={product.active !== false}
                                onCheckedChange={() => handleToggleActive(product)}
                                disabled={updateMutation.isPending}
                                aria-label={`${product.active ? 'Disattiva' : 'Attiva'} prodotto ${product.strain}`}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(product)}
                                aria-label={`Modifica prodotto ${product.strain}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                                className="text-destructive hover:text-destructive"
                                aria-label={`Elimina prodotto ${product.strain}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Select value={pageSize.toString()} onValueChange={(v) => {
                    setPageSize(parseInt(v))
                    setPage(1)
                  }}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per pagina</SelectItem>
                      <SelectItem value="25">25 per pagina</SelectItem>
                      <SelectItem value="50">50 per pagina</SelectItem>
                      <SelectItem value="100">100 per pagina</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const start = (page - 1) * pageSize + 1
                        const end = Math.min(page * pageSize, totalFiltered)
                        if (totalFiltered === 0) {
                          return 'Nessun record'
                        }
                        if (start === 1 && end === totalFiltered) {
                          return `Visualizzando tutti i ${totalFiltered} record`
                        }
                        return `Visualizzando ${start}-${end} di ${totalFiltered}`
                      })()}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          aria-label="Pagina precedente"
                        >
                          Precedente
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          aria-label="Pagina successiva"
                        >
                          Successiva
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? 'Modifica le informazioni del prodotto'
                    : 'Aggiungi un nuovo prodotto al sistema. L\'ID verrà generato automaticamente.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {editingProduct && (
                  <div className="grid gap-2">
                    <Label htmlFor="id">ID</Label>
                    <Input
                      id="id"
                      value={editingProduct.id}
                      disabled
                      className="font-mono"
                      aria-label="ID prodotto"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="strain">
                    Strain <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="strain"
                    value={formData.strain}
                    onChange={(e) =>
                      setFormData({ ...formData, strain: e.target.value })
                    }
                    required
                    placeholder="Nome/Strain del prodotto"
                    aria-label="Nome strain prodotto"
                    className={formErrors.strain ? 'border-destructive' : ''}
                  />
                  {formErrors.strain && (
                    <p className="text-sm text-destructive">{formErrors.strain}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo_id">
                      Tipo <span className="text-destructive">*</span>
                    </Label>
                    <div className={formErrors.tipo_id ? 'border border-destructive rounded-md' : ''}>
                      <ProductTypeSelect
                        id="tipo_id"
                        value={formData.tipo_id ? formData.tipo_id.toString() : ''}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            tipo_id: parseInt(value),
                          })
                        }
                        productTypes={productTypes || []}
                        required
                      />
                    </div>
                    {formErrors.tipo_id && (
                      <p className="text-sm text-destructive">{formErrors.tipo_id}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price_per_gram">Costo per grammo (€/g)</Label>
                    <Input
                      id="price_per_gram"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_gram !== undefined && formData.price_per_gram !== null ? formData.price_per_gram : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price_per_gram: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="0.00"
                      aria-label="Prezzo per grammo"
                      className={formErrors.price_per_gram ? 'border-destructive' : ''}
                    />
                    {formErrors.price_per_gram && (
                      <p className="text-sm text-destructive">{formErrors.price_per_gram}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Costo fisso quando acquisti merce dal magazzino Driplug
                </p>
                <div className="grid gap-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    rows={3}
                    placeholder="Note aggiuntive sul prodotto"
                    aria-label="Note prodotto"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? 'Salva Modifiche' : 'Crea Prodotto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* AlertDialog per conferma disattivazione */}
        <AlertDialog open={confirmToggleDialog.open} onOpenChange={(open) => setConfirmToggleDialog({ open, product: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disattiva prodotto</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler disattivare questo prodotto? Non sarà più visibile nelle selezioni future.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={() => confirmToggleDialog.product && performToggleActive(confirmToggleDialog.product, false)}>
                Disattiva
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog Dettagli Prodotto */}
        <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, product: null })}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dettagli Prodotto</DialogTitle>
              <DialogDescription>
                Informazioni dettagliate e statistiche del prodotto
              </DialogDescription>
            </DialogHeader>
            {detailsDialog.product && <ProductDetailsContent product={detailsDialog.product} typeInfo={getProductTypeInfo(detailsDialog.product.tipo_id)} />}
            <DialogFooter>
              <Button onClick={() => setDetailsDialog({ open: false, product: null })}>
                Chiudi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AlertDialog per conferma eliminazione */}
        <AlertDialog open={confirmDeleteDialog.open} onOpenChange={(open) => setConfirmDeleteDialog({ open, productId: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Elimina prodotto</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler eliminare questo prodotto? Questa azione non può essere annullata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={performDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
