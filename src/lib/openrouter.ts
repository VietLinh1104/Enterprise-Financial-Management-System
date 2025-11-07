import { Message } from "@/components/dashboard/MessageChat"
import axios from "axios"



export const openRouterClient = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer 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`,
  },
  timeout: 30000,
})

export async function chatWithOpenRouter(messages: Message[]) {

  try {
    console.log("🚀 Gọi OpenRouter với messages:", process.env.OPENROUTER_API_KEY)
    const res = await openRouterClient.post("/chat/completions", {
      model: "mistralai/mistral-7b-instruct",
      messages,
    })
    return res.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("🚨 Lỗi gọi OpenRouter:", error.response?.data || error.message)
    
    throw error
  }
}
