import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default function EditorialShowcase() {
  return (
    <section className="bg-[#FAF9F5] py-24 px-6 md:px-12 lg:px-24 border-t border-[#FAF9F5] overflow-hidden">
      {/* Editorial Header Logo / Monogram */}
      <div className="flex flex-col items-center justify-center text-center mb-20">
        <div className="w-10 h-10 border border-[#B5A48B]/40 rounded-full flex items-center justify-center text-[#B5A48B] font-serif text-[11px] mb-4 tracking-widest">
          NH
        </div>
        <span className="text-[10px] tracking-[0.3em] text-[#B5A48B] font-bold uppercase mb-2">
          L'ART DE LA MATIÈRE
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#111111] uppercase tracking-[0.1em]">
          L'ÉDITORIAL DE LA MAISON
        </h2>
        <div className="w-12 h-[1px] bg-[#B5A48B]/50 mt-4"></div>
      </div>

      {/* Chapter I: Skincare / L'Or de Nihan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-32">
        {/* Left: Text & Philosophy */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center order-2 lg:order-1">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B5A48B] uppercase block">
            CHAPITRE I &mdash; L'OR DE NIHAN
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-[#111111] tracking-wide uppercase leading-tight">
            L'ÉCLAT ÉTERNEL <br className="hidden md:inline" /> DU SÉRUM AURÉLIA
          </h3>
          <p className="text-xs text-[#555555] leading-relaxed font-sans font-medium text-justify">
            Formulé au cœur de nos laboratoires partenaires avec des actifs botaniques précieux et infusé de reflets d'or fins, le Rituel Aurélia revitalise l'épiderme en profondeur. Un élixir soyeux conçu pour offrir à la peau une clarté absolue, un grain sublimé et une texture satinée incomparable.
          </p>
          <div className="border-l-2 border-[#B5A48B]/30 pl-4 py-1.5 italic font-serif text-[#777777] text-xs leading-relaxed">
            "Une texture céleste, qui glisse et pénètre instantanément pour révéler un éclat qui défie les années."
          </div>
          <div className="pt-4">
            <LocalizedClientLink href="/categories/beauty">
              <button className="text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase border-b border-[#111111] pb-1 hover:text-[#B5A48B] hover:border-[#B5A48B] transition-colors duration-300">
                DÉCOUVRIR LE RITUEL DE BEAUTÉ
              </button>
            </LocalizedClientLink>
          </div>
        </div>

        {/* Right: Immersive Portrait Image */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative aspect-[4/5] md:aspect-[1.4/1] lg:aspect-[4/5] w-full bg-[#FAF9F5] p-3 border border-[#E5E7EB]/40 shadow-sm rounded-sm overflow-hidden group">
            <div className="absolute inset-0 border border-[#FAF9F5] m-4 z-10 pointer-events-none"></div>
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/images/skincare.png"
                alt="Sérum L'Or de Nihan"
                fill
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter II: Loungewear / Soie Impériale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24">
        {/* Left: Immersive Landscape Image */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] md:aspect-[1.4/1] lg:aspect-[4/5] w-full bg-[#FAF9F5] p-3 border border-[#E5E7EB]/40 shadow-sm rounded-sm overflow-hidden group">
            <div className="absolute inset-0 border border-[#FAF9F5] m-4 z-10 pointer-events-none"></div>
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/images/loungewear.png"
                alt="Soie Impériale Loungewear"
                fill
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Right: Text & Philosophy */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B5A48B] uppercase block">
            CHAPITRE II &mdash; SOIE IMPÉRIALE
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-[#111111] tracking-wide uppercase leading-tight">
            LA CESSATION DU TEMPS <br className="hidden md:inline" /> EN SOIE DE MÛRIER
          </h3>
          <p className="text-xs text-[#555555] leading-relaxed font-sans font-medium text-justify">
            Façonnés dans une soie de mûrier de 22 mommes d'une pureté absolue, nos ensembles de nuit et pyjamas enveloppent le corps d'une caresse fluide. Les finitions coutures à la main et les coupes épurées redéfinissent l'art du repos, alliant le confort thermique d'une fibre naturelle d'exception à un drapé magistral.
          </p>
          <div className="border-l-2 border-[#B5A48B]/30 pl-4 py-1.5 italic font-serif text-[#777777] text-xs leading-relaxed">
            "Le vêtement de nuit devient une seconde peau, une seconde respiration, un éloge de la paresse noble."
          </div>
          <div className="pt-4">
            <LocalizedClientLink href="/categories/loungewear">
              <button className="text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase border-b border-[#111111] pb-1 hover:text-[#B5A48B] hover:border-[#B5A48B] transition-colors duration-300">
                EXPLORER LES CRÉATIONS SOIE
              </button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Bottom Maison Quote Card */}
      <div className="mt-20 border border-[#B5A48B]/30 bg-white p-12 text-center max-w-3xl mx-auto rounded-sm shadow-sm relative">
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F5] px-4 text-[#B5A48B] font-serif text-lg italic">
          NH
        </span>
        <blockquote className="font-serif italic text-base md:text-lg text-[#111111] leading-relaxed max-w-xl mx-auto">
          "L'élégance n'est pas de se faire remarquer, mais d'offrir au regard un instant de grâce inoubliable."
        </blockquote>
        <cite className="block text-[9px] font-bold tracking-[0.25em] text-[#B5A48B] uppercase mt-4 not-italic">
          &mdash; MAISON NIHAN (NH) &mdash;
        </cite>
      </div>
    </section>
  )
}
