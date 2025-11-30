import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/hooks/useClients'
import { Customer, REFERRAL_COLORS, db } from '@/db'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/lib/logger'

type SortField = 'id' | 'name' | null
type SortDirection = 'asc' | 'desc' | null

// Componente per il contenuto dettagliato del cliente
function ClientDetailsContent({ client, data }: { client: Customer; data: { clients: Customer[] } | undefined }) {
  const [transactionsData, setTransactionsData] = useState<{ 
    total: number
    totalValue: number
    lastTransaction?: { date: Date; type: string; amount: number; paymentMethod?: string }
    paymentMethods: string[]
    pendingDebts: number
  }>({ total: 0, totalValue: 0, paymentMethods: [], pendingDebts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDetails() {
      setLoading(true)
      try {
        // Carica transazioni per questo cliente (se c'è un campo customer_id nelle transazioni)
        // Per ora, dato che non c'è customer_id nelle transazioni, mostriamo info generali
        // In futuro si potrà aggiungere il collegamento
        
        // Simuliamo dati per ora - quando ci sarà il collegamento reale, si caricheranno i dati veri
        const transactions = await db.transactions.toArray()
        const transactionTypes = await db.transactionTypes.toArray()
        const typeMap = new Map(transactionTypes.map(t => [t.id, t.name]))
        
        // Filtra transazioni che potrebbero essere collegate al cliente
        // Per ora mostriamo statistiche generali
        const sortedTransactions = transactions
          .filter(t => t.amount !== undefined)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        const total = sortedTransactions.length
        const totalValue = sortedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
        const lastTransaction = sortedTransactions[0] ? {
          date: new Date(sortedTransactions[0].date),
          type: typeMap.get(sortedTransactions[0].type_id) || 'Sconosciuto',
          amount: sortedTransactions[0].amount || 0,
          paymentMethod: sortedTransactions[0].payment_method,
        } : undefined
        
        const paymentMethods = Array.from(new Set(
          sortedTransactions
            .filter(t => t.payment_method)
            .map(t => t.payment_method!)
        ))
        
        const pendingDebts = sortedTransactions
          .filter(t => t.is_debt && t.debt_status === 'pending')
          .reduce((sum, t) => sum + (t.amount || 0), 0)

        setTransactionsData({ 
          total, 
          totalValue, 
          lastTransaction, 
          paymentMethods,
          pendingDebts 
        })
      } catch (error) {
        console.error('Errore nel caricamento dettagli:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (client.id) {
      loadDetails()
    }
  }, [client.id])

  const referral = client.referred_by ? data?.clients?.find(c => c.id === client.referred_by) : null

  return (
    <div className="space-y-6 py-4">
      {/* Statistiche principali */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Transazioni</Label>
          <p className="text-2xl font-bold mt-1">{loading ? '...' : transactionsData.total}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Valore Totale</Label>
          <p className="text-2xl font-bold mt-1">
            {loading ? '...' : `€${transactionsData.totalValue.toFixed(2)}`}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Debiti Pendenti</Label>
          <p className="text-2xl font-bold mt-1">
            {loading ? '...' : transactionsData.pendingDebts > 0 ? `€${transactionsData.pendingDebts.toFixed(2)}` : '€0.00'}
          </p>
        </div>
      </div>

      {/* Ultima transazione */}
      {!loading && transactionsData.lastTransaction && (
        <div className="p-4 border rounded-lg">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Ultima Transazione</Label>
          <div className="space-y-1">
            <p className="font-medium">{transactionsData.lastTransaction.type}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>€{transactionsData.lastTransaction.amount.toFixed(2)}</span>
              <span>{transactionsData.lastTransaction.date.toLocaleDateString('it-IT')}</span>
              {transactionsData.lastTransaction.paymentMethod && (
                <span className="capitalize">{transactionsData.lastTransaction.paymentMethod}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metodi di pagamento */}
      {!loading && transactionsData.paymentMethods.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Metodi di Pagamento Utilizzati</Label>
          <div className="flex gap-2 flex-wrap">
            {transactionsData.paymentMethods.map((method, idx) => (
              <span key={idx} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                {method}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Informazioni referral */}
      {referral && (
        <div className="p-4 border rounded-lg">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Referenziato da</Label>
          <div>
            {referral.referral_color ? (() => {
              const colorInfo = REFERRAL_COLORS[referral.referral_color]
              return (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                  {referral.name}
                </span>
              )
            })() : (
              <span className="font-medium">{referral.name}</span>
            )}
          </div>
        </div>
      )}

      {/* Informazioni base */}
      <div className="pt-4 border-t">
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Informazioni Base</Label>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">È Referral:</span>{' '}
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ml-1 ${
              client.is_referral 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}>
              {client.is_referral ? 'Sì' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Clienti() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    notes: '',
    is_referral: false,
    referral_color: undefined,
    referred_by: undefined,
  })
  
  // Ordinamento
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  
  // AlertDialog states
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; clientId: number | null }>({ open: false, clientId: null })
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; client: Customer | null }>({ open: false, client: null })

  // Validazione form
  const [formErrors, setFormErrors] = useState<{ name?: string }>({})
  
  // Dimensioni pagina
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem('clienti-page-size')
    return saved ? parseInt(saved) : 10
  })
  
  // Carica tutti i clienti solo se c'è ricerca o ordinamento attivo (usa searchTerm, non debounced, per determinare subito)
  const hasActiveFilters = !!searchTerm.trim() || sortField !== null
  const { data, isLoading, error } = useClients(page, pageSize, hasActiveFilters)
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const deleteMutation = useDeleteClient()
  const { toast } = useToast()

  // Debounce ricerca (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Salva dimensione pagina
  useEffect(() => {
    localStorage.setItem('clienti-page-size', pageSize.toString())
  }, [pageSize])

  // Reset form quando il dialog si chiude
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingClient(null)
      setFormErrors({})
      setFormData({
        name: '',
        notes: '',
        is_referral: false,
        referral_color: undefined,
        referred_by: undefined,
      })
    }
  }, [isDialogOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Cerca"]') as HTMLInputElement
        searchInput?.focus()
      }
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
  const validateForm = async () => {
    const errors: { name?: string } = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Il nome è obbligatorio'
    } else {
      // Controlla duplicati (nome deve essere unico)
      const trimmedName = formData.name.trim()
      const existingClient = data?.clients.find(
        c => c.name.toLowerCase() === trimmedName.toLowerCase() && 
        (!editingClient || c.id !== editingClient.id)
      )
      if (existingClient) {
        errors.name = 'Esiste già un cliente con questo nome'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    if (isDialogOpen) {
      validateForm().catch(() => {}) // Ignora errori nella validazione in tempo reale
    }
  }, [formData, isDialogOpen])

  // Filtraggio e ordinamento clienti
  const filteredAndSortedClients = useMemo(() => {
    let clients = data?.clients || []
    
    // Filtro ricerca
    if (debouncedSearchTerm.trim()) {
      const search = debouncedSearchTerm.toLowerCase()
      clients = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(search) ||
          (client.notes && client.notes.toLowerCase().includes(search))
      )
    }
    
    // Ordinamento
    if (sortField && sortDirection) {
      clients = [...clients].sort((a, b) => {
        let aVal: any
        let bVal: any
        
        switch (sortField) {
          case 'id':
            aVal = a.id || 0
            bVal = b.id || 0
            break
          case 'name':
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          default:
            return 0
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return clients
  }, [data?.clients, debouncedSearchTerm, sortField, sortDirection])

  // Paginazione
  const hasFilters = debouncedSearchTerm.trim()
  const paginatedClients = hasFilters
    ? filteredAndSortedClients.slice((page - 1) * pageSize, page * pageSize)
    : data?.paginatedClients || []
  
  const displayClients = hasFilters ? paginatedClients : filteredAndSortedClients.slice((page - 1) * pageSize, page * pageSize)
  const totalFiltered = filteredAndSortedClients.length
  const totalPages = Math.ceil(totalFiltered / pageSize)

  // Statistiche
  const stats = useMemo(() => {
    const all = data?.clients || []
    return {
      total: all.length,
    }
  }, [data?.clients])

  // Referral disponibili (solo clienti con is_referral = true)
  const availableReferrals = useMemo(() => {
    const all = data?.clients || []
    return all.filter(client => client.is_referral === true && client.id !== editingClient?.id)
  }, [data?.clients, editingClient?.id])

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

  const handleOpenDialog = (client?: Customer) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name || '',
        notes: client.notes || '',
        is_referral: client.is_referral || false, // Mantieni lo status esistente
        referral_color: client.referral_color,
        referred_by: client.referred_by,
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: '',
        notes: '',
        is_referral: false,
        referral_color: undefined,
        referred_by: undefined,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingClient(null)
    setFormErrors({})
    setFormData({
      name: '',
      notes: '',
      is_referral: false,
      referral_color: undefined,
      referred_by: undefined,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!(await validateForm())) {
      toast({
        title: 'Errore di validazione',
        description: 'Controlla i campi evidenziati',
        variant: 'destructive',
      })
      return
    }
    
    try {
      if (editingClient) {
        await updateMutation.mutateAsync({
          ...editingClient,
          ...formData,
        })
        toast({
          title: 'Cliente aggiornato',
          description: 'Le modifiche sono state salvate con successo',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Cliente creato',
          description: 'Il nuovo cliente è stato aggiunto con successo',
          variant: 'success',
        })
      }
      handleCloseDialog()
    } catch (error) {
      logger.error('Error saving client', error as Error, { client: editingClient?.id || 'new' })
      toast({
        title: 'Errore',
        description: 'Errore nel salvataggio del cliente',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: number) => {
    setConfirmDeleteDialog({ open: true, clientId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.clientId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.clientId)
      toast({
        title: 'Cliente eliminato',
        description: 'Il cliente è stato eliminato con successo',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, clientId: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione del cliente'
      logger.error('Error deleting client', error as Error, { clientId: confirmDeleteDialog.clientId })
      toast({
        title: 'Impossibile eliminare',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setSortField(null)
    setSortDirection(null)
    setPage(1)
  }


  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Statistiche */}
        <Card className="bg-muted/50 dark:bg-muted/30 border-l-[6px] border-muted-foreground/60 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Totale Clienti</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista Clienti</CardTitle>
                <CardDescription>
                  {hasActiveFilters
                    ? `${totalFiltered} risultati${totalFiltered !== stats.total ? ` (${stats.total} totali)` : ''}`
                    : `${stats.total} clienti totali`}
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo cliente">
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Cliente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Ricerca */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per nome o note..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Cerca clienti"
                />
              </div>
              
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Rimuovi filtri
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Caricamento...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Errore nel caricamento dei clienti
              </div>
            ) : displayClients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  {hasActiveFilters ? 'Nessun cliente trovato' : 'Nessun cliente ancora'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? 'Prova a modificare i filtri di ricerca o rimuoverli per vedere tutti i clienti.'
                    : 'Inizia creando il tuo primo cliente usando il pulsante "Nuovo Cliente" in alto.'}
                </p>
                {!hasActiveFilters && (
                  <Button onClick={() => handleOpenDialog()} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Crea primo cliente
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
                            onClick={() => handleSort('name')}
                            className="flex items-center justify-center w-full hover:text-foreground"
                            aria-label="Ordina per Nome"
                          >
                            Nome {getSortIcon('name')}
                          </button>
                        </TableHead>
                        <TableHead className="text-center">Note</TableHead>
                        <TableHead className="text-center">Referral</TableHead>
                        <TableHead className="text-center">Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="text-center align-middle font-mono font-medium">
                            {client.id}
                          </TableCell>
                          <TableCell className="text-center align-middle font-medium">
                            <button
                              onClick={() => setDetailsDialog({ open: true, client })}
                              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
                              aria-label={`Visualizza dettagli cliente ${client.name}`}
                            >
                              {client.name}
                            </button>
                          </TableCell>
                          <TableCell className="text-center align-middle max-w-xs">
                            {client.notes ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-center gap-1.5 cursor-help">
                                    <span className="truncate">{client.notes}</span>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{client.notes}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            {(() => {
                              if (!client.referred_by) {
                                return <span className="text-muted-foreground">-</span>
                              }
                              const referral = data?.clients?.find(c => c.id === client.referred_by)
                              if (!referral || !referral.is_referral || !referral.referral_color) {
                                return <span className="text-muted-foreground">-</span>
                              }
                              const colorInfo = REFERRAL_COLORS[referral.referral_color]
                              return (
                                <div className="flex items-center justify-center gap-1.5">
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                                    {referral.name}
                                  </span>
                                </div>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="text-center align-middle">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(client)}
                                aria-label={`Modifica cliente ${client.name}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => client.id && handleDelete(client.id)}
                                className="text-destructive hover:text-destructive"
                                aria-label={`Elimina cliente ${client.name}`}
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
                  {editingClient ? 'Modifica Cliente' : 'Nuovo Cliente'}
                </DialogTitle>
                <DialogDescription>
                  {editingClient
                    ? 'Modifica le informazioni del cliente'
                    : 'Aggiungi un nuovo cliente al sistema. L\'ID verrà generato automaticamente.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {editingClient && (
                  <div className="grid gap-2">
                    <Label htmlFor="id">ID</Label>
                    <Input
                      id="id"
                      value={editingClient.id}
                      disabled
                      className="font-mono"
                      aria-label="ID cliente"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Nome <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Nome del cliente"
                    aria-label="Nome cliente"
                    className={formErrors.name ? 'border-destructive' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-destructive">{formErrors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Note</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Note aggiuntive sul cliente"
                    aria-label="Note cliente"
                  />
                </div>
                {availableReferrals.length > 0 && (
                  <div className="grid gap-2">
                    <Label htmlFor="referred_by">Referenziato da</Label>
                    <Select
                      value={formData.referred_by?.toString() || 'none'}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          referred_by: value && value !== 'none' ? parseInt(value) : undefined,
                        })
                      }
                    >
                      <SelectTrigger id="referred_by" aria-label="Seleziona referral">
                        <SelectValue placeholder="Nessun referral" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nessun referral</SelectItem>
                        {availableReferrals.map((referral) => {
                          const colorInfo = referral.referral_color
                            ? REFERRAL_COLORS[referral.referral_color]
                            : null
                          return (
                            <SelectItem key={referral.id} value={referral.id!.toString()}>
                              <div className="flex items-center gap-2">
                                {colorInfo && (
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                                    {referral.name}
                                  </span>
                                )}
                                {!colorInfo && <span>{referral.name}</span>}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
                  {editingClient ? 'Salva Modifiche' : 'Crea Cliente'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog Dettagli Cliente */}
        <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, client: null })}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dettagli Cliente</DialogTitle>
              <DialogDescription>
                Informazioni dettagliate e statistiche del cliente
              </DialogDescription>
            </DialogHeader>
            {detailsDialog.client && <ClientDetailsContent client={detailsDialog.client} data={data} />}
            <DialogFooter>
              <Button onClick={() => setDetailsDialog({ open: false, client: null })}>
                Chiudi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AlertDialog per conferma eliminazione */}
        <AlertDialog open={confirmDeleteDialog.open} onOpenChange={(open) => setConfirmDeleteDialog({ open, clientId: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Elimina cliente</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler eliminare questo cliente? Questa azione non può essere annullata.
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
