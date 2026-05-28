import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")

    // Retrieve all published products with their variants, prices, and images
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "description",
        "images.*",
        "variants.*",
        "variants.prices.*"
      ],
      filters: {
        status: "published"
      }
    })

    const baseUrl = "http://localhost:8000" // Next.js storefront base URL

    // Construct a standard Facebook / TikTok catalog XML feed
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Maison NIHAN (NH) - Catalogue Luxe</title>
    <link>${baseUrl}</link>
    <description>Maison NIHAN (NH) - Collection Privée de cosmétiques fins, loungewear en soie et joaillerie minimaliste.</description>
`

    for (const product of products) {
      // Find the first variant and its default price
      const firstVariant = product.variants?.[0]
      const priceObject = firstVariant?.prices?.find((p: any) => p.currency_code === "eur") || firstVariant?.prices?.[0]
      const price = priceObject ? (priceObject.amount).toFixed(2) : "0.00"
      const currency = priceObject?.currency_code?.toUpperCase() || "EUR"

      const productUrl = `${baseUrl}/dk/products/${product.handle}`
      const imageUrl = product.images?.[0]?.url 
        ? (product.images[0].url.startsWith("http") ? product.images[0].url : `${baseUrl}${product.images[0].url}`)
        : `${baseUrl}/images/placeholder.png`

      xml += `    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.title} | Maison NIHAN (NH)]]></g:title>
      <g:description><![CDATA[${product.description || ""}]]></g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:brand>Maison NIHAN</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${price} ${currency}</g:price>
      <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>
    </item>
`
    }

    xml += `  </channel>
</rss>`

    res.setHeader("Content-Type", "application/xml")
    return res.status(200).send(xml)
  } catch (error: any) {
    console.error("Erreur lors de la génération du catalogue XML :", error)
    return res.status(500).json({
      success: false,
      message: "Impossible de générer le flux XML du catalogue.",
      error: error.message,
    })
  }
}
