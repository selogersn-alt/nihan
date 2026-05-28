"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const pathname = usePathname()

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  // Open cart drawer when a new item is added to the cart, except on the cart page itself
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      open()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname])

  // Lock body scrolling when the sliding drawer is open
  useEffect(() => {
    if (cartDropdownOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [cartDropdownOpen])

  // Close drawer on path changes
  useEffect(() => {
    close()
  }, [pathname])

  return (
    <div className="h-full z-40">
      {/* Trigger Button inside navigation bar */}
      <button
        onClick={open}
        className="h-full flex items-center hover:opacity-80 transition-opacity font-serif text-[13px] tracking-[0.15em] uppercase text-[#111111]"
      >
        PANIER ({totalItems})
      </button>

      {/* Slide-out Drawer & Blurred Backdrop Portal Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out ${
          cartDropdownOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop Blurred Glass Overlay */}
        <div
          onClick={close}
          className={`absolute inset-0 bg-[#0F0F0E]/40 backdrop-blur-sm transition-opacity duration-500 ${
            cartDropdownOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* The Luxury Right Drawer */}
        <div
          className={`absolute inset-y-0 right-0 max-w-md w-full h-full bg-[#FAF9F5]/98 backdrop-blur-xl border-l border-[#E5E7EB]/40 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
            cartDropdownOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#FAF9F5] flex items-center justify-between bg-white/70">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.25em] text-[#B5A48B] font-bold uppercase mb-1">
                MAISON NIHAN
              </span>
              <h2 className="font-serif tracking-[0.15em] uppercase text-base font-bold text-[#111111]">
                VOTRE PANIER
              </h2>
            </div>
            <button
              onClick={close}
              className="text-[#9CA3AF] hover:text-[#111111] transition-colors p-2 -mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
            {cartState && cartState.items?.length ? (
              <div className="space-y-6">
                {cartState.items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => (
                    <div
                      className="grid grid-cols-[100px_1fr] gap-x-4 border-b border-gray-100 pb-5"
                      key={item.id}
                      data-testid="cart-item"
                    >
                      {/* Product Thumbnail */}
                      <LocalizedClientLink
                        href={`/products/${item.product_handle}`}
                        onClick={close}
                        className="w-full bg-[#FAF9F6] rounded-sm overflow-hidden border border-gray-100 flex items-center justify-center aspect-square"
                      >
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          images={item.variant?.product?.images}
                          size="square"
                        />
                      </LocalizedClientLink>

                      {/* Product Info */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="text-[12px] font-bold tracking-wide text-[#111111] uppercase font-sans line-clamp-2 pr-2">
                              <LocalizedClientLink
                                href={`/products/${item.product_handle}`}
                                onClick={close}
                              >
                                {item.title}
                              </LocalizedClientLink>
                            </h3>
                            <div className="text-[11px] font-semibold text-[#B5A48B] font-mono whitespace-nowrap">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>

                          <div className="mt-1.5 space-y-0.5">
                            <LineItemOptions
                              variant={item.variant}
                              data-testid="cart-item-variant"
                              className="text-[10px] text-[#8E8E8E]"
                            />
                            <div className="text-[10px] text-[#8E8E8E] font-medium uppercase tracking-wider">
                              Quantité : {item.quantity}
                            </div>
                          </div>
                        </div>

                        {/* Custom Luxury Delete Button */}
                        <div className="flex justify-start items-center mt-3">
                          <DeleteButton
                            id={item.id}
                            className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A6967D] hover:text-[#7D705C] transition-colors border-b border-transparent hover:border-[#7D705C] pb-0.5"
                          >
                            SUPPRIMER
                          </DeleteButton>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                {/* Empty State visual */}
                <div className="w-12 h-12 border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#B5A48B] font-serif text-sm mb-4">
                  NH
                </div>
                <span className="font-serif italic text-[#374151] text-sm">
                  Votre sac de shopping est vide.
                </span>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mt-1.5">
                  L'élégance vous attend.
                </p>
                <div className="mt-6">
                  <LocalizedClientLink href="/store" onClick={close}>
                    <button className="px-6 py-3 bg-[#111111] text-[#ffffff] hover:bg-[#333333] transition-colors text-[9px] font-bold uppercase tracking-[0.25em]">
                      EXPLORER NOS CRÉATIONS
                    </button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer (Subtotal & Actions) */}
          {cartState && cartState.items?.length && (
            <div className="px-6 py-6 border-t border-gray-100 bg-white/70 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif tracking-wider text-[#374151] uppercase">
                  SOUS-TOTAL <span className="text-[9px] font-sans lowercase text-gray-400 font-normal">(hors taxes)</span>
                </span>
                <span className="font-serif font-bold text-[#111111] text-sm">
                  {convertToLocale({
                    amount: subtotal,
                    currency_code: cartState.currency_code,
                  })}
                </span>
              </div>

              {/* Centered Luxury Checkout Button */}
              <LocalizedClientLink href="/cart" onClick={close} className="block">
                <button className="w-full py-4 bg-[#111111] hover:bg-[#333333] text-white transition-all duration-300 font-sans text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:gap-3">
                  <span>COMMANDER</span>
                  <span>&mdash;</span>
                  <span>PASSER À LA CAISSE</span>
                </button>
              </LocalizedClientLink>

              {/* Free Shipping Highlight Banner */}
              <div className="text-center pt-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B5A48B] font-semibold block">
                  * LIVRAISON OFFERTE DÈS 150€ D'ACHAT *
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDropdown
