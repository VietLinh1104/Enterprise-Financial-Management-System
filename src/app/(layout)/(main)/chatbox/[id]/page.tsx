"use client"

import React, { useState } from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageChat, Message } from "@/components/dashboard/MessageChat"

export default function GeneratedFormPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?", time: "10:00" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // 🧠 Hàm gọi API OpenRouter
  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: input,
      time: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: "Bạn là ChatBot Mistral được xây dựng bởi Việt Linh." },
            ...messages.map((m) => ({
              role: m.sender === "me" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        }),
      })

      const data = await response.json()
      const botText = data.choices?.[0]?.message?.content || "Không có phản hồi."

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: botText,
        time: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      console.error("Lỗi API:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-1.5 rounded-md h-[calc(100dvh-100px)] flex flex-col">
      <div className="max-w-5xl border rounded-2xl w-full mx-auto h-full flex flex-col justify-end">
        {/* 💬 Danh sách tin nhắn */}
        <MessageChat messages={messages} isTyping={loading} />

        {/* 🔹 Thanh nhập tin nhắn */}
        <div className="toolbar flex items-center gap-2 pt-2 w-full mb-3 border-t border-muted mt-2 px-2 bg-background">
          <Input
            placeholder="Viết tin nhắn..."
            className="rounded-full flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <Button
            size="icon"
            className="rounded-full"
            onClick={sendMessage}
            disabled={loading}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
