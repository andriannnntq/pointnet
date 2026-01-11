"use client"

import { useEffect, useState, useRef } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, TrendingUp, Star, Clock, Users, MessageCircle, Percent } from "lucide-react"
import Link from "next/link"
import { PromoModal } from "@/components/promo-modal"
import TopupModal from "@/components/topup-modal"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  balance: number
  tier: string
}

interface ActiveOrder {
  id: string
  type: string
  hours: number
  startTime: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([])
  const [remainingHours, setRemainingHours] = useState(0)
  const [promoOpen, setPromoOpen] = useState(false)
  const [topupOpen, setTopupOpen] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const userData = localStorage.getItem("poinnet_user")
    const ordersData = localStorage.getItem("poinnet_active_orders")

    if (userData && isMountedRef.current) {
      setUser(JSON.parse(userData))
    }

    if (ordersData && isMountedRef.current) {
      const orders = JSON.parse(ordersData)
      setActiveOrders(orders)
      calculateRemainingHours(orders)
    }

    if (isMountedRef.current) {
      setLoading(false)
    }

    const handleBalanceUpdate = () => {
      const userData = localStorage.getItem("poinnet_user")
      if (userData && isMountedRef.current) {
        setUser(JSON.parse(userData))
      }
    }

    window.addEventListener("balance_updated", handleBalanceUpdate)

    return () => {
      isMountedRef.current = false
      window.removeEventListener("balance_updated", handleBalanceUpdate)
    }
  }, [])

  const calculateRemainingHours = (orders: ActiveOrder[]) => {
    let totalHours = 0
    const now = Date.now()

    orders.forEach((order) => {
      const elapsedMs = now - order.startTime
      const elapsedHours = elapsedMs / (1000 * 60 * 60)
      const remaining = Math.max(0, order.hours - elapsedHours)
      totalHours += remaining
    })

    if (isMountedRef.current) {
      setRemainingHours(totalHours)
    }
  }

  useEffect(() => {
    if (activeOrders.length === 0) return

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        calculateRemainingHours(activeOrders)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [activeOrders])

  const handleTopupSuccess = (amount: number) => {
    const userData = localStorage.getItem("poinnet_user")
    if (userData && isMountedRef.current) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background"></div>
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-24 pt-4 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <img
              src={user?.avatar || "/placeholder.svg"}
              alt={user?.name}
              className="w-16 h-16 rounded-lg border-2 border-primary/20"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {user?.tier === "vip" ? "VIP Member" : "Regular Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm mb-2">Saldo Anda</p>
            <div className="flex items-end gap-2 mb-4">
              <h2 className="text-4xl font-bold">Rp {(user?.balance || 0).toLocaleString("id-ID")}</h2>
              <span className="text-muted-foreground text-sm mb-1">IDR</span>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setTopupOpen(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Top Up Saldo
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Pesanan Aktif</p>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                </div>
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Jam Tersisa</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(remainingHours)}h {Math.round((remainingHours % 1) * 60)}m
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Layanan Utama</h3>

          <Link href="/orders" className="block">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="pt-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold">Smart Billing</p>
                  <p className="text-xs text-muted-foreground">Beli paket dan top-up jam</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/orders" className="block">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="pt-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">E-Menu</p>
                  <p className="text-xs text-muted-foreground">Pesan makanan & minuman</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat" className="block">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="pt-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Chat Admin</p>
                  <p className="text-xs text-muted-foreground">Hubungi tim support</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Promo Banner */}
        <div
          onClick={() => setPromoOpen(true)}
          className="mt-8 rounded-lg bg-gradient-to-r from-accent/30 to-secondary/30 border border-accent/20 p-4 cursor-pointer hover:border-accent/40 transition-colors"
        >
          <h4 className="font-semibold mb-1 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Promo Spesial
          </h4>
          <p className="text-sm text-muted-foreground mb-3">Top-up sekarang dapatkan bonus jam bermain</p>
          <Button size="sm" variant="outline" className="border-accent/30 bg-transparent">
            Lihat Promo
          </Button>
        </div>

        {/* Promo Modal */}
        <PromoModal isOpen={promoOpen} onClose={() => setPromoOpen(false)} />

        {/* Topup Modal */}
        <TopupModal
          isOpen={topupOpen}
          onClose={() => setTopupOpen(false)}
          currentBalance={user?.balance || 0}
          onTopupSuccess={handleTopupSuccess}
        />
      </main>

      <BottomNav />
    </ProtectedRoute>
  )
}
