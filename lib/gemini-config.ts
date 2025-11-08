import { createGoogleGenerativeAI } from "@ai-sdk/google"
import type { GoogleGenerativeAIProvider } from "@ai-sdk/google"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is not set in environment variables")
}

const google = createGoogleGenerativeAI({
  apiKey,
}) as unknown as GoogleGenerativeAIProvider

// ✅ Correctly invoke provider to get model reference
export const geminiModel = google("gemini-2.0-flash")
export const geminiMiniModel = google("gemini-2.0-flash")
