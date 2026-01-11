"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Star, Zap, Cpu, Gamepad2, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { PackageSelector } from "@/components/orders/package-selector"
import { FoodMenu } from "@/components/orders/food-menu"
import { Cart } from "@/components/orders/cart"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("packages")
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])

  const addToCart = (item: any) => {
    setCartItems([...cartItems, { ...item, id: Date.now() }])
  }

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-32 pt-4 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button size="icon" variant="ghost" className="hover:bg-card">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Pesanan</h1>
          <Button size="icon" variant="ghost" className="hover:bg-card relative" onClick={() => setCartOpen(!cartOpen)}>
            <Zap className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-xs rounded-full text-primary-foreground flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>

        {/* Cart Panel */}
        {cartOpen && cartItems.length > 0 && <Cart items={cartItems} onRemove={removeFromCart} />}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border/50">
            <TabsTrigger value="packages" className="gap-2">
              <Zap className="w-4 h-4" />
              Paket
            </TabsTrigger>
            <TabsTrigger value="food" className="gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Makanan
            </TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Gamepad2 className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold">Paket Reguler</h3>
              </div>
              <PackageSelector
                type="regular"
                packages={[
                  { id: 1, name: "30 Menit", hours: 0.5, price: 10000 },
                  { id: 2, name: "1 Jam", hours: 1, price: 15000 },
                  { id: 3, name: "2 Jam", hours: 2, price: 28000 },
                  { id: 4, name: "3 Jam", hours: 3, price: 40000 },
                  { id: 5, name: "5 Jam", hours: 5, price: 60000 },
                ]}
                onSelect={addToCart}
              />
            </div>

            <div className="border-t border-border/50 my-6"></div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Star className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Paket VIP</h3>
                <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded-full px-2 py-0.5">
                  Premium
                </span>
              </div>
              <PackageSelector
                type="vip"
                packages={[
                  { id: 11, name: "VIP 1 Jam", hours: 1, price: 35000 },
                  { id: 12, name: "VIP 2 Jam", hours: 2, price: 65000 },
                  { id: 13, name: "VIP 3 Jam", hours: 3, price: 90000 },
                  { id: 14, name: "VIP 5 Jam", hours: 5, price: 140000 },
                ]}
                onSelect={addToCart}
              />
              <Card className="bg-accent/10 border-accent/20 p-3">
                <p className="text-xs text-muted-foreground flex gap-2">
                  <Cpu className="w-4 h-4 flex-shrink-0 text-accent mt-0.5" />
                  <span>Akses PC High-End dengan ruangan privat dan AC lebih dingin</span>
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Food Tab */}
          <TabsContent value="food" className="space-y-4 mt-4">
            <FoodMenu onAddToCart={addToCart} />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </ProtectedRoute>
  )
}
