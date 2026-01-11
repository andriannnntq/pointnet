"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-card to-background z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/20 border border-primary/30 animate-pulse">
          <Zap className="w-10 h-10 text-primary animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          POINNET
        </h1>
        <p className="text-muted-foreground">One-Stop Digital Hub</p>
      </div>
    </div>
  )
}
