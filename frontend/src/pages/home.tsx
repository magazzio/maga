import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Magazz.io</h1>
        <Card>
          <CardHeader>
            <CardTitle>Benvenuto in Magazz.io</CardTitle>
            <CardDescription>
              Gestionale magazzino e cassa per utenti privati e PMI italiane
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Inizia</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

