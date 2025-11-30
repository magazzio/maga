import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ProductTypeSelect } from '@/components/ui/select-product-type'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, Package, Warehouse as WarehouseIcon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { useProductTypes } from '@/hooks/useProductTypes'
import { useWarehouses } from '@/hooks/useWarehouses'
import { useEntities } from '@/hooks/useEntities'
import { useStockByWarehouseAndProduct, useStockByEntityAndProduct } from '@/hooks/useStock'
import { Product, PRODUCT_TYPE_COLORS } from '@/db'

export default function Prodotti() {
  const { data: products, isLoading } = useProducts()
  const { data: productTypes } = useProductTypes()
  const { data: entities } = useEntities()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  
  // Filtri
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTypeId, setFilterTypeId] = useState<number | null>(null)
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  
  // Ordinamento
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    tipo_id: 0,
    strain: '',
    note: '',
    active: true,
    price_per_gram: undefined,
  })

  // Filtra e ordina prodotti
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return []

    let filtered = products.filter(product => {
      // Filtro ricerca
      if (searchTerm && !product.strain.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtro tipo
      if (filterTypeId && product.tipo_id !== filterTypeId) {
        return false
      }

      // Filtro attivo/inattivo
      if (filterActive === 'active' && !product.active) {
        return false
      }
      if (filterActive === 'inactive' && product.active) {
        return false
      }

      return true
    })

    // Ordinamento
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sortColumn) {
          case 'id':
            aValue = a.id
            bValue = b.id
            break
          case 'strain':
            aValue = a.strain.toLowerCase()
            bValue = b.strain.toLowerCase()
            break
          case 'tipo':
            aValue = a.tipo_id
            bValue = b.tipo_id
            break
          case 'price':
            aValue = a.price_per_gram || 0
            bValue = b.price_per_gram || 0
            break
          default:
            return 0
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [products, searchTerm, filterTypeId, filterActive, sortColumn, sortDirection])

  // Paginazione
  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  // Reset pagina quando cambiano i filtri o ordinamento
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterTypeId, filterActive, sortColumn, sortDirection])

  // Reset pagina quando cambiano i dati
  useEffect(() => {
    if (filteredAndSortedProducts && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [filteredAndSortedProducts, currentPage, totalPages])

  // Funzione per gestire click su header colonna
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      // Nuova colonna: inizia con asc
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        tipo_id: product.tipo_id,
        strain: product.strain,
        note: product.note || '',
        active: product.active, // Manteniamo lo stato attuale in modifica
        price_per_gram: product.price_per_gram,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        tipo_id: productTypes?.[0]?.id || 0,
        strain: '',
        note: '',
        active: true, // Default attivo per nuovi prodotti
        price_per_gram: undefined,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingProduct(null)
    setFormData({
      tipo_id: productTypes?.[0]?.id || 0,
      strain: '',
      note: '',
      active: true, // Default attivo
      price_per_gram: undefined,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct?.id) {
      updateMutation.mutate({ ...editingProduct, ...formData })
    } else {
      createMutation.mutate(formData)
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
  }

  const handleToggleActive = (product: Product) => {
    updateMutation.mutate({ ...product, active: !product.active })
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setDetailDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prodotti</h2>
          <p className="text-muted-foreground">Gestisci i prodotti e visualizza lo stock</p>
        </div>
        <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo prodotto">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Nuovo Prodotto
        </Button>
      </div>

      {/* Filtri e Ricerca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Cerca per ID o strain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Cerca prodotti"
            autoComplete="off"
          />
        </div>
        <Select
          value={filterTypeId?.toString() || 'all'}
          onValueChange={(value) => setFilterTypeId(value === 'all' ? null : parseInt(value))}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
            <SelectValue placeholder="Tutti i tipi" />
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
        <Select
          value={filterActive}
          onValueChange={(value) => setFilterActive(value as 'all' | 'active' | 'inactive')}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            <SelectItem value="active">Solo attivi</SelectItem>
            <SelectItem value="inactive">Solo inattivi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center align-middle w-[9%]">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center justify-center gap-1 hover:text-foreground transition-colors mx-auto"
                  aria-label="Ordina per ID"
                >
                  ID
                  {sortColumn === 'id' ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-center align-middle w-[13%]">
                <button
                  onClick={() => handleSort('tipo')}
                  className="flex items-center justify-center gap-1 hover:text-foreground transition-colors mx-auto"
                  aria-label="Ordina per Tipo"
                >
                  Tipo
                  {sortColumn === 'tipo' ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-center align-middle w-[22%]">
                <button
                  onClick={() => handleSort('strain')}
                  className="flex items-center justify-center gap-1 hover:text-foreground transition-colors mx-auto"
                  aria-label="Ordina per Strain"
                >
                  Strain
                  {sortColumn === 'strain' ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </TableHead>
              {entities && entities.length > 0 && entities.map((entity) => (
                <TableHead key={entity.id} className="text-center align-middle">
                  Stock {entity.name}
                </TableHead>
              ))}
              <TableHead className="text-center align-middle w-[11%]">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center justify-center gap-1 hover:text-foreground transition-colors mx-auto"
                  aria-label="Ordina per Prezzo"
                >
                  Prezzo/g
                  {sortColumn === 'price' ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-center align-middle w-[8%]">Attivo</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const productType = productTypes?.find(t => t.id === product.tipo_id)
                return (
                  <ProductRow
                    key={product.id}
                    product={product}
                    productType={productType}
                    entities={entities || []}
                    onEdit={() => handleOpenDialog(product)}
                    onDelete={() => setDeleteId(product.id)}
                    onViewDetails={() => handleViewDetails(product)}
                    onToggleActive={() => handleToggleActive(product)}
                  />
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6 + (entities?.length || 0)} className="text-center text-muted-foreground py-8">
                  {searchTerm || filterTypeId || filterActive !== 'all'
                    ? 'Nessun prodotto corrisponde ai filtri selezionati'
                    : 'Nessun prodotto. Crea il primo prodotto.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => {
            const productType = productTypes?.find(t => t.id === product.tipo_id)
            return (
              <ProductCard
                key={product.id}
                product={product}
                productType={productType}
                entities={entities || []}
                onEdit={() => handleOpenDialog(product)}
                onDelete={() => setDeleteId(product.id)}
                onViewDetails={() => handleViewDetails(product)}
                onToggleActive={() => handleToggleActive(product)}
              />
            )
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {searchTerm || filterTypeId || filterActive !== 'all'
              ? 'Nessun prodotto corrisponde ai filtri selezionati'
              : 'Nessun prodotto. Crea il primo prodotto.'}
          </div>
        )}
      </div>

      {/* Paginazione - Mostra solo se ci sono più elementi della pageSize */}
      {filteredAndSortedProducts.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} di {filteredAndSortedProducts.length} prodotti
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Pagina precedente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    aria-label={`Vai alla pagina ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Pagina successiva"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialog Creazione/Modifica */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
            <DialogTitle>
              {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Modifica i dettagli del prodotto'
                : 'Crea un nuovo prodotto. L\'ID verrà generato automaticamente.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="px-6 space-y-5 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-semibold">
                  Tipo Prodotto <span className="text-destructive">*</span>
                </Label>
                <ProductTypeSelect
                  value={formData.tipo_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, tipo_id: parseInt(value) })}
                  productTypes={productTypes || []}
                  required
                />
                {productTypes && productTypes.length === 0 && (
                  <p className="text-xs text-amber-600">
                    Nessun tipo prodotto disponibile. Crea prima un tipo prodotto in Impostazioni.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="strain" className="text-sm font-semibold">
                  Strain / Nome Prodotto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="strain"
                  value={formData.strain}
                  onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
                  placeholder="Es. Blue Dream, OG Kush..."
                  required
                  autoFocus={!editingProduct}
                  autoComplete="off"
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Nome identificativo del prodotto
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold">
                  Prezzo al grammo <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_gram || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                        setFormData({ ...formData, price_per_gram: value === '' ? undefined : parseFloat(value) })
                      }
                    }}
                    placeholder="0.00"
                    required
                    autoComplete="off"
                    className="text-base pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Prezzo fisso di acquisto da Driplug (€/g)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-semibold">
                  Note <span className="text-muted-foreground font-normal">(opzionale)</span>
                </Label>
                <Textarea
                  id="note"
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Informazioni aggiuntive sul prodotto..."
                  rows={3}
                  autoComplete="off"
                  className="resize-none"
                />
              </div>

              {editingProduct && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota:</strong> Per attivare o disattivare il prodotto, usa il toggle nella tabella principale.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="px-6 py-4 border-t gap-2 sm:gap-0 flex-shrink-0">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit" disabled={!formData.tipo_id || !formData.strain || !formData.price_per_gram}>
                {editingProduct ? 'Salva Modifiche' : 'Crea Prodotto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Dettaglio Prodotto */}
      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          productTypes={productTypes}
        />
      )}

      {/* Dialog Conferma Eliminazione */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare definitivamente questo prodotto? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Componente Riga Prodotto (per calcolare stock)
function ProductRow({ product, productType, entities, onEdit, onDelete, onViewDetails, onToggleActive }: { 
  product: Product
  productType?: any
  entities: any[]
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
  onToggleActive: () => void
}) {
  const colorInfo = productType?.color && productType.color in PRODUCT_TYPE_COLORS 
    ? PRODUCT_TYPE_COLORS[productType.color as keyof typeof PRODUCT_TYPE_COLORS]
    : null

  return (
    <TableRow>
      <TableCell className="font-medium align-middle w-[9%]">{product.id}</TableCell>
      <TableCell className="align-middle w-[13%]">
        {productType && colorInfo ? (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
            {productType.name}
          </span>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell className="align-middle w-[22%]">
        <button
          onClick={onViewDetails}
          className="text-left hover:underline hover:text-primary cursor-pointer focus:outline-none focus:underline focus:text-primary font-medium"
          aria-label={`Visualizza dettagli prodotto ${product.strain}`}
        >
          {product.strain}
        </button>
      </TableCell>
      {entities.map((entity) => (
        <EntityStockCell key={entity.id} entityId={entity.id} productId={product.id} />
      ))}
      <TableCell className="text-center align-middle w-[11%]">
        {product.price_per_gram ? (
          <span className="font-medium">€ {product.price_per_gram.toFixed(2)}</span>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell className="text-center align-middle w-[8%]">
        <div className="flex justify-center">
          <Switch
            checked={product.active}
            onCheckedChange={onToggleActive}
            aria-label={`${product.active ? 'Disattiva' : 'Attiva'} prodotto ${product.strain}`}
          />
        </div>
      </TableCell>
      <TableCell className="text-center align-middle w-[120px]">
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Modifica prodotto ${product.strain}`}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Modifica</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Elimina prodotto ${product.strain}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Componente Cella Stock per Entità
function EntityStockCell({ entityId, productId }: { entityId: number | undefined; productId: string }) {
  const { data: stock = 0, isLoading } = useStockByEntityAndProduct(entityId, productId)

  return (
    <TableCell className="text-center align-middle">
      {isLoading ? (
        <span className="text-muted-foreground text-sm">...</span>
      ) : (
        <span className="font-medium">{stock.toFixed(2)}g</span>
      )}
    </TableCell>
  )
}

// Componente Card Prodotto Mobile
function ProductCard({ product, productType, entities, onEdit, onDelete, onViewDetails, onToggleActive }: { 
  product: Product
  productType?: any
  entities: any[]
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
  onToggleActive: () => void
}) {
  const colorInfo = productType?.color && productType.color in PRODUCT_TYPE_COLORS 
    ? PRODUCT_TYPE_COLORS[productType.color as keyof typeof PRODUCT_TYPE_COLORS]
    : null

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetails}
              className="font-medium hover:underline hover:text-primary cursor-pointer focus:outline-none focus:underline focus:text-primary text-left"
              aria-label={`Visualizza dettagli prodotto ${product.strain}`}
            >
              {product.strain}
            </button>
            <span className="text-sm text-muted-foreground">({product.id})</span>
          </div>
          {productType && colorInfo && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${colorInfo.bg} ${colorInfo.text}`}>
              {productType.name}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label={`Modifica prodotto ${product.strain}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            aria-label={`Elimina prodotto ${product.strain}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">Attivo:</Label>
        <Switch
          checked={product.active}
          onCheckedChange={onToggleActive}
          aria-label={`${product.active ? 'Disattiva' : 'Attiva'} prodotto ${product.strain}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {entities.map((entity) => (
          <EntityStockInCard key={entity.id} entityId={entity.id} entityName={entity.name} productId={product.id} />
        ))}
        {product.price_per_gram && (
          <div>
            <span className="font-medium">Prezzo/g:</span>{' '}
            <span className="font-medium">€{product.price_per_gram.toFixed(2)}</span>
          </div>
        )}
        {!product.active && (
          <div className="col-span-2">
            <span className="text-xs text-amber-600">Prodotto inattivo</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente Stock per Entità in Card Mobile
function EntityStockInCard({ entityId, entityName, productId }: { entityId: number | undefined; entityName: string; productId: string }) {
  const { data: stock = 0, isLoading } = useStockByEntityAndProduct(entityId, productId)

  return (
    <div>
      <span className="font-medium">Stock {entityName}:</span>{' '}
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : (
        <span className="font-medium">{stock.toFixed(2)}g</span>
      )}
    </div>
  )
}

// Componente Dialog Dettaglio Prodotto con Stock per Magazzino
function ProductDetailDialog({ 
  product, 
  open, 
  onOpenChange,
  productTypes 
}: { 
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  productTypes?: any[]
}) {
  const { data: warehouses } = useWarehouses()
  const productType = productTypes?.find(t => t.id === product.tipo_id)
  const colorInfo = productType?.color && productType.color in PRODUCT_TYPE_COLORS 
    ? PRODUCT_TYPE_COLORS[productType.color as keyof typeof PRODUCT_TYPE_COLORS]
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" aria-hidden="true" />
            Dettagli Prodotto
          </DialogTitle>
          <DialogDescription>
            Informazioni complete e stock per magazzino
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Info Prodotto */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">ID</Label>
                <p className="font-medium">{product.id}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Strain</Label>
                <p className="font-medium">{product.strain}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Tipo</Label>
                {productType && colorInfo ? (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                    {productType.name}
                  </span>
                ) : (
                  <p className="text-muted-foreground">-</p>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Prezzo al grammo</Label>
                <p className="font-medium">{product.price_per_gram ? `€ ${product.price_per_gram.toFixed(2)}` : '-'}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Stato</Label>
                <p className={product.active ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                  {product.active ? 'Attivo' : 'Inattivo'}
                </p>
              </div>
            </div>
          </div>

          {/* Stock per Magazzino */}
          {warehouses && warehouses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <WarehouseIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Label className="text-sm font-semibold">Stock per Magazzino</Label>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">Magazzino</TableHead>
                      <TableHead className="text-center w-[40%]">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouses.map((warehouse) => (
                      <WarehouseStockRow
                        key={warehouse.id}
                        warehouse={warehouse}
                        productId={product.id}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente Riga Stock Magazzino nel dettaglio
function WarehouseStockRow({ warehouse, productId }: { warehouse: any; productId: string }) {
  const { data: stock = 0, isLoading } = useStockByWarehouseAndProduct(warehouse.id, productId)

  return (
    <TableRow>
      <TableCell className="font-medium">{warehouse.name}</TableCell>
      <TableCell className="text-center">
        {isLoading ? (
          <span className="text-muted-foreground text-sm">...</span>
        ) : (
          <span className="font-medium">{stock.toFixed(2)}g</span>
        )}
      </TableCell>
    </TableRow>
  )
}
