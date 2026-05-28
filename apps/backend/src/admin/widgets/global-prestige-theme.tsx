import React from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const GlobalPrestigeThemeWidget = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --bg-subtle: #FFF0F3 !important;
        --bg-base: #FFFDFE !important;
        --border-base: #FFC2D1 !important;
        --ui-fg-base: #C9184A !important;
        --ui-fg-subtle: #FF758F !important;
        --ui-fg-interactive: #FF4D6D !important;
        --ui-bg-interactive: #FFE5EC !important;
        --ui-border-interactive: #FF85A1 !important;
      }

      body {
        background: radial-gradient(circle at top right, #FFF5F7 0%, #FFF0F3 50%, #FCE8ED 100%) !important;
        font-family: 'Playfair Display', 'Didot', 'Inter', serif !important;
      }

      /* Sidebar Navigation */
      aside, [data-testid="sidebar-container"], nav {
        background: linear-gradient(135deg, #FCDDEC 0%, #FFF5F7 100%) !important;
        border-right: 2px solid #FFC2D1 !important;
        box-shadow: 0 0 30px rgba(255, 117, 143, 0.2) !important;
      }

      /* Sidebar Items and Text */
      aside a, aside button, nav a, nav button, [data-testid="sidebar-item"] {
        color: #800F2F !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
      }

      aside a:hover, aside button:hover, [data-testid="sidebar-item"]:hover {
        background-color: #FFE5EC !important;
        color: #C9184A !important;
        transform: translateX(4px) !important;
      }

      /* Main Title & Headers typography */
      h1, h2, h3, h4, [role="heading"], .text-ui-fg-base {
        font-family: 'Playfair Display', serif !important;
        color: #800F2F !important;
        text-shadow: 0 0 10px rgba(255, 182, 193, 0.5) !important;
      }

      /* Custom neon-glowing card styles for Medusa components */
      .bg-ui-bg-base, [class*="bg-white"], [class*="bg-card"], main div.bg-white, [data-testid="container"] {
        background: rgba(255, 255, 255, 0.88) !important;
        backdrop-filter: blur(10px) !important;
        border: 1.5px solid rgba(255, 194, 209, 0.7) !important;
        box-shadow: 0 12px 35px rgba(255, 182, 193, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.6) !important;
        border-radius: 18px !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      /* Tables styling */
      table, th, td, tr {
        border-color: #FFE3E8 !important;
        background-color: transparent !important;
      }

      th {
        color: #800F2F !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        background-color: #FFF0F3 !important;
      }

      tr:hover td {
        background-color: #FFF5F7 !important;
      }

      /* Beautiful custom pink glow buttons */
      button:not([disabled]):not(.bg-transparent):not([class*="border-"]), .btn-primary, [type="submit"] {
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
      input[type="text"], input[type="number"], input[type="email"], input[type="password"], select, textarea {
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

      /* Global text colors */
      span, p, div, label, td, th {
        color: #5C061E !important;
      }

      /* Badge / status colors */
      [class*="bg-emerald-"], [class*="bg-[#"], [class*="badge"] {
        background-color: #FFE5EC !important;
        color: #C9184A !important;
        border: 1px solid #FFB3C6 !important;
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
  )
}

export const config = defineWidgetConfig({
  zone: [
    "product.list.before",
    "product.list.after",
    "product.details.before",
    "product.details.after",
    "order.list.before",
    "order.list.after",
    "order.details.before",
    "order.details.after",
    "customer.list.before",
    "customer.list.after",
    "customer.details.before",
    "customer.details.after",
    "promotion.list.before",
    "promotion.list.after",
    "promotion.details.before",
    "promotion.details.after",
    "price_list.list.before",
    "price_list.list.after",
    "price_list.details.before",
    "price_list.details.after",
    "inventory_item.list.before",
    "inventory_item.list.after",
    "inventory_item.details.before",
    "inventory_item.details.after"
  ]
})

export default GlobalPrestigeThemeWidget
