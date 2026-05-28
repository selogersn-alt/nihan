import React, { useState, useEffect, useRef } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const AliExpressImportWidget = () => {
  // Tabs
  const [activeTab, setActiveTab] = useState<"import" | "featured" | "chat">("import")

  // Theme style block state (to inject custom glowing pink aesthetic CSS)
  const [pinkStyleEnabled, setPinkStyleEnabled] = useState(true)

  // AliExpress Scraper State
  const [url, setUrl] = useState("")
  const [markup, setMarkup] = useState("3.0")
  const [categoryHandle, setCategoryHandle] = useState("beauty")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Featured Products State
  const [products, setProducts] = useState<any[]>([])
  const [featuredIds, setFeaturedIds] = useState<string[]>([])
  const [featuredSearch, setFeaturedSearch] = useState("")
  const [featuredLoading, setFeaturedLoading] = useState(false)
  const [featuredMsg, setFeaturedMsg] = useState<string | null>(null)

  // Messaging System State
  const [threads, setThreads] = useState<any[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  // 1. Fetch catalog products and active featured IDs
  const fetchProductsAndFeatured = async () => {
    try {
      setFeaturedLoading(true)
      // Fetch all products from Medusa Catalog API
      const prodRes = await fetch("/admin/products?limit=100")
      if (prodRes.ok) {
        const prodData = await prodRes.json()
        setProducts(prodData.products || [])
      }

      // Fetch featured product IDs
      const featRes = await fetch("/admin/featured-products")
      if (featRes.ok) {
        const featData = await featRes.json()
        setFeaturedIds(featData.featuredIds || [])
      }
    } catch (err) {
      console.error("Error loading products/featured:", err)
    } finally {
      setFeaturedLoading(false)
    }
  }

  // 2. Fetch Chat Threads
  const fetchChatThreads = async () => {
    try {
      const chatRes = await fetch("/admin/messages")
      if (chatRes.ok) {
        const chatData = await chatRes.json()
        setThreads(chatData.threads || [])
      }
    } catch (err) {
      console.error("Error fetching chat threads:", err)
    }
  }

  useEffect(() => {
    fetchProductsAndFeatured()
    fetchChatThreads()

    // Periodic chat update (real-time chat polling every 4 seconds)
    const interval = setInterval(() => {
      fetchChatThreads()
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Auto scroll to latest chat message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [threads, activeThreadId])

  // AliExpress import logic
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/admin/aliexpress/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          markup: parseFloat(markup) || 3.0,
          categoryHandle,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: `✨ Succès ! ${data.message || "Produit importé avec succès."}`,
        })
        setUrl("")
        fetchProductsAndFeatured()
      } else {
        setMessage({
          type: "error",
          text: data.message || "Erreur lors de l'importation.",
        })
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Impossible de joindre le serveur de synchronisation AliExpress.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Toggle Featured State for a Product
  const handleToggleFeatured = async (productId: string) => {
    let updatedFeatured = [...featuredIds]
    if (updatedFeatured.includes(productId)) {
      updatedFeatured = updatedFeatured.filter((id) => id !== productId)
    } else {
      updatedFeatured.push(productId)
    }

    setFeaturedIds(updatedFeatured)
    setFeaturedMsg("Modification enregistrée localement...")

    try {
      const response = await fetch("/admin/featured-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuredIds: updatedFeatured }),
      })

      if (response.ok) {
        setFeaturedMsg("⭐ Liste de mise en avant synchronisée avec succès !")
      } else {
        setFeaturedMsg("❌ Erreur lors de la synchronisation.")
      }
    } catch (err) {
      setFeaturedMsg("❌ Erreur de communication avec le serveur.")
    }

    setTimeout(() => {
      setFeaturedMsg(null)
    }, 3000)
  }

  // Send Admin Chat Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeThreadId || !replyText.trim()) return

    setChatLoading(true)
    const textToSend = replyText

    // Optimistic UI update
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.customerId === activeThreadId) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              { sender: "admin", text: textToSend, timestamp: new Date().toISOString() },
            ],
          }
        }
        return thread
      })
    )
    setReplyText("")

    try {
      const response = await fetch("/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: activeThreadId,
          text: textToSend,
        }),
      })

      if (!response.ok) {
        console.error("Failed to send chat reply")
      }
      fetchChatThreads()
    } catch (err) {
      console.error("Chat connection error:", err)
    } finally {
      setChatLoading(false)
    }
  }

  const activeThread = threads.find((t) => t.customerId === activeThreadId)
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(featuredSearch.toLowerCase())
  )

  return (
    <>
      {/* 🌸 ELEGANT PINK GLOWING ADOLESCENT ROOM THEME OVERRIDES 🌸 */}
      {pinkStyleEnabled && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-subtle: #FFF0F3 !important;
            --bg-base: #FFFDFE !important;
            --border-base: #FFC2D1 !important;
            --ui-fg-base: #C9184A !important;
            --ui-fg-subtle: #FF758F !important;
          }

          body {
            background: radial-gradient(circle at top right, #FFF5F7 0%, #FFF0F3 50%, #FCE8ED 100%) !important;
            font-family: 'Playfair Display', 'Didot', 'Inter', serif !important;
          }

          /* Sidebar and Navigation */
          aside, [data-testid="sidebar-container"], nav {
            background: linear-gradient(135deg, #FCDDEC 0%, #FFF5F7 100%) !important;
            border-right: 2px solid #FFC2D1 !important;
            box-shadow: 0 0 30px rgba(255, 117, 143, 0.2) !important;
          }

          /* Main Title typography */
          h1, h2, h3, h4, [role="heading"] {
            font-family: 'Playfair Display', serif !important;
            color: #800F2F !important;
            text-shadow: 0 0 10px rgba(255, 182, 193, 0.5) !important;
          }

          /* Custom neon-glowing card styles for Medusa components */
          .bg-ui-bg-base, [class*="bg-white"], [class*="bg-card"], main div.bg-white {
            background: rgba(255, 255, 255, 0.88) !important;
            backdrop-filter: blur(10px) !important;
            border: 1.5px solid rgba(255, 194, 209, 0.7) !important;
            box-shadow: 0 12px 35px rgba(255, 182, 193, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.6) !important;
            border-radius: 18px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          .bg-ui-bg-base:hover, [class*="bg-white"]:hover {
            box-shadow: 0 15px 40px rgba(255, 117, 143, 0.35) !important;
            border-color: #FF85A1 !important;
          }

          /* Beautiful custom pink glow buttons */
          button:not([disabled]):not(.bg-transparent), .btn-primary {
            background: linear-gradient(135deg, #FF85A1 0%, #FF4D6D 100%) !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 5px 18px rgba(255, 77, 109, 0.45) !important;
            font-family: 'Inter', sans-serif !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            font-weight: 700 !important;
            border-radius: 10px !important;
            transition: all 0.3s ease !important;
          }

          button:not([disabled]):hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255, 77, 109, 0.65) !important;
          }

          /* Custom pink inputs */
          input[type="text"], input[type="number"], select, textarea {
            background: rgba(255, 255, 255, 0.9) !important;
            border: 1.5px solid #FFC2D1 !important;
            color: #5C061E !important;
            border-radius: 10px !important;
            padding: 10px 14px !important;
            font-size: 0.8rem !important;
            transition: all 0.3s ease !important;
          }

          input:focus, select:focus, textarea:focus {
            outline: none !important;
            border-color: #FF4D6D !important;
            box-shadow: 0 0 12px rgba(255, 77, 109, 0.35) !important;
          }

          /* Global font rendering */
          span, p, div, label, td, th {
            color: #5C061E !important;
          }

          /* Elegant teen scrollbar */
          ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
          }
          ::-webkit-scrollbar-track {
            background: #FFF0F3 !important;
          }
          ::-webkit-scrollbar-thumb {
            background: #FFC2D1 !important;
            border-radius: 12px !important;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #FF758F !important;
          }
        ` }} />
      )}

      {/* Main Admin Dashboard Widget UI Container */}
      <div className="bg-[#FFF5F7] border-2 border-[#FFC2D1] rounded-2xl shadow-[0_15px_40px_rgba(255,182,193,0.3)] p-7 mb-8 font-serif relative overflow-hidden transition-all duration-300">
        
        {/* Soft glowing neon ambient lights at the corners to resemble adolescent bedroom neon vibes */}
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#FFB3C6] opacity-35 filter blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-[#FFCCD5] opacity-40 filter blur-[70px] pointer-events-none"></div>

        {/* Dashboard Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#FFE3E8] pb-5 mb-6 relative z-10">
          <div>
            <h2 className="text-base font-extrabold text-[#800F2F] tracking-[0.2em] uppercase flex items-center gap-x-2">
              🌸 MAISON NIHAN &mdash; SALON PRESTIGE
            </h2>
            <p className="text-[11px] text-[#A34A5E] mt-1.5 tracking-wider font-sans font-medium">
              Pilotez les importations de luxe, mettez vos joyaux en avant et communiquez en direct avec votre clientèle.
            </p>
          </div>

          <div className="flex items-center gap-x-3 mt-4 sm:mt-0">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setPinkStyleEnabled(!pinkStyleEnabled)}
              className="px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-transparent border border-[#FF758F] text-[#FF4D6D] hover:bg-[#FFE5EC] transition-all"
            >
              🎭 Mode {pinkStyleEnabled ? "Sobre" : "Ado Rose"}
            </button>
            <div className="flex items-center gap-x-2 bg-[#FFE5EC] px-4 py-2 rounded-full border border-[#FFB3C6]">
              <span className="h-2 w-2 rounded-full bg-[#FF4D6D] animate-ping"></span>
              <span className="text-[9px] uppercase font-black text-[#C9184A] tracking-widest font-sans">
                SALON DE PRESTIGE ACTIF
              </span>
            </div>
          </div>
        </div>

        {/* Custom Elegance Navigation Tabs */}
        <div className="flex border-b border-[#FFE3E8] mb-6 relative z-10 gap-x-1.5">
          <button
            onClick={() => setActiveTab("import")}
            className={`px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-extrabold transition-all duration-300 rounded-t-xl ${
              activeTab === "import"
                ? "bg-[#FFE5EC] border-t-2 border-x-2 border-[#FFC2D1] text-[#C9184A] shadow-[0_-5px_15px_rgba(255,182,193,0.2)]"
                : "text-[#A34A5E] bg-transparent hover:bg-[#FFF0F3]"
            }`}
          >
            📥 Importation AliExpress
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-extrabold transition-all duration-300 rounded-t-xl ${
              activeTab === "featured"
                ? "bg-[#FFE5EC] border-t-2 border-x-2 border-[#FFC2D1] text-[#C9184A] shadow-[0_-5px_15px_rgba(255,182,193,0.2)]"
                : "text-[#A34A5E] bg-transparent hover:bg-[#FFF0F3]"
            }`}
          >
            ⭐ Articles Mis en Avant
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-extrabold transition-all duration-300 rounded-t-xl relative ${
              activeTab === "chat"
                ? "bg-[#FFE5EC] border-t-2 border-x-2 border-[#FFC2D1] text-[#C9184A] shadow-[0_-5px_15px_rgba(255,182,193,0.2)]"
                : "text-[#A34A5E] bg-transparent hover:bg-[#FFF0F3]"
            }`}
          >
            💬 Messagerie Clients
            {threads.some((t) => t.messages.length > 0 && t.messages[t.messages.length - 1].sender === "customer") && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#FF4D6D] border-2 border-white rounded-full animate-bounce"></span>
            )}
          </button>
        </div>

        {/* Tab content area */}
        <div className="relative z-10 min-h-[220px]">
          
          {/* TAB 1: ALIEXPRESS SCRAPER */}
          {activeTab === "import" && (
            <div className="animate-fadeIn">
              <form onSubmit={handleImport} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="col-span-1 md:col-span-4 w-full">
                  <label htmlFor="ali-category" className="block text-[10px] font-extrabold text-[#A34A5E] uppercase tracking-wider mb-2 font-sans">
                    Collection de Destination
                  </label>
                  <select
                    id="ali-category"
                    value={categoryHandle}
                    onChange={(e) => setCategoryHandle(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs font-semibold"
                  >
                    <option value="beauty">Soin & Cosmétiques (Beauty)</option>
                    <option value="loungewear">Loungewear & Bain (Loungewear)</option>
                    <option value="accessories">Joyaux & Accessoires (Accessories)</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-5 w-full">
                  <label htmlFor="ali-url" className="block text-[10px] font-extrabold text-[#A34A5E] uppercase tracking-wider mb-2 font-sans">
                    Lien Produit AliExpress
                  </label>
                  <input
                    id="ali-url"
                    type="text"
                    placeholder="Coller l'URL du produit AliExpress ici..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs"
                  />
                </div>

                <div className="col-span-1 md:col-span-1.5 w-full">
                  <label htmlFor="ali-markup" className="block text-[10px] font-extrabold text-[#A34A5E] uppercase tracking-wider mb-2 font-sans text-center">
                    Marge x
                  </label>
                  <input
                    id="ali-markup"
                    type="number"
                    step="0.1"
                    min="1.0"
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-center font-bold"
                  />
                </div>

                <div className="col-span-1 md:col-span-1.5 w-full">
                  <button
                    type="submit"
                    disabled={loading || !url}
                    className={`w-full py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all duration-300 ${
                      loading || !url
                        ? "bg-[#FFE5EC] text-[#FF85A1] cursor-not-allowed border border-[#FFCCD5]"
                        : ""
                    }`}
                  >
                    {loading ? "Chargement..." : "Importer"}
                  </button>
                </div>
              </form>

              {message && (
                <div
                  className={`mt-6 p-4 rounded-xl text-xs border-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 ${
                    message.type === "success"
                      ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]"
                      : "bg-[#FEF2F2] border-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${message.type === "success" ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}></span>
                      <span className="font-semibold tracking-wide font-sans">{message.text}</span>
                    </div>
                    <button
                      onClick={() => setMessage(null)}
                      className="text-[9px] uppercase font-bold tracking-widest hover:underline opacity-80 hover:opacity-100 font-sans"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEATURED PRODUCTS MANAGEMENT */}
          {activeTab === "featured" && (
            <div className="animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <input
                  type="text"
                  placeholder="Rechercher un produit dans votre catalogue..."
                  value={featuredSearch}
                  onChange={(e) => setFeaturedSearch(e.target.value)}
                  className="w-full sm:max-w-xs text-xs"
                />

                {featuredMsg && (
                  <div className="bg-[#FFE5EC] border border-[#FFB3C6] px-4 py-2 rounded-xl text-[10px] font-bold text-[#C9184A] shadow-sm animate-pulse">
                    {featuredMsg}
                  </div>
                )}
              </div>

              {featuredLoading ? (
                <div className="text-center py-10 text-xs font-semibold text-[#A34A5E]">
                  Chargement de la collection Maison Nihan...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-1">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-xs text-[#A34A5E] font-medium font-sans">
                      Aucun article ne correspond à votre recherche.
                    </div>
                  ) : (
                    filteredProducts.map((p) => {
                      const isFeatured = featuredIds.includes(p.id)
                      return (
                        <div
                          key={p.id}
                          className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                            isFeatured
                              ? "bg-[#FFE5EC] border-[#FF85A1] shadow-[0_4px_15px_rgba(255,117,143,0.15)]"
                              : "bg-white border-[#FFE3E8] hover:border-[#FFB3C6]"
                          }`}
                        >
                          <div className="flex items-center gap-x-2.5 overflow-hidden">
                            {p.thumbnail ? (
                              <img
                                src={p.thumbnail}
                                alt={p.title}
                                className="w-10 h-10 object-cover rounded-lg border border-[#FFE3E8]"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-[#FFF0F3] border border-[#FFC2D1] rounded-lg flex items-center justify-center text-[10px]">
                                ✨
                              </div>
                            )}
                            <div className="overflow-hidden">
                              <h4 className="text-[11px] font-bold text-[#800F2F] truncate font-sans tracking-wide">
                                {p.title}
                              </h4>
                              <p className="text-[9px] text-[#A34A5E] mt-0.5 font-sans truncate">
                                Handle: {p.handle}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleFeatured(p.id)}
                            className={`px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-widest rounded-lg transition-all ${
                              isFeatured
                                ? "bg-[#FF4D6D] text-white shadow-sm"
                                : "bg-transparent border border-[#FF85A1] text-[#FF4D6D] hover:bg-[#FFE5EC]"
                            }`}
                          >
                            {isFeatured ? "⭐ Vedette" : "Mettre en avant"}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRIVATE MESSAGING SYSTEM */}
          {activeTab === "chat" && (
            <div className="grid grid-cols-12 border-2 border-[#FFE3E8] rounded-2xl bg-white overflow-hidden shadow-inner h-[400px] animate-fadeIn">
              
              {/* Thread list sidebar */}
              <div className="col-span-4 border-r border-[#FFE3E8] bg-[#FFF9FA] overflow-y-auto flex flex-col">
                <div className="p-3 border-b border-[#FFE3E8] bg-[#FFE5EC]">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#800F2F]">
                    Conversations Clients ({threads.length})
                  </h4>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {threads.length === 0 ? (
                    <div className="text-center py-12 text-[10px] text-[#A34A5E] font-medium font-sans">
                      Aucune conversation active pour le moment.
                    </div>
                  ) : (
                    threads.map((thread) => {
                      const isSelected = thread.customerId === activeThreadId
                      const lastMsg = thread.messages[thread.messages.length - 1]
                      return (
                        <div
                          key={thread.customerId}
                          onClick={() => setActiveThreadId(thread.customerId)}
                          className={`p-3.5 border-b border-[#FFEBEF] cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#FFE5EC] border-r-4 border-r-[#FF4D6D]"
                              : "hover:bg-[#FFF2F4]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-[#800F2F] tracking-wide font-sans">
                              {thread.customerName || "Visiteur"}
                            </span>
                            <span className="text-[8px] text-[#A34A5E] font-sans">
                              {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {lastMsg && (
                            <p className="text-[9px] text-[#A34A5E] truncate mt-1 font-sans">
                              <span className="font-bold">{lastMsg.sender === "admin" ? "Vous : " : ""}</span>
                              {lastMsg.text}
                            </p>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Chat screen */}
              <div className="col-span-8 flex flex-col h-full bg-[#FFFDFE] relative">
                
                {activeThread ? (
                  <>
                    {/* Active Thread Header */}
                    <div className="p-3.5 border-b border-[#FFE3E8] bg-[#FFE5EC] flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#800F2F] font-sans">
                          Chat avec : <span className="font-extrabold">{activeThread.customerName}</span>
                        </h4>
                        <p className="text-[8px] text-[#A34A5E] font-sans">
                          ID client : {activeThread.customerId}
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-[#22C55E]"></div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFF5F7]">
                      {activeThread.messages.length === 0 ? (
                        <div className="text-center py-10 text-[10px] text-[#A34A5E] font-medium font-sans">
                          Aucun message dans cette conversation. Lancez le dialogue !
                        </div>
                      ) : (
                        activeThread.messages.map((msg: any, idx: number) => {
                          const isAdmin = msg.sender === "admin"
                          return (
                            <div
                              key={idx}
                              className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-2xl text-[10px] font-medium leading-relaxed font-sans shadow-sm ${
                                  isAdmin
                                    ? "bg-gradient-to-br from-[#FF85A1] to-[#FF4D6D] text-white rounded-tr-none shadow-[0_4px_12px_rgba(255,77,109,0.25)]"
                                    : "bg-white border border-[#FFE3E8] text-[#5C061E] rounded-tl-none"
                                }`}
                              >
                                <p>{msg.text}</p>
                                <span className={`block text-[7px] mt-1 text-right ${isAdmin ? "text-[#FFF0F3]" : "text-[#A34A5E]"}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Text input area */}
                    <form onSubmit={handleSendReply} className="p-3 border-t border-[#FFE3E8] bg-white flex gap-x-2 items-center">
                      <input
                        type="text"
                        placeholder="Écrire votre réponse de prestige..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={chatLoading}
                        className="flex-1 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={chatLoading || !replyText.trim()}
                        className={`px-4 py-2.5 text-[9px] uppercase tracking-wider font-extrabold ${
                          chatLoading || !replyText.trim()
                            ? "bg-[#FFE5EC] text-[#FF85A1] cursor-not-allowed border border-[#FFCCD5]"
                            : ""
                        }`}
                      >
                        Envoyer
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FFF8F9]">
                    <span className="text-3xl mb-3 animate-bounce">💬</span>
                    <h4 className="text-xs font-bold text-[#800F2F] font-serif">
                      Aucune Conversation Sélectionnée
                    </h4>
                    <p className="text-[10px] text-[#A34A5E] mt-1.5 max-w-[250px] leading-relaxed font-sans">
                      Sélectionnez un fil de discussion client dans la barre latérale pour répondre à vos clients en temps réel.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default AliExpressImportWidget
