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
  // Sort threads by latest message timestamp
  const sortedThreads = threads.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  res.status(200).json({ threads: sortedThreads })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const threads = ensureFileExists()
  const { customerId, text } = req.body as {
    customerId: string
    text: string
  }

  if (!customerId || !text) {
    res.status(400).json({ message: "customerId and text are required" })
    return
  }

  const thread = threads.find((t) => t.customerId === customerId)

  if (!thread) {
    res.status(404).json({ message: "Conversation not found" })
    return
  }

  const newMessage: Message = {
    sender: "admin",
    text,
    timestamp: new Date().toISOString()
  }

  thread.updatedAt = new Date().toISOString()
  thread.messages.push(newMessage)

  fs.writeFileSync(FILE_PATH, JSON.stringify(threads, null, 2))
  res.status(200).json({ thread, success: true })
}
