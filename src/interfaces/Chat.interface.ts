import { ImageObject } from "@georstat/react-native-image-gallery";
import { UID } from "./VHUser";

export type ChatID = string;

export type Message = {
  by: UID,
  chatID: ChatID,
  created: Date | string,
  desc: string,
  images: ImageObject[]
}

export type Chat = {
  id: ChatID;
  chat_img?: string;
  name: string;
  owner: UID;
  type: "chat" | "dms";
  users: UID[];
  messages: Message;
};

export type TempChat = Partial<Chat> & {
  type: "chat" | "dms";
  users: UID[];
};
  

export type ChatCollection = {
  [key: ChatID]: Chat  
}

export type DMCollection = {
  [key: ChatID]: Chat | TempChat 
}

export type MessagesCollection = {
  [key: ChatID]: Message[]
}

export type UserStateChats = {
  chat: ChatCollection,
  dms: DMCollection
}