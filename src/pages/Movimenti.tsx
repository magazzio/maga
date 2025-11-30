import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search, Package, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/useTransactions'
import { useTransactionTypes } from '@/hooks/useTransactionTypes'
import { useActiveProducts } from '@/hooks/useProducts'
import { useWarehouses } from '@/hooks/useWarehouses'
import { usePortfolios } from '@/hooks/usePortfolios'
import { useEntities } from '@/hooks/useEntities'
import { Transaction } from '@/db'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/lib/logger'

export default function Movimenti() {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTypeId, setFilterTypeId] = useState<number | 'all'>('all')
  const [filterProductId, setFilterProductId] = useState<string | 'all'>('all')
  const [filterEntityId, setFilterEntityId] = useState<number | 'all'>('all')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; transactionId: number | null }>({ open: false, transactionId: null })

  const { data: transactionsData, isLoading } = useTransactions(page, pageSize)
  const { data: transactionTypes } = useTransactionTypes()
  const { data: products } = useActiveProducts()
  const { data: warehouses } = useWarehouses()
  const { data: portfolios } = usePortfolios()
  const { data: entities } = useEntities()

  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()
  const { toast } = useToast()

  // Form data per nuovo/modifica movimento
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type_id: 0,
    date: new Date(),
    product_id: undefined,
    quantity: undefined,
    from_warehouse_id: undefined,
    to_warehouse_id: undefined,
    from_portfolio_id: undefined,
    to_portfolio_id: undefined,
    amount: undefined,
    payment_method: 'cash',
    is_debt: false,
    debt_status: undefined,
    notes: undefined,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Tipo movimento selezionato nel form
  const selectedTransactionType = transactionTypes?.find(t => t.id === formData.type_id)

  // Crea mappe per lookup veloce
  const warehouseMap = useMemo(() => {
    if (!warehouses) return new Map()
    return new Map(warehouses.map(w => [w.id, w]))
  }, [warehouses])

  const portfolioMap = useMemo(() => {
    if (!portfolios) return new Map()
    return new Map(portfolios.map(p => [p.id, p]))
  }, [portfolios])

  // Filtra movimenti
  const filteredTransactions = useMemo(() => {
    if (!transactionsData?.transactions) return []
    
    let filtered = transactionsData.transactions

    // Filtro tipo movimento
    if (filterTypeId !== 'all') {
      filtered = filtered.filter(t => t.type_id === filterTypeId)
    }

    // Filtro prodotto
    if (filterProductId !== 'all') {
      filtered = filtered.filter(t => t.product_id === filterProductId)
    }

    // Filtro entità (tramite magazzini/portafogli)
    if (filterEntityId !== 'all') {
      filtered = filtered.filter(t => {
        const fromWarehouse = t.from_warehouse_id ? warehouseMap.get(t.from_warehouse_id) : null
        const toWarehouse = t.to_warehouse_id ? warehouseMap.get(t.to_warehouse_id) : null
        const fromPortfolio = t.from_portfolio_id ? portfolioMap.get(t.from_portfolio_id) : null
        const toPortfolio = t.to_portfolio_id ? portfolioMap.get(t.to_portfolio_id) : null
        
        return (
          (fromWarehouse?.entity_id === filterEntityId) ||
          (toWarehouse?.entity_id === filterEntityId) ||
          (fromPortfolio?.entity_id === filterEntityId) ||
          (toPortfolio?.entity_id === filterEntityId)
        )
      })
    }

    // Filtro ricerca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(t => {
        const typeName = transactionTypes?.find(tt => tt.id === t.type_id)?.name || ''
        const productName = products?.find(p => p.id === t.product_id)?.strain || ''
        const notes = t.notes || ''
        
        return (
          typeName.toLowerCase().includes(search) ||
          productName.toLowerCase().includes(search) ||
          notes.toLowerCase().includes(search)
        )
      })
    }

    return filtered
  }, [transactionsData, filterTypeId, filterProductId, filterEntityId, searchTerm, transactionTypes, products, warehouseMap, portfolioMap])

  // Debiti pendenti
  const pendingDebts = useMemo(() => {
    return filteredTransactions.filter(t => t.is_debt && t.debt_status === 'pending')
  }, [filteredTransactions])

  // Tipi movimento più comuni (per Quick Actions)
  const commonTransactionTypes = useMemo(() => {
    if (!transactionTypes) return []
    // Prendi i primi 4 tipi movimento (o tutti se meno di 4)
    return transactionTypes.slice(0, 4)
  }, [transactionTypes])

  const handleQuickAction = (typeId: number) => {
    const type = transactionTypes?.find(t => t.id === typeId)
    if (!type) return

    // Precompila form con tipo movimento
    setFormData({
      type_id: typeId,
      date: new Date(),
      product_id: undefined,
      quantity: undefined,
      from_warehouse_id: undefined,
      to_warehouse_id: undefined,
      from_portfolio_id: undefined,
      to_portfolio_id: undefined,
      amount: undefined,
      payment_method: type.payment_type === 'instant' ? 'cash' : 'debito',
      is_debt: type.payment_type === 'monthly',
      debt_status: type.payment_type === 'monthly' ? 'pending' : undefined,
      notes: undefined,
    })
    setEditingTransaction(null)
    setFormErrors({})
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type_id: transaction.type_id,
      date: transaction.date instanceof Date ? transaction.date : new Date(transaction.date),
      product_id: transaction.product_id,
      quantity: transaction.quantity,
      from_warehouse_id: transaction.from_warehouse_id,
      to_warehouse_id: transaction.to_warehouse_id,
      from_portfolio_id: transaction.from_portfolio_id,
      to_portfolio_id: transaction.to_portfolio_id,
      amount: transaction.amount,
      payment_method: transaction.payment_method || 'cash',
      is_debt: transaction.is_debt || false,
      debt_status: transaction.debt_status,
      debt_paid_date: transaction.debt_paid_date,
      notes: transaction.notes,
    })
    setFormErrors({})
  }

  const handleResetForm = () => {
    setEditingTransaction(null)
    setFormData({
      type_id: 0,
      date: new Date(),
      product_id: undefined,
      quantity: undefined,
      from_warehouse_id: undefined,
      to_warehouse_id: undefined,
      from_portfolio_id: undefined,
      to_portfolio_id: undefined,
      amount: undefined,
      payment_method: 'cash',
      is_debt: false,
      debt_status: undefined,
      notes: undefined,
    })
    setFormErrors({})
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.type_id || formData.type_id === 0) {
      errors.type_id = 'Seleziona un tipo movimento'
    }

    if (selectedTransactionType?.affects_warehouse) {
      if (!formData.from_warehouse_id && !formData.to_warehouse_id) {
        errors.warehouse = 'Seleziona almeno un magazzino (origine o destinazione)'
      }
    }

    if (selectedTransactionType?.affects_portfolio) {
      if (!formData.from_portfolio_id && !formData.to_portfolio_id) {
        errors.portfolio = 'Seleziona almeno un portafoglio (origine o destinazione)'
      }
      if (!formData.amount || formData.amount <= 0) {
        errors.amount = 'L\'importo è obbligatorio e deve essere maggiore di zero'
      }
    }

    if (formData.is_debt && !formData.debt_status) {
      errors.debt_status = 'Seleziona lo stato del debito'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
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
      if (editingTransaction?.id) {
        await updateMutation.mutateAsync({
          ...editingTransaction,
          ...formData,
        })
        toast({
          title: 'Movimento aggiornato',
          description: 'Le modifiche sono state salvate con successo',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Movimento creato',
          description: 'Il nuovo movimento è stato registrato con successo',
          variant: 'success',
        })
      }
      handleResetForm()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      logger.error('Error saving transaction', error as Error)
      toast({
        title: 'Errore',
        description: `Errore nel salvataggio del movimento: ${errorMessage}`,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: number) => {
    setConfirmDeleteDialog({ open: true, transactionId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.transactionId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.transactionId)
      toast({
        title: 'Movimento eliminato',
        description: 'Il movimento è stato eliminato con successo',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, transactionId: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione del movimento'
      logger.error('Error deleting transaction', error as Error, { transactionId: confirmDeleteDialog.transactionId })
      toast({
        title: 'Errore',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleSettleDebt = async (transaction: Transaction) => {
    if (!transaction.id) return
    
    try {
      await updateMutation.mutateAsync({
        ...transaction,
        debt_status: 'paid',
        debt_paid_date: new Date(),
      })
      toast({
        title: 'Debito saldato',
        description: 'Il debito è stato segnato come saldato',
        variant: 'success',
      })
    } catch (error) {
      logger.error('Error settling debt', error as Error)
      toast({
        title: 'Errore',
        description: 'Errore nel saldare il debito',
        variant: 'destructive',
      })
    }
  }

  // Filtra magazzini per entità selezionata
  const availableWarehouses = useMemo(() => {
    if (!warehouses) return []
    if (filterEntityId === 'all') return warehouses
    return warehouses.filter(w => w.entity_id === filterEntityId)
  }, [warehouses, filterEntityId])

  // Filtra portafogli per entità selezionata
  const availablePortfolios = useMemo(() => {
    if (!portfolios) return []
    if (filterEntityId === 'all') return portfolios
    return portfolios.filter(p => p.entity_id === filterEntityId)
  }, [portfolios, filterEntityId])

  // Formatta data per input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Movimenti</h2>
        <p className="text-muted-foreground mt-2">
          Registra e gestisci i movimenti di magazzino e portafogli
        </p>
      </div>

      {/* Quick Actions Bar */}
      {commonTransactionTypes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Azioni Rapide</CardTitle>
            <CardDescription className="text-sm">
              Crea rapidamente i movimenti più comuni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {commonTransactionTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(type.id!)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {type.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debiti Pendenti - Prominente */}
      {pendingDebts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Debiti Pendenti</CardTitle>
                <Badge variant="destructive">{pendingDebts.length}</Badge>
              </div>
            </div>
            <CardDescription>
              Ci sono {pendingDebts.length} debito{pendingDebts.length !== 1 ? 'i' : ''} in sospeso da saldare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pendingDebts.slice(0, 5).map((debt) => {
                const type = transactionTypes?.find(t => t.id === debt.type_id)
                const date = debt.date instanceof Date ? debt.date : new Date(debt.date)
                return (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-background"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{type?.name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('it-IT')} - € {debt.amount?.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSettleDebt(debt)}
                      className="ml-2"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Salda
                    </Button>
                  </div>
                )
              })}
              {pendingDebts.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  ... e altri {pendingDebts.length - 5} debiti
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Split View: Form + Lista */}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Form Sinistra (sempre visibile su desktop) */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {editingTransaction ? 'Modifica Movimento' : 'Nuovo Movimento'}
                </CardTitle>
                {editingTransaction && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetForm}
                    aria-label="Annulla modifica"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipo Movimento */}
                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Tipo Movimento *</Label>
                  <Select
                    value={formData.type_id === 0 ? '' : formData.type_id.toString()}
                    onValueChange={(v) => {
                      const typeId = parseInt(v)
                      const type = transactionTypes?.find(t => t.id === typeId)
                      setFormData({
                        ...formData,
                        type_id: typeId,
                        from_warehouse_id: type?.affects_warehouse ? formData.from_warehouse_id : undefined,
                        to_warehouse_id: type?.affects_warehouse ? formData.to_warehouse_id : undefined,
                        from_portfolio_id: type?.affects_portfolio ? formData.from_portfolio_id : undefined,
                        to_portfolio_id: type?.affects_portfolio ? formData.to_portfolio_id : undefined,
                        amount: type?.affects_portfolio ? formData.amount : undefined,
                      })
                    }}
                  >
                    <SelectTrigger id="transaction-type" aria-label="Seleziona tipo movimento">
                      <SelectValue placeholder="Seleziona tipo movimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id?.toString() || ''}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.type_id && (
                    <p className="text-sm text-destructive">{formErrors.type_id}</p>
                  )}
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <Label htmlFor="transaction-date">Data *</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={formatDateForInput(formData.date)}
                    onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                    required
                  />
                </div>

                {/* Prodotto */}
                {selectedTransactionType?.affects_warehouse && (
                  <div className="space-y-2">
                    <Label htmlFor="transaction-product">Prodotto</Label>
                    <Select
                      value={formData.product_id || ''}
                      onValueChange={(v) => setFormData({ ...formData, product_id: v || undefined })}
                    >
                      <SelectTrigger id="transaction-product" aria-label="Seleziona prodotto">
                        <SelectValue placeholder="Seleziona prodotto (opzionale)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nessun prodotto</SelectItem>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.strain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Quantità */}
                {selectedTransactionType?.affects_warehouse && formData.product_id && (
                  <div className="space-y-2">
                    <Label htmlFor="transaction-quantity">Quantità (g)</Label>
                    <Input
                      id="transaction-quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.quantity || ''}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="0.00"
                    />
                  </div>
                )}

                {/* Magazzini */}
                {selectedTransactionType?.affects_warehouse && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="from-warehouse">Magazzino Origine</Label>
                        <Select
                          value={formData.from_warehouse_id?.toString() || ''}
                          onValueChange={(v) => setFormData({ ...formData, from_warehouse_id: v ? parseInt(v) : undefined })}
                        >
                          <SelectTrigger id="from-warehouse" aria-label="Seleziona magazzino origine">
                            <SelectValue placeholder="Nessuno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nessuno</SelectItem>
                            {availableWarehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id?.toString() || ''}>
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-warehouse">Magazzino Destinazione</Label>
                        <Select
                          value={formData.to_warehouse_id?.toString() || ''}
                          onValueChange={(v) => setFormData({ ...formData, to_warehouse_id: v ? parseInt(v) : undefined })}
                        >
                          <SelectTrigger id="to-warehouse" aria-label="Seleziona magazzino destinazione">
                            <SelectValue placeholder="Nessuno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nessuno</SelectItem>
                            {availableWarehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id?.toString() || ''}>
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formErrors.warehouse && (
                      <p className="text-sm text-destructive">{formErrors.warehouse}</p>
                    )}
                  </>
                )}

                {/* Portafogli */}
                {selectedTransactionType?.affects_portfolio && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="from-portfolio">Portafoglio Origine</Label>
                        <Select
                          value={formData.from_portfolio_id?.toString() || ''}
                          onValueChange={(v) => setFormData({ ...formData, from_portfolio_id: v ? parseInt(v) : undefined })}
                        >
                          <SelectTrigger id="from-portfolio" aria-label="Seleziona portafoglio origine">
                            <SelectValue placeholder="Nessuno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nessuno</SelectItem>
                            {availablePortfolios.map((portfolio) => (
                              <SelectItem key={portfolio.id} value={portfolio.id?.toString() || ''}>
                                {portfolio.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-portfolio">Portafoglio Destinazione</Label>
                        <Select
                          value={formData.to_portfolio_id?.toString() || ''}
                          onValueChange={(v) => setFormData({ ...formData, to_portfolio_id: v ? parseInt(v) : undefined })}
                        >
                          <SelectTrigger id="to-portfolio" aria-label="Seleziona portafoglio destinazione">
                            <SelectValue placeholder="Nessuno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nessuno</SelectItem>
                            {availablePortfolios.map((portfolio) => (
                              <SelectItem key={portfolio.id} value={portfolio.id?.toString() || ''}>
                                {portfolio.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formErrors.portfolio && (
                      <p className="text-sm text-destructive">{formErrors.portfolio}</p>
                    )}

                    {/* Importo */}
                    <div className="space-y-2">
                      <Label htmlFor="transaction-amount">Importo (€) *</Label>
                      <Input
                        id="transaction-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="0.00"
                        aria-invalid={!!formErrors.amount}
                      />
                      {formErrors.amount && (
                        <p className="text-sm text-destructive">{formErrors.amount}</p>
                      )}
                    </div>

                    {/* Metodo Pagamento */}
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Metodo Pagamento</Label>
                      <Select
                        value={formData.payment_method || 'cash'}
                        onValueChange={(v) => setFormData({ ...formData, payment_method: v as 'cash' | 'bancomat' | 'debito' })}
                      >
                        <SelectTrigger id="payment-method" aria-label="Seleziona metodo pagamento">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bancomat">Bancomat</SelectItem>
                          <SelectItem value="debito">Debito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Debito */}
                    {formData.payment_method === 'debito' && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is-debt"
                            checked={formData.is_debt || false}
                            onCheckedChange={(checked) => setFormData({ 
                              ...formData, 
                              is_debt: checked,
                              debt_status: checked ? 'pending' : undefined
                            })}
                          />
                          <Label htmlFor="is-debt">È un debito</Label>
                        </div>
                        {formData.is_debt && (
                          <div className="space-y-2">
                            <Label htmlFor="debt-status">Stato Debito</Label>
                            <Select
                              value={formData.debt_status || 'pending'}
                              onValueChange={(v) => setFormData({ 
                                ...formData, 
                                debt_status: v as 'pending' | 'paid',
                                debt_paid_date: v === 'paid' ? new Date() : undefined
                              })}
                            >
                              <SelectTrigger id="debt-status" aria-label="Seleziona stato debito">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">In Sospeso</SelectItem>
                                <SelectItem value="paid">Saldato</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.debt_status && (
                              <p className="text-sm text-destructive">{formErrors.debt_status}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="transaction-notes">Note</Label>
                  <Textarea
                    id="transaction-notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value || undefined })}
                    placeholder="Note aggiuntive (opzionale)"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingTransaction ? 'Salva Modifiche' : 'Crea Movimento'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Lista Movimenti Destra */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Storico Movimenti</CardTitle>
                  <CardDescription>
                    {filteredTransactions.length} movimento{filteredTransactions.length !== 1 ? 'i' : ''} trovato{filteredTransactions.length !== 1 ? 'i' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtri */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cerca movimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Cerca movimenti"
                  />
                </div>
                <Select
                  value={filterTypeId === 'all' ? 'all' : filterTypeId.toString()}
                  onValueChange={(v) => setFilterTypeId(v === 'all' ? 'all' : parseInt(v))}
                >
                  <SelectTrigger aria-label="Filtra per tipo movimento">
                    <SelectValue placeholder="Tipo Movimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i tipi</SelectItem>
                    {transactionTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id?.toString() || ''}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterProductId}
                  onValueChange={(v) => setFilterProductId(v)}
                >
                  <SelectTrigger aria-label="Filtra per prodotto">
                    <SelectValue placeholder="Prodotto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i prodotti</SelectItem>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.strain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterEntityId === 'all' ? 'all' : filterEntityId.toString()}
                  onValueChange={(v) => setFilterEntityId(v === 'all' ? 'all' : parseInt(v))}
                >
                  <SelectTrigger aria-label="Filtra per entità">
                    <SelectValue placeholder="Entità" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le entità</SelectItem>
                    {entities?.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id?.toString() || ''}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tabella Movimenti */}
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Nessun movimento trovato</p>
                  <p className="text-sm mt-1">
                    {searchTerm || filterTypeId !== 'all' || filterProductId !== 'all' || filterEntityId !== 'all'
                      ? 'Prova a modificare i filtri di ricerca'
                      : 'Crea il primo movimento per iniziare'}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Prodotto</TableHead>
                        <TableHead>Quantità</TableHead>
                        <TableHead>Magazzini</TableHead>
                        <TableHead>Portafogli</TableHead>
                        <TableHead>Importo</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => {
                        const type = transactionTypes?.find(t => t.id === transaction.type_id)
                        const product = products?.find(p => p.id === transaction.product_id)
                        const fromWarehouse = transaction.from_warehouse_id ? warehouseMap.get(transaction.from_warehouse_id) : null
                        const toWarehouse = transaction.to_warehouse_id ? warehouseMap.get(transaction.to_warehouse_id) : null
                        const fromPortfolio = transaction.from_portfolio_id ? portfolioMap.get(transaction.from_portfolio_id) : null
                        const toPortfolio = transaction.to_portfolio_id ? portfolioMap.get(transaction.to_portfolio_id) : null
                        const date = transaction.date instanceof Date ? transaction.date : new Date(transaction.date)

                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {date.toLocaleDateString('it-IT')}
                            </TableCell>
                            <TableCell className="font-medium">
                              {type?.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {product?.strain || transaction.product_id || '-'}
                            </TableCell>
                            <TableCell>
                              {transaction.quantity ? `${transaction.quantity.toLocaleString('it-IT')} g` : '-'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {fromWarehouse && toWarehouse ? (
                                <span>{fromWarehouse.name} → {toWarehouse.name}</span>
                              ) : fromWarehouse ? (
                                <span className="text-muted-foreground">→ {fromWarehouse.name}</span>
                              ) : toWarehouse ? (
                                <span>{toWarehouse.name}</span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {fromPortfolio && toPortfolio ? (
                                <span>{fromPortfolio.name} → {toPortfolio.name}</span>
                              ) : fromPortfolio ? (
                                <span className="text-muted-foreground">→ {fromPortfolio.name}</span>
                              ) : toPortfolio ? (
                                <span>{toPortfolio.name}</span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {transaction.amount ? (
                                <span className={transaction.is_debt && transaction.debt_status === 'pending' ? 'text-destructive font-medium' : ''}>
                                  € {transaction.amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  {transaction.is_debt && transaction.debt_status === 'pending' && (
                                    <span className="ml-1 text-xs">(Debito)</span>
                                  )}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(transaction)}
                                  aria-label={`Modifica movimento ${transaction.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => transaction.id && handleDelete(transaction.id)}
                                  className="text-destructive hover:text-destructive"
                                  aria-label={`Elimina movimento ${transaction.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Paginazione */}
              {transactionsData && transactionsData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Pagina {page} di {transactionsData.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Precedente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(transactionsData.totalPages, p + 1))}
                      disabled={page === transactionsData.totalPages}
                    >
                      Successiva
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AlertDialog per conferma eliminazione */}
      <AlertDialog
        open={confirmDeleteDialog.open}
        onOpenChange={(open) => setConfirmDeleteDialog({ open, transactionId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina movimento</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo movimento? Questa azione non può essere annullata e influenzerà lo stock calcolato.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={performDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
