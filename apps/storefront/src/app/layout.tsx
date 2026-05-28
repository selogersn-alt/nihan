import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Outfit, Playfair_Display } from "next/font/google"
import "styles/globals.css"
import AnalyticsTracker from "@modules/common/components/analytics"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | Maison NIHAN (NH)",
    default: "Maison NIHAN (NH) | Haute Couture, Loungewear & Cosmétiques Fins",
  },
  description: "Découvrez l'élégance intemporelle de Maison NIHAN (NH). Une sélection d'exception associant cosmétiques raffinés, loungewear en soie de mûrier et joaillerie minimaliste.",
  openGraph: {
    title: "Maison NIHAN (NH) | Haute Couture & Loungewear",
    description: "Découvrez l'élégance intemporelle de Maison NIHAN (NH). Cosmétiques raffinés, loungewear en soie et joaillerie minimaliste.",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 800,
        alt: "Maison NIHAN (NH) Luxury Monogram",
      },
    ],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#FAF9F6] text-[#1E1E1E]">
        <AnalyticsTracker />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
