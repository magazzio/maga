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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-product-type'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Users, UserCheck, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useCustomers'
import { useCustomerSpending } from '@/hooks/useCustomerSpending'
import { useCustomerDebt } from '@/hooks/useCustomerDebt'
import { useCustomerReferrals } from '@/hooks/useCustomerReferrals'
import { Customer, REFERRAL_COLORS, ReferralColor } from '@/db'

export default function Clienti() {
  const { data: customers, isLoading } = useCustomers()
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  
  // Filtri
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterReferral, setFilterReferral] = useState<'all' | 'referral' | 'non-referral'>('all')
  
  // Ordinamento
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    notes: '',
    active: true,
    is_referral: false,
    referral_color: undefined,
    referred_by: undefined,
  })

  // Filtra e ordina clienti
  const filteredAndSortedCustomers = useMemo(() => {
    if (!customers) return []

    let filtered = customers.filter(customer => {
      // Filtro ricerca
      if (searchTerm && !customer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtro attivo/inattivo
      if (filterActive === 'active' && !customer.active) {
        return false
      }
      if (filterActive === 'inactive' && customer.active) {
        return false
      }

      // Filtro referral
      if (filterReferral === 'referral' && !customer.is_referral) {
        return false
      }
      if (filterReferral === 'non-referral' && customer.is_referral) {
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
          case 'name':
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
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
  }, [customers, searchTerm, filterActive, filterReferral, sortColumn, sortDirection])

  // Paginazione
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCustomers = filteredAndSortedCustomers.slice(startIndex, endIndex)

  // Reset pagina quando cambiano i filtri o ordinamento
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterActive, filterReferral, sortColumn, sortDirection])

  // Reset pagina quando cambiano i dati
  useEffect(() => {
    if (filteredAndSortedCustomers && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [filteredAndSortedCustomers, currentPage, totalPages])

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

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      setFormData({
        name: customer.name,
        notes: customer.notes || '',
        active: customer.active !== false,
        is_referral: customer.is_referral || false,
        referral_color: customer.referral_color,
        referred_by: customer.referred_by,
      })
    } else {
      setEditingCustomer(null)
      setFormData({
        name: '',
        notes: '',
        active: true,
        is_referral: false,
        referral_color: undefined,
        referred_by: undefined,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCustomer(null)
    setFormData({
      name: '',
      notes: '',
      active: true,
      is_referral: false,
      referral_color: undefined,
      referred_by: undefined,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCustomer?.id) {
      updateMutation.mutate({ ...editingCustomer, ...formData })
    } else {
      createMutation.mutate(formData)
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
    setDeleteId(null)
  }

  const handleToggleActive = (customer: Customer) => {
    updateMutation.mutate({ ...customer, active: !customer.active })
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDetailDialogOpen(true)
  }

  // Clienti referral per il campo "referred_by"
  const referralCustomers = useMemo(() => {
    if (!customers) return []
    return customers.filter(c => c.is_referral && c.id !== editingCustomer?.id)
  }, [customers, editingCustomer])

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
      <h2 className="text-3xl font-bold tracking-tight">Clienti</h2>
          <p className="text-muted-foreground">Gestisci i clienti di Meetdrip</p>
        </div>
        <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo cliente">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Nuovo Cliente
        </Button>
      </div>

      {/* Filtri e Ricerca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Cerca per nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Cerca clienti"
            autoComplete="off"
          />
        </div>
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
        <Select
          value={filterReferral}
          onValueChange={(value) => setFilterReferral(value as 'all' | 'referral' | 'non-referral')}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            <SelectItem value="referral">Solo referral</SelectItem>
            <SelectItem value="non-referral">Non referral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabella Desktop */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center align-middle w-[8%]">
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
              <TableHead className="text-center align-middle w-[20%]">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center justify-center gap-1 hover:text-foreground transition-colors mx-auto"
                  aria-label="Ordina per Nome"
                >
                  Nome
                  {sortColumn === 'name' ? (
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
              <TableHead className="text-center align-middle w-[15%]">Referral</TableHead>
              <TableHead className="text-center align-middle w-[11%]">Referiti</TableHead>
              <TableHead className="text-center align-middle w-[11%]">Spesa</TableHead>
              <TableHead className="text-center align-middle w-[11%]">Debito</TableHead>
              <TableHead className="text-center align-middle w-[8%]">Attivo</TableHead>
              <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  customers={customers || []}
                  onEdit={() => handleOpenDialog(customer)}
                  onDelete={() => setDeleteId(customer.id!)}
                  onViewDetails={() => handleViewDetails(customer)}
                  onToggleActive={() => handleToggleActive(customer)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  {searchTerm || filterActive !== 'all' || filterReferral !== 'all'
                    ? 'Nessun cliente corrisponde ai filtri selezionati'
                    : 'Nessun cliente. Crea il primo cliente.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedCustomers.length > 0 ? (
          paginatedCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              customers={customers || []}
              onEdit={() => handleOpenDialog(customer)}
              onDelete={() => setDeleteId(customer.id!)}
              onViewDetails={() => handleViewDetails(customer)}
              onToggleActive={() => handleToggleActive(customer)}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {searchTerm || filterActive !== 'all' || filterReferral !== 'all'
              ? 'Nessun cliente corrisponde ai filtri selezionati'
              : 'Nessun cliente. Crea il primo cliente.'}
          </div>
        )}
      </div>

      {/* Paginazione */}
      {filteredAndSortedCustomers.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedCustomers.length)} di {filteredAndSortedCustomers.length} clienti
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
              {editingCustomer ? 'Modifica Cliente' : 'Nuovo Cliente'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer
                ? 'Modifica i dettagli del cliente'
                : 'Crea un nuovo cliente. Solo clienti di Meetdrip.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="px-6 space-y-5 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nome Cliente <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo del cliente"
                  required
                  autoFocus={!editingCustomer}
                  autoComplete="off"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-semibold">
                  Note <span className="text-muted-foreground font-normal">(opzionale)</span>
                </Label>
                <Textarea
                  id="note"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informazioni aggiuntive sul cliente..."
                  rows={3}
                  autoComplete="off"
                  className="resize-none"
                />
              </div>

              {/* Sezione Referral */}
              <div className="space-y-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label>
                    <input
                      type="checkbox"
                      checked={formData.is_referral || false}
                      onChange={(e) => {
                        const isReferral = e.target.checked
                        setFormData({
                          ...formData,
                          is_referral: isReferral,
                          referral_color: isReferral ? formData.referral_color : undefined,
                        })
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-semibold">Cliente Referral</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    I clienti referral hanno un colore identificativo e possono essere referenziati da altri clienti
                  </p>
                </div>

                {formData.is_referral && (
                  <div className="space-y-2">
                    <Label htmlFor="referral-color" className="text-sm font-semibold">
                      Colore Referral <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.referral_color || ''}
                      onValueChange={(value) => setFormData({ ...formData, referral_color: value as ReferralColor })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona colore" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(REFERRAL_COLORS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span className={`inline-block w-4 h-4 rounded-full ${value.bg.replace('bg-', 'bg-')}`}></span>
                              {value.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="referred-by" className="text-sm font-semibold">
                    Riferito da <span className="text-muted-foreground font-normal">(opzionale)</span>
                  </Label>
                  <Select
                    value={formData.referred_by || undefined}
                    onValueChange={(value) => setFormData({ ...formData, referred_by: value === 'none' ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nessuno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nessuno</SelectItem>
                      {referralCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id!}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Seleziona un cliente referral che ha portato questo cliente (il cliente può essere referenziato anche se non è referral)
                  </p>
                </div>
              </div>

              {editingCustomer && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota:</strong> Per attivare o disattivare il cliente, usa il toggle nella tabella principale.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="px-6 py-4 border-t gap-2 sm:gap-0 flex-shrink-0">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit" disabled={!formData.name || (formData.is_referral && !formData.referral_color)}>
                {editingCustomer ? 'Salva Modifiche' : 'Crea Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Dettaglio Cliente */}
      {selectedCustomer && (
        <CustomerDetailDialog
          customer={selectedCustomer}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          customers={customers || []}
        />
      )}

      {/* Dialog Conferma Eliminazione */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare definitivamente questo cliente? Questa azione non può essere annullata.
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

// Componente Cella Spesa Cliente
function CustomerSpendingCell({ customerId }: { customerId?: string }) {
  const { data: spending = 0, isLoading } = useCustomerSpending(customerId)

  return (
    <TableCell className="text-center align-middle w-[11%]">
      {isLoading ? (
        <span className="text-muted-foreground text-sm">...</span>
      ) : (
        <span className="font-medium">€ {spending.toFixed(2)}</span>
      )}
    </TableCell>
  )
}

// Componente Cella Debito Cliente
function CustomerDebtCell({ customerId }: { customerId?: string }) {
  const { data: debt = 0, isLoading } = useCustomerDebt(customerId)

  return (
    <TableCell className="text-center align-middle w-[11%]">
      {isLoading ? (
        <span className="text-muted-foreground text-sm">...</span>
      ) : debt > 0 ? (
        <span className="font-medium text-amber-600">€ {debt.toFixed(2)}</span>
      ) : (
        <div className="flex justify-center">
          <CheckCircle className="h-5 w-5 text-green-600" aria-label="Nessun debito" />
        </div>
      )}
    </TableCell>
  )
}

// Componente Cella Referiti Cliente
function CustomerReferralsCell({ customerId, isReferral }: { customerId?: string; isReferral?: boolean }) {
  const { data: referralsCount = 0, isLoading } = useCustomerReferrals(customerId)

  return (
    <TableCell className="text-center align-middle w-[11%]">
      {isLoading ? (
        <span className="text-muted-foreground text-sm">...</span>
      ) : isReferral ? (
        <span className="font-medium">{referralsCount}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )}
    </TableCell>
  )
}

// Componente Riga Cliente
function CustomerRow({ customer, customers, onEdit, onDelete, onViewDetails, onToggleActive }: { 
  customer: Customer
  customers: Customer[]
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
  onToggleActive: () => void
}) {
  const referredByCustomer = customer.referred_by 
    ? customers.find(c => c.id === customer.referred_by)
    : null
  const referralColorInfo = customer.referral_color && customer.is_referral
    ? REFERRAL_COLORS[customer.referral_color]
    : null

  return (
    <TableRow>
      <TableCell className="font-medium text-center align-middle w-[8%]">{customer.id}</TableCell>
      <TableCell className="text-center align-middle w-[20%]">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onViewDetails}
            className="font-medium hover:underline hover:text-primary cursor-pointer focus:outline-none focus:underline focus:text-primary"
            aria-label={`Visualizza dettagli cliente ${customer.name}`}
          >
            {customer.name}
          </button>
          {customer.is_referral && referralColorInfo && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${referralColorInfo.bg} ${referralColorInfo.text}`}>
              <UserCheck className="h-3 w-3" />
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center align-middle w-[15%]">
        {referredByCustomer ? (
          referredByCustomer.is_referral && referredByCustomer.referral_color ? (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${REFERRAL_COLORS[referredByCustomer.referral_color].bg} ${REFERRAL_COLORS[referredByCustomer.referral_color].text}`}>
              {referredByCustomer.name}
            </span>
          ) : (
            <span className="font-medium">{referredByCustomer.name}</span>
          )
        ) : (
          '-'
        )}
      </TableCell>
      <CustomerReferralsCell customerId={customer.id} isReferral={customer.is_referral} />
      <CustomerSpendingCell customerId={customer.id} />
      <CustomerDebtCell customerId={customer.id} />
      <TableCell className="text-center align-middle w-[8%]">
        <div className="flex justify-center">
          <Switch
            checked={customer.active !== false}
            onCheckedChange={onToggleActive}
            aria-label={`${customer.active ? 'Disattiva' : 'Attiva'} cliente ${customer.name}`}
          />
        </div>
      </TableCell>
      <TableCell className="text-center align-middle w-[120px]">
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Modifica cliente ${customer.name}`}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Modifica</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Elimina cliente ${customer.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Componente Spesa in Card Mobile
function CustomerSpendingInCard({ customerId }: { customerId?: string }) {
  const { data: spending = 0, isLoading } = useCustomerSpending(customerId)

  return (
    <div>
      <span className="font-medium">Spesa:</span>{' '}
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : (
        <span className="font-medium">€ {spending.toFixed(2)}</span>
      )}
    </div>
  )
}

// Componente Debito in Card Mobile
function CustomerDebtInCard({ customerId }: { customerId?: string }) {
  const { data: debt = 0, isLoading } = useCustomerDebt(customerId)

  return (
    <div>
      <span className="font-medium">Debito:</span>{' '}
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : debt > 0 ? (
        <span className="font-medium text-amber-600">€ {debt.toFixed(2)}</span>
      ) : (
        <span className="text-muted-foreground">Nessun debito</span>
      )}
    </div>
  )
}

// Componente Referiti in Card Mobile
function CustomerReferralsInCard({ customerId, isReferral }: { customerId?: string; isReferral?: boolean }) {
  const { data: referralsCount = 0, isLoading } = useCustomerReferrals(customerId)

  return (
    <div>
      <span className="font-medium">Referiti:</span>{' '}
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : isReferral ? (
        <span className="font-medium">{referralsCount}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )}
    </div>
  )
}

// Componente Card Cliente Mobile
function CustomerCard({ customer, customers, onEdit, onDelete, onViewDetails, onToggleActive }: { 
  customer: Customer
  customers: Customer[]
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
  onToggleActive: () => void
}) {
  const referredByCustomer = customer.referred_by 
    ? customers.find(c => c.id === customer.referred_by)
    : null
  const referralColorInfo = customer.referral_color && customer.is_referral
    ? REFERRAL_COLORS[customer.referral_color]
    : null

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetails}
              className="hover:underline hover:text-primary cursor-pointer focus:outline-none focus:underline focus:text-primary text-left font-medium"
              aria-label={`Visualizza dettagli cliente ${customer.name}`}
            >
              {customer.name}
            </button>
            <span className="text-sm text-muted-foreground">({customer.id})</span>
            {customer.is_referral && referralColorInfo && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${referralColorInfo.bg} ${referralColorInfo.text}`}>
                <UserCheck className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label={`Modifica cliente ${customer.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            aria-label={`Elimina cliente ${customer.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">Attivo:</Label>
        <Switch
          checked={customer.active !== false}
          onCheckedChange={onToggleActive}
          aria-label={`${customer.active ? 'Disattiva' : 'Attiva'} cliente ${customer.name}`}
        />
      </div>
      <div className="space-y-2 text-sm">
        {customer.is_referral && referralColorInfo && (
          <div>
            <span className="font-medium">Colore Referral:</span>{' '}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${referralColorInfo.bg} ${referralColorInfo.text}`}>
              {referralColorInfo.label}
            </span>
          </div>
        )}
        {referredByCustomer && (
          <div>
            <span className="font-medium">Riferito da:</span>{' '}
            {referredByCustomer.is_referral && referredByCustomer.referral_color ? (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${REFERRAL_COLORS[referredByCustomer.referral_color].bg} ${REFERRAL_COLORS[referredByCustomer.referral_color].text}`}>
                {referredByCustomer.name}
              </span>
            ) : (
              <span className="font-medium">{referredByCustomer.name}</span>
            )}
          </div>
        )}
        <CustomerSpendingInCard customerId={customer.id} />
        <CustomerDebtInCard customerId={customer.id} />
        {customer.is_referral && (
          <CustomerReferralsInCard customerId={customer.id} isReferral={customer.is_referral} />
        )}
        {customer.active === false && (
          <div>
            <span className="text-xs text-amber-600">Cliente inattivo</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente Spesa in Dialog Dettaglio
function CustomerSpendingInDetail({ customerId }: { customerId?: string }) {
  const { data: spending = 0, isLoading } = useCustomerSpending(customerId)

  return (
    <p className="font-medium text-lg">
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : (
        `€ ${spending.toFixed(2)}`
      )}
    </p>
  )
}

// Componente Debito in Dialog Dettaglio
function CustomerDebtInDetail({ customerId }: { customerId?: string }) {
  const { data: debt = 0, isLoading } = useCustomerDebt(customerId)

  return (
    <p className="font-medium text-lg">
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : debt > 0 ? (
        <span className="text-amber-600">€ {debt.toFixed(2)}</span>
      ) : (
        <span className="text-muted-foreground">Nessun debito</span>
      )}
    </p>
  )
}

// Componente Referiti in Dialog Dettaglio
function CustomerReferralsInDetail({ customerId, isReferral }: { customerId?: string; isReferral?: boolean }) {
  const { data: referralsCount = 0, isLoading } = useCustomerReferrals(customerId)

  return (
    <p className="font-medium text-lg">
      {isLoading ? (
        <span className="text-muted-foreground">...</span>
      ) : isReferral ? (
        <span>{referralsCount}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )}
    </p>
  )
}

// Componente Dialog Dettaglio Cliente
function CustomerDetailDialog({ 
  customer, 
  open, 
  onOpenChange,
  customers
}: { 
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
}) {
  const referredByCustomer = customer.referred_by 
    ? customers.find(c => c.id === customer.referred_by)
    : null
  const referralColorInfo = customer.referral_color && customer.is_referral
    ? REFERRAL_COLORS[customer.referral_color]
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" aria-hidden="true" />
            Dettagli Cliente
          </DialogTitle>
          <DialogDescription>
            Informazioni complete del cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">ID</Label>
              <p className="font-medium">{customer.id}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Nome</Label>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Stato</Label>
              <p className={customer.active !== false ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                {customer.active !== false ? 'Attivo' : 'Inattivo'}
              </p>
            </div>
            {customer.is_referral && (
              <>
                <div>
                  <Label className="text-sm text-muted-foreground">Tipo</Label>
                  <p className="font-medium">
                    {referralColorInfo ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${referralColorInfo.bg} ${referralColorInfo.text}`}>
                        <UserCheck className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </p>
                </div>
                {referredByCustomer && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Riferito da</Label>
                    <p className="font-medium">{referredByCustomer.name}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Spesa</Label>
            <CustomerSpendingInDetail customerId={customer.id} />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Debito</Label>
            <CustomerDebtInDetail customerId={customer.id} />
          </div>
          {customer.is_referral && (
            <div>
              <Label className="text-sm text-muted-foreground">Referiti</Label>
              <CustomerReferralsInDetail customerId={customer.id} isReferral={customer.is_referral} />
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
