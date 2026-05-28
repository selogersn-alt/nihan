import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE_PATH = path.join(DATA_DIR, "messages.json")

interface Message {
  sender: "customer" | "admin"
  text: string
  timestamp: string
}

interface Thread {
  customerId: string
  customerName: string
  updatedAt: string
  messages: Message[]
}

const ensureFileExists = (): Thread[] => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]))
    return []
  }
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
  } catch (e) {
    return []
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const threads = ensureFileExists()
  const customerId = req.query.customerId as string

  if (!customerId) {
    res.status(400).json({ message: "customerId query parameter is required" })
    return
  }

  const thread = threads.find((t) => t.customerId === customerId) || {
    customerId,
    customerName: "Visiteur Anonyme",
    updatedAt: new Date().toISOString(),
    messages: []
  }

  res.status(200).json({ thread })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const threads = ensureFileExists()
  const { customerId, customerName, text } = req.body as {
    customerId: string
    customerName?: string
    text: string
  }

  if (!customerId || !text) {
    res.status(400).json({ message: "customerId and text are required" })
    return
  }

  let thread = threads.find((t) => t.customerId === customerId)

  const newMessage: Message = {
    sender: "customer",
    text,
    timestamp: new Date().toISOString()
  }

  if (!thread) {
    thread = {
      customerId,
      customerName: customerName || "Visiteur Anonyme",
      updatedAt: new Date().toISOString(),
      messages: [newMessage]
    }
    threads.push(thread)
  } else {
    if (customerName) {
      thread.customerName = customerName
    }
    thread.updatedAt = new Date().toISOString()
    thread.messages.push(newMessage)
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(threads, null, 2))
  res.status(200).json({ thread, success: true })
}
