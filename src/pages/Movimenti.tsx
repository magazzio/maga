import { useState, useEffect } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-product-type'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Calendar, Package, Warehouse, Wallet, ArrowRight, ArrowDown, ArrowUp, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useTransactions'
import { useTransactionTypes, useTransactionType } from '@/hooks/useTransactionTypes'
import { useWarehouses } from '@/hooks/useWarehouses'
import { usePortfolios } from '@/hooks/usePortfolios'
import { useProducts } from '@/hooks/useProducts'
import { Transaction } from '@/db'
import { format } from 'date-fns'

export default function Movimenti() {
  const { data: transactions, isLoading } = useTransactions()
  const { data: transactionTypes } = useTransactionTypes()
  const { data: warehouses } = useWarehouses()
  const { data: portfolios } = usePortfolios()
  const { data: products } = useProducts()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type_id: 0,
    date: new Date(),
    product_id: undefined,
    quantity: undefined,
    product_state: undefined,
    from_warehouse_id: undefined,
    to_warehouse_id: undefined,
    from_portfolio_id: undefined,
    to_portfolio_id: undefined,
    amount: undefined,
    payment_method: undefined,
    is_debt: false,
    debt_status: undefined,
    notes: undefined,
  })

  // Carica tipo movimento selezionato per applicare suggerimenti
  const { data: selectedTransactionType } = useTransactionType(selectedTypeId || 0)

  // Applica suggerimenti quando cambia il tipo movimento
  useEffect(() => {
    if (selectedTransactionType && !editingTransaction) {
      const newFormData: Partial<Transaction> = {
        ...formData,
        type_id: selectedTransactionType.id!,
      }

      // Applica suggerimenti magazzino
      if (selectedTransactionType.affects_warehouse) {
        if (selectedTransactionType.warehouse_direction === 'transfer') {
          newFormData.from_warehouse_id = selectedTransactionType.suggested_from_warehouse_id
          newFormData.to_warehouse_id = selectedTransactionType.suggested_to_warehouse_id
        } else if (selectedTransactionType.warehouse_direction === 'in') {
          newFormData.to_warehouse_id = selectedTransactionType.suggested_to_warehouse_id
          newFormData.from_warehouse_id = undefined
        } else if (selectedTransactionType.warehouse_direction === 'out') {
          newFormData.from_warehouse_id = selectedTransactionType.suggested_from_warehouse_id
          newFormData.to_warehouse_id = undefined
        }
      }

      // Applica suggerimenti portafoglio
      if (selectedTransactionType.affects_portfolio) {
        if (selectedTransactionType.portfolio_direction === 'transfer') {
          newFormData.from_portfolio_id = selectedTransactionType.suggested_from_portfolio_id
          newFormData.to_portfolio_id = selectedTransactionType.suggested_to_portfolio_id
        } else if (selectedTransactionType.portfolio_direction === 'in') {
          newFormData.to_portfolio_id = selectedTransactionType.suggested_to_portfolio_id
          newFormData.from_portfolio_id = undefined
        } else if (selectedTransactionType.portfolio_direction === 'out') {
          newFormData.from_portfolio_id = selectedTransactionType.suggested_from_portfolio_id
          newFormData.to_portfolio_id = undefined
        }
      }

      // Applica trasformazione di stato se configurata
      if (selectedTransactionType.transforms_state) {
        // Lo stato finale viene salvato nel movimento
        newFormData.product_state = selectedTransactionType.to_state
      }

      setFormData(newFormData)
    }
  }, [selectedTransactionType, editingTransaction])

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction)
      setSelectedTypeId(transaction.type_id)
      setFormData({
        ...transaction,
        date: transaction.date instanceof Date ? transaction.date : new Date(transaction.date),
      })
    } else {
      setEditingTransaction(null)
      setSelectedTypeId(null)
      setFormData({
        type_id: 0,
        date: new Date(),
        product_id: undefined,
        quantity: undefined,
        product_state: undefined,
        from_warehouse_id: undefined,
        to_warehouse_id: undefined,
        from_portfolio_id: undefined,
        to_portfolio_id: undefined,
        amount: undefined,
        payment_method: undefined,
        is_debt: false,
        debt_status: undefined,
        notes: undefined,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTransaction(null)
    setSelectedTypeId(null)
    setErrors({})
    setFormData({
      type_id: 0,
      date: new Date(),
      product_id: undefined,
      quantity: undefined,
      product_state: undefined,
      from_warehouse_id: undefined,
      to_warehouse_id: undefined,
      from_portfolio_id: undefined,
      to_portfolio_id: undefined,
      amount: undefined,
      payment_method: undefined,
      is_debt: false,
      debt_status: undefined,
      notes: undefined,
    })
  }

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.type_id) {
      newErrors.type_id = 'Seleziona un tipo movimento'
    }
    if (!formData.date) {
      newErrors.date = 'Seleziona una data'
    }
    if (selectedType?.requires_product) {
      if (!formData.product_id) {
        newErrors.product_id = 'Seleziona una strain'
      }
      if (!formData.quantity || formData.quantity <= 0) {
        newErrors.quantity = 'Inserisci una quantità valida'
      }
    }
    if (selectedType?.affects_warehouse) {
      if (selectedType.warehouse_direction === 'transfer') {
        if (!formData.from_warehouse_id) {
          newErrors.from_warehouse_id = 'Seleziona magazzino origine'
        }
        if (!formData.to_warehouse_id) {
          newErrors.to_warehouse_id = 'Seleziona magazzino destinazione'
        }
      } else if (selectedType.warehouse_direction === 'in' && !formData.to_warehouse_id) {
        newErrors.to_warehouse_id = 'Seleziona magazzino destinazione'
      } else if (selectedType.warehouse_direction === 'out' && !formData.from_warehouse_id) {
        newErrors.from_warehouse_id = 'Seleziona magazzino origine'
      }
    }
    if (selectedType?.affects_portfolio) {
      if (!formData.amount || formData.amount <= 0) {
        newErrors.amount = 'Inserisci un importo valido'
      }
      if (selectedType.portfolio_direction === 'transfer') {
        if (!formData.from_portfolio_id) {
          newErrors.from_portfolio_id = 'Seleziona portafoglio origine'
        }
        if (!formData.to_portfolio_id) {
          newErrors.to_portfolio_id = 'Seleziona portafoglio destinazione'
        }
      } else if (selectedType.portfolio_direction === 'in' && !formData.to_portfolio_id) {
        newErrors.to_portfolio_id = 'Seleziona portafoglio destinazione'
      } else if (selectedType.portfolio_direction === 'out' && !formData.from_portfolio_id) {
        newErrors.from_portfolio_id = 'Seleziona portafoglio origine'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    if (editingTransaction?.id) {
      updateMutation.mutate({ ...editingTransaction, ...formData } as Transaction)
    } else {
      createMutation.mutate(formData as Omit<Transaction, 'id'>)
    }
    setErrors({})
    handleCloseDialog()
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
  }

  const selectedType = transactionTypes?.find(t => t.id === selectedTypeId)

  // Paginazione
  const totalPages = transactions ? Math.ceil(transactions.length / pageSize) : 0
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTransactions = transactions?.slice(startIndex, endIndex) || []

  // Reset pagina quando cambiano i dati
  useEffect(() => {
    if (transactions && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [transactions, currentPage, totalPages])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movimenti</h2>
          <p className="text-muted-foreground">Gestisci i movimenti di magazzino e portafogli</p>
        </div>
        <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo movimento">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Nuovo Movimento
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Caricamento...</div>
        </div>
      ) : (
        <>
          {/* Tabella Desktop */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="align-middle w-[11%]">Data</TableHead>
                  <TableHead className="align-middle w-[14%]">Tipo</TableHead>
                  <TableHead className="align-middle w-[14%]">Prodotto</TableHead>
                  <TableHead className="text-center align-middle w-[9%]">Quantità</TableHead>
                  <TableHead className="text-center align-middle w-[9%]">Stato</TableHead>
                  <TableHead className="align-middle w-[17%]">Magazzino</TableHead>
                  <TableHead className="align-middle w-[17%]">Portafoglio</TableHead>
                  <TableHead className="text-center align-middle w-[11%]">Importo</TableHead>
                  <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => {
                  const type = transactionTypes?.find(t => t.id === transaction.type_id)
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="align-middle w-[11%]">
                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="align-middle w-[14%]">{type?.name || 'N/A'}</TableCell>
                      <TableCell className="align-middle w-[14%]">
                        {transaction.product_id 
                          ? (products?.find(p => p.id === transaction.product_id)?.strain || transaction.product_id)
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-center align-middle w-[9%]">{transaction.quantity || '-'}</TableCell>
                      <TableCell className="text-center align-middle w-[9%]">
                        <div className="flex justify-center items-center">
                          {transaction.product_state ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.product_state === 'raw' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.product_state === 'raw' ? 'Raw' : 'Cured'}
                            </span>
                          ) : (
                            '-'
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-middle w-[17%]">
                        {transaction.from_warehouse_id && transaction.to_warehouse_id ? (
                          <span className="text-sm text-muted-foreground">
                            {warehouses?.find(w => w.id === transaction.from_warehouse_id)?.name} → {warehouses?.find(w => w.id === transaction.to_warehouse_id)?.name}
                          </span>
                        ) : transaction.from_warehouse_id ? (
                          <span className="text-sm text-muted-foreground">
                            {warehouses?.find(w => w.id === transaction.from_warehouse_id)?.name} (uscita)
                          </span>
                        ) : transaction.to_warehouse_id ? (
                          <span className="text-sm text-muted-foreground">
                            {warehouses?.find(w => w.id === transaction.to_warehouse_id)?.name} (entrata)
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="align-middle w-[17%]">
                        {transaction.from_portfolio_id && transaction.to_portfolio_id ? (
                          <span className="text-sm text-muted-foreground">
                            {portfolios?.find(p => p.id === transaction.from_portfolio_id)?.name} → {portfolios?.find(p => p.id === transaction.to_portfolio_id)?.name}
                          </span>
                        ) : transaction.from_portfolio_id ? (
                          <span className="text-sm text-muted-foreground">
                            {portfolios?.find(p => p.id === transaction.from_portfolio_id)?.name} (uscita)
                          </span>
                        ) : transaction.to_portfolio_id ? (
                          <span className="text-sm text-muted-foreground">
                            {portfolios?.find(p => p.id === transaction.to_portfolio_id)?.name} (entrata)
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-center align-middle w-[11%]">
                        {transaction.amount ? `€ ${transaction.amount.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-center align-middle w-[120px]">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(transaction)}
                            aria-label={`Modifica movimento del ${format(new Date(transaction.date), 'dd/MM/yyyy')}`}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Modifica</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(transaction.id!)}
                            aria-label={`Elimina movimento del ${format(new Date(transaction.date), 'dd/MM/yyyy')}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Elimina</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Nessun movimento registrato
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card View Mobile */}
          <div className="md:hidden space-y-4">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => {
                const type = transactionTypes?.find(t => t.id === transaction.type_id)
                return (
                  <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="font-medium">
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(transaction)}
                          aria-label={`Modifica movimento del ${format(new Date(transaction.date), 'dd/MM/yyyy')}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(transaction.id!)}
                          aria-label={`Elimina movimento del ${format(new Date(transaction.date), 'dd/MM/yyyy')}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tipo:</span>
                        <span>{type?.name || 'N/A'}</span>
                      </div>
                      {transaction.product_id && (
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>
                            {products?.find(p => p.id === transaction.product_id)?.strain || transaction.product_id}
                            {transaction.quantity && ` - ${transaction.quantity}g`}
                            {transaction.product_state && (
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                transaction.product_state === 'raw' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {transaction.product_state === 'raw' ? 'Raw' : 'Cured'}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      {transaction.from_warehouse_id || transaction.to_warehouse_id ? (
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>
                            {transaction.from_warehouse_id && transaction.to_warehouse_id ? (
                              <>
                                {warehouses?.find(w => w.id === transaction.from_warehouse_id)?.name} → {warehouses?.find(w => w.id === transaction.to_warehouse_id)?.name}
                              </>
                            ) : transaction.from_warehouse_id ? (
                              <>
                                {warehouses?.find(w => w.id === transaction.from_warehouse_id)?.name} (uscita)
                              </>
                            ) : (
                              <>
                                {warehouses?.find(w => w.id === transaction.to_warehouse_id)?.name} (entrata)
                              </>
                            )}
                          </span>
                        </div>
                      ) : null}
                      {transaction.from_portfolio_id || transaction.to_portfolio_id ? (
                        <div className="flex items-center gap-2">
                          <Wallet className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>
                            {transaction.from_portfolio_id && transaction.to_portfolio_id ? (
                              <>
                                {portfolios?.find(p => p.id === transaction.from_portfolio_id)?.name} → {portfolios?.find(p => p.id === transaction.to_portfolio_id)?.name}
                              </>
                            ) : transaction.from_portfolio_id ? (
                              <>
                                {portfolios?.find(p => p.id === transaction.from_portfolio_id)?.name} (uscita)
                              </>
                            ) : (
                              <>
                                {portfolios?.find(p => p.id === transaction.to_portfolio_id)?.name} (entrata)
                              </>
                            )}
                            {transaction.amount && ` - €${transaction.amount.toFixed(2)}`}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nessun movimento registrato
              </div>
            )}
          </div>

          {/* Paginazione - Mostra solo se ci sono più elementi della pageSize */}
          {transactions && transactions.length > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-{Math.min(endIndex, transactions.length)} di {transactions.length} movimenti
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
        </>
      )}

      {/* Dialog Creazione/Modifica */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full"
          aria-describedby="transaction-dialog-description"
        >
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Modifica Movimento' : 'Nuovo Movimento'}
            </DialogTitle>
            <DialogDescription id="transaction-dialog-description">
              {editingTransaction
                ? 'Modifica i dettagli del movimento'
                : 'Crea un nuovo movimento di magazzino o portafoglio'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Tipo Movimento */}
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Tipo Movimento *</Label>
                <Select
                  value={selectedTypeId?.toString() || ''}
                  onValueChange={(value) => {
                    const typeId = parseInt(value)
                    setSelectedTypeId(typeId)
                    setFormData({ ...formData, type_id: typeId })
                    setErrors({ ...errors, type_id: '' })
                  }}
                  disabled={!!editingTransaction}
                >
                  <SelectTrigger className={errors.type_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleziona tipo movimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id!.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type_id && (
                  <p className="text-sm text-red-500">{errors.type_id}</p>
                )}
                {selectedType?.description && (
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-md text-sm text-muted-foreground" role="note" aria-label="Descrizione tipo movimento">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{selectedType.description}</span>
                  </div>
                )}
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  required
                />
              </div>

              {/* Prodotto (se richiesto dal tipo) */}
              {selectedType?.requires_product && (
                <div className="space-y-2">
                  <Label htmlFor="product">Strain *</Label>
                  <Select
                    value={formData.product_id || undefined}
                    onValueChange={(value) => {
                      setFormData({ ...formData, product_id: value })
                      setErrors({ ...errors, product_id: '' })
                    }}
                  >
                    <SelectTrigger className={errors.product_id ? 'border-red-500' : (!formData.product_id ? 'border-red-300' : '')}>
                      <SelectValue placeholder="Seleziona strain" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.strain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.product_id && (
                    <p className="text-sm text-red-500">{errors.product_id}</p>
                  )}
                </div>
              )}

              {/* Quantità (se richiesto prodotto) */}
              {selectedType?.requires_product && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantità (g) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantity || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, quantity: parseFloat(e.target.value) || undefined })
                      setErrors({ ...errors, quantity: '' })
                    }}
                    placeholder="0.00"
                    className={errors.quantity ? 'border-red-500' : ''}
                    required={selectedType.requires_product}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity}</p>
                  )}
                </div>
              )}

              {/* Stato Prodotto (solo se richiesto prodotto) */}
              {selectedType?.requires_product && (
                <div className="space-y-2">
                  {selectedType.transforms_state ? (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>Trasformazione di Stato</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        <div className="space-y-2">
                          <Label htmlFor="from-state">Stato Iniziale</Label>
                          <div className="px-3 py-2 border rounded-md bg-background">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              selectedType.from_state === 'raw' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {selectedType.from_state === 'raw' ? 'Raw' : 'Cured'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Stato del prodotto prima della trasformazione</p>
                        </div>
                        <div className="pt-6 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="to-state">Stato Finale</Label>
                          <div className="px-3 py-2 border rounded-md bg-background">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              selectedType.to_state === 'raw' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {selectedType.to_state === 'raw' ? 'Raw' : 'Cured'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Stato del prodotto dopo la trasformazione</p>
                        </div>
                      </div>
                      {formData.from_warehouse_id && formData.to_warehouse_id && formData.from_warehouse_id === formData.to_warehouse_id && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          <p><strong>Trasformazione interna:</strong> Il prodotto rimane nello stesso magazzino ma cambia stato da <strong>{selectedType.from_state === 'raw' ? 'Raw' : 'Cured'}</strong> a <strong>{selectedType.to_state === 'raw' ? 'Raw' : 'Cured'}</strong>.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="product-state">Stato Prodotto</Label>
                      <Select
                        value={formData.product_state || undefined}
                        onValueChange={(value) => setFormData({ ...formData, product_state: value as 'raw' | 'cured' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona stato (opzionale)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw">Raw</SelectItem>
                          <SelectItem value="cured">Cured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Magazzino - Mostra campi in base alla direzione */}
              {selectedType?.affects_warehouse && (
                <div className="space-y-4 p-4 border rounded-lg" role="group" aria-labelledby="warehouse-section">
                  <div className="flex items-center gap-2 text-sm font-medium" id="warehouse-section">
                    <Warehouse className="h-4 w-4" aria-hidden="true" />
                    Magazzino
                  </div>
                  {selectedType.warehouse_direction === 'transfer' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
                        <div className="space-y-2">
                          <Label htmlFor="from-warehouse">Da Magazzino *</Label>
                          <Select
                            value={formData.from_warehouse_id?.toString() || undefined}
                            onValueChange={(value) => {
                              setFormData({ ...formData, from_warehouse_id: value ? parseInt(value) : undefined })
                              setErrors({ ...errors, from_warehouse_id: '' })
                            }}
                          >
                            <SelectTrigger className={errors.from_warehouse_id ? 'border-red-500' : (!formData.from_warehouse_id ? 'border-red-300' : '')}>
                              <SelectValue placeholder="Seleziona magazzino" />
                            </SelectTrigger>
                            <SelectContent>
                              {warehouses?.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                                  {warehouse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.from_warehouse_id && (
                            <p className="text-sm text-red-500">{errors.from_warehouse_id}</p>
                          )}
                        </div>
                        <div className="pb-2 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="to-warehouse">A Magazzino *</Label>
                          <Select
                            value={formData.to_warehouse_id?.toString() || undefined}
                            onValueChange={(value) => {
                              setFormData({ ...formData, to_warehouse_id: value ? parseInt(value) : undefined })
                              setErrors({ ...errors, to_warehouse_id: '' })
                            }}
                          >
                            <SelectTrigger className={errors.to_warehouse_id ? 'border-red-500' : (!formData.to_warehouse_id ? 'border-red-300' : '')}>
                              <SelectValue placeholder="Seleziona magazzino" />
                            </SelectTrigger>
                            <SelectContent>
                              {warehouses?.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                                  {warehouse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.to_warehouse_id && (
                            <p className="text-sm text-red-500">{errors.to_warehouse_id}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedType.warehouse_direction === 'in' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-green-600" aria-hidden="true" />
                        <Label htmlFor="to-warehouse">Magazzino Destinazione (Entrata) *</Label>
                      </div>
                        <Select
                          value={formData.to_warehouse_id?.toString() || undefined}
                          onValueChange={(value) => {
                            setFormData({ ...formData, to_warehouse_id: value ? parseInt(value) : undefined })
                            setErrors({ ...errors, to_warehouse_id: '' })
                          }}
                        >
                          <SelectTrigger className={errors.to_warehouse_id ? 'border-red-500' : (!formData.to_warehouse_id ? 'border-red-300' : '')}>
                          <SelectValue placeholder="Seleziona magazzino" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses?.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.to_warehouse_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.to_warehouse_id}</p>
                      )}
                    </div>
                  )}
                  {selectedType.warehouse_direction === 'out' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-red-600" aria-hidden="true" />
                        <Label htmlFor="from-warehouse">Magazzino Origine (Uscita) *</Label>
                      </div>
                      <Select
                        value={formData.from_warehouse_id?.toString() || undefined}
                        onValueChange={(value) => setFormData({ ...formData, from_warehouse_id: value ? parseInt(value) : undefined })}
                      >
                        <SelectTrigger className={!formData.from_warehouse_id ? 'border-red-300' : ''}>
                          <SelectValue placeholder="Seleziona magazzino" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses?.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id!.toString()}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.from_warehouse_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.from_warehouse_id}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Portafoglio - Mostra campi in base alla direzione */}
              {selectedType?.affects_portfolio && (
                <div className="space-y-4 p-4 border rounded-lg" role="group" aria-labelledby="portfolio-section">
                  <div className="flex items-center gap-2 text-sm font-medium" id="portfolio-section">
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                    Portafoglio
                  </div>
                  {selectedType.portfolio_direction === 'transfer' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
                        <div className="space-y-2">
                          <Label htmlFor="from-portfolio">Da Portafoglio *</Label>
                          <Select
                            value={formData.from_portfolio_id?.toString() || undefined}
                            onValueChange={(value) => {
                              setFormData({ ...formData, from_portfolio_id: value ? parseInt(value) : undefined })
                              setErrors({ ...errors, from_portfolio_id: '' })
                            }}
                          >
                            <SelectTrigger className={errors.from_portfolio_id ? 'border-red-500' : (!formData.from_portfolio_id ? 'border-red-300' : '')}>
                              <SelectValue placeholder="Seleziona portafoglio" />
                            </SelectTrigger>
                            <SelectContent>
                              {portfolios?.map((portfolio) => (
                                <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                                  {portfolio.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.from_portfolio_id && (
                            <p className="text-sm text-red-500">{errors.from_portfolio_id}</p>
                          )}
                        </div>
                        <div className="pb-2 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="to-portfolio">A Portafoglio *</Label>
                          <Select
                            value={formData.to_portfolio_id?.toString() || undefined}
                            onValueChange={(value) => {
                              setFormData({ ...formData, to_portfolio_id: value ? parseInt(value) : undefined })
                              setErrors({ ...errors, to_portfolio_id: '' })
                            }}
                          >
                            <SelectTrigger className={errors.to_portfolio_id ? 'border-red-500' : (!formData.to_portfolio_id ? 'border-red-300' : '')}>
                              <SelectValue placeholder="Seleziona portafoglio" />
                            </SelectTrigger>
                            <SelectContent>
                              {portfolios?.map((portfolio) => (
                                <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                                  {portfolio.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.to_portfolio_id && (
                            <p className="text-sm text-red-500">{errors.to_portfolio_id}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedType.portfolio_direction === 'in' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-green-600" aria-hidden="true" />
                        <Label htmlFor="to-portfolio">Portafoglio Destinazione (Entrata) *</Label>
                      </div>
                      <Select
                        value={formData.to_portfolio_id?.toString() || undefined}
                        onValueChange={(value) => setFormData({ ...formData, to_portfolio_id: value ? parseInt(value) : undefined })}
                      >
                        <SelectTrigger className={!formData.to_portfolio_id ? 'border-red-300' : ''}>
                          <SelectValue placeholder="Seleziona portafoglio" />
                        </SelectTrigger>
                        <SelectContent>
                          {portfolios?.map((portfolio) => (
                            <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                              {portfolio.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.to_portfolio_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.to_portfolio_id}</p>
                      )}
                    </div>
                  )}
                  {selectedType.portfolio_direction === 'out' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-red-600" aria-hidden="true" />
                        <Label htmlFor="from-portfolio">Portafoglio Origine (Uscita) *</Label>
                      </div>
                      <Select
                        value={formData.from_portfolio_id?.toString() || undefined}
                        onValueChange={(value) => setFormData({ ...formData, from_portfolio_id: value ? parseInt(value) : undefined })}
                      >
                        <SelectTrigger className={!formData.from_portfolio_id ? 'border-red-300' : ''}>
                          <SelectValue placeholder="Seleziona portafoglio" />
                        </SelectTrigger>
                        <SelectContent>
                          {portfolios?.map((portfolio) => (
                            <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                              {portfolio.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.from_portfolio_id && (
                        <p className="text-sm text-red-500 mt-1">{errors.from_portfolio_id}</p>
                      )}
                    </div>
                  )}

                  {/* Importo */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Importo (€) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || undefined })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Tipo Pagamento */}
                  {selectedType.payment_type && (
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Metodo Pagamento</Label>
                      <Select
                        value={formData.payment_method || undefined}
                        onValueChange={(value) => setFormData({ ...formData, payment_method: value as 'cash' | 'bancomat' | 'debito' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona metodo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Contanti</SelectItem>
                          <SelectItem value="bancomat">Bancomat</SelectItem>
                          <SelectItem value="debito">Debito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Debito */}
                  {selectedType.payment_type === 'monthly' && (
                    <div className="space-y-2">
                      <Label>
                        <input
                          type="checkbox"
                          checked={formData.is_debt || false}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              is_debt: e.target.checked,
                              debt_status: e.target.checked ? 'pending' : undefined,
                            })
                          }}
                          className="mr-2"
                        />
                        Pagamento con debito
                      </Label>
                      {formData.is_debt && (
                        <div className="space-y-2 ml-6">
                          <Label htmlFor="debt-status">Stato Debito</Label>
                          <Select
                            value={formData.debt_status || 'pending'}
                            onValueChange={(value) => setFormData({ ...formData, debt_status: value as 'pending' | 'paid' })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">In sospeso</SelectItem>
                              <SelectItem value="paid">Pagato</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Anteprima Movimento */}
              {selectedType && (
                <div className="p-4 bg-muted rounded-lg border-2 border-dashed" role="region" aria-labelledby="preview-heading">
                  <div className="flex items-center gap-2 mb-3" id="preview-heading">
                    <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Label className="text-sm font-semibold">Anteprima Movimento</Label>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Tipo:</span>
                      <span>{selectedType.name}</span>
                    </div>
                    {formData.product_id && (
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        <span>
                          <span className="font-medium">Strain:</span> {products?.find(p => p.id === formData.product_id)?.strain || formData.product_id}
                          {formData.quantity && ` - ${formData.quantity}g`}
                          {selectedType.transforms_state ? (
                            <span className="ml-1">
                              ({selectedType.from_state === 'raw' ? 'Raw' : 'Cured'} → {selectedType.to_state === 'raw' ? 'Raw' : 'Cured'})
                            </span>
                          ) : (
                            formData.product_state && ` (${formData.product_state === 'raw' ? 'Raw' : 'Cured'})`
                          )}
                        </span>
                      </div>
                    )}
                    {selectedType.affects_warehouse && (
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        <span>
                          {selectedType.warehouse_direction === 'transfer' && formData.from_warehouse_id && formData.to_warehouse_id && (
                            <>
                              <span className="font-medium">Magazzino:</span> {
                                formData.from_warehouse_id === formData.to_warehouse_id ? (
                                  <span>{warehouses?.find(w => w.id === formData.from_warehouse_id)?.name} <span className="text-muted-foreground">(trasformazione interna)</span></span>
                                ) : (
                                  <span>{warehouses?.find(w => w.id === formData.from_warehouse_id)?.name} → {warehouses?.find(w => w.id === formData.to_warehouse_id)?.name}</span>
                                )
                              }
                            </>
                          )}
                          {selectedType.warehouse_direction === 'in' && formData.to_warehouse_id && (
                            <>
                              <span className="font-medium">Magazzino:</span> Entrata in {warehouses?.find(w => w.id === formData.to_warehouse_id)?.name}
                            </>
                          )}
                          {selectedType.warehouse_direction === 'out' && formData.from_warehouse_id && (
                            <>
                              <span className="font-medium">Magazzino:</span> Uscita da {warehouses?.find(w => w.id === formData.from_warehouse_id)?.name}
                            </>
                          )}
                          {!formData.from_warehouse_id && !formData.to_warehouse_id && (
                            <span className="text-muted-foreground italic">Seleziona magazzino</span>
                          )}
                        </span>
                      </div>
                    )}
                    {selectedType.affects_portfolio && (
                      <div className="flex items-center gap-2">
                        <Wallet className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        <span>
                          {selectedType.portfolio_direction === 'transfer' && formData.from_portfolio_id && formData.to_portfolio_id && (
                            <>
                              <span className="font-medium">Portafoglio:</span> {portfolios?.find(p => p.id === formData.from_portfolio_id)?.name} → {portfolios?.find(p => p.id === formData.to_portfolio_id)?.name}
                              {formData.amount && ` (€${formData.amount.toFixed(2)})`}
                            </>
                          )}
                          {selectedType.portfolio_direction === 'in' && formData.to_portfolio_id && (
                            <>
                              <span className="font-medium">Portafoglio:</span> Entrata in {portfolios?.find(p => p.id === formData.to_portfolio_id)?.name}
                              {formData.amount && ` (€${formData.amount.toFixed(2)})`}
                            </>
                          )}
                          {selectedType.portfolio_direction === 'out' && formData.from_portfolio_id && (
                            <>
                              <span className="font-medium">Portafoglio:</span> Uscita da {portfolios?.find(p => p.id === formData.from_portfolio_id)?.name}
                              {formData.amount && ` (€${formData.amount.toFixed(2)})`}
                            </>
                          )}
                          {!formData.from_portfolio_id && !formData.to_portfolio_id && (
                            <span className="text-muted-foreground italic">Seleziona portafoglio</span>
                          )}
                        </span>
                      </div>
                    )}
                    {formData.is_debt && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <span className="font-medium">⚠ Debito:</span> {formData.debt_status === 'paid' ? 'Pagato' : 'In sospeso'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="notes">Note</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Note aggiuntive..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseDialog}
                aria-label="Annulla e chiudi dialog"
              >
                Annulla
              </Button>
              <Button 
                type="submit"
                aria-label={editingTransaction ? 'Salva modifiche movimento' : 'Crea nuovo movimento'}
              >
                {editingTransaction ? 'Salva Modifiche' : 'Crea Movimento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Conferma Eliminazione */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo movimento? Questa azione non può essere annullata.
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
