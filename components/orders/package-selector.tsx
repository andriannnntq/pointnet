"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Clock } from "lucide-react"

interface Package {
  id: number
  name: string
  hours: number
  price: number
}

interface PackageSelectorProps {
  type: "regular" | "vip"
  packages: Package[]
  onSelect: (pkg: any) => void
}

export function PackageSelector({ type, packages, onSelect }: PackageSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {packages.map((pkg) => (
        <Card
          key={pkg.id}
          className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors overflow-hidden"
        >
          <CardContent className="p-3 space-y-2">
            <div>
              <p className="font-semibold text-sm">{pkg.name}</p>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                <Clock className="w-3 h-3" />
                <span>{pkg.hours}h</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Rp</p>
                <p className="font-bold text-sm">{pkg.price.toLocaleString("id-ID")}</p>
              </div>
              <Button
                size="icon"
                className="h-7 w-7 bg-primary hover:bg-primary/90"
                onClick={() => onSelect({ ...pkg, type })}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
