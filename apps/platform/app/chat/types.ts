export type Message = {
  id: string;
  role: "user" | "bot";
  createdAt?: Date;
  content: string;
  tool_call_id?: string;
};

export type ChatType = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
};

export type ChatListType = ChatType[];
