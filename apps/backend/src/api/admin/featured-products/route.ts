import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE_PATH = path.join(DATA_DIR, "featured-products.json")

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]))
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  ensureFileExists()
  const data = fs.readFileSync(FILE_PATH, "utf-8")
  const featuredIds = JSON.parse(data)
  res.status(200).json({ featuredIds })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  ensureFileExists()
  const { featuredIds } = req.body as { featuredIds: string[] }
  
  if (!Array.isArray(featuredIds)) {
    res.status(400).json({ message: "featuredIds must be an array" })
    return
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(featuredIds, null, 2))
  res.status(200).json({ featuredIds, success: true })
}
