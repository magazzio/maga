import { useState, useEffect, Fragment } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-product-type'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Building2, Warehouse as WarehouseIcon, Wallet, ArrowLeftRight, Package, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowRight, Info } from 'lucide-react'
import { useEntities, useCreateEntity, useUpdateEntity, useDeleteEntity } from '@/hooks/useEntities'
import { useWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from '@/hooks/useWarehouses'
import { usePortfolios, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/hooks/usePortfolios'
import { useTransactionTypes, useCreateTransactionType, useUpdateTransactionType, useDeleteTransactionType } from '@/hooks/useTransactionTypes'
import { useProductTypes, useCreateProductType, useUpdateProductType, useDeleteProductType } from '@/hooks/useProductTypes'
import { useStockByWarehouse } from '@/hooks/useStock'
import { usePortfolioBalance } from '@/hooks/usePortfolioBalance'
import { Entity, Warehouse, Portfolio, TransactionType, ProductType, PRODUCT_TYPE_COLORS, ProductTypeColor } from '@/db'

export default function Impostazioni() {
  const [activeTab, setActiveTab] = useState('entities')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Impostazioni</h2>
        <p className="text-muted-foreground">
          Gestisci entità, magazzini, portafogli, tipi movimento e tipi prodotto.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <TabsTrigger value="entities">
            <Building2 className="h-4 w-4 mr-2" />
            Entità
          </TabsTrigger>
          <TabsTrigger value="warehouses">
            <WarehouseIcon className="h-4 w-4 mr-2" />
            Magazzini
          </TabsTrigger>
          <TabsTrigger value="portfolios">
            <Wallet className="h-4 w-4 mr-2" />
            Portafogli
          </TabsTrigger>
          <TabsTrigger value="transaction-types">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Tipi Movimento
          </TabsTrigger>
          <TabsTrigger value="product-types">
            <Package className="h-4 w-4 mr-2" />
            Tipi Prodotto
          </TabsTrigger>
        </TabsList>

        {activeTab === 'entities' && (
          <TabsContent value="entities" className="space-y-4">
            <EntitiesTab />
          </TabsContent>
        )}

        {activeTab === 'warehouses' && (
          <TabsContent value="warehouses" className="space-y-4">
            <WarehousesTab />
          </TabsContent>
        )}

        {activeTab === 'portfolios' && (
          <TabsContent value="portfolios" className="space-y-4">
            <PortfoliosTab />
          </TabsContent>
        )}

        {activeTab === 'transaction-types' && (
          <TabsContent value="transaction-types" className="space-y-4">
            <TransactionTypesTab />
          </TabsContent>
        )}

        {activeTab === 'product-types' && (
          <TabsContent value="product-types" className="space-y-4">
            <ProductTypesTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

// Tab Entità
function EntitiesTab() {
  const { data: entities, isLoading } = useEntities()
  const createMutation = useCreateEntity()
  const updateMutation = useUpdateEntity()
  const deleteMutation = useDeleteEntity()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  const handleOpenDialog = (entity?: Entity) => {
    if (entity) {
      setEditingEntity(entity)
      setFormData({ name: entity.name, description: entity.description || '' })
    } else {
      setEditingEntity(null)
      setFormData({ name: '', description: '' })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingEntity(null)
    setFormData({ name: '', description: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEntity?.id) {
      updateMutation.mutate({ ...editingEntity, ...formData })
    } else {
      createMutation.mutate(formData)
    }
    handleCloseDialog()
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
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
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entità</h3>
        <Button onClick={() => handleOpenDialog()} aria-label="Crea nuova entità">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nuova Entità
        </Button>
      </div>

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="align-middle w-[30%]">Nome</TableHead>
              <TableHead className="align-middle w-[calc(70%-120px)]">Descrizione</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities && entities.length > 0 ? (
              entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium align-middle w-[30%]">{entity.name}</TableCell>
                  <TableCell className="align-middle w-[calc(70%-120px)]">{entity.description || '-'}</TableCell>
                  <TableCell className="text-center align-middle w-[120px]">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(entity)}
                        aria-label={`Modifica entità ${entity.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifica</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(entity.id!)}
                        aria-label={`Elimina entità ${entity.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Elimina</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Nessuna entità. Crea la prima entità.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {entities && entities.length > 0 ? (
          entities.map((entity) => (
            <div key={entity.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{entity.name}</h4>
                  {entity.description && (
                    <p className="text-sm text-muted-foreground mt-1">{entity.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(entity)}
                    aria-label={`Modifica entità ${entity.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(entity.id!)}
                    aria-label={`Elimina entità ${entity.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Nessuna entità. Crea la prima entità.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEntity ? 'Modifica Entità' : 'Nuova Entità'}
            </DialogTitle>
            <DialogDescription>
              {editingEntity
                ? 'Modifica i dettagli dell\'entità.'
                : 'Crea una nuova entità (es. Driplug, Meetdrip).'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit">Salva</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Entità</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa entità? Questa azione non può essere annullata.
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
    </>
  )
}

// Componente Riga Magazzino (per calcolare stock)
function WarehouseRow({ warehouse, entity, onEdit, onDelete }: { warehouse: Warehouse; entity?: Entity; onEdit: () => void; onDelete: () => void }) {
  const { data: stock = 0, isLoading: isLoadingStock } = useStockByWarehouse(warehouse.id)

  return (
    <TableRow>
      <TableCell className="font-medium align-middle w-[20%]">{warehouse.name}</TableCell>
      <TableCell className="align-middle w-[18%]">{entity?.name || '-'}</TableCell>
      <TableCell className="text-center align-middle w-[12%]">
        {isLoadingStock ? (
          <span className="text-muted-foreground text-sm">...</span>
        ) : (
          <span className="font-medium">{stock.toFixed(2)}g</span>
        )}
      </TableCell>
      <TableCell className="align-middle w-[calc(50%-120px)]">{warehouse.description || '-'}</TableCell>
      <TableCell className="text-center align-middle w-[120px]">
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Modifica magazzino ${warehouse.name}`}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Modifica</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Elimina magazzino ${warehouse.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Componente Card Magazzino Mobile
function WarehouseCard({ warehouse, entity, onEdit, onDelete }: { warehouse: Warehouse; entity?: Entity; onEdit: () => void; onDelete: () => void }) {
  const { data: stock = 0, isLoading: isLoadingStock } = useStockByWarehouse(warehouse.id)

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{warehouse.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">Entità:</span> {entity?.name || '-'}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Stock:</span>{' '}
            {isLoadingStock ? (
              <span className="text-muted-foreground">...</span>
            ) : (
              <span className="font-medium">{stock.toFixed(2)}g</span>
            )}
          </p>
          {warehouse.description && (
            <p className="text-sm text-muted-foreground mt-1">{warehouse.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label={`Modifica magazzino ${warehouse.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            aria-label={`Elimina magazzino ${warehouse.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Tab Magazzini
function WarehousesTab() {
  const { data: warehouses, isLoading } = useWarehouses()
  const { data: entities } = useEntities()
  const createMutation = useCreateWarehouse()
  const updateMutation = useUpdateWarehouse()
  const deleteMutation = useDeleteWarehouse()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', entity_id: 0 })

  const handleOpenDialog = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse)
      setFormData({ name: warehouse.name, description: warehouse.description || '', entity_id: warehouse.entity_id })
    } else {
      setEditingWarehouse(null)
      setFormData({ name: '', description: '', entity_id: entities?.[0]?.id || 0 })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingWarehouse(null)
    setFormData({ name: '', description: '', entity_id: entities?.[0]?.id || 0 })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingWarehouse?.id) {
      updateMutation.mutate({ ...editingWarehouse, ...formData, entity_id: formData.entity_id })
    } else {
      createMutation.mutate({ ...formData, entity_id: formData.entity_id })
    }
    handleCloseDialog()
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
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
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Magazzini</h3>
        <Button onClick={() => handleOpenDialog()} disabled={!entities || entities.length === 0} aria-label="Crea nuovo magazzino">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nuovo Magazzino
        </Button>
      </div>

      {(!entities || entities.length === 0) && (
        <div className="rounded-md border p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Crea prima almeno un'entità per poter creare magazzini.
          </p>
        </div>
      )}

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="align-middle w-[20%]">Nome</TableHead>
              <TableHead className="align-middle w-[18%]">Entità</TableHead>
              <TableHead className="text-center align-middle w-[12%]">Stock</TableHead>
              <TableHead className="align-middle w-[calc(50%-120px)]">Descrizione</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses && warehouses.length > 0 ? (
              warehouses.map((warehouse) => {
                const entity = entities?.find((e) => e.id === warehouse.entity_id)
                return (
                  <WarehouseRow key={warehouse.id} warehouse={warehouse} entity={entity} onEdit={() => handleOpenDialog(warehouse)} onDelete={() => setDeleteId(warehouse.id!)} />
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nessun magazzino. Crea il primo magazzino.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {warehouses && warehouses.length > 0 ? (
          warehouses.map((warehouse) => {
            const entity = entities?.find((e) => e.id === warehouse.entity_id)
            return (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} entity={entity} onEdit={() => handleOpenDialog(warehouse)} onDelete={() => setDeleteId(warehouse.id!)} />
            )
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Nessun magazzino. Crea il primo magazzino.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Modifica Magazzino' : 'Nuovo Magazzino'}
            </DialogTitle>
            <DialogDescription>
              {editingWarehouse
                ? 'Modifica i dettagli del magazzino.'
                : 'Crea un nuovo magazzino collegato a un\'entità.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse-name">Nome *</Label>
                <Input
                  id="warehouse-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse-entity">Entità *</Label>
                <Select
                  value={formData.entity_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, entity_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona entità" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities?.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id!.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse-description">Descrizione</Label>
                <Textarea
                  id="warehouse-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit">Salva</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Magazzino</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo magazzino? Questa azione non può essere annullata.
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
    </>
  )
}

// Componente Riga Portafoglio (per calcolare saldi)
function PortfolioRow({ portfolio, entity, onEdit, onDelete }: { portfolio: Portfolio; entity?: Entity; onEdit: () => void; onDelete: () => void }) {
  const { data: balance, isLoading: isLoadingBalance } = usePortfolioBalance(portfolio.id)

  return (
    <TableRow>
      <TableCell className="font-medium align-middle w-[20%]">{portfolio.name}</TableCell>
      <TableCell className="align-middle w-[18%]">{entity?.name || '-'}</TableCell>
      <TableCell className="text-center align-middle w-[12%]">
        {isLoadingBalance ? (
          <span className="text-muted-foreground text-sm">...</span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{balance?.balance.toFixed(2) || '0.00'}€</span>
            {balance && balance.debt_balance !== 0 && (
              <span className="text-xs text-amber-600">Debiti: {balance.debt_balance.toFixed(2)}€</span>
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="align-middle w-[calc(50%-120px)]">{portfolio.description || '-'}</TableCell>
      <TableCell className="text-center align-middle w-[120px]">
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Modifica portafoglio ${portfolio.name}`}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Modifica</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Elimina portafoglio ${portfolio.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Componente Card Portafoglio Mobile
function PortfolioCard({ portfolio, entity, onEdit, onDelete }: { portfolio: Portfolio; entity?: Entity; onEdit: () => void; onDelete: () => void }) {
  const { data: balance, isLoading: isLoadingBalance } = usePortfolioBalance(portfolio.id)

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{portfolio.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">Entità:</span> {entity?.name || '-'}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Saldo:</span>{' '}
            {isLoadingBalance ? (
              <span className="text-muted-foreground">...</span>
            ) : (
              <>
                <span className="font-medium">{balance?.balance.toFixed(2) || '0.00'}€</span>
                {balance && balance.cash_balance !== balance.balance && (
                  <span className="text-muted-foreground ml-1">(Cash: {balance.cash_balance.toFixed(2)}€)</span>
                )}
                {balance && balance.debt_balance !== 0 && (
                  <span className="text-amber-600 ml-1">| Debiti: {balance.debt_balance.toFixed(2)}€</span>
                )}
              </>
            )}
          </p>
          {portfolio.description && (
            <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label={`Modifica portafoglio ${portfolio.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            aria-label={`Elimina portafoglio ${portfolio.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Tab Portafogli
function PortfoliosTab() {
  const { data: portfolios, isLoading } = usePortfolios()
  const { data: entities } = useEntities()
  const createMutation = useCreatePortfolio()
  const updateMutation = useUpdatePortfolio()
  const deleteMutation = useDeletePortfolio()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', entity_id: 0 })

  const handleOpenDialog = (portfolio?: Portfolio) => {
    if (portfolio) {
      setEditingPortfolio(portfolio)
      setFormData({ name: portfolio.name, description: portfolio.description || '', entity_id: portfolio.entity_id })
    } else {
      setEditingPortfolio(null)
      setFormData({ name: '', description: '', entity_id: entities?.[0]?.id || 0 })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPortfolio(null)
    setFormData({ name: '', description: '', entity_id: entities?.[0]?.id || 0 })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPortfolio?.id) {
      updateMutation.mutate({ ...editingPortfolio, ...formData, entity_id: formData.entity_id })
    } else {
      createMutation.mutate({ ...formData, entity_id: formData.entity_id })
    }
    handleCloseDialog()
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
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
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portafogli</h3>
        <Button onClick={() => handleOpenDialog()} disabled={!entities || entities.length === 0} aria-label="Crea nuovo portafoglio">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nuovo Portafoglio
        </Button>
      </div>

      {(!entities || entities.length === 0) && (
        <div className="rounded-md border p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Crea prima almeno un'entità per poter creare portafogli.
          </p>
        </div>
      )}

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="align-middle w-[20%]">Nome</TableHead>
              <TableHead className="align-middle w-[18%]">Entità</TableHead>
              <TableHead className="text-center align-middle w-[12%]">Saldo</TableHead>
              <TableHead className="align-middle w-[calc(50%-120px)]">Descrizione</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolios && portfolios.length > 0 ? (
              portfolios.map((portfolio) => {
                const entity = entities?.find((e) => e.id === portfolio.entity_id)
                return (
                  <PortfolioRow key={portfolio.id} portfolio={portfolio} entity={entity} onEdit={() => handleOpenDialog(portfolio)} onDelete={() => setDeleteId(portfolio.id!)} />
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nessun portafoglio. Crea il primo portafoglio.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {portfolios && portfolios.length > 0 ? (
          portfolios.map((portfolio) => {
            const entity = entities?.find((e) => e.id === portfolio.entity_id)
            return (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} entity={entity} onEdit={() => handleOpenDialog(portfolio)} onDelete={() => setDeleteId(portfolio.id!)} />
            )
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Nessun portafoglio. Crea il primo portafoglio.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPortfolio ? 'Modifica Portafoglio' : 'Nuovo Portafoglio'}
            </DialogTitle>
            <DialogDescription>
              {editingPortfolio
                ? 'Modifica i dettagli del portafoglio.'
                : 'Crea un nuovo portafoglio collegato a un\'entità.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio-name">Nome *</Label>
                <Input
                  id="portfolio-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-entity">Entità *</Label>
                <Select
                  value={formData.entity_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, entity_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona entità" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities?.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id!.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-description">Descrizione</Label>
                <Textarea
                  id="portfolio-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit">Salva</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Portafoglio</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo portafoglio? Questa azione non può essere annullata.
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
    </>
  )
}

// Helper per calcolare impatto su entità
type ImpactType = 'up' | 'down' | 'none'

function getWarehouseImpact(
  type: TransactionType,
  entityId: number,
  warehouses: Warehouse[]
): ImpactType {
  if (!type.affects_warehouse) return 'none'

  const fromWarehouse = warehouses.find(w => w.id === type.suggested_from_warehouse_id)
  const toWarehouse = warehouses.find(w => w.id === type.suggested_to_warehouse_id)

  // Calcola la direzione automaticamente se non è presente
  let direction = type.warehouse_direction
  if (!direction) {
    if (fromWarehouse && toWarehouse) direction = 'transfer'
    else if (fromWarehouse) direction = 'out'
    else if (toWarehouse) direction = 'in'
    else return 'none'
  }

  if (direction === 'in') {
    // Entrata: aumenta se to_warehouse appartiene all'entità
    if (toWarehouse?.entity_id === entityId) return 'up'
  } else if (direction === 'out') {
    // Uscita: diminuisce se from_warehouse appartiene all'entità
    if (fromWarehouse?.entity_id === entityId) return 'down'
  } else if (direction === 'transfer') {
    // Trasferimento: diminuisce se from appartiene, aumenta se to appartiene
    if (fromWarehouse?.entity_id === entityId && toWarehouse?.entity_id === entityId) {
      // Stesso magazzino (trasformazione interna): nessun impatto sulla quantità
      return 'none'
    }
    if (fromWarehouse?.entity_id === entityId) return 'down'
    if (toWarehouse?.entity_id === entityId) return 'up'
  }

  return 'none'
}

function getPortfolioImpact(
  type: TransactionType,
  entityId: number,
  portfolios: Portfolio[]
): ImpactType {
  if (!type.affects_portfolio) return 'none'

  const fromPortfolio = portfolios.find(p => p.id === type.suggested_from_portfolio_id)
  const toPortfolio = portfolios.find(p => p.id === type.suggested_to_portfolio_id)

  // Calcola la direzione automaticamente se non è presente
  let direction = type.portfolio_direction
  if (!direction) {
    if (fromPortfolio && toPortfolio) direction = 'transfer'
    else if (fromPortfolio) direction = 'out'
    else if (toPortfolio) direction = 'in'
    else return 'none'
  }

  if (direction === 'in') {
    // Entrata: aumenta se to_portfolio appartiene all'entità
    if (toPortfolio?.entity_id === entityId) return 'up'
  } else if (direction === 'out') {
    // Uscita: diminuisce se from_portfolio appartiene all'entità
    if (fromPortfolio?.entity_id === entityId) return 'down'
  } else if (direction === 'transfer') {
    // Trasferimento: diminuisce se from appartiene, aumenta se to appartiene
    if (fromPortfolio?.entity_id === entityId) return 'down'
    if (toPortfolio?.entity_id === entityId) return 'up'
  }

  return 'none'
}

// Componente per renderizzare indicatore impatto
function ImpactIndicator({ impact }: { impact: ImpactType }) {
  if (impact === 'up') {
    return (
      <div className="flex justify-center items-center">
        <ArrowUp className="h-4 w-4 text-green-600" aria-label="Aumenta" />
      </div>
    )
  } else if (impact === 'down') {
    return (
      <div className="flex justify-center items-center">
        <ArrowDown className="h-4 w-4 text-red-600" aria-label="Diminuisce" />
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center text-muted-foreground">
      <span>-</span>
    </div>
  )
}

// Componente Riepilogo Configurazione Tipo Movimento
function TransactionTypeSummary({ 
  formData, 
  warehouses, 
  portfolios 
}: { 
  formData: Partial<TransactionType>
  warehouses?: Warehouse[]
  portfolios?: Portfolio[]
}) {
  const getWarehouseName = (id?: number) => {
    if (!id) return 'Nessuno'
    return warehouses?.find(w => w.id === id)?.name || 'Nessuno'
  }

  const getPortfolioName = (id?: number) => {
    if (!id) return 'Nessuno'
    return portfolios?.find(p => p.id === id)?.name || 'Nessuno'
  }

  // Calcola la direzione automaticamente in base a cosa è selezionato
  const calculateDirection = (fromId?: number, toId?: number): 'in' | 'out' | 'transfer' | undefined => {
    if (fromId && toId) return 'transfer'
    if (fromId && !toId) return 'out'
    if (!fromId && toId) return 'in'
    return undefined
  }

  const getDirectionLabel = (fromId?: number, toId?: number) => {
    const direction = calculateDirection(fromId, toId)
    if (!direction) return 'Non configurato'
    const labels: Record<string, string> = {
      'in': 'Entrata',
      'out': 'Uscita',
      'transfer': 'Trasferimento'
    }
    return labels[direction] || direction
  }

  const getDirectionIcon = (fromId?: number, toId?: number) => {
    const direction = calculateDirection(fromId, toId)
    if (direction === 'in') return <ArrowDown className="h-4 w-4 text-green-600" />
    if (direction === 'out') return <ArrowUp className="h-4 w-4 text-red-600" />
    if (direction === 'transfer') return <ArrowLeftRight className="h-4 w-4 text-blue-600" />
    return null
  }

  const getPaymentTypeLabel = (type?: string) => {
    if (!type) return 'Non selezionato'
    return type === 'monthly' ? 'Mensile' : 'Istantaneo'
  }

  if (!formData.affects_warehouse && !formData.affects_portfolio) {
    return (
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Riepilogo Configurazione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Attiva almeno una sezione (Magazzino o Portafoglio) per vedere il riepilogo.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="h-4 w-4" />
          Riepilogo Configurazione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.affects_warehouse && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <WarehouseIcon className="h-4 w-4 text-blue-600" />
              <span>Magazzino</span>
            </div>
            <div className="pl-6 space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{getDirectionLabel(formData.suggested_from_warehouse_id, formData.suggested_to_warehouse_id)}</span>
                {getDirectionIcon(formData.suggested_from_warehouse_id, formData.suggested_to_warehouse_id)}
              </div>
              {formData.suggested_from_warehouse_id && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Da:</span>
                  <span className="font-medium">{getWarehouseName(formData.suggested_from_warehouse_id)}</span>
                </div>
              )}
              {formData.suggested_to_warehouse_id && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">A:</span>
                  <span className="font-medium">{getWarehouseName(formData.suggested_to_warehouse_id)}</span>
                </div>
              )}
              {formData.suggested_from_warehouse_id && formData.suggested_to_warehouse_id && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span>Trasferimento tra magazzini</span>
                </div>
              )}
            </div>
          </div>
        )}

        {formData.affects_portfolio && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Wallet className="h-4 w-4 text-green-600" />
              <span>Portafoglio</span>
            </div>
            <div className="pl-6 space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{getDirectionLabel(formData.suggested_from_portfolio_id, formData.suggested_to_portfolio_id)}</span>
                {getDirectionIcon(formData.suggested_from_portfolio_id, formData.suggested_to_portfolio_id)}
              </div>
              {formData.suggested_from_portfolio_id && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Da:</span>
                  <span className="font-medium">{getPortfolioName(formData.suggested_from_portfolio_id)}</span>
                </div>
              )}
              {formData.suggested_to_portfolio_id && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">A:</span>
                  <span className="font-medium">{getPortfolioName(formData.suggested_to_portfolio_id)}</span>
                </div>
              )}
              {formData.suggested_from_portfolio_id && formData.suggested_to_portfolio_id && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span>Trasferimento tra portafogli</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Pagamento:</span>
                <span className="font-medium">{getPaymentTypeLabel(formData.payment_type)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Tab Tipi Movimento
function TransactionTypesTab() {
  const { data: transactionTypes, isLoading } = useTransactionTypes()
  const { data: warehouses } = useWarehouses()
  const { data: portfolios } = usePortfolios()
  const { data: entities } = useEntities()
  const createMutation = useCreateTransactionType()
  const updateMutation = useUpdateTransactionType()
  const deleteMutation = useDeleteTransactionType()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<TransactionType | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)
  const [formData, setFormData] = useState<Partial<TransactionType>>({
    name: '',
    description: '',
    affects_warehouse: false,
    affects_portfolio: false,
    payment_type: undefined,
    warehouse_direction: undefined,
    portfolio_direction: undefined,
    suggested_from_warehouse_id: undefined,
    suggested_to_warehouse_id: undefined,
    suggested_from_portfolio_id: undefined,
    suggested_to_portfolio_id: undefined,
    requires_product: false,
    transforms_state: false,
    from_state: undefined,
    to_state: undefined,
  })

  const handleOpenDialog = (type?: TransactionType) => {
    if (type) {
      setEditingType(type)
      setFormData(type)
    } else {
      setEditingType(null)
      setFormData({
        name: '',
        description: '',
        affects_warehouse: false,
        affects_portfolio: false,
        payment_type: undefined,
        warehouse_direction: undefined,
        portfolio_direction: undefined,
        suggested_from_warehouse_id: undefined,
        suggested_to_warehouse_id: undefined,
        suggested_from_portfolio_id: undefined,
        suggested_to_portfolio_id: undefined,
        requires_product: false,
        transforms_state: false,
        from_state: undefined,
        to_state: undefined,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingType(null)
    setFormData({
      name: '',
      description: '',
      affects_warehouse: false,
      affects_portfolio: false,
      payment_type: undefined,
        warehouse_direction: undefined,
        portfolio_direction: undefined,
        suggested_from_warehouse_id: undefined,
        suggested_to_warehouse_id: undefined,
        suggested_from_portfolio_id: undefined,
        suggested_to_portfolio_id: undefined,
        requires_product: false,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Calcola automaticamente le direzioni se non sono già impostate
    const finalFormData = { ...formData }
    
    // Calcola direzione magazzino
    if (finalFormData.affects_warehouse) {
      if (finalFormData.suggested_from_warehouse_id && finalFormData.suggested_to_warehouse_id) {
        finalFormData.warehouse_direction = 'transfer'
      } else if (finalFormData.suggested_from_warehouse_id) {
        finalFormData.warehouse_direction = 'out'
      } else if (finalFormData.suggested_to_warehouse_id) {
        finalFormData.warehouse_direction = 'in'
      }
    }
    
    // Calcola direzione portafoglio
    if (finalFormData.affects_portfolio) {
      if (finalFormData.suggested_from_portfolio_id && finalFormData.suggested_to_portfolio_id) {
        finalFormData.portfolio_direction = 'transfer'
      } else if (finalFormData.suggested_from_portfolio_id) {
        finalFormData.portfolio_direction = 'out'
      } else if (finalFormData.suggested_to_portfolio_id) {
        finalFormData.portfolio_direction = 'in'
      }
    }
    
    if (editingType?.id) {
      updateMutation.mutate({ ...editingType, ...finalFormData } as TransactionType)
    } else {
      createMutation.mutate(finalFormData as Omit<TransactionType, 'id'>)
    }
    handleCloseDialog()
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
  }

  // Paginazione
  const totalPages = transactionTypes ? Math.ceil(transactionTypes.length / pageSize) : 0
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTypes = transactionTypes?.slice(startIndex, endIndex) || []

  // Reset pagina quando cambiano i dati
  useEffect(() => {
    if (transactionTypes && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [transactionTypes, currentPage, totalPages])

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
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tipi Movimento</h3>
        <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo tipo movimento">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nuovo Tipo Movimento
        </Button>
      </div>

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="align-middle w-[20%]">Nome</TableHead>
                  {entities && entities.map((entity) => (
                <Fragment key={entity.id}>
                  <TableHead className="text-center align-middle w-[8%]" title={`Magazzino ${entity.name}`}>
                    <div className="flex flex-col items-center gap-1">
                      <WarehouseIcon className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-medium">{entity.name}</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center align-middle w-[8%]" title={`Portafoglio ${entity.name}`}>
                    <div className="flex flex-col items-center gap-1">
                      <Wallet className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-medium">{entity.name}</span>
                    </div>
                  </TableHead>
                </Fragment>
              ))}
              <TableHead className="text-center align-middle" style={{ width: entities ? `calc(${100 - 20 - (entities.length * 16)}% - 120px)` : 'calc(40%-120px)' }}>Tipo Pagamento</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTypes.length > 0 ? (
              paginatedTypes.map((type: TransactionType) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium align-middle w-[20%]">{type.name}</TableCell>
                  {entities && entities.map((entity) => (
                    <Fragment key={entity.id}>
                      <TableCell className="text-center align-middle w-[8%]">
                        <ImpactIndicator impact={getWarehouseImpact(type, entity.id!, warehouses || [])} />
                      </TableCell>
                      <TableCell className="text-center align-middle w-[8%]">
                        <ImpactIndicator impact={getPortfolioImpact(type, entity.id!, portfolios || [])} />
                      </TableCell>
                    </Fragment>
                  ))}
                  <TableCell className="text-center align-middle" style={{ width: entities ? `calc(${100 - 20 - (entities.length * 16)}% - 120px)` : 'calc(40%-120px)' }}>{type.payment_type || '-'}</TableCell>
                  <TableCell className="text-center align-middle w-[120px]">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(type)}
                        aria-label={`Modifica tipo movimento ${type.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifica</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(type.id!)}
                        aria-label={`Elimina tipo movimento ${type.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Elimina</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={entities ? (1 + entities.length * 2 + 2) : 5} className="text-center text-muted-foreground py-8">
                  Nessun tipo movimento. Crea il primo tipo movimento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedTypes.length > 0 ? (
          paginatedTypes.map((type) => (
            <div key={type.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{type.name}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(type)}
                    aria-label={`Modifica tipo movimento ${type.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(type.id!)}
                    aria-label={`Elimina tipo movimento ${type.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {entities && entities.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium text-xs text-muted-foreground uppercase">Impatto per Entità</div>
                    {entities.map((entity) => (
                      <div key={entity.id} className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-muted">
                        <div className="flex items-center gap-2">
                          <WarehouseIcon className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span className="font-medium text-xs">{entity.name} Magazzino:</span>
                          <ImpactIndicator impact={getWarehouseImpact(type, entity.id!, warehouses || [])} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Wallet className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span className="font-medium text-xs">{entity.name} Portafoglio:</span>
                          <ImpactIndicator impact={getPortfolioImpact(type, entity.id!, portfolios || [])} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {type.payment_type && (
                  <div>
                    <span className="font-medium">Pagamento:</span> {type.payment_type === 'monthly' ? 'Mensile' : 'Istantaneo'}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Nessun tipo movimento. Crea il primo tipo movimento.
          </div>
        )}
      </div>

      {/* Paginazione - Mostra solo se ci sono più elementi della pageSize */}
      {transactionTypes && transactionTypes.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, transactionTypes.length)} di {transactionTypes.length} tipi
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Modifica Tipo Movimento' : 'Nuovo Tipo Movimento'}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? 'Modifica i dettagli del tipo movimento.'
                : 'Crea un nuovo tipo movimento personalizzabile.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Informazioni Base */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type-name">Nome *</Label>
                  <Input
                    id="type-name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type-description">Descrizione</Label>
                  <Textarea
                    id="type-description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      <input
                        type="checkbox"
                        checked={formData.affects_warehouse || false}
                        onChange={(e) => setFormData({ ...formData, affects_warehouse: e.target.checked })}
                        className="mr-2"
                      />
                      Influisce su Magazzino
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <input
                        type="checkbox"
                        checked={formData.affects_portfolio || false}
                        onChange={(e) => setFormData({ ...formData, affects_portfolio: e.target.checked })}
                        className="mr-2"
                      />
                      Influisce su Portafoglio
                    </Label>
                  </div>
                </div>
              </div>

              {/* Riepilogo */}
              <TransactionTypeSummary 
                formData={formData} 
                warehouses={warehouses} 
                portfolios={portfolios} 
              />

              {/* Sezioni Magazzino e Portafoglio */}
              <div className={`grid gap-4 ${formData.affects_warehouse && formData.affects_portfolio ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Sezione Magazzino */}
                {formData.affects_warehouse && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <WarehouseIcon className="h-4 w-4 text-blue-600" />
                        <span>Configurazione Magazzino</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        <p className="font-medium mb-1">Come funziona:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li><strong>Solo "Da":</strong> Uscita da magazzino</li>
                          <li><strong>Solo "A":</strong> Entrata in magazzino</li>
                          <li><strong>Entrambi:</strong> Trasferimento tra magazzini</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="suggested-from-warehouse">Da Magazzino (suggerito)</Label>
                          <Select
                            value={formData.suggested_from_warehouse_id?.toString() || undefined}
                            onValueChange={(value: string) => {
                              const newFromId = value === "none" ? undefined : parseInt(value)
                              setFormData({ 
                                ...formData, 
                                suggested_from_warehouse_id: newFromId,
                                // Calcola automaticamente la direzione
                                warehouse_direction: newFromId && formData.suggested_to_warehouse_id 
                                  ? 'transfer' 
                                  : newFromId 
                                    ? 'out' 
                                    : formData.suggested_to_warehouse_id 
                                      ? 'in' 
                                      : undefined
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Nessuno" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nessuno</SelectItem>
                              {warehouses?.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                                  {warehouse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="suggested-to-warehouse">A Magazzino (suggerito)</Label>
                          <Select
                            value={formData.suggested_to_warehouse_id?.toString() || undefined}
                            onValueChange={(value: string) => {
                              const newToId = value === "none" ? undefined : parseInt(value)
                              setFormData({ 
                                ...formData, 
                                suggested_to_warehouse_id: newToId,
                                // Calcola automaticamente la direzione
                                warehouse_direction: formData.suggested_from_warehouse_id && newToId 
                                  ? 'transfer' 
                                  : newToId 
                                    ? 'in' 
                                    : formData.suggested_from_warehouse_id 
                                      ? 'out' 
                                      : undefined
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Nessuno" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nessuno</SelectItem>
                              {warehouses?.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                                  {warehouse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sezione Portafoglio */}
                {formData.affects_portfolio && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-green-600" />
                        <span>Configurazione Portafoglio</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        <p className="font-medium mb-1">Come funziona:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li><strong>Solo "Da":</strong> Uscita da portafoglio (es. pagamento)</li>
                          <li><strong>Solo "A":</strong> Entrata in portafoglio (es. incasso)</li>
                          <li><strong>Entrambi:</strong> Trasferimento tra portafogli (es. Ship: Driplug → Meetdrip)</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="suggested-from-portfolio">Da Portafoglio (suggerito)</Label>
                          <Select
                            value={formData.suggested_from_portfolio_id?.toString() || undefined}
                            onValueChange={(value: string) => {
                              const newFromId = value === "none" ? undefined : parseInt(value)
                              setFormData({ 
                                ...formData, 
                                suggested_from_portfolio_id: newFromId,
                                // Calcola automaticamente la direzione
                                portfolio_direction: newFromId && formData.suggested_to_portfolio_id 
                                  ? 'transfer' 
                                  : newFromId 
                                    ? 'out' 
                                    : formData.suggested_to_portfolio_id 
                                      ? 'in' 
                                      : undefined
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Nessuno" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nessuno</SelectItem>
                              {portfolios?.map((portfolio) => (
                                <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                                  {portfolio.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="suggested-to-portfolio">A Portafoglio (suggerito)</Label>
                          <Select
                            value={formData.suggested_to_portfolio_id?.toString() || undefined}
                            onValueChange={(value: string) => {
                              const newToId = value === "none" ? undefined : parseInt(value)
                              setFormData({ 
                                ...formData, 
                                suggested_to_portfolio_id: newToId,
                                // Calcola automaticamente la direzione
                                portfolio_direction: formData.suggested_from_portfolio_id && newToId 
                                  ? 'transfer' 
                                  : newToId 
                                    ? 'in' 
                                    : formData.suggested_from_portfolio_id 
                                      ? 'out' 
                                      : undefined
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Nessuno" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nessuno</SelectItem>
                              {portfolios?.map((portfolio) => (
                                <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                                  {portfolio.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-type">Tipo Pagamento</Label>
                        <Select
                          value={formData.payment_type || undefined}
                          onValueChange={(value: string) => setFormData({ ...formData, payment_type: value as 'monthly' | 'instant' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona tipo pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Mensile</SelectItem>
                            <SelectItem value="instant">Istantaneo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.requires_product || false}
                    onChange={(e) => setFormData({ ...formData, requires_product: e.target.checked })}
                    className="mr-2"
                  />
                  Richiede Prodotto
                </Label>
              </div>
              {/* Trasformazione di Stato */}
              {formData.requires_product && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>
                      <input
                        type="checkbox"
                        checked={formData.transforms_state || false}
                        onChange={(e) => {
                          const transforms = e.target.checked
                          setFormData({
                            ...formData,
                            transforms_state: transforms,
                            from_state: transforms ? formData.from_state : undefined,
                            to_state: transforms ? formData.to_state : undefined,
                          })
                        }}
                        className="mr-2"
                      />
                      Trasforma Stato Prodotto (es. Raw → Cured)
                    </Label>
                  </div>
                  {formData.transforms_state && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from-state">Stato Iniziale *</Label>
                        <Select
                          value={formData.from_state || undefined}
                          onValueChange={(value: string) => setFormData({ ...formData, from_state: value as 'raw' | 'cured' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona stato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raw">Raw</SelectItem>
                            <SelectItem value="cured">Cured</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-state">Stato Finale *</Label>
                        <Select
                          value={formData.to_state || undefined}
                          onValueChange={(value: string) => setFormData({ ...formData, to_state: value as 'raw' | 'cured' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona stato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raw">Raw</SelectItem>
                            <SelectItem value="cured">Cured</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {formData.transforms_state && (
                    <div className="text-sm text-muted-foreground">
                      <p>Questo movimento trasformerà il prodotto da <strong>{formData.from_state === 'raw' ? 'Raw' : 'Cured'}</strong> a <strong>{formData.to_state === 'raw' ? 'Raw' : 'Cured'}</strong>.</p>
                      <p className="mt-1">Per trasformazioni nello stesso magazzino, usa "Trasferimento" come direzione magazzino e seleziona lo stesso magazzino per origine e destinazione.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit">Salva</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Tipo Movimento</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo tipo movimento? Questa azione non può essere annullata.
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
    </>
  )
}

// Tab Tipi Prodotto
function ProductTypesTab() {
  const { data: productTypes, isLoading } = useProductTypes()
  const createMutation = useCreateProductType()
  const updateMutation = useUpdateProductType()
  const deleteMutation = useDeleteProductType()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<ProductType | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', color: 'blue' as ProductTypeColor })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)

  const handleOpenDialog = (type?: ProductType) => {
    if (type) {
      setEditingType(type)
      setFormData({ name: type.name, color: type.color })
    } else {
      setEditingType(null)
      setFormData({ name: '', color: 'blue' })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingType(null)
    setFormData({ name: '', color: 'blue' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingType?.id) {
      updateMutation.mutate({ ...editingType, ...formData })
    } else {
      createMutation.mutate(formData)
    }
    handleCloseDialog()
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
  }

  // Paginazione
  const totalPages = productTypes ? Math.ceil(productTypes.length / pageSize) : 0
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTypes = productTypes?.slice(startIndex, endIndex) || []

  // Reset pagina quando cambiano i dati
  useEffect(() => {
    if (productTypes && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [productTypes, currentPage, totalPages])

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
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tipi Prodotto</h3>
        <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo tipo prodotto">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nuovo Tipo Prodotto
        </Button>
      </div>

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="align-middle w-[calc(70%-120px)]">Nome</TableHead>
              <TableHead className="text-center align-middle w-[30%]">Colore</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTypes.length > 0 ? (
              paginatedTypes.map((type) => {
                const colorInfo = PRODUCT_TYPE_COLORS[type.color]
                return (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium align-middle w-[calc(70%-120px)]">{type.name}</TableCell>
                    <TableCell className="text-center align-middle w-[30%]">
                      <div className="flex justify-center items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                          {colorInfo.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center align-middle w-[120px]">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(type)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(type.id!)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nessun tipo prodotto. Crea il primo tipo prodotto.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedTypes.length > 0 ? (
          paginatedTypes.map((type) => {
            const colorInfo = PRODUCT_TYPE_COLORS[type.color]
            return (
              <div key={type.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{type.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${colorInfo.bg} ${colorInfo.text}`}>
                      {colorInfo.label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(type)}
                      aria-label={`Modifica tipo prodotto ${type.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(type.id!)}
                      aria-label={`Elimina tipo prodotto ${type.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Nessun tipo prodotto. Crea il primo tipo prodotto.
          </div>
        )}
      </div>

      {/* Paginazione - Mostra solo se ci sono più elementi della pageSize */}
      {productTypes && productTypes.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, productTypes.length)} di {productTypes.length} tipi
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Modifica Tipo Prodotto' : 'Nuovo Tipo Prodotto'}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? 'Modifica i dettagli del tipo prodotto.'
                : 'Crea un nuovo tipo prodotto (es. Fiore, Hash, Olio).'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product-type-name">Nome *</Label>
                <Input
                  id="product-type-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-type-color">Colore *</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value: string) => setFormData({ ...formData, color: value as ProductTypeColor })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona colore" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRODUCT_TYPE_COLORS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full ${value.bg} ${value.text}`} />
                          {value.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit">Salva</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Tipo Prodotto</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo tipo prodotto? Questa azione non può essere annullata.
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
    </>
  )
}
