"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-24 pt-4 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/profile">
            <Button size="icon" variant="ghost" className="hover:bg-card">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Kebijakan Privasi</h1>
        </div>

        {/* Content */}
        <div className="space-y-6 max-w-2xl">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-sm text-muted-foreground mb-4">
                POINNET mengumpulkan informasi yang Anda berikan secara langsung seperti nama, email, nomor telepon, dan
                data akun gaming Anda untuk memberikan layanan yang lebih baik.
              </p>
              <p className="text-sm text-muted-foreground">
                Kami juga mengumpulkan data penggunaan seperti riwayat pesanan, waktu bermain, dan preferensi makanan
                untuk meningkatkan pengalaman Anda.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">2. Penggunaan Data</h2>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Menyediakan layanan billing dan pemesanan makanan</li>
                <li>• Memberikan dukungan pelanggan melalui chat admin</li>
                <li>• Mengirimkan promosi dan penawaran khusus</li>
                <li>• Meningkatkan fitur dan keamanan aplikasi</li>
                <li>• Menganalisis penggunaan aplikasi untuk perbaikan</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">3. Keamanan Data</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Data Anda dilindungi dengan enkripsi dan sistem keamanan berlapis. Kami tidak akan pernah membagikan
                informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.
              </p>
              <p className="text-sm text-muted-foreground">
                Password Anda disimpan dalam bentuk terenkripsi dan hanya Anda yang dapat mengaksesnya.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">4. Hak Anda</h2>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Akses dan lihat data pribadi Anda kapan saja</li>
                <li>• Mengubah atau menghapus informasi akun Anda</li>
                <li>• Menolak menerima email promosi</li>
                <li>• Menghapus akun Anda selamanya</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">5. Hubungi Kami</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi kami, silakan hubungi kami melalui:
              </p>
              <p className="text-sm text-primary font-medium">Email: support@poinnet.id</p>
              <p className="text-sm text-primary font-medium">Chat: Gunakan fitur Chat Admin di aplikasi</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground text-center">
                Kebijakan Privasi ini terakhir diperbarui pada: {new Date().toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </ProtectedRoute>
  )
}
