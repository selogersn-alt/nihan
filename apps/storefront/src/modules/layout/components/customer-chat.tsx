"use client"

import React, { useState, useEffect, useRef } from "react"

interface Message {
  sender: "customer" | "admin"
  text: string
  timestamp: string
}

export default function CustomerChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [customerId, setCustomerId] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasNewMsg, setHasNewMsg] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize customer UUID
  useEffect(() => {
    let id = localStorage.getItem("nihan_chat_customer_id")
    if (!id) {
      id = "cust_" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("nihan_chat_customer_id", id)
    }
    setCustomerId(id)
  }, [])

  // Fetch messages from Medusa store API
  const fetchMessages = async () => {
    if (!customerId) return
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const res = await fetch(`${backendUrl}/store/messages?customerId=${customerId}`)
      if (res.ok) {
        const data = await res.json()
        const fetchedMessages = data.thread?.messages || []
        
        // Alert customer if a new message was received from admin
        if (messages.length > 0 && fetchedMessages.length > messages.length) {
          const lastNewMsg = fetchedMessages[fetchedMessages.length - 1]
          if (lastNewMsg.sender === "admin" && !isOpen) {
            setHasNewMsg(true)
          }
        }
        
        setMessages(fetchedMessages)
      }
    } catch (err) {
      console.error("Chat loading error:", err)
    }
  }

  useEffect(() => {
    if (customerId) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 4000)
      return () => clearInterval(interval)
    }
  }, [customerId, messages.length, isOpen])

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !customerId) return

    setLoading(true)
    const textToSend = inputText
    setInputText("")

    // Optimistically add customer message
    setMessages((prev) => [
      ...prev,
      { sender: "customer", text: textToSend, timestamp: new Date().toISOString() },
    ])

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const res = await fetch(`${backendUrl}/store/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          customerName: "Client Maison Nihan",
          text: textToSend,
        }),
      })

      if (!res.ok) {
        console.error("Failed to send message")
      }
      fetchMessages()
    } catch (err) {
      console.error("Failed to connect to chat API:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMsg(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FF85A1] to-[#FF4D6D] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(255,77,109,0.5)] border border-[#FFCCD5] transition-all duration-300 hover:scale-110 active:scale-95 relative"
      >
        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
        
        {/* Unread dot */}
        {hasNewMsg && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#C9184A] border-2 border-white rounded-full animate-bounce"></span>
        )}
      </button>

      {/* Sleek Chat Drawer Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-white border border-[#FFC2D1] rounded-3xl shadow-[0_20px_50px_rgba(255,182,193,0.4)] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#FCDDEC] to-[#FFF5F7] border-b border-[#FFC2D1] flex items-center gap-x-3">
            <div className="h-10 w-10 rounded-full bg-white border border-[#FF85A1] flex items-center justify-center text-xl shadow-inner">
              👑
            </div>
            <div>
              <h3 className="text-xs font-black text-[#800F2F] uppercase tracking-wider">
                Maison Nihan &mdash; Service Prestige
              </h3>
              <p className="text-[10px] text-[#A34A5E] mt-0.5 flex items-center gap-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                Réponse en quelques minutes
              </p>
            </div>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-4 bg-[#FFF9FA] overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-2">
                <span className="text-3xl">🌸</span>
                <p className="text-xs font-bold text-[#800F2F]">Bienvenue dans votre Salon Privé</p>
                <p className="text-[10px] text-[#A34A5E] max-w-[200px] mx-auto leading-relaxed">
                  Posez vos questions sur nos créations ou collections de cosmétiques et loungewear de luxe.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isCustomer = msg.sender === "customer"
                return (
                  <div key={idx} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                        isCustomer
                          ? "bg-gradient-to-br from-[#FF85A1] to-[#FF4D6D] text-white rounded-tr-none shadow-[0_4px_12px_rgba(255,77,109,0.2)]"
                          : "bg-white border border-[#FFE3E8] text-[#5C061E] rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[8px] mt-1 text-right ${isCustomer ? "text-[#FFF0F3]" : "text-[#A34A5E]"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#FFE3E8] bg-white flex gap-x-2 items-center">
            <input
              type="text"
              placeholder="Écrire votre message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 text-xs px-4 py-3 bg-[#FFF9FA] border border-[#FFC2D1] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#FF4D6D] focus:border-[#FF4D6D] text-[#5C061E]"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-4 py-3 rounded-2xl bg-[#FF4D6D] hover:bg-[#FF758F] text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(255,77,109,0.3)] disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
