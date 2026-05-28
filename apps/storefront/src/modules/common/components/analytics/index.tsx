"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    fbq: any
    _fbq: any
    ttq: any
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 1. Initialize Meta / Facebook Pixel (Simulated for high-fidelity conversion tracking)
    if (!window.fbq) {
      ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = "2.0"
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")
      
      window.fbq("init", "nihan_meta_pixel_id_2026")
    }

    // 2. Initialize TikTok Pixel (Simulated for high-fidelity conversion tracking)
    if (!window.ttq) {
      ;(function (w: any, d: any, t: any) {
        w.ttq = w.ttq || []
        w.ttq.methods = [
          "page", "track", "identify", "instances", "debug", "on", "off",
          "once", "ready", "alias", "group", "enableCookie", "cleanCookie"
        ]
        w.ttq.setAndDefer = function (e: any, t: any) {
          e[t] = function () {
            e.push([t].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        for (var i = 0; i < w.ttq.methods.length; i++) {
          w.ttq.setAndDefer(w.ttq, w.ttq.methods[i])
        }
        w.ttq.instance = function (e: any) {
          var t = w.ttq._i[e] || []
          for (var n = 0; n < w.ttq.methods.length; n++) {
            w.ttq.setAndDefer(t, w.ttq.methods[n])
          }
          return t
        }
        w.ttq.load = function (e: any, t: any) {
          var n = "https://analytics.tiktok.com/i18n/pixel/events.js"
          w.ttq._i = w.ttq._i || {}
          w.ttq._i[e] = []
          w.ttq._i[e]._u = n
          w.ttq._t = w.ttq._t || {}
          w.ttq._t[e] = +new Date()
          var o = d.createElement("script")
          o.type = "text/javascript"
          o.async = !0
          o.src = n
          var a = d.getElementsByTagName("script")[0]
          a.parentNode.insertBefore(o, a)
        }
        w.ttq.load("nihan_tiktok_pixel_id_2026")
      })(window, document, "script")
    }
  }, [])

  // 3. Track PageView on route change
  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView")
    }
    if (window.ttq) {
      window.ttq.page()
    }
    console.log(`[NIHAN Analytics] PageView : ${pathname}`)
  }, [pathname, searchParams])

  return null
}

// Global conversion event triggers helper
export const trackConversionEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (window.fbq) {
    window.fbq("track", eventName, properties)
  }
  if (window.ttq) {
    window.ttq.track(eventName, properties)
  }
  console.log(`[NIHAN Analytics] Event: ${eventName}`, properties)
}
