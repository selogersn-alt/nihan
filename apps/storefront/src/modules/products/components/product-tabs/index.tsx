import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Spécifications & Détails",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Conseils de la Maison",
      component: <MaisonCareTab product={product} />,
    },
    {
      label: "Livraison & Retours Privés",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8 text-[#55524C]">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-black">Matière / Matériau</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-black">Pays d'origine</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-black">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-black">Poids</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-black">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const MaisonCareTab = ({ product }: ProductTabsProps) => {
  const title = product.title?.toLowerCase() || ""
  
  if (
    title.includes("shirt") || 
    title.includes("robe") || 
    title.includes("loungewear") || 
    title.includes("silk") || 
    title.includes("pyjama") || 
    title.includes("satin")
  ) {
    return (
      <div className="text-small-regular py-8 text-[#55524C] leading-relaxed">
        <p className="font-semibold text-black mb-2">Entretien de la Soie & du Satin :</p>
        <ul className="list-disc list-inside space-y-1.5">
          <li>Lavage à la main recommandé à l'eau tiède (30°C maximum).</li>
          <li>Utiliser une lessive liquide douce spéciale textiles délicats.</li>
          <li>Ne pas tordre l'article pour l'essorer ; presser très doucement.</li>
          <li>Séchage à plat à l'ombre, à l'écart de toute source de chaleur.</li>
          <li>Repassage sur l'envers à température douce (soie), sans vapeur.</li>
        </ul>
      </div>
    )
  }
  
  if (
    title.includes("serum") || 
    title.includes("skincare") || 
    title.includes("cream") || 
    title.includes("beauty") || 
    title.includes("soin")
  ) {
    return (
      <div className="text-small-regular py-8 text-[#55524C] leading-relaxed">
        <p className="font-semibold text-black mb-2">Rituel d'Application recommandé :</p>
        <ul className="list-disc list-inside space-y-1.5">
          <li>Appliquer matin et soir sur une peau préalablement nettoyée.</li>
          <li>Chauffer 3 à 4 gouttes au creux de vos mains avant l'application.</li>
          <li>Masser délicatement par mouvements circulaires ascendants.</li>
          <li>Terminer par de légères pressions du bout des doigts pour stimuler l'absorption.</li>
          <li>Conserver au sec, à l'abri de la lumière directe.</li>
        </ul>
      </div>
    )
  }

  // Fallback (for jewelry/general)
  return (
    <div className="text-small-regular py-8 text-[#55524C] leading-relaxed">
      <p className="font-semibold text-black mb-2">Préservation & Éclat :</p>
      <ul className="list-disc list-inside space-y-1.5">
        <li>Éviter tout contact direct avec les parfums, crèmes et produits cosmétiques.</li>
        <li>Retirer vos pièces avant de dormir, de vous baigner ou de faire du sport.</li>
        <li>Nettoyer délicatement à l'aide d'un chiffon doux et sec en microfibre.</li>
        <li>Conserver individuellement dans l'écrin protecteur Maison NIHAN.</li>
      </ul>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8 text-[#55524C]">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold text-black">Livraison Privée & Suivie</span>
            <p className="max-w-sm mt-1">
              Votre commande est expédiée sous 24h à 48h dans un emballage signature Maison NIHAN avec suivi en temps réel.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold text-black">Échanges Facilités</span>
            <p className="max-w-sm mt-1">
              Une taille ou un coloris ne convient pas ? Aucun souci, nous échangeons vos articles sans frais supplémentaires.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold text-black">Retours Simplifiés</span>
            <p className="max-w-sm mt-1">
              Vous disposez de 14 jours à compter de la réception de votre colis pour nous retourner vos articles dans leur écrin d'origine.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
