import { useState, useMemo } from 'react'
import { Package, Warehouse as WarehouseIcon, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useWarehouses } from '@/hooks/useWarehouses'
import { useEntities } from '@/hooks/useEntities'
import { useStockByWarehouse } from '@/hooks/useStock'
import { useProductTypes } from '@/hooks/useProductTypes'
import { PRODUCT_TYPE_COLORS } from '@/db'

export default function Magazzini() {
  const [expandedEntityId, setExpandedEntityId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: warehouses, isLoading } = useWarehouses()
  const { data: entities, isLoading: entitiesLoading } = useEntities()
  const { data: productTypes } = useProductTypes()

  // Crea mappa entity_id -> warehouse
  const entityWarehouseMap = useMemo(() => {
    if (!warehouses || !entities) return new Map()
    const map = new Map<number, typeof warehouses[0]>()
    entities.forEach(entity => {
      if (entity.id) {
        const warehouse = warehouses.find(w => w.entity_id === entity.id)
        if (warehouse) {
          map.set(entity.id, warehouse)
        }
      }
    })
    return map
  }, [warehouses, entities])

  // Carica stock per magazzino espanso
  const expandedWarehouse = expandedEntityId ? entityWarehouseMap.get(expandedEntityId) : null
  const { data: stockData, isLoading: stockLoading } = useStockByWarehouse(expandedWarehouse?.id || undefined)

  // Funzione helper per ottenere info tipo prodotto
  const getProductTypeInfo = (tipoId: number) => {
    const tipo = productTypes?.find((t) => t.id === tipoId)
    if (!tipo) return { name: 'N/A', color: null }
    const colorInfo = tipo.color ? PRODUCT_TYPE_COLORS[tipo.color] : null
    return {
      name: tipo.name,
      color: colorInfo,
    }
  }

  // Calcola statistiche stock per entità
  const entityStockStats = useMemo(() => {
    if (!stockData || !expandedEntityId) return null
    
    const totalProducts = stockData.length
    const totalQuantity = stockData.reduce((sum, item) => sum + item.quantity, 0)
    
    // Calcola valore stimato (se i prodotti hanno price_per_gram)
    const totalValue = stockData.reduce((sum, item) => {
      const price = item.product?.price_per_gram || 0
      return sum + (item.quantity * price)
    }, 0)
    
    // Conta tipi prodotto unici
    const uniqueTypes = new Set(
      stockData
        .map(item => item.product?.tipo_id)
        .filter((id): id is number => id !== undefined)
    ).size
    
    return {
      totalProducts,
      totalQuantity,
      totalValue,
      uniqueTypes,
    }
  }, [stockData, expandedEntityId])

  // Filtra stock per ricerca
  const filteredStockData = useMemo(() => {
    if (!stockData || !searchTerm.trim()) return stockData
    const search = searchTerm.toLowerCase()
    return stockData.filter(item => {
      const productName = item.product?.strain || item.product_id || ''
      const productId = item.product_id || ''
      const typeName = item.product?.tipo_id
        ? getProductTypeInfo(item.product.tipo_id).name
        : ''
      return (
        productName.toLowerCase().includes(search) ||
        productId.toLowerCase().includes(search) ||
        typeName.toLowerCase().includes(search)
      )
    })
  }, [stockData, searchTerm, productTypes])

  // Statistiche da mostrare (dinamiche in base al magazzino selezionato)
  const displayStats = useMemo(() => {
    if (expandedEntityId && entityStockStats) {
      // Statistiche del magazzino selezionato
      return {
        title: expandedWarehouse?.name || 'Magazzino',
        stats: [
          {
            label: 'Prodotti in Stock',
            value: entityStockStats.totalProducts.toString(),
            description: 'Prodotti diversi disponibili',
          },
          {
            label: 'Quantità Totale',
            value: `${entityStockStats.totalQuantity.toLocaleString('it-IT')} g`,
            description: 'Peso totale in grammi',
          },
          {
            label: 'Tipi Prodotto',
            value: entityStockStats.uniqueTypes.toString(),
            description: 'Varietà diverse',
          },
          {
            label: 'Valore Stimato',
            value: entityStockStats.totalValue > 0 
              ? `€ ${entityStockStats.totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : 'N/A',
            description: 'Valore totale stimato',
          },
        ],
      }
    } else {
      // Statistiche globali (quando nessun magazzino è espanso)
      return {
        title: 'Panoramica',
        stats: [
          {
            label: 'Entità Totali',
            value: entities?.length.toString() || '0',
            description: 'Numero di entità',
          },
          {
            label: 'Magazzini Totali',
            value: warehouses?.length.toString() || '0',
            description: 'Numero di magazzini',
          },
        ],
      }
    }
  }, [expandedEntityId, entityStockStats, expandedWarehouse, entities, warehouses])

  const toggleExpand = (entityId: number) => {
    setExpandedEntityId(expandedEntityId === entityId ? null : entityId)
    setSearchTerm('') // Reset ricerca quando si cambia entità
  }

  if (isLoading || entitiesLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Caricamento...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!entities || entities.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Magazzini</h2>
          <p className="text-muted-foreground mt-2">
            Visualizza lo stock disponibile nei magazzini
          </p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <WarehouseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Nessuna entità</p>
              <p className="text-sm mt-1">Crea un'entità in Impostazioni per iniziare</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Magazzini</h2>
        <p className="text-muted-foreground mt-2">
          Visualizza lo stock disponibile nei magazzini per entità
        </p>
      </div>

      {/* Statistiche Dinamiche */}
      {displayStats.stats.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">{displayStats.title}</h3>
          <div className={`grid gap-4 ${displayStats.stats.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {displayStats.stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs font-medium text-foreground mt-1">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Card Entità */}
      <div className="grid gap-6 md:grid-cols-2">
        {entities.map((entity) => {
          const warehouse = entityWarehouseMap.get(entity.id!)
          const isExpanded = expandedEntityId === entity.id
          const isLoadingStock = isExpanded && stockLoading
          const stockStats = isExpanded && entityStockStats

          return (
            <Card 
              key={entity.id} 
              className={`transition-all ${isExpanded ? 'md:col-span-2' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <WarehouseIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{entity.name}</CardTitle>
                      <CardDescription>
                        {warehouse ? warehouse.name : 'Nessun magazzino associato'}
                        {warehouse?.description && ` • ${warehouse.description}`}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => entity.id && toggleExpand(entity.id)}
                    disabled={!warehouse}
                    aria-label={isExpanded ? 'Chiudi dettagli' : 'Mostra dettagli stock'}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Chiudi
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Dettagli
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="space-y-4">
                  {!warehouse ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Nessun magazzino associato</p>
                      <p className="text-sm mt-1">Questa entità non ha un magazzino associato</p>
                    </div>
                  ) : isLoadingStock ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Caricamento stock...
                    </div>
                  ) : stockStats ? (
                    <>
                      {/* Statistiche Stock */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-muted/50">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{stockStats.totalProducts}</div>
                              <p className="text-xs text-muted-foreground mt-1">Prodotti in Stock</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {stockStats.totalQuantity.toLocaleString('it-IT')} g
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Quantità Totale</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Ricerca */}
                      {stockStats.totalProducts > 0 && (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Cerca prodotto o tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            aria-label="Cerca nello stock"
                          />
                        </div>
                      )}

                      {/* Tabella Stock */}
                      {filteredStockData && filteredStockData.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Prodotto</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Quantità (g)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredStockData.map((item) => {
                                const typeInfo = item.product?.tipo_id
                                  ? getProductTypeInfo(item.product.tipo_id)
                                  : { name: 'N/A', color: null }
                                return (
                                  <TableRow key={`${item.product_id}-${item.warehouse_id}`}>
                                    <TableCell className="font-medium">
                                      {item.product?.strain || item.product_id}
                                    </TableCell>
                                    <TableCell>
                                      {typeInfo.color ? (
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.color.bg} ${typeInfo.color.text}`}>
                                          {typeInfo.name}
                                        </span>
                                      ) : (
                                        typeInfo.name
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      {item.quantity.toLocaleString('it-IT')} g
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : stockStats.totalProducts === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="font-medium">Nessun prodotto in stock</p>
                          <p className="text-sm mt-1">Questo magazzino non contiene prodotti</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Nessun prodotto trovato</p>
                          <p className="text-sm mt-1">Prova a modificare i termini di ricerca</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nessun dato disponibile
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
