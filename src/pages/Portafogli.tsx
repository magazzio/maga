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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-product-type'
import { Wallet, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Calendar, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { usePortfolios } from '@/hooks/usePortfolios'
import { usePortfolioBalance } from '@/hooks/usePortfolioBalance'
import { useTransactions, useUpdateTransaction } from '@/hooks/useTransactions'
import { useTransactionTypes } from '@/hooks/useTransactionTypes'
import { useEntities } from '@/hooks/useEntities'
import { useEntityNetBalance } from '@/hooks/useEntityNetBalance'
import { useCustomerCredits } from '@/hooks/useCustomerCredits'
import { Transaction } from '@/db'
import { format } from 'date-fns'

type PeriodFilter = 'all' | 'today' | 'week' | 'month'

export default function Portafogli() {
  const { data: portfolios, isLoading: portfoliosLoading } = usePortfolios()
  const { data: entities } = useEntities()
  const { data: transactions, isLoading: transactionsLoading } = useTransactions()
  const { data: transactionTypes } = useTransactionTypes()
  const { data: entityNetBalance, isLoading: entityNetBalanceLoading } = useEntityNetBalance()
  const { data: customerCredits, isLoading: customerCreditsLoading } = useCustomerCredits()
  const updateMutation = useUpdateTransaction()
  const queryClient = useQueryClient()

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null)
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [payDebtDialogOpen, setPayDebtDialogOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<Transaction | null>(null)
  const [payDate, setPayDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  // Seleziona primo portafoglio disponibile al caricamento
  useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      setSelectedPortfolioId(portfolios[0].id!)
    }
  }, [portfolios, selectedPortfolioId])

  // Calcola saldi portafoglio selezionato
  const { data: balance, isLoading: balanceLoading } = usePortfolioBalance(selectedPortfolioId || undefined)

  // Filtra movimenti per portafoglio selezionato
  const portfolioTransactions = useMemo(() => {
    if (!transactions || !selectedPortfolioId) return []
    return transactions.filter(t => 
      t.from_portfolio_id === selectedPortfolioId || t.to_portfolio_id === selectedPortfolioId
    )
  }, [transactions, selectedPortfolioId])

  // Filtra debiti pendenti
  const pendingDebts = useMemo(() => {
    if (!portfolioTransactions) return []
    return portfolioTransactions.filter(t => 
      t.is_debt && t.debt_status === 'pending' && t.amount
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [portfolioTransactions])

  // Filtra movimenti per periodo
  const filteredTransactions = useMemo(() => {
    if (!portfolioTransactions) return []
    
    let filtered = [...portfolioTransactions]
    
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
        // Nessun filtro
        break
    }
    
    // Ordina per data (più recenti prima)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [portfolioTransactions, periodFilter])

  // Paginazione movimenti
  const totalPages = Math.ceil(filteredTransactions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Reset pagina quando cambiano filtri
  useEffect(() => {
    setCurrentPage(1)
  }, [periodFilter, selectedPortfolioId])

  // Reset pagina quando cambiano i dati
  useEffect(() => {
    if (filteredTransactions && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [filteredTransactions, currentPage, totalPages])

  // Gestione saldare debito
  const handlePayDebt = (transaction: Transaction) => {
    setSelectedDebt(transaction)
    setPayDate(format(new Date(), 'yyyy-MM-dd'))
    setPayDebtDialogOpen(true)
  }

  const handleConfirmPayDebt = () => {
    if (!selectedDebt?.id) return
    
    updateMutation.mutate({
      ...selectedDebt,
      debt_status: 'paid',
      debt_paid_date: new Date(payDate),
    } as Transaction, {
      onSuccess: () => {
        // Invalida i saldi del portafoglio per aggiornare i calcoli
        if (selectedPortfolioId) {
          queryClient.invalidateQueries({ queryKey: ['portfolio-balance', selectedPortfolioId] })
        }
        setPayDebtDialogOpen(false)
        setSelectedDebt(null)
      }
    })
  }

  const selectedPortfolio = portfolios?.find(p => p.id === selectedPortfolioId)
  const selectedEntity = entities?.find(e => e.id === selectedPortfolio?.entity_id)
  const isMeetdripPortfolio = selectedEntity?.name.toLowerCase().includes('meetdrip')
  const isDriplugPortfolio = selectedEntity?.name.toLowerCase().includes('driplug')

  if (portfoliosLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Portafogli</h2>
        <div className="rounded-md border p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Nessun portafoglio disponibile. Crea un portafoglio nella sezione Impostazioni.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
      <h2 className="text-3xl font-bold tracking-tight">Portafogli</h2>
        <p className="text-muted-foreground">
          Visualizza saldi, debiti e storico movimenti finanziari
        </p>
      </div>

      {/* Selettore Portafoglio */}
      <div className="space-y-2">
        <Label htmlFor="portfolio-select">Portafoglio</Label>
        <Select
          value={selectedPortfolioId?.toString() || ''}
          onValueChange={(value) => setSelectedPortfolioId(parseInt(value))}
        >
          <SelectTrigger id="portfolio-select" className="w-full sm:w-[300px]">
            <SelectValue placeholder="Seleziona portafoglio" />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((portfolio) => {
              const entity = entities?.find(e => e.id === portfolio.entity_id)
              return (
                <SelectItem key={portfolio.id} value={portfolio.id!.toString()}>
                  {portfolio.name} {entity && `(${entity.name})`}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedPortfolioId && (
        <>
          {/* Sezione Saldi - Tutte le card su una riga */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
            isMeetdripPortfolio ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          }`}>
            {/* Saldo Cash - PRINCIPALE */}
            <div className="rounded-lg border-2 border-primary bg-card p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contanti Disponibili</p>
                  <p className={`text-4xl font-bold mt-2 ${
                    balanceLoading ? 'text-muted-foreground' : 
                    (balance?.cash_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {balanceLoading ? '...' : `€${(balance?.cash_balance || 0).toFixed(2)}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Solo movimenti in contanti</p>
                </div>
                <Wallet className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
            </div>

            {/* Crediti con l'altra entità - Mostra sempre se ci sono entità */}
            {entityNetBalance && (isMeetdripPortfolio || isDriplugPortfolio) && (() => {
              // Per Meetdrip: meetdripCredits = crediti con Driplug (Driplug deve a Meetdrip)
              // Per Driplug: meetdripDebts = crediti con Meetdrip (Meetdrip deve a Driplug)
              const credits = isMeetdripPortfolio ? entityNetBalance.meetdripCredits : entityNetBalance.meetdripDebts
              
              return (
                <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                  credits > 0 ? 'border-green-300 bg-green-50/70 shadow-sm' : 'border bg-card'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {isMeetdripPortfolio ? 'Crediti con Driplug' : 'Crediti con Meetdrip'}
                      </p>
                      <p className={`text-2xl font-bold mt-1 ${
                        entityNetBalanceLoading ? 'text-muted-foreground' : 
                        credits > 0 ? 'text-green-700' : 'text-muted-foreground'
                      }`}>
                        {entityNetBalanceLoading ? '...' : `€${credits.toFixed(2)}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isMeetdripPortfolio ? 'Driplug ti deve' : 'Meetdrip ti deve'}
                      </p>
                    </div>
                    <TrendingUp className={`h-6 w-6 ${
                      credits > 0 ? 'text-green-600' : 'text-muted-foreground'
                    }`} aria-hidden="true" />
                  </div>
                </div>
              )
            })()}

            {/* Debiti con l'altra entità - Mostra sempre se ci sono entità */}
            {entityNetBalance && (isMeetdripPortfolio || isDriplugPortfolio) && (() => {
              // Per Meetdrip: meetdripDebts = debiti con Driplug (Meetdrip deve a Driplug)
              // Per Driplug: meetdripCredits = debiti con Meetdrip (Driplug deve a Meetdrip)
              const debts = isMeetdripPortfolio ? entityNetBalance.meetdripDebts : entityNetBalance.meetdripCredits
              
              return (
                <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                  debts > 0 ? 'border-orange-300 bg-orange-50/70 shadow-sm' : 'border bg-card'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {isMeetdripPortfolio ? 'Debiti con Driplug' : 'Debiti con Meetdrip'}
                      </p>
                      <p className={`text-2xl font-bold mt-1 ${
                        entityNetBalanceLoading ? 'text-muted-foreground' : 
                        debts > 0 ? 'text-orange-700' : 'text-muted-foreground'
                      }`}>
                        {entityNetBalanceLoading ? '...' : `€${debts.toFixed(2)}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isMeetdripPortfolio ? 'Devi a Driplug' : 'Devi a Meetdrip'}
                      </p>
                    </div>
                    <TrendingDown className={`h-6 w-6 ${
                      debts > 0 ? 'text-orange-600' : 'text-muted-foreground'
                    }`} aria-hidden="true" />
                  </div>
                </div>
              )
            })()}

            {/* Crediti con Clienti (solo per Meetdrip) - Mostra sempre se Meetdrip */}
            {isMeetdripPortfolio && (
              <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                (customerCredits || 0) > 0 ? 'border-blue-300 bg-blue-50/70 shadow-sm' : 'border bg-card'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Crediti con Clienti</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      customerCreditsLoading ? 'text-muted-foreground' : 
                      (customerCredits || 0) > 0 ? 'text-blue-700' : 'text-muted-foreground'
                    }`}>
                      {customerCreditsLoading ? '...' : `€${(customerCredits || 0).toFixed(2)}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(customerCredits || 0) > 0 ? 'Clienti ti devono' : 'Nessun credito'}
                    </p>
                  </div>
                  <Users className={`h-6 w-6 ${
                    (customerCredits || 0) > 0 ? 'text-blue-600' : 'text-muted-foreground'
                  }`} aria-hidden="true" />
                </div>
              </div>
            )}

          </div>

          {/* Saldo Totale - Informativo (meno prominente) */}
          <div className="rounded-md border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Totale (informativo)</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Include contanti e debiti. Bancomat escluso (solo storico).
                </p>
              </div>
              <p className={`text-xl font-semibold ${
                balanceLoading ? 'text-muted-foreground' : 
                (balance?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {balanceLoading ? '...' : `€${(balance?.balance || 0).toFixed(2)}`}
              </p>
            </div>
          </div>


          {/* Sezione Debiti Pendenti */}
          {pendingDebts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  Debiti Pendenti ({pendingDebts.length})
                </h3>
              </div>

              {/* Tabella Desktop Debiti */}
              <div className="hidden md:block rounded-md border overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center align-middle w-[15%]">Data</TableHead>
                      <TableHead className="align-middle w-[25%]">Tipo</TableHead>
                      <TableHead className="text-center align-middle w-[20%]">Importo</TableHead>
                      <TableHead className="align-middle w-[calc(40%-120px)]">Note</TableHead>
                      <TableHead className="text-center w-[120px] align-middle">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDebts.map((debt) => {
                      const type = transactionTypes?.find(t => t.id === debt.type_id)
                      return (
                        <TableRow key={debt.id}>
                          <TableCell className="text-center align-middle w-[15%]">
                            {format(new Date(debt.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="align-middle w-[25%]">{type?.name || 'N/A'}</TableCell>
                          <TableCell className="text-center align-middle w-[20%] font-medium text-orange-600">
                            €{debt.amount?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell className="align-middle w-[calc(40%-120px)]">
                            {debt.notes || '-'}
                          </TableCell>
                          <TableCell className="text-center w-[120px] align-middle">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayDebt(debt)}
                              aria-label={`Saldare debito del ${format(new Date(debt.date), 'dd/MM/yyyy')}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                              Salda
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Card View Mobile Debiti */}
              <div className="md:hidden space-y-3">
                {pendingDebts.map((debt) => {
                  const type = transactionTypes?.find(t => t.id === debt.type_id)
                  return (
                    <div key={debt.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span className="font-medium">
                            {format(new Date(debt.date), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePayDebt(debt)}
                          aria-label={`Saldare debito del ${format(new Date(debt.date), 'dd/MM/yyyy')}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                          Salda
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tipo:</span>
                          <span>{type?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Importo:</span>
                          <span className="font-semibold text-orange-600">
                            €{debt.amount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        {debt.notes && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Note:</span>
                            <span>{debt.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sezione Storico Movimenti */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Storico Movimenti Finanziari</h3>
              
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
                    <TableHead className="text-center align-middle w-[12%]">Direzione</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Metodo</TableHead>
                    <TableHead className="text-center align-middle w-[14%]">Importo</TableHead>
                    <TableHead className="text-center align-middle w-[12%]">Stato Debito</TableHead>
                    <TableHead className="align-middle w-[calc(20%-120px)]">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => {
                      const type = transactionTypes?.find(t => t.id === transaction.type_id)
                      const isIncoming = transaction.to_portfolio_id === selectedPortfolioId
                      const isDebt = transaction.is_debt && transaction.debt_status === 'pending'
                      
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-center align-middle w-[12%]">
                            {format(new Date(transaction.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="align-middle w-[18%]">{type?.name || 'N/A'}</TableCell>
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
                          <TableCell className="text-center align-middle w-[12%]">
                            {transaction.payment_method === 'cash' ? 'Cash' :
                             transaction.payment_method === 'bancomat' ? 'Bancomat' :
                             transaction.payment_method === 'debito' ? 'Debito' : '-'}
                          </TableCell>
                          <TableCell className={`text-center align-middle w-[14%] font-medium ${
                            isIncoming ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount ? `€${transaction.amount.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-center align-middle w-[12%]">
                            {isDebt ? (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                Debito
                              </span>
                            ) : transaction.is_debt && transaction.debt_status === 'paid' ? (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                                Saldato
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="align-middle w-[calc(20%-120px)]">
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
                  const isIncoming = transaction.to_portfolio_id === selectedPortfolioId
                  const isDebt = transaction.is_debt && transaction.debt_status === 'pending'
                  
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
                            {transaction.amount ? `€${transaction.amount.toFixed(2)}` : '-'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tipo:</span>
                          <span>{type?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Metodo:</span>
                          <span>
                            {transaction.payment_method === 'cash' ? 'Cash' :
                             transaction.payment_method === 'bancomat' ? 'Bancomat' :
                             transaction.payment_method === 'debito' ? 'Debito' : '-'}
                          </span>
                        </div>
                        {isDebt && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              Debito Pendente
                            </span>
                          </div>
                        )}
                        {transaction.is_debt && transaction.debt_status === 'paid' && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" aria-hidden="true" />
                              Debito Saldato
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
          </div>
        </>
      )}

      {/* Dialog Saldare Debito */}
      <Dialog open={payDebtDialogOpen} onOpenChange={setPayDebtDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Saldare Debito</DialogTitle>
            <DialogDescription>
              Registra il pagamento di questo debito. Il saldo del portafoglio verrà aggiornato automaticamente.
            </DialogDescription>
          </DialogHeader>
          {selectedDebt && (
            <div className="space-y-4 py-4">
              <div className="rounded-md border p-4 bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Data movimento:</span>
                  <span className="font-medium">{format(new Date(selectedDebt.date), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Importo:</span>
                  <span className="font-semibold text-lg text-orange-600">
                    €{selectedDebt.amount?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {selectedDebt.notes && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Note:</span>
                    <span className="text-sm">{selectedDebt.notes}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-date">Data Saldo *</Label>
                <Input
                  id="pay-date"
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPayDebtDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirmPayDebt}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Salvataggio...' : 'Conferma Saldo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
