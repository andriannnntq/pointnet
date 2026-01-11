"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Gamepad2, UtensilsCrossed } from "lucide-react"
import { SplashScreen } from "@/components/splash-screen"

export default function LandingPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("poinnet_user")
      if (user) {
        router.push("/dashboard")
      }
    }
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <main className="min-h-screen bg-gradient-to-br from-background via-card to-background overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 border border-primary/30">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              POINNET
            </h1>
            <p className="text-xl text-muted-foreground mb-2">One-Stop Digital Hub Solution</p>
            <p className="text-base text-muted-foreground mb-8">
              Sistem manajemen warnet modern dengan smart billing, pemesanan makanan, dan dukungan pelanggan
              terintegrasi
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-3xl">
            <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <Gamepad2 className="w-6 h-6 text-accent mb-2" />
                <CardTitle className="text-lg">Smart Billing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Top-up paket tanpa antre kasir</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <UtensilsCrossed className="w-6 h-6 text-secondary mb-2" />
                <CardTitle className="text-lg">E-Menu Ordering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Pesan makanan langsung dari tempat</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <Zap className="w-6 h-6 text-accent mb-2" />
                <CardTitle className="text-lg">Chat Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Bantuan teknis langsung</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => router.push("/login")}
            >
              Masuk
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 bg-transparent"
              onClick={() => router.push("/register")}
            >
              Daftar
            </Button>
          </div>

          {/* Footer info */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            Versi Beta • Untuk warnet dan pengunjung gamer
          </p>
        </div>
      </main>
    </>
  )
}
