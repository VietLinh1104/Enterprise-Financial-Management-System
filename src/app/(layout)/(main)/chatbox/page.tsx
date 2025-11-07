"use client"

import React from "react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { MessageCircleDashed,MessageCirclePlus, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GeneratedFormPage() {
	const [chatList, setChatList] = React.useState(null);

	return (
		<div className="p-1.5">
		{chatList === null ? 
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MessageCircleDashed />
					</EmptyMedia>
					<EmptyTitle>Chưa có tin nhắn nào</EmptyTitle>
					<EmptyDescription>Hãy gửi tin nhắn mới</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button variant="outline" ><MessageCirclePlus /> Tin nhắn mới</Button>
				</EmptyContent>
			</Empty> : 
			
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MessageCircle />
					</EmptyMedia>
					<EmptyTitle>Hãy chọn 1 tin nhắn</EmptyTitle>
					<EmptyDescription>Hoặc gửi tin nhắn mới</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button variant="outline" ><MessageCirclePlus /> Tin nhắn mới</Button>
				</EmptyContent>
			</Empty>
		
		}
		</div>
	)
}
