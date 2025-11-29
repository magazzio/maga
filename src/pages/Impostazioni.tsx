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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
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
import { ProductType, ProductTypeColor, PRODUCT_TYPE_COLORS } from '@/db'
import { useToast } from '@/hooks/use-toast'

export default function Impostazioni() {
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

      <Tabs defaultValue="tipi-prodotto" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tipi-prodotto">Tipi Prodotto</TabsTrigger>
          <TabsTrigger value="tipi-movimento">Tipi Movimento</TabsTrigger>
          <TabsTrigger value="magazzini">Magazzini</TabsTrigger>
          <TabsTrigger value="portafogli">Portafogli</TabsTrigger>
          <TabsTrigger value="clienti">Clienti</TabsTrigger>
        </TabsList>

        <TabsContent value="tipi-prodotto" className="mt-6">
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
        </TabsContent>

        <TabsContent value="tipi-movimento" className="mt-6">
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
        </TabsContent>

        <TabsContent value="magazzini" className="mt-6">
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
        </TabsContent>

        <TabsContent value="portafogli" className="mt-6">
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
        </TabsContent>

        <TabsContent value="clienti" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clienti</CardTitle>
              <CardDescription>
                Gestisci i clienti (solo Meetdrip)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Funzionalità in arrivo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

