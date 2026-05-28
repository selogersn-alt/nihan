import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE_PATH = path.join(DATA_DIR, "featured-products.json")

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  let featuredIds: string[] = []
  
  if (fs.existsSync(FILE_PATH)) {
    try {
      featuredIds = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
    } catch (e) {
      featuredIds = []
    }
  }

  if (featuredIds.length === 0) {
    res.status(200).json({ products: [] })
    return
  }

  try {
    const query = req.scope.resolve("query")
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "thumbnail", "description", "variants.*", "variants.prices.*"],
      filters: {
        id: featuredIds,
        status: "published"
      }
    })

    res.status(200).json({ products })
  } catch (error: any) {
    console.error("Error fetching featured products:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
}
