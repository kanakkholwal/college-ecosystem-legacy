export type Message = {
  id: string;
  role: "user" | "bot";
  createdAt?: Date;
  content: string;
  // isTyping?: boolean;
};

export type ChatType = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
};

export type ChatListType = ChatType[];
