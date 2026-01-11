"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowRight, ChevronUp } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  type: string
  hours?: number
}

interface CartProps {
  items: CartItem[]
  onRemove: (id: number) => void
}

export function Cart({ items, onRemove }: CartProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price, 0)

  if (collapsed) {
    return (
      <Button
        variant="outline"
        className="w-full mb-4 border-primary/30 bg-primary/10"
        onClick={() => setCollapsed(false)}
      >
        <ChevronUp className="w-4 h-4 mr-2" />
        Tampilkan Keranjang ({items.length})
      </Button>
    )
  }

  const handleCheckout = () => {
    const firstItem = items[0]
    const params = new URLSearchParams({
      total: total.toString(),
      packageName: items.map((i) => i.name).join(", "),
      hours: items.reduce((sum, i) => sum + (i.hours || 0), 0).toString(),
      type: firstItem.type,
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <Card className="mb-4 bg-primary/10 border-primary/30">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Keranjang Belanja</CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setCollapsed(true)} className="h-6 w-6">
          <ChevronUp className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Items list */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-card/50 p-2 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.hours ? `${item.hours}h` : "Item"} • Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 hover:bg-destructive/20"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-primary/20 pt-3">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Total</p>
            <p className="text-lg font-bold text-primary">Rp {total.toLocaleString("id-ID")}</p>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleCheckout}>
            Lanjut ke Pembayaran
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
