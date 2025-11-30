import { useState, useEffect, useMemo } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-product-type'
import { Warehouse, Package, TrendingUp, DollarSign, ChevronLeft, ChevronRight, Calendar, ArrowUp, ArrowDown, Search, Leaf } from 'lucide-react'
import { useWarehouses } from '@/hooks/useWarehouses'
import { useWarehouseStock } from '@/hooks/useWarehouseStock'
import { useTransactions } from '@/hooks/useTransactions'
import { useTransactionTypes } from '@/hooks/useTransactionTypes'
import { useProductTypes } from '@/hooks/useProductTypes'
import { useEntities } from '@/hooks/useEntities'
import { Transaction } from '@/db'
import { format } from 'date-fns'

type PeriodFilter = 'all' | 'today' | 'week' | 'month'

export default function Magazzini() {
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses()
  const { data: entities } = useEntities()
  const { data: transactions, isLoading: transactionsLoading } = useTransactions()
  const { data: transactionTypes } = useTransactionTypes()
  const { data: productTypes } = useProductTypes()

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null)
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPage, setProductsPage] = useState(1)
  const [pageSize] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProductType, setFilterProductType] = useState<number | 'all'>('all')

  // Seleziona primo magazzino disponibile al caricamento
  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !selectedWarehouseId) {
      setSelectedWarehouseId(warehouses[0].id!)
    }
  }, [warehouses, selectedWarehouseId])

  // Calcola stock magazzino selezionato
  const { data: warehouseStock, isLoading: stockLoading } = useWarehouseStock(selectedWarehouseId || undefined)

  // Filtra movimenti per magazzino selezionato
  const warehouseTransactions = useMemo(() => {
    if (!transactions || !selectedWarehouseId) return []
    return transactions.filter(t => 
      t.from_warehouse_id === selectedWarehouseId || t.to_warehouse_id === selectedWarehouseId
    )
  }, [transactions, selectedWarehouseId])

  // Filtra movimenti per periodo
  const filteredTransactions = useMemo(() => {
    if (!warehouseTransactions) return []
    
    let filtered = [...warehouseTransactions]
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (periodFilter) {
      case 'today':
        filtered = filtered.filter(t => {
          const tDate = new Date(t.date)
          return tDate >= today
        })
        break
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        filtered = filtered.filter(t => new Date(t.date) >= monthAgo)
        break
      case 'all':
      default:
        break
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [warehouseTransactions, periodFilter])

  // Filtra prodotti per ricerca e tipo
  const filteredProducts = useMemo(() => {
    if (!warehouseStock?.products) return []
    
    let filtered = warehouseStock.products.filter(product => {
      // Filtro ricerca
      if (searchTerm && !product.product.strain.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Filtro tipo prodotto
      if (filterProductType !== 'all' && product.product.tipo_id !== filterProductType) {
        return false
      }
      
      return true
    })
    
    return filtered
  }, [warehouseStock?.products, searchTerm, filterProductType])

  // Paginazione movimenti
  const totalPages = Math.ceil(filteredTransactions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Paginazione prodotti
  const productsTotalPages = Math.ceil(filteredProducts.length / pageSize)
  const productsStartIndex = (productsPage - 1) * pageSize
  const productsEndIndex = productsStartIndex + pageSize
  const paginatedProducts = filteredProducts.slice(productsStartIndex, productsEndIndex)

  // Reset pagine quando cambiano filtri
  useEffect(() => {
    setCurrentPage(1)
  }, [periodFilter, selectedWarehouseId])

  useEffect(() => {
    setProductsPage(1)
  }, [searchTerm, filterProductType, selectedWarehouseId])

  // Reset pagine quando cambiano i dati
  useEffect(() => {
    if (filteredTransactions && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [filteredTransactions, currentPage, totalPages])

  useEffect(() => {
    if (filteredProducts && productsPage > productsTotalPages && productsTotalPages > 0) {
      setProductsPage(productsTotalPages)
    }
  }, [filteredProducts, productsPage, productsTotalPages])

  const selectedWarehouse = warehouses?.find(w => w.id === selectedWarehouseId)
  const selectedEntity = entities?.find(e => e.id === selectedWarehouse?.entity_id)
  const isDriplugWarehouse = selectedEntity?.name.toLowerCase().includes('driplug')
  const isMeetdripWarehouse = selectedEntity?.name.toLowerCase().includes('meetdrip')

  if (warehousesLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Magazzini</h2>
        <div className="rounded-md border p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Nessun magazzino disponibile. Crea un magazzino nella sezione Impostazioni.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
      <h2 className="text-3xl font-bold tracking-tight">Magazzini</h2>
        <p className="text-muted-foreground">
          Visualizza stock, prodotti e storico movimenti di magazzino
        </p>
      </div>

      {/* Selettore Magazzino */}
      <div className="space-y-2">
        <Label htmlFor="warehouse-select">Magazzino</Label>
        <Select
          value={selectedWarehouseId?.toString() || ''}
          onValueChange={(value) => setSelectedWarehouseId(parseInt(value))}
        >
          <SelectTrigger id="warehouse-select" className="w-full sm:w-[300px]">
            <SelectValue placeholder="Seleziona magazzino" />
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((warehouse) => {
              const entity = entities?.find(e => e.id === warehouse.entity_id)
              return (
                <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                  {warehouse.name} {entity && `(${entity.name})`}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedWarehouseId && (
        <>
          {/* Sezione Card Informative - Personalizzate per entità */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
            isDriplugWarehouse ? 'lg:grid-cols-3' : 'lg:grid-cols-3'
          }`}>
            {/* Stock Totale - PRINCIPALE (sempre visibile) */}
            <div className="rounded-lg border-2 border-primary bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantità Totale</p>
                  <p className={`text-4xl font-bold mt-2 ${
                    stockLoading ? 'text-muted-foreground' : 'text-blue-600'
                  }`}>
                    {stockLoading ? '...' : `${(warehouseStock?.totalStock || 0).toFixed(2)}g`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Stock totale disponibile</p>
                </div>
                <Package className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
            </div>

            {/* Card per Driplug: Quantità Cured */}
            {isDriplugWarehouse && (
              <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                (warehouseStock?.totalCured || 0) > 0 ? 'border-green-300 bg-green-50/70 shadow-sm' : 'border bg-card'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantità Cured</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      stockLoading ? 'text-muted-foreground' : 
                      (warehouseStock?.totalCured || 0) > 0 ? 'text-green-700' : 'text-muted-foreground'
                    }`}>
                      {stockLoading ? '...' : `${(warehouseStock?.totalCured || 0).toFixed(2)}g`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Totale Cured</p>
                  </div>
                  <Leaf className={`h-6 w-6 ${
                    (warehouseStock?.totalCured || 0) > 0 ? 'text-green-600' : 'text-muted-foreground'
                  }`} aria-hidden="true" />
                </div>
              </div>
            )}

            {/* Card per Driplug: Quantità Raw */}
            {isDriplugWarehouse && (
              <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                (warehouseStock?.totalRaw || 0) > 0 ? 'border-amber-300 bg-amber-50/70 shadow-sm' : 'border bg-card'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantità Raw</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      stockLoading ? 'text-muted-foreground' : 
                      (warehouseStock?.totalRaw || 0) > 0 ? 'text-amber-700' : 'text-muted-foreground'
                    }`}>
                      {stockLoading ? '...' : `${(warehouseStock?.totalRaw || 0).toFixed(2)}g`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Totale Raw</p>
                  </div>
                  <Leaf className={`h-6 w-6 ${
                    (warehouseStock?.totalRaw || 0) > 0 ? 'text-amber-600' : 'text-muted-foreground'
                  }`} aria-hidden="true" />
                </div>
              </div>
            )}

            {/* Card per Meetdrip: Prodotti Totali */}
            {isMeetdripWarehouse && (
              <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                (warehouseStock?.activeProducts || 0) > 0 ? 'border-blue-300 bg-blue-50/70 shadow-sm' : 'border bg-card'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prodotti Totali</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      stockLoading ? 'text-muted-foreground' : 
                      (warehouseStock?.activeProducts || 0) > 0 ? 'text-blue-700' : 'text-muted-foreground'
                    }`}>
                      {stockLoading ? '...' : warehouseStock?.activeProducts || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Con stock disponibile</p>
                  </div>
                  <TrendingUp className={`h-6 w-6 ${
                    (warehouseStock?.activeProducts || 0) > 0 ? 'text-blue-600' : 'text-muted-foreground'
                  }`} aria-hidden="true" />
                </div>
              </div>
            )}

            {/* Card per Meetdrip: Valore Stock */}
            {isMeetdripWarehouse && (
              <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                (warehouseStock?.totalValue || 0) > 0 ? 'border-green-300 bg-green-50/70 shadow-sm' : 'border bg-card'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valore Stock</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      stockLoading ? 'text-muted-foreground' : 
                      (warehouseStock?.totalValue || 0) > 0 ? 'text-green-700' : 'text-muted-foreground'
                    }`}>
                      {stockLoading ? '...' : `€${(warehouseStock?.totalValue || 0).toFixed(2)}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(warehouseStock?.totalValue || 0) > 0 ? 'Valore totale' : 'Nessun prezzo'}
                    </p>
                  </div>
                  <DollarSign className={`h-6 w-6 ${
                    (warehouseStock?.totalValue || 0) > 0 ? 'text-green-600' : 'text-muted-foreground'
                  }`} aria-hidden="true" />
                </div>
              </div>
            )}
          </div>

          {/* Sezione Prodotti nel Magazzino */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Prodotti nel Magazzino</h3>
              
              {/* Filtri */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-[200px]">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    placeholder="Cerca prodotto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select
                  value={filterProductType === 'all' ? 'all' : filterProductType.toString()}
                  onValueChange={(value) => setFilterProductType(value === 'all' ? 'all' : parseInt(value))}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Tipo prodotto" />
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
              </div>
            </div>

            {/* Tabella Desktop Prodotti */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center align-middle w-[12%]">ID</TableHead>
                    <TableHead className="align-middle w-[20%]">Prodotto</TableHead>
                    <TableHead className="align-middle w-[15%]">Tipo</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Quantità</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Raw</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Cured</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Valore</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((productStock) => {
                      const productType = productTypes?.find(t => t.id === productStock.product.tipo_id)
                      return (
                        <TableRow key={productStock.product_id}>
                          <TableCell className="text-center align-middle w-[12%] font-medium">
                            {productStock.product_id}
                          </TableCell>
                          <TableCell className="align-middle w-[20%]">
                            {productStock.product.strain}
                          </TableCell>
                          <TableCell className="align-middle w-[15%]">
                            {productType?.name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%] font-semibold">
                            {productStock.quantity.toFixed(2)}g
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%]">
                            {productStock.raw_quantity > 0 ? (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                {productStock.raw_quantity.toFixed(2)}g
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%]">
                            {productStock.cured_quantity > 0 ? (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                {productStock.cured_quantity.toFixed(2)}g
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%]">
                            {productStock.value > 0 ? (
                              <span className="font-semibold text-green-600">
                                €{productStock.value.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {searchTerm || filterProductType !== 'all' 
                          ? 'Nessun prodotto trovato con i filtri selezionati'
                          : 'Nessun prodotto nel magazzino'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Card View Mobile Prodotti */}
            <div className="md:hidden space-y-3">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((productStock) => {
                  const productType = productTypes?.find(t => t.id === productStock.product.tipo_id)
                  return (
                    <div key={productStock.product_id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{productStock.product.strain}</p>
                          <p className="text-sm text-muted-foreground">{productStock.product_id}</p>
                        </div>
                        <p className="text-lg font-semibold text-blue-600">
                          {productStock.quantity.toFixed(2)}g
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tipo:</span>
                          <span>{productType?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Raw:</span>
                          {productStock.raw_quantity > 0 ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              {productStock.raw_quantity.toFixed(2)}g
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Cured:</span>
                          {productStock.cured_quantity > 0 ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              {productStock.cured_quantity.toFixed(2)}g
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                        {productStock.value > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Valore:</span>
                            <span className="font-semibold text-green-600">
                              €{productStock.value.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {searchTerm || filterProductType !== 'all' 
                    ? 'Nessun prodotto trovato con i filtri selezionati'
                    : 'Nessun prodotto nel magazzino'}
                </div>
              )}
            </div>

            {/* Paginazione Prodotti */}
            {filteredProducts.length > pageSize && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-sm text-muted-foreground">
                  Mostrando {productsStartIndex + 1}-{Math.min(productsEndIndex, filteredProducts.length)} di {filteredProducts.length} prodotti
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setProductsPage(p => Math.max(1, p - 1))}
                    disabled={productsPage === 1}
                    aria-label="Pagina precedente"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, productsTotalPages) }, (_, i) => {
                      let pageNum: number
                      if (productsTotalPages <= 5) {
                        pageNum = i + 1
                      } else if (productsPage <= 3) {
                        pageNum = i + 1
                      } else if (productsPage >= productsTotalPages - 2) {
                        pageNum = productsTotalPages - 4 + i
                      } else {
                        pageNum = productsPage - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`px-3 py-1 rounded-md text-sm ${
                            productsPage === pageNum
                              ? 'bg-primary text-primary-foreground'
                              : 'border hover:bg-accent'
                          }`}
                          onClick={() => setProductsPage(pageNum)}
                          aria-label={`Vai alla pagina ${pageNum}`}
                          aria-current={productsPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    className="p-2 rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setProductsPage(p => Math.min(productsTotalPages, p + 1))}
                    disabled={productsPage === productsTotalPages}
                    aria-label="Pagina successiva"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sezione Storico Movimenti */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Storico Movimenti Magazzino</h3>
              
              {/* Filtri Periodo */}
              <div className="flex items-center gap-2">
                <Label htmlFor="period-filter" className="sr-only">Filtro periodo</Label>
                <Select
                  value={periodFilter}
                  onValueChange={(value) => setPeriodFilter(value as PeriodFilter)}
                >
                  <SelectTrigger id="period-filter" className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutto</SelectItem>
                    <SelectItem value="today">Oggi</SelectItem>
                    <SelectItem value="week">Questa settimana</SelectItem>
                    <SelectItem value="month">Questo mese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabella Desktop Movimenti */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center align-middle w-[12%]">Data</TableHead>
                    <TableHead className="align-middle w-[18%]">Tipo</TableHead>
                    <TableHead className="align-middle w-[18%]">Prodotto</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Direzione</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Quantità</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Stato</TableHead>
                    <TableHead className="align-middle w-[calc(16%-120px)]">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => {
                      const type = transactionTypes?.find(t => t.id === transaction.type_id)
                      const isIncoming = transaction.to_warehouse_id === selectedWarehouseId
                      
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-center align-middle w-[12%]">
                            {format(new Date(transaction.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="align-middle w-[18%]">{type?.name || 'N/A'}</TableCell>
                          <TableCell className="align-middle w-[18%]">
                            {transaction.product_id || '-'}
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%]">
                            <div className="flex items-center justify-center gap-1">
                              {isIncoming ? (
                                <>
                                  <ArrowDown className="h-4 w-4 text-green-600" aria-hidden="true" />
                                  <span className="text-green-600 font-medium">Entrata</span>
                                </>
                              ) : (
                                <>
                                  <ArrowUp className="h-4 w-4 text-red-600" aria-hidden="true" />
                                  <span className="text-red-600 font-medium">Uscita</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%] font-medium">
                            {transaction.quantity ? `${transaction.quantity.toFixed(2)}g` : '-'}
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%]">
                            {transaction.product_state ? (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                transaction.product_state === 'raw' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {transaction.product_state === 'raw' ? 'Raw' : 'Cured'}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="align-middle w-[calc(16%-120px)]">
                            {transaction.notes || '-'}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Nessun movimento trovato per questo periodo
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Card View Mobile Movimenti */}
            <div className="md:hidden space-y-3">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => {
                  const type = transactionTypes?.find(t => t.id === transaction.type_id)
                  const isIncoming = transaction.to_warehouse_id === selectedWarehouseId
                  
                  return (
                    <div key={transaction.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span className="font-medium">
                            {format(new Date(transaction.date), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          isIncoming ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isIncoming ? (
                            <ArrowDown className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ArrowUp className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="font-semibold">
                            {transaction.quantity ? `${transaction.quantity.toFixed(2)}g` : '-'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tipo:</span>
                          <span>{type?.name || 'N/A'}</span>
                        </div>
                        {transaction.product_id && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Prodotto:</span>
                            <span>{transaction.product_id}</span>
                          </div>
                        )}
                        {transaction.product_state && (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.product_state === 'raw' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.product_state === 'raw' ? 'Raw' : 'Cured'}
                            </span>
                          </div>
                        )}
                        {transaction.notes && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Note:</span>
                            <span>{transaction.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Nessun movimento trovato per questo periodo
                </div>
              )}
            </div>

            {/* Paginazione Movimenti */}
            {filteredTransactions.length > pageSize && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} di {filteredTransactions.length} movimenti
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Pagina precedente"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
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
                        <button
                          key={pageNum}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === pageNum
                              ? 'bg-primary text-primary-foreground'
                              : 'border hover:bg-accent'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-label={`Vai alla pagina ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    className="p-2 rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Pagina successiva"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
