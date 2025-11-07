// src/components/dashboard/NavSection.tsx
import { ChatItem } from "@/types/dev-tool/chat-items";
import ChatList from "./ChatList";

type Props = {
  title: string;
  chats: ChatItem[];
  pathname: string;
};

export default function ChatSection({ title, chats, pathname }: Props) {
  return (
    <div>
      <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide opacity-60 mt-5">{title}</div>
      {/* <NavList items={items} pathname={pathname} /> */}
      <ChatList items={chats} pathname={pathname} />

    </div>
  );
}