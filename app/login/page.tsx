"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate login
    setTimeout(() => {
      if (email && password) {
        const user = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          balance: 100000,
          tier: "regular",
        }
        localStorage.setItem("poinnet_user", JSON.stringify(user))
        localStorage.setItem("poinnet_user_balance", "100000")
        console.log("[v0] LOGIN - Balance set to:", localStorage.getItem("poinnet_user_balance"))
        setLoading(false)
        router.push("/dashboard")
      } else {
        setError("Email dan password harus diisi")
        setLoading(false)
      }
    }, 800)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md bg-card/80 border-primary/20 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">POINNET</CardTitle>
          <p className="text-sm text-muted-foreground">Masuk ke akun Anda</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-input/50 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-input/50 focus:border-primary/50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground">Atau</span>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
