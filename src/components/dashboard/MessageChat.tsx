"use client"

import React, { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

export type Message = {
  id: number
  sender: "me" | "bot"
  text: string
  time: string
}

type Props = {
  messages: Message[]
  isTyping?: boolean
}

function getMinuteDiff(t1: string, t2: string) {
  const [h1, m1] = t1.split(":").map(Number)
  const [h2, m2] = t2.split(":").map(Number)
  return h2 * 60 + m2 - (h1 * 60 + m1)
}

export function MessageChat({ messages, isTyping = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 🔹 Tự động scroll xuống cuối khi có tin mới
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scrollbar-thin"
    >
      {messages.map((msg, index) => {
        const prev = messages[index - 1]
        const next = messages[index + 1]

        const isSameSenderPrev = prev && prev.sender === msg.sender
        const isSameSenderNext = next && next.sender === msg.sender
        const isSameTimeNext = next && next.time === msg.time
        const shouldShowTimestamp =
          !prev || getMinuteDiff(prev.time, msg.time) > 5

        let bubbleRounded = "rounded-2xl"
        if (msg.sender === "me") {
          if (!isSameSenderPrev && isSameSenderNext)
            bubbleRounded = "rounded-2xl rounded-br-md"
          else if (isSameSenderPrev && isSameSenderNext)
            bubbleRounded = "rounded-md rounded-l-2xl"
          else if (isSameSenderPrev && !isSameSenderNext)
            bubbleRounded = "rounded-2xl rounded-tr-md"
        } else {
          if (!isSameSenderPrev && isSameSenderNext)
            bubbleRounded = "rounded-2xl rounded-bl-md"
          else if (isSameSenderPrev && isSameSenderNext)
            bubbleRounded = "rounded-md rounded-r-2xl"
          else if (isSameSenderPrev && !isSameSenderNext)
            bubbleRounded = "rounded-2xl rounded-tl-md"
        }

        return (
          <React.Fragment key={msg.id}>
            {shouldShowTimestamp && (
              <div className="flex justify-center my-3">
                <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {msg.time}
                </span>
              </div>
            )}

            <div
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              } transition-all`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 text-sm shadow-sm ${bubbleRounded} ${
                  msg.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {/* 🧠 Hiển thị markdown với highlight */}
                <div
                  className={`prose prose-sm dark:prose-invert max-w-none break-words ${
                    msg.sender === "me" ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>


                {(!isSameTimeNext || !isSameSenderNext) && (
                  <span
                    className={`block text-[10px] text-muted-foreground mt-0.5 ${
                      msg.sender === "me" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          </React.Fragment>
        )
      })}

      {/* ✨ Hiệu ứng bot đang gõ */}
      {isTyping && (
        <div className="flex justify-start mt-2">
          <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-md inline-flex items-center space-x-1 shadow-sm">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </div>
  )
}
