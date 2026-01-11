"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  description: string
}

const menuItems: MenuItem[] = [
  { id: 1, name: "Nasi Goreng", category: "Makanan", price: 25000, description: "Nasi goreng spesial" },
  { id: 2, name: "Mie Goreng", category: "Makanan", price: 22000, description: "Mie goreng kuah" },
  { id: 3, name: "Ayam Crispy", category: "Makanan", price: 32000, description: "Ayam goreng crispy" },
  { id: 4, name: "Tahu Goreng", category: "Makanan", price: 15000, description: "Tahu goreng isi" },
  { id: 5, name: "Es Teh Manis", category: "Minuman", price: 8000, description: "Es teh manis dingin" },
  { id: 6, name: "Es Jeruk", category: "Minuman", price: 10000, description: "Es jeruk segar" },
  { id: 7, name: "Kopi Hitam", category: "Minuman", price: 12000, description: "Kopi hitam panas" },
  { id: 8, name: "Air Mineral", category: "Minuman", price: 5000, description: "Air mineral 600ml" },
]

interface FoodMenuProps {
  onAddToCart: (item: any) => void
}

export function FoodMenu({ onAddToCart }: FoodMenuProps) {
  const categories = ["Makanan", "Minuman"]

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{category}</h3>
          <div className="grid grid-cols-2 gap-2">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <Card key={item.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-3 space-y-2">
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Rp</p>
                        <p className="font-bold text-sm">{item.price.toLocaleString("id-ID")}</p>
                      </div>
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-primary hover:bg-primary/90"
                        onClick={() => onAddToCart({ ...item, type: "food" })}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
