"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, Copy, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const total = Number.parseInt(searchParams.get("total") || "0")
  const packageName = searchParams.get("packageName") || "Paket"
  const hours = Number.parseFloat(searchParams.get("hours") || "0")
  const packageType = searchParams.get("type") || "regular"

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error" | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const bankAccountNumber = "1234567890"
  const bankName = "Bank BRI"
  const accountHolder = "POINNET WARNET"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankAccountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmPayment = () => {
    setLoading(true)
    setTimeout(() => {
      setPaymentStatus("success")
      setLoading(false)

      const balanceStr = localStorage.getItem("poinnet_user_balance")
      let currentBalance = balanceStr ? Number(balanceStr) : 0

      if (currentBalance === 0 || isNaN(currentBalance)) {
        const userData = JSON.parse(localStorage.getItem("poinnet_user") || "{}")
        currentBalance = userData.balance || 0
      }

      const newBalance = Math.max(0, currentBalance - total)

      localStorage.setItem("poinnet_user_balance", newBalance.toString())
      const userData = JSON.parse(localStorage.getItem("poinnet_user") || "{}")
      userData.balance = newBalance
      localStorage.setItem("poinnet_user", JSON.stringify(userData))

      window.dispatchEvent(new Event("balance_updated"))

      const orders = JSON.parse(localStorage.getItem("poinnet_orders") || "[]")
      orders.push({
        id: "ORDER_" + Date.now(),
        amount: total,
        timestamp: new Date().toISOString(),
        status: "success",
        description: `${packageName} (${packageType === "vip" ? "VIP" : "Regular"})`,
      })
      localStorage.setItem("poinnet_orders", JSON.stringify(orders))

      const activeOrders = JSON.parse(localStorage.getItem("poinnet_active_orders") || "[]")
      activeOrders.push({
        id: "ACTIVE_" + Date.now(),
        type: packageType,
        hours: hours,
        startTime: Date.now(),
        description: packageName,
      })
      localStorage.setItem("poinnet_active_orders", JSON.stringify(activeOrders))
    }, 2000)
  }

  if (!total) {
    return (
      <main className="min-h-screen bg-background pb-24 pt-4 px-4">
        <div className="text-center mt-20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground mb-4">Tidak ada pesanan yang valid</p>
          <Link href="/orders">
            <Button className="bg-primary hover:bg-primary/90">Kembali ke Pesanan</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/orders">
          <Button size="icon" variant="ghost" className="hover:bg-card">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Pembayaran</h1>
      </div>

      {paymentStatus === "success" ? (
        // Success State
        <div className="space-y-4">
          <Card className="bg-green-500/10 border-green-500/30 text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
            <p className="text-muted-foreground mb-4">Pesanan Anda sedang diproses</p>
            <div className="bg-card/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
              <p className="text-3xl font-bold text-primary">Rp {total.toLocaleString("id-ID")}</p>
              <p className="text-sm text-muted-foreground mt-2">{packageName}</p>
            </div>
          </Card>

          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Clock className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-500 ml-2">
              Pesanan akan segera diproses. Silakan tunggu di tempat Anda.
            </AlertDescription>
          </Alert>

          <Link href="/dashboard">
            <Button className="w-full bg-primary hover:bg-primary/90">Kembali ke Dashboard</Button>
          </Link>
        </div>
      ) : (
        // Payment Pending State
        <div className="space-y-4">
          {/* Amount Summary */}
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm mb-2">Total Pembayaran</p>
              <p className="text-4xl font-bold text-primary mb-1">Rp {total.toLocaleString("id-ID")}</p>
              <p className="text-sm text-muted-foreground mt-2">{packageName}</p>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instruksi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Transfer ke rekening bank berikut</p>
                    <p className="text-xs text-muted-foreground mt-1">Pastikan nominal sesuai</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Klik tombol "Konfirmasi Pembayaran"</p>
                    <p className="text-xs text-muted-foreground mt-1">Setelah transfer selesai</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Pesanan akan segera diproses</p>
                    <p className="text-xs text-muted-foreground mt-1">Biasanya dalam 5 menit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="bg-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent"></span>
                {bankName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nama Rekening</p>
                <p className="font-semibold">{accountHolder}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Nomor Rekening</p>
                <div className="flex gap-2">
                  <Input value={bankAccountNumber} readOnly className="bg-card border-border/50 font-mono" />
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border/50 bg-transparent"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copied && <p className="text-xs text-green-500 mt-1">Tercopy!</p>}
              </div>

              <div className="bg-secondary/20 rounded-lg p-3 border border-secondary/20">
                <p className="text-xs text-muted-foreground mb-1">Total Transfer</p>
                <p className="text-2xl font-bold text-secondary">Rp {total.toLocaleString("id-ID")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full border-border/50 bg-transparent">
                Batal
              </Button>
            </Link>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleConfirmPayment} disabled={loading}>
              {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
            </Button>
          </div>

          <Alert className="bg-blue-500/10 border-blue-500/30">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-500 ml-2 text-xs">
              Pembayaran akan diverifikasi otomatis. Jangan tutup halaman ini.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  )
}
