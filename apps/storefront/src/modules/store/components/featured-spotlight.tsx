"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

interface Product {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
}

export default function FeaturedSpotlight({ countryCode }: { countryCode: string }) {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const res = await fetch(`${backendUrl}/store/featured-products`)
        if (res.ok) {
          const data = await res.json()
          setFeatured(data.products || [])
        }
      } catch (err) {
        console.error("Error loading featured products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading || featured.length === 0) return null

  return (
    <div className="w-full mb-12 p-8 rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-[#FFFDFE] to-[#FCE8ED] border-2 border-[#FFC2D1] shadow-[0_15px_40px_rgba(255,182,193,0.35)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,117,143,0.45)]">
      {/* Soft neon glowing lights in the background */}
      <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#FFB3C6] opacity-35 filter blur-[40px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[#FFCCD5] opacity-40 filter blur-[40px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-[#FFE3E8] pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-[0.25em] text-[#800F2F] font-serif uppercase">
              💎 LES COUPS DE CŒUR &mdash; MAISON NIHAN
            </h2>
            <p className="text-xs text-[#A34A5E] mt-1 font-sans italic">
              Une sélection exclusive de nos plus belles créations, triées sur le volet pour votre raffinement.
            </p>
          </div>
          <div className="flex items-center gap-x-2 bg-[#FFE5EC] px-3 py-1.5 rounded-full border border-[#FFB3C6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D6D] animate-ping"></span>
            <span className="text-[9px] uppercase font-bold text-[#C9184A] tracking-wider font-sans">
              Édition Limitée
            </span>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.slice(0, 3).map((product) => (
            <Link
              key={product.id}
              href={`/${countryCode}/products/${product.handle}`}
              className="group bg-white/75 backdrop-blur-md border border-[#FFE3E8] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-[#FF85A1] hover:shadow-[0_12px_25px_rgba(255,117,143,0.25)]"
            >
              <div>
                <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-50 relative border border-[#FFEBEF]">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-[#FFF0F3]">
                      ✨
                    </div>
                  )}
                  {/* Glowing Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FF758F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-sm font-extrabold text-[#800F2F] mt-4 font-sans tracking-wide truncate group-hover:text-[#FF4D6D] transition-colors">
                  {product.title}
                </h3>
                
                {product.description && (
                  <p className="text-[11px] text-[#A34A5E] mt-1.5 line-clamp-2 leading-relaxed font-sans">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#FFF0F3] flex items-center justify-between font-sans">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF758F] group-hover:text-[#FF4D6D] transition-colors">
                  Découvrir l'article
                </span>
                <span className="h-6 w-6 rounded-full bg-[#FFF0F3] flex items-center justify-center text-xs text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-all duration-300">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
