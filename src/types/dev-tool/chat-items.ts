import React from "react";

export type ChatItem = {
  href: string
  label: string
  icon?: React.ElementType
  avatar?: string // URL ảnh đại diện
  lastMessage?: string // tin nhắn mới nhất
}