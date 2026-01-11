"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

interface AvatarPickerProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar: string
  onAvatarChange: (avatar: string) => void
}

export default function AvatarPicker({ isOpen, onClose, currentAvatar, onAvatarChange }: AvatarPickerProps) {
  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming5",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming6",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming7",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming8",
  ]

  const handleSelectAvatar = (avatar: string) => {
    const userData = localStorage.getItem("poinnet_user")
    if (userData) {
      const user = JSON.parse(userData)
      user.avatar = avatar
      localStorage.setItem("poinnet_user", JSON.stringify(user))
    }
    onAvatarChange(avatar)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Pilih Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3">
          {avatars.map((avatar, index) => (
            <Card
              key={index}
              className={`cursor-pointer border-2 transition-all ${
                currentAvatar === avatar ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
              }`}
              onClick={() => handleSelectAvatar(avatar)}
            >
              <CardContent className="p-3">
                <img
                  src={avatar || "/placeholder.svg"}
                  alt={`Avatar ${index + 1}`}
                  className="w-full aspect-square rounded"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
          Tutup
        </Button>
      </DialogContent>
    </Dialog>
  )
}
