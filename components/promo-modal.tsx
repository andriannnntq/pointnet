"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Percent } from "lucide-react"

interface PromoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  const [claimed, setClaimed] = useState<string[]>([])

  const promos = [
    {
      id: "promo1",
      title: "Bonus Jam Bermain 30%",
      description: "Top-up sekarang dapatkan bonus 30% waktu bermain tambahan",
      badge: "Bonus 30%",
      color: "from-accent/30 to-secondary/30",
      borderColor: "border-accent/20",
    },
    {
      id: "promo2",
      title: "Diskon Makanan 20%",
      description: "Setiap pemesanan menu makanan gratis ongkir dan diskon 20%",
      badge: "Diskon 20%",
      color: "from-secondary/30 to-accent/30",
      borderColor: "border-secondary/20",
    },
    {
      id: "promo3",
      title: "Member VIP Gratis 1 Hari",
      description: "Daftar sekarang dan dapatkan akses VIP gratis selama 24 jam",
      badge: "Gratis 1 Hari",
      color: "from-primary/30 to-accent/30",
      borderColor: "border-primary/20",
    },
  ]

  const handleClaim = (promoId: string) => {
    setClaimed([...claimed, promoId])
    setTimeout(() => {
      setClaimed(claimed.filter((id) => id !== promoId))
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <Card className="w-full rounded-t-2xl rounded-b-none bg-background border-t border-border/50 max-h-[80vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-background border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-accent" />
              Promo Spesial
            </CardTitle>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8 space-y-4">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`bg-gradient-to-r ${promo.color} border ${promo.borderColor} rounded-lg p-4 transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground">{promo.description}</p>
                </div>
                <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded-full px-2 py-1 whitespace-nowrap ml-2">
                  {promo.badge}
                </span>
              </div>

              <Button
                size="sm"
                className={`w-full ${claimed.includes(promo.id) ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-primary/90"}`}
                onClick={() => handleClaim(promo.id)}
                disabled={claimed.includes(promo.id)}
              >
                {claimed.includes(promo.id) ? "Diklaim!" : "Klaim Sekarang"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
