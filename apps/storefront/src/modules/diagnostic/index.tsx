"use client"

import React, { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface DiagnosticQuizProps {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}

export default function DiagnosticQuiz({ products, countryCode }: DiagnosticQuizProps) {
  const [step, setStep] = useState<number>(0)
  const [answers, setAnswers] = useState({
    skinType: "",
    mainConcern: "",
    texture: "",
  })
  const [loadingResult, setLoadingResult] = useState<boolean>(false)
  const [loadingText, setLoadingText] = useState<string>("")
  const [addingToCart, setAddingToCart] = useState<boolean>(false)
  const [addedToCart, setAddedToCart] = useState<boolean>(false)
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false)

  // Poetic loading updates to simulate personalized luxury skin synthesis
  useEffect(() => {
    if (!loadingResult) return
    
    const steps = [
      "Analyse de vos affinités épidermiques...",
      "Calcul des synergies actives botaniques...",
      "Harmonisation de votre rituel de nuit de soie...",
      "Sublimation de votre diagnostic de prestige...",
    ]
    
    let index = 0
    setLoadingText(steps[0])
    
    const interval = setInterval(() => {
      index++
      if (index < steps.length) {
        setLoadingText(steps[index])
      } else {
        clearInterval(interval)
        setLoadingResult(false)
        setStep(4)
      }
    }, 850)

    return () => clearInterval(interval)
  }, [loadingResult])

  const selectAnswer = (field: "skinType" | "mainConcern" | "texture", value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
    
    // Smooth delay before moving to next step to let the selection render beautifully
    setTimeout(() => {
      if (field === "skinType") setStep(2)
      if (field === "mainConcern") setStep(3)
      if (field === "texture") {
        setLoadingResult(true)
      }
    }, 350)
  }

  const resetQuiz = () => {
    setAnswers({ skinType: "", mainConcern: "", texture: "" })
    setStep(0)
    setAddedToCart(false)
    setCopiedCoupon(false)
  }

  // Calculate recommendation based on selections
  const getRecommendation = () => {
    // 1. If sleep/comfort is selected as primary, recommend the Silk Loungewear
    if (answers.mainConcern === "sommeil") {
      const match = products.find(p => p.handle?.includes("loungewear") || p.title?.toLowerCase().includes("soie"))
      return {
        type: "loungewear",
        title: "Le Rituel de Soie Impériale",
        tagline: "Lingerie & Ensembles de Nuit en Pure Soie de Mûrier",
        description: "En réponse à votre recherche d'apaisement nocturne et de confort absolu, la Maison vous recommande sa Soie Impériale. Un ensemble façonné dans une soie de 22 mommes d'une douceur exceptionnelle, régulant naturellement votre température corporelle pour un sommeil céleste.",
        image: "/images/loungewear.png",
        coupon: "SOIEIMP10",
        matchedProduct: match || null,
        fallbackVariantId: match?.variants?.[0]?.id || "fallback_loungewear_variant",
      }
    }

    // 2. If dry skin or anti-aging concerns are selected, recommend the Skincare L'Or de Nihan
    if (answers.skinType === "seche" || answers.mainConcern === "anti_age") {
      const match = products.find(p => p.handle?.includes("serum") || p.title?.toLowerCase().includes("or de nihan"))
      return {
        type: "beauty",
        title: "Le Rituel L'Or de Nihan",
        tagline: "Sérum Rénovateur Éclat Infini & Huiles Précieuses",
        description: "Votre peau demande une régénération profonde et une texture riche enveloppante. La Maison vous propose l'incomparable Rituel L'Or de Nihan. Infusé d'actifs antioxydants rares et de reflets d'or fins, ce sérum soyeux réhydrate intensément, raffermit et ravive l'éclat de votre épiderme.",
        image: "/images/skincare.png",
        coupon: "RITUELOR10",
        matchedProduct: match || null,
        fallbackVariantId: match?.variants?.[0]?.id || "fallback_skincare_variant",
      }
    }

    // 3. Fallback: recommend the minimalist gold jewelry
    const match = products.find(p => p.handle?.includes("jewelry") || p.title?.toLowerCase().includes("bijoux") || p.handle?.includes("necklace"))
    return {
      type: "jewelry",
      title: "La Parure d'Or Minimaliste",
      tagline: "Créations de Joaillerie et Colliers en Or Fin",
      description: "Pour sublimer votre éclat naturel au quotidien avec une touche de géométrie noble, la Maison vous conseille sa collection de bijoux épurés. Un collier en or jaune satiné reposant avec légèreté sur la peau, pour signer vos tenues d'une élégance souveraine.",
      image: "/images/jewelry.png",
      coupon: "PARURE10",
      matchedProduct: match || null,
      fallbackVariantId: match?.variants?.[0]?.id || "fallback_jewelry_variant",
    }
  }

  const recommendation = getRecommendation()

  // Handle adding product to cart natively
  const handleAddToCart = async () => {
    const variantId = recommendation.matchedProduct?.variants?.[0]?.id || recommendation.fallbackVariantId
    
    if (variantId.startsWith("fallback_")) {
      alert("Ce produit de démo n'est pas encore enregistré en base de données. Il sera automatiquement ajoutable dès qu'il sera importé depuis AliExpress ! En attendant, profitez du code promo : " + recommendation.coupon)
      return
    }

    setAddingToCart(true)
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
      })
      setAddedToCart(true)
    } catch (err) {
      console.error(err)
      alert("Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.")
    } finally {
      setAddingToCart(false)
    }
  }

  const copyCoupon = () => {
    navigator.clipboard.writeText(recommendation.coupon)
    setCopiedCoupon(true)
    setTimeout(() => {
      setCopiedCoupon(false)
    }, 2000)
  }

  return (
    <div className="w-full max-w-2xl bg-white border border-[#E5E7EB]/40 luxury-card-shadow rounded-sm p-8 md:p-12 relative overflow-hidden font-sans">
      {/* Premium custom style block for self-contained luxury transitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInLuxury {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .luxury-fade-in {
          animation: fadeInLuxury 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .luxury-card-shadow {
          box-shadow: 0 30px 60px -20px rgba(181, 164, 139, 0.12), 0 1px 4px rgba(0, 0, 0, 0.01);
        }
      `}} />

      {/* Sleek Dynamic Golden Progress Bar */}
      {step > 0 && step <= 3 && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FAF9F5]">
          <div 
            className="h-full bg-[#B5A48B] transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

      {/* Background brand crest watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.018] pointer-events-none text-[180px] font-serif text-[#111111] select-none">
        NH
      </div>

      {/* STEP 0: INTRO SCREEN */}
      {step === 0 && (
        <div className="text-center space-y-6 luxury-fade-in">
          <div className="w-14 h-14 border border-[#B5A48B]/40 rounded-full flex items-center justify-center text-[#B5A48B] font-serif text-xs mx-auto tracking-widest bg-[#FFFDF9]/60">
            NH
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#B5A48B] font-bold uppercase block">
            DIAGNOSTIC DE LA MAISON
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#111111] uppercase tracking-wide leading-tight">
            VOTRE RITUEL <br /> SUR-MESURE
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed max-w-md mx-auto font-medium text-justify md:text-center">
            Prenez deux minutes pour révéler votre rituel idéal. Un diagnostic sensoriel exclusif conçu pour harmoniser votre épiderme, vos nuits de soie et votre éclat naturel.
          </p>
          <div className="w-12 h-[1px] bg-[#B5A48B]/30 mx-auto pt-4"></div>
          <div className="pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#B5A48B] text-white text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-sm hover:scale-[1.03] hover:shadow-lg shadow-black/10"
            >
              COMMENCER LE DIAGNOSTIC &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: PEAU / MATÉRIAU */}
      {step === 1 && (
        <div className="space-y-6 luxury-fade-in">
          <div className="flex justify-between items-center text-[10px] text-[#B5A48B] font-bold uppercase tracking-widest">
            <span>DIAGNOSTIC DE LA MAISON</span>
            <span>Question 1 / 3</span>
          </div>
          <h3 className="font-serif text-xl text-[#111111] uppercase tracking-wide border-b border-gray-100 pb-4">
            Quelle est la nature actuelle de votre épiderme ?
          </h3>
          <div className="space-y-3">
            {[
              { id: "seche", title: "Sèche & Déshydratée", desc: "Sensations de tiraillements, sécheresse localisée, besoin d'hydratation riche." },
              { id: "mixte", title: "Mixte à Grasse", desc: "Brillance sur la zone médiane, teint irrégulier, recherche de légèreté & d'éclat." },
              { id: "sensible", title: "Sensible & Réactive", desc: "Rougeurs diffuses, inconforts passagers, besoin de douceur & d'apaisement." }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => selectAnswer("skinType", opt.id)}
                className={`border p-4 rounded-sm cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-sm ${
                  answers.skinType === opt.id
                    ? "border-[#B5A48B] bg-[#FAF9F5] shadow-sm"
                    : "border-gray-200 hover:border-[#B5A48B]/60 hover:bg-[#FAF9F6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${answers.skinType === opt.id ? "border-[#B5A48B]" : "border-gray-300"}`}>
                    {answers.skinType === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#B5A48B]"></div>}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#111111] uppercase tracking-wider">{opt.title}</span>
                    <span className="block text-[10px] text-[#6B7280] mt-0.5">{opt.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: PRÉOCCUPATION / CONFORT */}
      {step === 2 && (
        <div className="space-y-6 luxury-fade-in">
          <div className="flex justify-between items-center text-[10px] text-[#B5A48B] font-bold uppercase tracking-widest">
            <span>DIAGNOSTIC DE LA MAISON</span>
            <span>Question 2 / 3</span>
          </div>
          <h3 className="font-serif text-xl text-[#111111] uppercase tracking-wide border-b border-gray-100 pb-4">
            Quelle est votre préoccupation ou recherche prioritaire ?
          </h3>
          <div className="space-y-3">
            {[
              { id: "anti_age", title: "Régénération & Anti-Âge", desc: "Atténuer les ridules, stimuler la fermeté et redessiner les contours du visage." },
              { id: "teint", title: "Luminosité & Pureté", desc: "Resserrer le grain de peau, éliminer le teint terne pour capter naturellement la lumière." },
              { id: "sommeil", title: "Sommeil & Bien-être nocturne", desc: "Améliorer le repos nocturne, apaiser le corps avec la fraîcheur thermique de la soie." }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => selectAnswer("mainConcern", opt.id)}
                className={`border p-4 rounded-sm cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-sm ${
                  answers.mainConcern === opt.id
                    ? "border-[#B5A48B] bg-[#FAF9F5] shadow-sm"
                    : "border-gray-200 hover:border-[#B5A48B]/60 hover:bg-[#FAF9F6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${answers.mainConcern === opt.id ? "border-[#B5A48B]" : "border-gray-300"}`}>
                    {answers.mainConcern === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#B5A48B]"></div>}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#111111] uppercase tracking-wider">{opt.title}</span>
                    <span className="block text-[10px] text-[#6B7280] mt-0.5">{opt.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: TEXTURE / AFFINITÉ */}
      {step === 3 && (
        <div className="space-y-6 luxury-fade-in">
          <div className="flex justify-between items-center text-[10px] text-[#B5A48B] font-bold uppercase tracking-widest">
            <span>DIAGNOSTIC DE LA MAISON</span>
            <span>Question 3 / 3</span>
          </div>
          <h3 className="font-serif text-xl text-[#111111] uppercase tracking-wide border-b border-gray-100 pb-4">
            Quelle affinité sensorielle vous séduit le plus ?
          </h3>
          <div className="space-y-3">
            {[
              { id: "huile", title: "Huiles & Soies Précieuses", desc: "Des matières enveloppantes et douces, laissant un voile protecteur satiné." },
              { id: "creme", title: "Émulsions Fondantes & Veloutées", desc: "Des crèmes légères qui fusionnent au contact pour hydrater en souplesse." },
              { id: "fluide", title: "Fluides Rafraîchissants & Légers", desc: "Des textures aqueuses fraîches, des métaux fins légers et épurés sur la peau." }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => selectAnswer("texture", opt.id)}
                className={`border p-4 rounded-sm cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-sm ${
                  answers.texture === opt.id
                    ? "border-[#B5A48B] bg-[#FAF9F5] shadow-sm"
                    : "border-gray-200 hover:border-[#B5A48B]/60 hover:bg-[#FAF9F6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${answers.texture === opt.id ? "border-[#B5A48B]" : "border-gray-300"}`}>
                    {answers.texture === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#B5A48B]"></div>}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#111111] uppercase tracking-wider">{opt.title}</span>
                    <span className="block text-[10px] text-[#6B7280] mt-0.5">{opt.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIAGNOSING LOADER */}
      {loadingResult && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 luxury-fade-in">
          <div className="w-12 h-12 border-2 border-t-[#B5A48B] border-r-transparent border-[#FAF9F5] rounded-full animate-spin"></div>
          <span className="text-[10px] tracking-[0.25em] text-[#B5A48B] font-bold uppercase block animate-pulse">
            {loadingText}
          </span>
        </div>
      )}

      {/* STEP 4: RECOMMENDATION RESULT */}
      {step === 4 && (
        <div className="space-y-6 luxury-fade-in">
          <div className="text-center border-b border-gray-100 pb-5">
            <span className="text-[9px] tracking-[0.25em] text-[#B5A48B] font-bold uppercase block mb-1">
              DIAGNOSTIC DE LA MAISON ACCOMPLI
            </span>
            <h3 className="font-serif text-2xl text-[#111111] uppercase tracking-wide">
              VOTRE RECOMMANDATION PRIVÉE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Beautiful Product Portrait Image */}
            <div className="md:col-span-5 relative aspect-square md:aspect-[3/4] w-full border border-gray-100 p-2 bg-[#FAF9F6] rounded-sm overflow-hidden shadow-sm">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={recommendation.image}
                  alt={recommendation.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            {/* Right: Recommendation details */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#B5A48B] uppercase block">
                {recommendation.tagline}
              </span>
              <h4 className="font-serif text-lg font-bold text-[#111111] uppercase tracking-wide">
                {recommendation.title}
              </h4>
              <p className="text-xs text-[#555555] leading-relaxed font-sans text-justify font-medium">
                {recommendation.description}
              </p>

              {/* Price display if matched product is found */}
              {recommendation.matchedProduct ? (
                <div className="text-xs text-[#111111] font-bold tracking-wide font-sans">
                  Tarif :{" "}
                  <span className="text-[#B5A48B] font-mono">
                    {recommendation.matchedProduct.variants?.[0]?.calculated_price?.calculated_amount_with_taxes || "69,00 €"}
                  </span>
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold italic">
                  Édition Limitée de la Maison &mdash; En attente de stock
                </div>
              )}

              {/* Add to Cart button */}
              <div className="pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || addedToCart}
                  className={`w-full py-3.5 text-[9px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-sm ${
                    addedToCart
                      ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-default"
                      : "bg-[#111111] hover:bg-[#B5A48B] text-white hover:scale-[1.02] shadow-md shadow-black/5"
                  }`}
                >
                  {addingToCart ? "AJOUT EN COURS..." : addedToCart ? "✓ AJOUTÉ AU PANIER !" : "AJOUTER LE RITUEL AU PANIER"}
                </button>
              </div>
            </div>
          </div>

          {/* VIP Golden Coupon Card */}
          <div className="border border-dashed border-[#B5A48B] bg-[#FFFDF9] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <div>
              <span className="text-[9px] font-bold text-[#B5A48B] tracking-wider uppercase block">
                PRIVILÈGE RITUEL MAISON
              </span>
              <p className="text-[10px] text-[#6B7280] mt-0.5 font-medium">
                Bénéficiez de 10% offerts sur ce rituel de prestige grâce au code :
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-[#FAF9F5] border border-[#B5A48B]/40 font-mono text-xs font-bold text-[#111111] tracking-wider rounded-sm select-all">
                {recommendation.coupon}
              </span>
              <button
                onClick={copyCoupon}
                className="px-3 py-1.5 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm hover:bg-[#B5A48B] transition-colors"
              >
                {copiedCoupon ? "COPIÉ !" : "COPIER"}
              </button>
            </div>
          </div>

          {/* Centered reset button */}
          <div className="text-center pt-4">
            <button
              onClick={resetQuiz}
              className="text-[9px] font-bold tracking-[0.2em] text-[#6B7280] uppercase hover:text-[#111111] transition-colors"
            >
              &larr; RECOMMENCER LE DIAGNOSTIC
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
