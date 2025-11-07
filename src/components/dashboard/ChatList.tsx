import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {ChatItem} from "@/types/dev-tool/chat-items"

type Props = {
  items: ChatItem[];
  pathname: string;
  onNavigate?: () => void;
};

export default function ChatList({ items, pathname, onNavigate }: Props) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
        const initials = item.label
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
              active ? "bg-muted font-medium" : "hover:bg-muted/70"
            }`}
          >
            {/* Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.avatar} alt={item.label} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {/* Nội dung */}
            <div className="flex flex-col text-sm truncate">
              <span className="font-medium">{item.label}</span>
              {item.lastMessage && (
                <span className="text-xs text-muted-foreground truncate">
                  {item.lastMessage}
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
