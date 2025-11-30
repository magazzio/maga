import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, Warehouse as WarehouseIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select-product-type'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  useProductTypes,
  useCreateProductType,
  useUpdateProductType,
  useDeleteProductType,
} from '@/hooks/useProductTypes'
import {
  useClients,
  useUpdateClient,
} from '@/hooks/useClients'
import {
  useEntities,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from '@/hooks/useEntities'
import {
  useTransactionTypes,
  useCreateTransactionType,
  useUpdateTransactionType,
  useDeleteTransactionType,
} from '@/hooks/useTransactionTypes'
import { ProductType, ProductTypeColor, PRODUCT_TYPE_COLORS, Customer, ReferralColor, REFERRAL_COLORS, Entity, TransactionType, db } from '@/db'
import { useToast } from '@/hooks/use-toast'
import { resetEntitiesAndWarehouses } from '@/db/reset'

type SettingsSection = 'tipi-prodotto' | 'tipi-movimento' | 'entita' | 'referral'

export default function Impostazioni() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('tipi-prodotto')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<ProductType | null>(null)
  const [formData, setFormData] = useState<Omit<ProductType, 'id'>>({
    name: '',
    color: 'blue',
  })

  const { data: productTypes, isLoading, error } = useProductTypes()
  const createMutation = useCreateProductType()
  const updateMutation = useUpdateProductType()
  const deleteMutation = useDeleteProductType()
  const { toast } = useToast()
  
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; typeId: number | null }>({ open: false, typeId: null })

  const handleOpenDialog = (productType?: ProductType) => {
    if (productType) {
      setEditingType(productType)
      setFormData({
        name: productType.name || '',
        color: productType.color || 'blue',
      })
    } else {
      setEditingType(null)
      setFormData({
        name: '',
        color: 'blue',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingType(null)
    setFormData({
      name: '',
      color: 'blue',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Errore di validazione',
        description: 'Il nome del tipo è obbligatorio',
        variant: 'destructive',
      })
      return
    }
    
    // Controlla duplicati (nome deve essere unico)
    const trimmedName = formData.name.trim()
    const existingType = productTypes?.find(
      t => t.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!editingType || t.id !== editingType.id)
    )
    if (existingType) {
      toast({
        title: 'Errore di validazione',
        description: 'Esiste già un tipo prodotto con questo nome',
        variant: 'destructive',
      })
      return
    }
    
    try {
      if (editingType && editingType.id) {
        await updateMutation.mutateAsync({
          ...editingType,
          ...formData,
        })
        toast({
          title: 'Tipo prodotto aggiornato',
          description: 'Le modifiche sono state salvate con successo',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Tipo prodotto creato',
          description: 'Il nuovo tipo prodotto è stato aggiunto con successo',
          variant: 'success',
        })
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving product type:', error)
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      toast({
        title: 'Errore',
        description: `Errore nel salvataggio del tipo prodotto: ${errorMessage}`,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: number) => {
    setConfirmDeleteDialog({ open: true, typeId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.typeId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.typeId)
      toast({
        title: 'Tipo prodotto eliminato',
        description: 'Il tipo prodotto è stato eliminato con successo',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, typeId: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione del tipo prodotto'
      toast({
        title: 'Impossibile eliminare',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const getColorInfo = (color: ProductTypeColor) => {
    return PRODUCT_TYPE_COLORS[color] || PRODUCT_TYPE_COLORS.blue
  }

  const sections: Array<{ id: SettingsSection; label: string; description: string }> = [
    { id: 'tipi-prodotto', label: 'Tipi Prodotto', description: 'Gestisci i tipi di prodotto' },
    { id: 'tipi-movimento', label: 'Tipi Movimento', description: 'Gestisci i tipi di movimento personalizzabili' },
    { id: 'entita', label: 'Entità', description: 'Gestisci le entità (magazzino e portafoglio creati automaticamente)' },
    { id: 'referral', label: 'Referral', description: 'Gestisci i referral' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Impostazioni</h2>
            <p className="text-muted-foreground mt-2">
              Gestisci le configurazioni e le personalizzazioni
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-card border rounded-lg p-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <div className="font-medium text-sm">{section.label}</div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {section.description}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Contenuto Principale */}
        <div className="flex-1 min-w-0">
          {activeSection === 'tipi-prodotto' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tipi Prodotto</CardTitle>
                  <CardDescription>
                    Gestisci i tipi di prodotto personalizzabili
                  </CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo Tipo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Caricamento...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  Errore nel caricamento dei tipi prodotto
                </div>
              ) : !productTypes || productTypes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">Nessun tipo prodotto</p>
                  <p className="text-sm mb-4">Crea il primo tipo per iniziare</p>
                  <Button onClick={() => handleOpenDialog()} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Crea primo tipo prodotto
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {productTypes.map((type) => {
                    const colorInfo = getColorInfo(type.color)
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleOpenDialog(type)}
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:scale-105 hover:shadow-md cursor-pointer ${colorInfo.bg} ${colorInfo.text}`}
                      >
                        {type.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {activeSection === 'tipi-movimento' && (
            <TransactionTypeSection />
          )}

          {activeSection === 'entita' && (
            <EntitySection />
          )}

          {activeSection === 'referral' && (
            <ReferralSection />
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingType ? 'Modifica Tipo Prodotto' : 'Nuovo Tipo Prodotto'}
              </DialogTitle>
              <DialogDescription>
                {editingType
                  ? 'Modifica le informazioni del tipo prodotto'
                  : 'Crea un nuovo tipo prodotto che potrai assegnare ai tuoi prodotti'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Es. Fiore, Hash, Olio..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Colore *</Label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(PRODUCT_TYPE_COLORS) as ProductTypeColor[]).map((color) => {
                    const colorInfo = PRODUCT_TYPE_COLORS[color]
                    const isSelected = formData.color === color
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`
                          relative h-12 rounded-md border-2 transition-all
                          ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}
                          ${colorInfo.bg} ${colorInfo.text}
                          flex items-center justify-center font-medium text-sm
                        `}
                        title={colorInfo.label}
                      >
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-[10px] text-primary-foreground">✓</span>
                          </span>
                        )}
                        {colorInfo.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                {editingType && editingType.id ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (editingType.id) {
                        handleCloseDialog()
                        handleDelete(editingType.id)
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Elimina
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Annulla
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingType ? 'Salva Modifiche' : 'Crea Tipo'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog per conferma eliminazione */}
      <AlertDialog open={confirmDeleteDialog.open} onOpenChange={(open) => setConfirmDeleteDialog({ open, typeId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina tipo prodotto</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo tipo prodotto? I prodotti associati potrebbero essere influenzati. Questa azione non può essere annullata.
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
  )
}

// Componente per la sezione Referral
function ReferralSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReferral, setEditingReferral] = useState<Customer | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<number | 'new'>('new')
  const [referralColor, setReferralColor] = useState<ReferralColor>('cyan')
  const [clientSearchValue, setClientSearchValue] = useState('')
  const [isClientComboboxOpen, setIsClientComboboxOpen] = useState(false)
  const [availableClients, setAvailableClients] = useState<Customer[]>([])

  const { data: clientsData } = useClients(1, 1000, true) // Carica tutti i clienti per i referral esistenti
  const referrals = clientsData?.clients?.filter(c => c.is_referral === true) || []
  const updateMutation = useUpdateClient()
  const { toast } = useToast()
  
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState<{ open: boolean; referralId: number | null }>({ open: false, referralId: null })

  // Carica clienti disponibili all'apertura del dialog
  useEffect(() => {
    if (isDialogOpen && !editingReferral) {
      const loadClients = async () => {
        try {
          const allClients = await db.customers.toArray()
          const filtered = allClients.filter(c => c.is_referral !== true)
          setAvailableClients(filtered)
        } catch (error) {
          console.error('Error loading clients:', error)
          setAvailableClients([])
        }
      }
      loadClients()
    }
  }, [isDialogOpen, editingReferral])

  // Filtra clienti in base al testo inserito
  const filteredClients = useMemo(() => {
    if (!clientSearchValue.trim()) {
      return availableClients.slice(0, 50)
    }
    const search = clientSearchValue.toLowerCase()
    return availableClients.filter(
      (client: Customer) =>
        client.name.toLowerCase().includes(search) ||
        (client.notes && client.notes.toLowerCase().includes(search))
    ).slice(0, 100)
  }, [availableClients, clientSearchValue])

  const handleOpenDialog = (referral?: Customer) => {
    if (referral) {
      setEditingReferral(referral)
      setSelectedClientId(referral.id || 'new')
      setReferralColor(referral.referral_color || 'cyan')
      setClientSearchValue(referral.name || '')
    } else {
      setEditingReferral(null)
      setSelectedClientId('new')
      setReferralColor('cyan')
      setClientSearchValue('')
    }
    setIsClientComboboxOpen(false)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingReferral(null)
    setSelectedClientId('new')
    setReferralColor('cyan')
    setClientSearchValue('')
    setIsClientComboboxOpen(false)
  }

  const handleSelectClient = (client: Customer) => {
    setSelectedClientId(client.id || 'new')
    setClientSearchValue(client.name)
    setIsClientComboboxOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedClientId === 'new') {
      toast({
        title: 'Errore di validazione',
        description: 'Seleziona un cliente esistente',
        variant: 'destructive',
      })
      return
    }
    
    const selectedClient = clientsData?.clients?.find(c => c.id === selectedClientId)
    if (!selectedClient) {
      toast({
        title: 'Errore',
        description: 'Cliente non trovato',
        variant: 'destructive',
      })
      return
    }
    
    try {
      await updateMutation.mutateAsync({
        ...selectedClient,
        is_referral: true,
        referral_color: referralColor,
      })
      toast({
        title: editingReferral ? 'Referral aggiornato' : 'Referral creato',
        description: editingReferral 
          ? 'Il colore del referral è stato aggiornato con successo'
          : 'Il cliente è stato marcato come referral con successo',
        variant: 'success',
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving referral:', error)
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      toast({
        title: 'Errore',
        description: `Errore nel salvataggio del referral: ${errorMessage}`,
        variant: 'destructive',
      })
    }
  }

  const handleRemoveReferral = (id: number) => {
    setConfirmRemoveDialog({ open: true, referralId: id })
  }

  const performRemoveReferral = async () => {
    if (!confirmRemoveDialog.referralId) return
    
    const referral = clientsData?.clients?.find(c => c.id === confirmRemoveDialog.referralId)
    if (!referral) return
    
    try {
      await updateMutation.mutateAsync({
        ...referral,
        is_referral: false,
        referral_color: undefined,
      })
      toast({
        title: 'Status referral rimosso',
        description: 'Il cliente non è più un referral',
        variant: 'success',
      })
      setConfirmRemoveDialog({ open: false, referralId: null })
    } catch (error) {
      console.error('Error removing referral status:', error)
      toast({
        title: 'Errore',
        description: 'Errore nella rimozione dello status referral',
        variant: 'destructive',
      })
    }
  }

  const getColorInfo = (color?: ReferralColor) => {
    if (!color) return REFERRAL_COLORS.cyan
    return REFERRAL_COLORS[color] || REFERRAL_COLORS.cyan
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Referral</CardTitle>
              <CardDescription>
                Seleziona clienti esistenti e marcali come referral. I referral possono referenziare altri clienti.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Referral
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">Nessun referral</p>
              <p className="text-sm">
                Seleziona un cliente esistente e marcalo come referral
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral) => {
                const colorInfo = getColorInfo(referral.referral_color)
                return (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${colorInfo.bg} ${colorInfo.text}`}>
                        {referral.name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(referral)}
                        aria-label={`Modifica referral ${referral.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => referral.id && handleRemoveReferral(referral.id)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Rimuovi status referral ${referral.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingReferral ? 'Modifica Referral' : 'Aggiungi Referral'}
              </DialogTitle>
              <DialogDescription>
                {editingReferral
                  ? 'Modifica il colore del referral'
                  : 'Seleziona un cliente esistente e marcalo come referral'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="referral-client">Cliente *</Label>
                {editingReferral ? (
                  <>
                    <Input
                      id="referral-client"
                      value={editingReferral.name}
                      disabled
                      className="font-medium"
                    />
                    <p className="text-xs text-muted-foreground">
                      Il cliente non può essere modificato. Vai in Clienti per modificare le informazioni.
                    </p>
                  </>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                      <Input
                        id="referral-client"
                        value={clientSearchValue}
                        onChange={(e) => {
                          setClientSearchValue(e.target.value)
                          setIsClientComboboxOpen(true)
                          if (selectedClientId !== 'new') {
                            setSelectedClientId('new')
                          }
                        }}
                        onFocus={() => setIsClientComboboxOpen(true)}
                        onBlur={(e) => {
                          // Delay per permettere il click sul dropdown
                          setTimeout(() => {
                            if (!e.currentTarget.contains(document.activeElement)) {
                              setIsClientComboboxOpen(false)
                            }
                          }, 200)
                        }}
                        placeholder="Cerca e seleziona un cliente..."
                        className="pl-10"
                        autoComplete="off"
                      />
                    </div>
                    {isClientComboboxOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[300px] overflow-auto">
                        {filteredClients.length > 0 ? (
                          <div className="p-1">
                            {filteredClients.map((client) => (
                              <button
                                key={client.id}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault() // Previene il blur dell'input
                                  handleSelectClient(client)
                                }}
                                className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                              >
                                <div className="font-medium">{client.name}</div>
                                {client.notes && (
                                  <div className="text-sm text-muted-foreground truncate">
                                    {client.notes}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            {clientSearchValue.trim() ? 'Nessun cliente trovato' : 'Inizia a digitare per cercare...'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="referral-color">Colore Referral *</Label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(REFERRAL_COLORS) as ReferralColor[]).map((color) => {
                    const colorInfo = REFERRAL_COLORS[color]
                    const isSelected = referralColor === color
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setReferralColor(color)}
                        className={`
                          relative h-12 rounded-md border-2 transition-all
                          ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}
                          ${colorInfo.bg} ${colorInfo.text}
                          flex items-center justify-center font-medium text-sm
                        `}
                        title={colorInfo.label}
                      >
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-[10px] text-primary-foreground">✓</span>
                          </span>
                        )}
                        {colorInfo.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                {editingReferral && editingReferral.id ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (editingReferral.id) {
                        handleCloseDialog()
                        handleRemoveReferral(editingReferral.id)
                      }
                    }}
                    disabled={updateMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Rimuovi Status
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Annulla
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending || selectedClientId === 'new'}>
                    {editingReferral ? 'Salva Modifiche' : 'Aggiungi Referral'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmRemoveDialog.open} onOpenChange={(open) => setConfirmRemoveDialog({ open, referralId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rimuovi status referral</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler rimuovere lo status referral da questo cliente? Il cliente non verrà eliminato, ma non potrà più referenziare altri clienti. I clienti già referenziati non verranno modificati.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={performRemoveReferral} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Rimuovi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}

// Componente per la sezione Entità
function EntitySection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [formErrors, setFormErrors] = useState<{ name?: string }>({})
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; entityId: number | null }>({ open: false, entityId: null })

  const { data: entities, isLoading } = useEntities()
  const createMutation = useCreateEntity()
  const updateMutation = useUpdateEntity()
  const deleteMutation = useDeleteEntity()
  const { toast } = useToast()
  const [resetDialog, setResetDialog] = useState(false)

  const handleOpenDialog = (entity?: Entity) => {
    if (entity) {
      setEditingEntity(entity)
      setFormData({
        name: entity.name,
        description: entity.description || '',
      })
    } else {
      setEditingEntity(null)
      setFormData({
        name: '',
        description: '',
      })
    }
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingEntity(null)
    setFormData({
      name: '',
      description: '',
    })
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Il nome dell\'entità è obbligatorio' })
      toast({
        title: 'Errore di validazione',
        description: 'Il nome dell\'entità è obbligatorio',
        variant: 'destructive',
      })
      return
    }
    
    // Controlla duplicati (nome deve essere unico)
    const trimmedName = formData.name.trim()
    const existingEntity = entities?.find(
      e => e.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!editingEntity || e.id !== editingEntity.id)
    )
    if (existingEntity) {
      setFormErrors({ name: 'Esiste già un\'entità con questo nome' })
      toast({
        title: 'Errore di validazione',
        description: 'Esiste già un\'entità con questo nome',
        variant: 'destructive',
      })
      return
    }
    
    try {
      if (editingEntity?.id) {
        await updateMutation.mutateAsync({
          ...editingEntity,
          ...formData,
        })
        toast({
          title: 'Entità aggiornata',
          description: 'Le modifiche sono state salvate con successo. Magazzino e portafoglio associati sono stati aggiornati.',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Entità creata',
          description: 'L\'entità è stata creata con successo. Magazzino e portafoglio associati sono stati creati automaticamente.',
          variant: 'success',
        })
      }
      handleCloseDialog()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      toast({
        title: 'Errore',
        description: `Errore nel salvataggio dell'entità: ${errorMessage}`,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: number) => {
    setConfirmDeleteDialog({ open: true, entityId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.entityId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.entityId)
      toast({
        title: 'Entità eliminata',
        description: 'L\'entità è stata eliminata con successo. Magazzino e portafoglio associati sono stati eliminati.',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, entityId: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione dell\'entità'
      toast({
        title: 'Impossibile eliminare',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleReset = async () => {
    try {
      await resetEntitiesAndWarehouses()
      toast({
        title: 'Reset completato',
        description: 'Tutte le entità, magazzini e portafogli sono stati eliminati.',
        variant: 'success',
      })
      setResetDialog(false)
      // Invalida le query per aggiornare la lista
      window.location.reload() // Ricarica per aggiornare tutto
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel reset'
      toast({
        title: 'Errore',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entità</CardTitle>
            <CardDescription>
              Gestisci le entità. Ogni entità crea automaticamente un magazzino e un portafoglio associati.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {entities && entities.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => setResetDialog(true)}
                aria-label="Elimina tutte le entità"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Elimina Tutte
              </Button>
            )}
            <Button onClick={() => handleOpenDialog()} aria-label="Crea nuova entità">
              <Plus className="mr-2 h-4 w-4" />
              Nuova Entità
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Caricamento...
          </div>
        ) : !entities || entities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-2">Nessuna entità</p>
            <p className="text-sm mb-4">Crea la prima entità per iniziare</p>
            <Button onClick={() => handleOpenDialog()} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Crea prima entità
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <WarehouseIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{entity.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {entity.description || 'Nessuna descrizione'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Include: Magazzino {entity.name} • Portafoglio {entity.name}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(entity)}
                    aria-label={`Modifica entità ${entity.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => entity.id && handleDelete(entity.id)}
                    className="text-destructive hover:text-destructive"
                    aria-label={`Elimina entità ${entity.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog per creare/modificare entità */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingEntity ? 'Modifica Entità' : 'Nuova Entità'}
              </DialogTitle>
              <DialogDescription>
                {editingEntity
                  ? 'Modifica le informazioni dell\'entità. Il magazzino e il portafoglio associati verranno aggiornati automaticamente.'
                  : 'Inserisci le informazioni per la nuova entità. Verranno creati automaticamente un magazzino e un portafoglio associati.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="entity-name">Nome *</Label>
                <Input
                  id="entity-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Es. Driplug, Meetdrip"
                  aria-invalid={!!formErrors.name}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-description">Descrizione</Label>
                <Textarea
                  id="entity-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Note aggiuntive (opzionale)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingEntity ? 'Salva Modifiche' : 'Crea Entità'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog per conferma eliminazione */}
      <AlertDialog
        open={confirmDeleteDialog.open}
        onOpenChange={(open) => setConfirmDeleteDialog({ open, entityId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina entità</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa entità? Verranno eliminati anche il magazzino e il portafoglio associati. Questa azione non può essere annullata.
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

      {/* AlertDialog per reset completo */}
      <AlertDialog
        open={resetDialog}
        onOpenChange={setResetDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina tutte le entità</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare TUTTE le entità? Verranno eliminate anche tutti i magazzini e portafogli associati. 
              Questa azione non può essere annullata e ti permetterà di partire da zero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina Tutto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

// Componente per la sezione Tipi Movimento
function TransactionTypeSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<TransactionType | null>(null)
  const [formData, setFormData] = useState<Omit<TransactionType, 'id'>>({
    name: '',
    description: '',
    affects_warehouse: true,
    affects_portfolio: true,
    payment_type: 'monthly',
  })
  const [formErrors, setFormErrors] = useState<{ name?: string }>({})
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; typeId: number | null }>({ open: false, typeId: null })

  const { data: transactionTypes, isLoading } = useTransactionTypes()
  const createMutation = useCreateTransactionType()
  const updateMutation = useUpdateTransactionType()
  const deleteMutation = useDeleteTransactionType()
  const { toast } = useToast()

  const handleOpenDialog = (type?: TransactionType) => {
    if (type) {
      setEditingType(type)
      setFormData({
        name: type.name,
        description: type.description || '',
        affects_warehouse: type.affects_warehouse,
        affects_portfolio: type.affects_portfolio,
        payment_type: type.payment_type || 'monthly',
        custom_fields: type.custom_fields,
      })
    } else {
      setEditingType(null)
      setFormData({
        name: '',
        description: '',
        affects_warehouse: true,
        affects_portfolio: true,
        payment_type: 'monthly',
      })
    }
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingType(null)
    setFormData({
      name: '',
      description: '',
      affects_warehouse: true,
      affects_portfolio: true,
      payment_type: 'monthly',
    })
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Il nome del tipo movimento è obbligatorio' })
      toast({
        title: 'Errore di validazione',
        description: 'Il nome del tipo movimento è obbligatorio',
        variant: 'destructive',
      })
      return
    }
    
    // Controlla duplicati
    const trimmedName = formData.name.trim()
    const existingType = transactionTypes?.find(
      t => t.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!editingType || t.id !== editingType.id)
    )
    if (existingType) {
      setFormErrors({ name: 'Esiste già un tipo movimento con questo nome' })
      toast({
        title: 'Errore di validazione',
        description: 'Esiste già un tipo movimento con questo nome',
        variant: 'destructive',
      })
      return
    }
    
    try {
      if (editingType?.id) {
        await updateMutation.mutateAsync({
          ...editingType,
          ...formData,
        })
        toast({
          title: 'Tipo movimento aggiornato',
          description: 'Le modifiche sono state salvate con successo',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Tipo movimento creato',
          description: 'Il nuovo tipo movimento è stato aggiunto con successo',
          variant: 'success',
        })
      }
      handleCloseDialog()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      toast({
        title: 'Errore',
        description: `Errore nel salvataggio del tipo movimento: ${errorMessage}`,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: number) => {
    setConfirmDeleteDialog({ open: true, typeId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.typeId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.typeId)
      toast({
        title: 'Tipo movimento eliminato',
        description: 'Il tipo movimento è stato eliminato con successo',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, typeId: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione del tipo movimento'
      toast({
        title: 'Impossibile eliminare',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipi Movimento</CardTitle>
            <CardDescription>
              Gestisci i tipi di movimento personalizzabili. Ogni tipo definisce come il movimento influisce su magazzino e portafoglio.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()} aria-label="Crea nuovo tipo movimento">
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Tipo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Caricamento...
          </div>
        ) : !transactionTypes || transactionTypes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-2">Nessun tipo movimento</p>
            <p className="text-sm mb-4">Crea il primo tipo movimento per iniziare</p>
            <Button onClick={() => handleOpenDialog()} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Crea primo tipo movimento
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {transactionTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {type.description || 'Nessuna descrizione'}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {type.affects_warehouse && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        Magazzino
                      </span>
                    )}
                    {type.affects_portfolio && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Portafoglio
                      </span>
                    )}
                    {type.payment_type && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                        {type.payment_type === 'instant' ? 'Pagamento Istantaneo' : 'Pagamento Mensile'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(type)}
                    aria-label={`Modifica tipo movimento ${type.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => type.id && handleDelete(type.id)}
                    className="text-destructive hover:text-destructive"
                    aria-label={`Elimina tipo movimento ${type.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog per creare/modificare tipo movimento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingType ? 'Modifica Tipo Movimento' : 'Nuovo Tipo Movimento'}
              </DialogTitle>
              <DialogDescription>
                {editingType
                  ? 'Modifica le informazioni del tipo movimento'
                  : 'Inserisci le informazioni per il nuovo tipo movimento'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type-name">Nome *</Label>
                <Input
                  id="type-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Es. Stock, Cura, Delivery, Meet, Ship"
                  aria-invalid={!!formErrors.name}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type-description">Descrizione</Label>
                <Textarea
                  id="type-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrizione del tipo movimento (opzionale)"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="affects-warehouse"
                    checked={formData.affects_warehouse}
                    onCheckedChange={(checked) => setFormData({ ...formData, affects_warehouse: checked })}
                  />
                  <Label htmlFor="affects-warehouse">Influisce su Magazzino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="affects-portfolio"
                    checked={formData.affects_portfolio}
                    onCheckedChange={(checked) => setFormData({ ...formData, affects_portfolio: checked })}
                  />
                  <Label htmlFor="affects-portfolio">Influisce su Portafoglio</Label>
                </div>
              </div>
              {formData.affects_portfolio && (
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Tipo Pagamento</Label>
                  <Select
                    value={formData.payment_type || 'monthly'}
                    onValueChange={(v) => setFormData({ ...formData, payment_type: v as 'monthly' | 'instant' })}
                  >
                    <SelectTrigger id="payment-type" aria-label="Seleziona tipo pagamento">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensile (pagato a fine mese)</SelectItem>
                      <SelectItem value="instant">Istantaneo (pagato subito)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingType ? 'Salva Modifiche' : 'Crea Tipo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog per conferma eliminazione */}
      <AlertDialog
        open={confirmDeleteDialog.open}
        onOpenChange={(open) => setConfirmDeleteDialog({ open, typeId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina tipo movimento</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo tipo movimento? Questa azione non può essere annullata.
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
    </Card>
  )
}

