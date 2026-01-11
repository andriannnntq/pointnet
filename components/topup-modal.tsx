"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Copy, CheckCircle, AlertCircle } from "lucide-react"

interface TopupModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
  onTopupSuccess: (amount: number) => void
}

export default function TopupModal({ isOpen, onClose, currentBalance, onTopupSuccess }: TopupModalProps) {
  const [step, setStep] = useState<"amount" | "payment" | "confirm">("amount")
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const isMountedRef = useRef(true)

  const presetAmounts = [50000, 100000, 250000, 500000]
  const bankAccount = "1234567890"
  const bankName = "BCA"

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setAmount(value)
  }

  const handleContinue = () => {
    if (!amount || Number.parseInt(amount) < 10000) {
      alert("Minimal top-up adalah Rp 10.000")
      return
    }
    setStep("payment")
  }

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount)
    setCopied(true)
    setTimeout(() => {
      if (isMountedRef.current) {
        setCopied(false)
      }
    }, 2000)
  }

  const handleConfirmPayment = () => {
    if (!amount) return

    const numAmount = Number.parseInt(amount)
    const newBalance = currentBalance + numAmount

    const userData = localStorage.getItem("poinnet_user")
    if (userData) {
      const user = JSON.parse(userData)
      user.balance = newBalance
      localStorage.setItem("poinnet_user", JSON.stringify(user))
    }

    const transactions = JSON.parse(localStorage.getItem("poinnet_orders") || "[]")
    const newTransaction = {
      id: Date.now().toString(),
      amount: numAmount,
      timestamp: new Date().toISOString(),
      status: "success",
      description: "Top-up Saldo",
    }
    transactions.unshift(newTransaction)
    localStorage.setItem("poinnet_orders", JSON.stringify(transactions))

    onTopupSuccess(numAmount)
    setStep("confirm")

    setTimeout(() => {
      if (isMountedRef.current) {
        setStep("amount")
        setAmount("")
        onClose()
      }
    }, 2000)
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Top-up Saldo
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4">
            <div className="bg-card/50 border border-border/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Saldo Saat Ini</p>
              <p className="text-2xl font-bold">Rp {currentBalance.toLocaleString("id-ID")}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Pilih Jumlah</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? "default" : "outline"}
                    className="text-sm h-12"
                    onClick={() => handleSelectAmount(preset)}
                  >
                    Rp {(preset / 1000).toFixed(0)}k
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount" className="text-xs">
                Atau Masukkan Jumlah Lain
              </Label>
              <Input
                id="custom-amount"
                type="text"
                placeholder="Contoh: 75000"
                value={amount}
                onChange={handleCustomAmount}
                className="bg-input border-input/50"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
                Batal
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleContinue} disabled={!amount}>
                Lanjutkan
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Jumlah Yang Harus Ditransfer</p>
              <p className="text-3xl font-bold text-accent">Rp {Number.parseInt(amount).toLocaleString("id-ID")}</p>
            </div>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">Transaksi ke rekening:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Bank</p>
                    <p className="font-semibold">{bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nomor Rekening</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold">{bankAccount}</p>
                      <Button size="sm" variant="ghost" onClick={handleCopyAccount} className="h-8 w-8 p-0">
                        {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Atas Nama</p>
                    <p className="font-semibold">PT POINNET</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Pastikan jumlah transfer tepat sesuai dengan nominal di atas untuk verifikasi otomatis.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("amount")}>
                Kembali
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleConfirmPayment}>
                Saya Sudah Transfer
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold">Top-up Berhasil!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Saldo Anda telah ditambah Rp {Number.parseInt(amount).toLocaleString("id-ID")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Menutup dalam 2 detik...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
