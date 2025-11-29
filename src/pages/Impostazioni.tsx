import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/hooks/useClients'
import { ProductType, ProductTypeColor, PRODUCT_TYPE_COLORS, Customer, ReferralColor, REFERRAL_COLORS } from '@/db'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

type SettingsSection = 'tipi-prodotto' | 'tipi-movimento' | 'magazzini' | 'portafogli' | 'referral'

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
      console.error('Error deleting product type:', error)
      toast({
        title: 'Errore',
        description: 'Errore nell\'eliminazione del tipo prodotto',
        variant: 'destructive',
      })
    }
  }

  const getColorInfo = (color: ProductTypeColor) => {
    return PRODUCT_TYPE_COLORS[color] || PRODUCT_TYPE_COLORS.blue
  }

  const sections: Array<{ id: SettingsSection; label: string; description: string }> = [
    { id: 'tipi-prodotto', label: 'Tipi Prodotto', description: 'Gestisci i tipi di prodotto' },
    { id: 'tipi-movimento', label: 'Tipi Movimento', description: 'Gestisci i tipi di movimento' },
    { id: 'magazzini', label: 'Magazzini', description: 'Gestisci i magazzini' },
    { id: 'portafogli', label: 'Portafogli', description: 'Gestisci i portafogli' },
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
                  <p className="text-sm">Crea il primo tipo per iniziare</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Tipi Movimento</CardTitle>
                <CardDescription>
                  Gestisci i tipi di movimento personalizzabili
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>Funzionalità in arrivo</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'magazzini' && (
            <Card>
              <CardHeader>
                <CardTitle>Magazzini</CardTitle>
                <CardDescription>
                  Gestisci i magazzini disponibili
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>Funzionalità in arrivo</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'portafogli' && (
            <Card>
              <CardHeader>
                <CardTitle>Portafogli</CardTitle>
                <CardDescription>
                  Gestisci i portafogli disponibili
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>Funzionalità in arrivo</p>
                </div>
              </CardContent>
            </Card>
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
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    contact_info: '',
    notes: '',
    is_referral: true,
    referral_color: 'cyan',
    referred_by: undefined,
  })

  const { data: clientsData } = useClients(1, 1000) // Carica tutti i clienti per filtrare i referral
  const referrals = clientsData?.clients?.filter(c => c.is_referral === true) || []
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const deleteMutation = useDeleteClient()
  const { toast } = useToast()
  
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; referralId: number | null }>({ open: false, referralId: null })

  const handleOpenDialog = (referral?: Customer) => {
    if (referral) {
      setEditingReferral(referral)
      setFormData({
        name: referral.name || '',
        contact_info: referral.contact_info || '',
        notes: referral.notes || '',
        is_referral: true,
        referral_color: referral.referral_color || 'cyan',
        referred_by: undefined, // I referral non possono essere referenziati
      })
    } else {
      setEditingReferral(null)
      setFormData({
        name: '',
        contact_info: '',
        notes: '',
        is_referral: true,
        referral_color: 'cyan',
        referred_by: undefined,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingReferral(null)
    setFormData({
      name: '',
      contact_info: '',
      notes: '',
      is_referral: true,
      referral_color: 'cyan',
      referred_by: undefined,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Errore di validazione',
        description: 'Il nome del referral è obbligatorio',
        variant: 'destructive',
      })
      return
    }
    
    try {
      if (editingReferral && editingReferral.id) {
        await updateMutation.mutateAsync({
          ...editingReferral,
          ...formData,
        })
        toast({
          title: 'Referral aggiornato',
          description: 'Le modifiche sono state salvate con successo',
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Referral creato',
          description: 'Il nuovo referral è stato aggiunto con successo',
          variant: 'success',
        })
      }
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

  const handleDelete = (id: number) => {
    setConfirmDeleteDialog({ open: true, referralId: id })
  }

  const performDelete = async () => {
    if (!confirmDeleteDialog.referralId) return
    
    try {
      await deleteMutation.mutateAsync(confirmDeleteDialog.referralId)
      toast({
        title: 'Referral eliminato',
        description: 'Il referral è stato eliminato con successo',
        variant: 'success',
      })
      setConfirmDeleteDialog({ open: false, referralId: null })
    } catch (error) {
      console.error('Error deleting referral:', error)
      toast({
        title: 'Errore',
        description: 'Errore nell\'eliminazione del referral',
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
                Gestisci i referral che possono referenziare altri clienti
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Referral
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">Nessun referral</p>
              <p className="text-sm">Crea il primo referral per iniziare</p>
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
                      {referral.contact_info && (
                        <span className="text-sm text-muted-foreground">{referral.contact_info}</span>
                      )}
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
                        onClick={() => referral.id && handleDelete(referral.id)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Elimina referral ${referral.name}`}
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
                {editingReferral ? 'Modifica Referral' : 'Nuovo Referral'}
              </DialogTitle>
              <DialogDescription>
                {editingReferral
                  ? 'Modifica le informazioni del referral'
                  : 'Crea un nuovo referral che potrà referenziare altri clienti'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="referral-name">Nome *</Label>
                <Input
                  id="referral-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Nome del referral"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="referral-contact">Informazioni di contatto</Label>
                <Input
                  id="referral-contact"
                  value={formData.contact_info}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_info: e.target.value })
                  }
                  placeholder="Telefono, email, indirizzo..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="referral-notes">Note</Label>
                <Textarea
                  id="referral-notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Note aggiuntive"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="referral-color">Colore Referral *</Label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(REFERRAL_COLORS) as ReferralColor[]).map((color) => {
                    const colorInfo = REFERRAL_COLORS[color]
                    const isSelected = formData.referral_color === color
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, referral_color: color })}
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
                        handleDelete(editingReferral.id)
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
                    {editingReferral ? 'Salva Modifiche' : 'Crea Referral'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteDialog.open} onOpenChange={(open) => setConfirmDeleteDialog({ open, referralId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina referral</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo referral? I clienti referenziati potrebbero essere influenzati. Questa azione non può essere annullata.
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
    </>
  )
}

