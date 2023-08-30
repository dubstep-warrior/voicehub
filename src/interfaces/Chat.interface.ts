import { UID } from "./VHUser";

export type ChatID = string;

export type Chat = {
  id: ChatID;
  chat_img?: string;
  name: string;
  owner: UID;
  type: "chat" | "dms";
  users: UID[];
  messages: [];
};

export type TempChat = Partial<Chat> & {};
