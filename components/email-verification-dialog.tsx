"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Mail, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmailVerificationDialogProps {
  currentEmail: string
  newEmail: string
  setNewEmail: (email: string) => void
  onVerified: (email: string) => void
  onCancel: () => void
}

export function EmailVerificationDialog({
  currentEmail,
  newEmail,
  setNewEmail,
  onVerified,
  onCancel,
}: EmailVerificationDialogProps) {
  const [step, setStep] = useState<"email" | "code">("email")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [demoCode, setDemoCode] = useState("")
  const isMountedRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (success && step === "code") {
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          // Reset state before calling onVerified to avoid post-unmount updates
          const emailToVerify = newEmail
          setStep("email")
          setCode("")
          setNewEmail("")
          setDemoCode("")
          setSuccess(false)
          // Call onVerified after state is reset
          onVerified(emailToVerify)
        }
      }, 1500)
    }
  }, [success, step, newEmail, onVerified, setNewEmail])

  const handleSendCode = async () => {
    if (!newEmail) {
      setError("Email baru harus diisi")
      return
    }

    if (newEmail === currentEmail) {
      setError("Email baru harus berbeda dengan email saat ini")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Format email tidak valid")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: "" }),
      })

      const data = await response.json()

      if (isMountedRef.current) {
        if (data.success) {
          setDemoCode(data.demoCode)
          setStep("code")
          setSuccess(false)
        } else {
          setError(data.message || "Gagal mengirim kode verifikasi")
        }
        setLoading(false)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError("Terjadi kesalahan saat mengirim kode")
        setLoading(false)
      }
    }
  }

  const handleVerifyCode = () => {
    if (!code) {
      setError("Kode verifikasi harus diisi")
      return
    }

    if (code === demoCode) {
      setSuccess(true)
      setError("")
    } else {
      setError("Kode verifikasi tidak sesuai")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-primary/20" id="email-verification-dialog">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Verifikasi Email Baru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" id="email-verification-description">
          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Email saat ini</p>
            <p className="font-semibold text-sm">{currentEmail}</p>
          </div>

          {error && (
            <Alert className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500 ml-2">Email berhasil diverifikasi!</AlertDescription>
            </Alert>
          )}

          {step === "email" ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-sm">
                  Email Baru
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="email@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={loading}
                  className="bg-input border-input/50"
                />
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded p-3">
                <p className="text-xs text-muted-foreground">
                  Kami akan mengirimkan kode verifikasi 6 digit ke email baru Anda.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent border-border/50"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSendCode} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Kode"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                <p className="text-xs text-blue-600 font-semibold mb-2">Demo Mode</p>
                <p className="text-xs text-blue-600">
                  Kode verifikasi: <span className="font-mono font-bold">{demoCode}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm">
                  Kode Verifikasi (6 digit)
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="bg-input border-input/50 text-center font-mono text-lg tracking-widest"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent border-border/50"
                  onClick={() => {
                    setStep("email")
                    setCode("")
                    setError("")
                  }}
                  disabled={loading}
                >
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleVerifyCode}
                  disabled={loading || success}
                >
                  {success ? "Terverifikasi" : "Verifikasi"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerificationDialog
