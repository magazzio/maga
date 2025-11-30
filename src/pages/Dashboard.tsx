import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Panoramica generale del tuo gestionale
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-6 w-6 text-muted-foreground" />
            <div>
              <CardTitle>In Costruzione</CardTitle>
              <CardDescription>
                La dashboard sarà disponibile dopo l'implementazione dei Movimenti e Portafogli
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            La dashboard mostrerà statistiche in tempo reale su magazzini, prodotti, portafogli e movimenti.
            Completa prima le sezioni Movimenti e Portafogli per abilitare questa funzionalità.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

