import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store"; 
import { UserStateChats } from "../../interfaces/Chat.interface";
import { Connections, User } from "../../interfaces/VHUser";

// Define a type for the slice state 
interface UserState extends User {   
  chats: UserStateChats;
}

// Define the initial state using that type
const initialState: UserState & Connections = {
  profile_img: null,
  username: "",
  displayedName: "",
  chats: {
    chat: {},
    dms: {},
  },
} ;

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
          if(!(chatID in state.chats[type as keyof typeof state.chats])) {
            state.chats[type as keyof typeof state.chats][chatID] = chat
          }
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
