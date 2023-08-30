import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { User, UserCredential } from "firebase/auth";
import { Chat, ChatID, TempChat } from "../../interfaces/Chat.interface";

// Define a type for the slice state
type ChatCollection = {
  [key: string]: Chat | TempChat 
}

interface UserState extends User {
  profile_img: any;
  username: string;
  displayedName: string;
  status?: string;
  friends?: UserState[];
  requests?: UserState[];
  pending?: UserState[];
  chats: {
    chat: any;
    dms: any;
  };
}

// Define the initial state using that type
const initialState: UserState = {
  profile_img: null,
  username: "",
  displayedName: "",
  chats: {
    chat: {},
    dms: {},
  },
} as UserState;

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {  
      const user = actions.payload.user;
      state.displayedName = user.displayedName;
      state.username = user.username;
      state.status = user.status;
      state.profile_img = user.profile_img; 
    },
    update: (state: UserState, actions) => {
      Object.keys(actions.payload).forEach((key) => {
        (state[key as keyof UserState] as any) = actions.payload[key];
      }); 
    },
    updateUserChat: (state: UserState, actions) => {
      const chatObj = actions.payload.chat;
      Object.keys(chatObj).forEach((type) => {
        const chats = chatObj[type];
        Object.keys(chats).forEach((chatID) => {
          const chat = chats[chatID];
          Object.keys(chat).forEach((attributeKey) => {
            if(!(chatID in state.chats[type as keyof typeof state.chats])) {
              state.chats[type as keyof typeof state.chats][chatID] = {}
            }
            state.chats[type as keyof typeof state.chats][chatID][
              attributeKey as keyof Chat
            ] = chat[attributeKey];
          });
        });
      }); 
    } 
  },
});

export const {
  assign,
  update, 
  updateUserChat, 
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
