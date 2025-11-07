"use client"

import React, { useState } from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageChat, Message } from "@/components/dashboard/MessageChat"
import { openRouterClient } from "@/lib/openrouter"

const MAX_MESSAGES = 50

export default function GeneratedFormPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      time: new Date().toISOString(), // ✅ ISO format
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: input,
      time: new Date().toISOString(), // ✅ Lưu ISO
    }

    setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES))
    setInput("")
    setLoading(true)

    try {
      const formattedMessages = [
        { role: "system", content: "Bạn là ChatBot Mistral được xây dựng bởi Việt Linh." },
        {
          role: "system",
          content:
            "Khi được hỏi về Việt Linh: là sinh viên trường Công nghệ GTVT, ngành Hệ thống thông tin, hiện đang làm việc tại Công ty Công nghệ HPT.",
        },
        ...messages.map((m) => ({
          role: m.sender === "me" ? "user" : "assistant",
          content: m.text,
        })),
        { role: "user", content: input },
      ]

      const res = await openRouterClient.post(
        "/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: formattedMessages,
        }
      )
     

      const botText = res.data.choices?.[0]?.message?.content || "Không có phản hồi."

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: botText,
        time: new Date().toISOString(), // ✅ ISO
      }

      setMessages((prev) => [...prev, botMsg].slice(-MAX_MESSAGES))
    } catch (err) {
      console.error("🚨 Lỗi API:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-1.5 rounded-md h-[calc(100dvh-100px)] flex flex-col">
      <div className="max-w-5xl border rounded-2xl w-full mx-auto h-full flex flex-col justify-end">
        <MessageChat messages={messages} isTyping={loading} />

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
