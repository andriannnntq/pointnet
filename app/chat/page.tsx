"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Send, Bot, Clock } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  text: string
  sender: "user" | "admin"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<any>(null)

  // Admin responses template
  const adminResponses: { [key: string]: string } = {
    default: "Terima kasih atas pertanyaan Anda. Tim admin kami akan merespon secepatnya!",
    error: "Ada masalah teknis? Kami siap membantu. Mohon jelaskan masalah yang Anda hadapi lebih detail.",
    pc: "Tentang PC Anda: Pastikan koneksi internet stabil. Coba restart komputer jika ada lag.",
    bill: "Tentang billing: Saldo Anda dapat dicek di menu dashboard. Tersedia berbagai paket pembayaran.",
    food: "Tentang makanan: Menu tersedia di aplikasi. Pesanan akan diantar ke meja Anda dalam 5-10 menit.",
  }

  useEffect(() => {
    const userData = localStorage.getItem("poinnet_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load previous chats
    const savedMessages = localStorage.getItem("poinnet_chats")
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })))
    }

    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getAdminResponse = (text: string): string => {
    const lowerText = text.toLowerCase()

    if (lowerText.includes("error") || lowerText.includes("masalah") || lowerText.includes("error"))
      return adminResponses.error
    if (lowerText.includes("pc") || lowerText.includes("komputer") || lowerText.includes("lag"))
      return adminResponses.pc
    if (lowerText.includes("bill") || lowerText.includes("paket") || lowerText.includes("jam"))
      return adminResponses.bill
    if (lowerText.includes("makanan") || lowerText.includes("makan") || lowerText.includes("minum"))
      return adminResponses.food

    return adminResponses.default
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: "user_" + Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")
    setLoading(true)

    // Simulate admin response
    setTimeout(() => {
      const adminResponse: Message = {
        id: "admin_" + Date.now(),
        text: getAdminResponse(inputValue),
        sender: "admin",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, adminResponse])
      setLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Save messages periodically
  useEffect(() => {
    localStorage.setItem("poinnet_chats", JSON.stringify(messages))
  }, [messages])

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-24 pt-4 px-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <Link href="/dashboard">
            <Button size="icon" variant="ghost" className="hover:bg-card">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">Chat Admin</h1>
            <p className="text-xs text-muted-foreground">Biasanya respon dalam 1-2 menit</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 && (
            <Card className="bg-card/50 border-border/50 mt-8">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hubungi Admin</h3>
                  <p className="text-sm text-muted-foreground">
                    Ada masalah atau pertanyaan? Tim admin kami siap membantu Anda.
                  </p>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-semibold text-accent">Tips:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 text-left">
                    <li>• Jelaskan masalah dengan detail</li>
                    <li>• Respon cepat dari admin</li>
                    <li>• Hubungi kapan saja</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border/50 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border/50 rounded-lg rounded-bl-none px-4 py-3 space-y-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ketik pesan Anda..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="bg-input border-input/50 focus:border-primary/50"
              />
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90"
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3 inline mr-1" />
              Admin biasanya online 08:00 - 22:00
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </ProtectedRoute>
  )
}
