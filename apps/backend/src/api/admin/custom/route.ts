import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
  updateRegionsWorkflow
} from "@medusajs/medusa/core-flows"
import { ProductStatus } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")

    // 1. Retrieve Default Sales Channel & Shipping Profile
    const { data: salesChannelResult } = await query.graph({
      entity: "sales_channel",
      fields: ["id"],
    })
    const salesChannelId = salesChannelResult[0]?.id

    const { data: shippingProfileResult } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfileId = shippingProfileResult[0]?.id

    if (!shippingProfileId || !salesChannelId) {
      return res.status(400).json({
        success: false,
        message: "Impossible de récupérer le profil de livraison ou le canal de vente par défaut.",
      })
    }

    // 2. Query and delete legacy default template products
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
    })

    const legacyHandles = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
    const legacyProductIds = allProducts
      .filter((p: any) => legacyHandles.includes(p.handle))
      .map((p: any) => p.id)

    if (legacyProductIds.length > 0) {
      console.log(`Suppression des produits de test par défaut : ${legacyProductIds.join(", ")}`)
      await deleteProductsWorkflow(req.scope).run({
        input: {
          ids: legacyProductIds,
        },
      })
    }

    // 3. Create or fetch custom product categories
    const { data: existingCategories } = await query.graph({
      entity: "product_category",
      fields: ["id", "handle", "name"],
    })

    const targetCategories = [
      { name: "Beauty", handle: "beauty", description: "L'excellence cosmétique et soins précieux de la Maison." },
      { name: "Loungewear", handle: "loungewear", description: "Matières fluides et coupes couture en satin et soie naturelle." },
      { name: "Accessories", handle: "accessories", description: "Joyaux intemporels, or jaune 18k et or blanc minimaliste." }
    ]

    const categoriesToCreate: any[] = []
    const categoryMap: Record<string, string> = {}

    // Build category map and identify which need to be created
    targetCategories.forEach((target) => {
      const match = existingCategories.find((cat: any) => cat.handle === target.handle)
      if (match) {
        categoryMap[target.handle] = match.id
      } else {
        categoriesToCreate.push({
          name: target.name,
          handle: target.handle,
          is_active: true,
        })
      }
    })

    if (categoriesToCreate.length > 0) {
      const { result: newCategories } = await createProductCategoriesWorkflow(req.scope).run({
        input: {
          product_categories: categoriesToCreate,
        },
      })
      newCategories.forEach((cat: any) => {
        categoryMap[cat.handle] = cat.id
      })
    }

    // 4. Create Luxury Flagship Products
    const productsToCreate: any[] = [
      {
        title: "Sérum Rénovateur Éclat Infini — L'Or de Nihan",
        handle: "serum-eclat-infini",
        description: "Formulé à base d'huiles précieuses et d'actifs botaniques brevetés, ce sérum d'exception illumine instantanément le teint, lisse les ridules et hydrate intensément.",
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfileId,
        category_ids: [categoryMap["beauty"]],
        images: [{ url: "http://localhost:8000/images/skincare.png" }],
        options: [{ title: "Volume", values: ["30ml", "50ml"] }],
        variants: [
          {
            title: "30ml",
            sku: `NIHAN-BEAUTY-SERUM-30`,
            options: { Volume: "30ml" },
            manage_inventory: false,
            prices: [
              { amount: 85, currency_code: "eur" },
              { amount: 95, currency_code: "usd" }
            ]
          },
          {
            title: "50ml",
            sku: `NIHAN-BEAUTY-SERUM-50`,
            options: { Volume: "50ml" },
            manage_inventory: false,
            prices: [
              { amount: 125, currency_code: "eur" },
              { amount: 140, currency_code: "usd" }
            ]
          }
        ],
        sales_channels: [{ id: salesChannelId }],
      },
      {
        title: "Pyjama Iconique en Soie Impériale — Maison Nihan",
        handle: "pyjama-soie-imperiale",
        description: "Conçu dans une soie de mûrier d'une douceur inégalée 22 mommes, cet ensemble de pyjama allie coupe tailleur intemporelle et confort absolu pour vos nuits.",
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfileId,
        category_ids: [categoryMap["loungewear"]],
        images: [{ url: "http://localhost:8000/images/loungewear.png" }],
        options: [{ title: "Size", values: ["S", "M", "L"] }],
        variants: [
          {
            title: "S",
            sku: `NIHAN-LOUNGE-PYJ-S`,
            options: { Size: "S" },
            manage_inventory: false,
            prices: [
              { amount: 220, currency_code: "eur" },
              { amount: 245, currency_code: "usd" }
            ]
          },
          {
            title: "M",
            sku: `NIHAN-LOUNGE-PYJ-M`,
            options: { Size: "M" },
            manage_inventory: false,
            prices: [
              { amount: 220, currency_code: "eur" },
              { amount: 245, currency_code: "usd" }
            ]
          },
          {
            title: "L",
            sku: `NIHAN-LOUNGE-PYJ-L`,
            options: { Size: "L" },
            manage_inventory: false,
            prices: [
              { amount: 220, currency_code: "eur" },
              { amount: 245, currency_code: "usd" }
            ]
          }
        ],
        sales_channels: [{ id: salesChannelId }],
      },
      {
        title: "Collier Pendentif Or 18k — Le Cube Nihan",
        handle: "collier-cube-or",
        description: "Une pièce joaillière d'un raffinement rare. Composé d'une chaîne délicate en or jaune 18 carats et d'un pendentif géométrique pur en cube évidé.",
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfileId,
        category_ids: [categoryMap["accessories"]],
        images: [{ url: "http://localhost:8000/images/jewelry.png" }],
        options: [{ title: "Color", values: ["Or Jaune", "Or Blanc"] }],
        variants: [
          {
            title: "Or Jaune",
            sku: `NIHAN-JEWEL-CUBE-GOLD`,
            options: { Color: "Or Jaune" },
            manage_inventory: false,
            prices: [
              { amount: 450, currency_code: "eur" },
              { amount: 500, currency_code: "usd" }
            ]
          },
          {
            title: "Or Blanc",
            sku: `NIHAN-JEWEL-CUBE-WHITE`,
            options: { Color: "Or Blanc" },
            manage_inventory: false,
            prices: [
              { amount: 480, currency_code: "eur" },
              { amount: 535, currency_code: "usd" }
            ]
          }
        ],
        sales_channels: [{ id: salesChannelId }],
      }
    ]

    const actualProductsToCreate: any[] = []
    for (const prod of productsToCreate) {
      const match = allProducts.find((p: any) => p.handle === prod.handle)
      if (!match) {
        actualProductsToCreate.push(prod)
      } else {
        console.log(`Le produit avec le handle "${prod.handle}" existe déjà dans le catalogue.`)
      }
    }

    if (actualProductsToCreate.length > 0) {
      await createProductsWorkflow(req.scope).run({
        input: {
          products: actualProductsToCreate,
        },
      })
      console.log(`${actualProductsToCreate.length} produits de luxe créés avec succès.`)
    }

    // 5. Link Stripe Payment Provider to all active Regions
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "countries", "payment_providers"],
    })

    for (const region of regions) {
      const currentProviders = region.payment_providers || []
      if (!currentProviders.includes("pp_stripe_stripe")) {
        console.log(`Liaison de pp_stripe_stripe à la région : ${region.name}`)
        await updateRegionsWorkflow(req.scope).run({
          input: {
            selector: { id: region.id },
            update: {
              payment_providers: [...currentProviders, "pp_stripe_stripe"],
            },
          },
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: "Catalogue et intégration Stripe configurés avec succès ! Les produits de test par défaut ont été supprimés, les 3 produits phares de Maison NIHAN ont été injectés et Stripe a été lié aux régions de vente.",
    })
  } catch (error: any) {
    console.error("Erreur lors de l'initialisation du catalogue de luxe :", error)
    return res.status(500).json({
      success: false,
      message: "Une erreur interne s'est produite lors de l'exécution du script de seeding.",
      error: error.message,
    })
  }
}
