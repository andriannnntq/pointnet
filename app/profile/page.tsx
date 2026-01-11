"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, LogOut, Edit2, Lock, CreditCard, Clock, CheckCircle, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import EmailVerificationDialog from "@/components/email-verification-dialog"
import AvatarPicker from "@/components/avatar-picker"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  balance: number
  tier: string
}

interface Transaction {
  id: string
  amount: number
  timestamp: string
  status: "success" | "pending" | "failed"
  description: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("poinnet_user")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setEditName(parsed.name)
    }

    const transactionData = localStorage.getItem("poinnet_orders")
    if (transactionData) {
      const parsed = JSON.parse(transactionData)
      setTransactions(parsed)
    }

    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("poinnet_user")
    router.push("/login")
  }

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name: editName }
      localStorage.setItem("poinnet_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setEditMode(false)
    }
  }

  const handleChangePassword = () => {
    if (editPassword.length < 6) {
      alert("Password minimal 6 karakter")
      return
    }
    alert("Password berhasil diubah")
    setEditPassword("")
  }

  const handleEmailVerified = (newEmailValue: string) => {
    if (user) {
      const updatedUser = { ...user, email: newEmailValue }
      localStorage.setItem("poinnet_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setShowEmailVerification(false)
      setNewEmail("")
    }
  }

  const handleAvatarChange = (newAvatar: string) => {
    setUser((prev) => (prev ? { ...prev, avatar: newAvatar } : null))
  }

  if (loading) {
    return <div className="min-h-screen bg-background"></div>
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-24 pt-4 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button size="icon" variant="ghost" className="hover:bg-card">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Profil</h1>
          <Button size="icon" variant="ghost" className="hover:bg-card" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-destructive" />
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-card/50 border-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {/* Make avatar clickable to open picker */}
              <div className="relative cursor-pointer group" onClick={() => setAvatarPickerOpen(true)}>
                <img
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.name}
                  className="w-20 h-20 rounded-lg border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
                />
                <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-medium text-white">Ubah</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>
                <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 w-fit">
                  <span className="text-xs font-medium text-primary">
                    {user?.tier === "vip" ? "VIP Member" : "Regular Member"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50">
            <TabsTrigger value="profile" className="gap-2 text-xs">
              <Edit2 className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 text-xs">
              <Clock className="w-4 h-4" />
              Aktivitas
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2 text-xs">
              <Info className="w-4 h-4" />
              Tentang
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            {!editMode ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Pengaturan Profil</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                    <p className="font-semibold mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2">Email</Label>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold mt-1">{user?.email}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowEmailVerification(true)}
                        className="text-xs"
                      >
                        Ubah Email
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">ID Pengguna</Label>
                    <p className="font-mono text-sm mt-1 break-all text-muted-foreground">{user?.id}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Edit Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-input border-input/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setEditMode(false)}>
                      Batal
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSaveProfile}>
                      Simpan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Password Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Ubah Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs">
                    Password Baru
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="bg-input border-input/50"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleChangePassword}>
                  Ubah Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Riwayat Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">Belum ada transaksi</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <Card key={tx.id} className="bg-card/50 border-border/50">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  tx.status === "success"
                                    ? "bg-green-500/20"
                                    : tx.status === "pending"
                                      ? "bg-yellow-500/20"
                                      : "bg-red-500/20"
                                }`}
                              >
                                {tx.status === "success" ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : tx.status === "pending" ? (
                                  <Clock className="w-5 h-5 text-yellow-500" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{tx.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(tx.timestamp).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">Rp {(tx.amount / 1000).toFixed(0)}k</p>
                              <p
                                className={`text-xs font-medium mt-1 ${
                                  tx.status === "success"
                                    ? "text-green-500"
                                    : tx.status === "pending"
                                      ? "text-yellow-500"
                                      : "text-red-500"
                                }`}
                              >
                                {tx.status === "success" ? "Berhasil" : tx.status === "pending" ? "Menunggu" : "Gagal"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tentang POINNET</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Versi</p>
                  <p className="text-sm">1.0.0 Beta</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Deskripsi</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    POINNET adalah solusi digital terintegrasi untuk manajemen warnet modern. Kami menyediakan kemudahan
                    dalam pembayaran paket, pemesanan makanan, dan layanan pelanggan yang responsif.
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Tim Pengembang</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Rizal Muhammad Rosyid</p>
                    <p>• Andrian Maulana</p>
                    <p>• Muchammad Azil Muarif</p>
                    <p>• Hafid Nur Karim</p>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Untuk pertanyaan atau laporan bug, silakan hubungi admin melalui fitur chat.
                  </p>
                </div>

                <Button variant="outline" className="w-full border-border/50 bg-transparent">
                  <Link href="/privacy" className="w-full">
                    Kebijakan Privasi
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add avatar picker dialog */}
      {showEmailVerification && user && (
        <EmailVerificationDialog
          currentEmail={user.email}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          onVerified={handleEmailVerified}
          onCancel={() => {
            setShowEmailVerification(false)
            setNewEmail("")
          }}
        />
      )}

      <AvatarPicker
        isOpen={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        currentAvatar={user?.avatar || "/placeholder.svg"}
        onAvatarChange={handleAvatarChange}
      />

      <BottomNav />
    </ProtectedRoute>
  )
}
