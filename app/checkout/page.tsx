"use client"

import { Suspense } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { CheckoutContent } from "@/components/checkout/checkout-content"

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center pb-24">
      <div className="text-center">
        <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
      <BottomNav />
    </ProtectedRoute>
  )
}
