import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Unsubscribe } from "firebase/auth"; 
import { ChatID, MessagesCollection, UserStateChats } from "../../interfaces/Chat.interface";

// Define a type for the slice state
interface AppState {
  loading: boolean;
  submitting: boolean;
  users: any[];
  home: {
    selectedCat: keyof UserStateChats | null;
    selectedSubCat: ChatID | null;
  };
  messages: MessagesCollection;
  userProfiles: any; 
  firebaseListeners: Unsubscribe[]; 
  openProfileModal: string;  
}

// Define the initial state using that type
const initialState: AppState = {
  loading: false,
  submitting: false,
  users: [],
  home: {
    selectedCat: "dms",
    selectedSubCat: null,
  },
  messages: {},
  userProfiles: {}, 
  firebaseListeners: [], 
  openProfileModal: '' ,  
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
 
      state.submitting = actions.payload.submitting ?? false;
      state.users = actions.payload.users ?? [];
    },
    update: (state, actions) => {
      Object.keys(actions.payload).forEach((key) => {
        (state[key as keyof AppState] as any) = actions.payload[key];
      });
     },
    updateAppMessages: (state, actions) => { 
      state.messages[actions.payload.chat_id] = actions.payload.messages; 
     },
    addFirebaseListener: (state, actions) => {
      state.firebaseListeners.push(actions.payload.listener);
    },
    clearFirebase: (state) => {
      state.firebaseListeners.forEach((listener) => {
        listener();
      });
      state.firebaseListeners = [];
    }, 
    addAppMessage: (state, actions) => {
      if (!(actions.payload.chat_id in state.messages)) state.messages[actions.payload.chat_id] = [actions.payload.message] 
      else state.messages[actions.payload.chat_id].push(actions.payload.message)
     }, 
  },
});

export const {
  assign,
  update,
  updateAppMessages,
  addFirebaseListener,
  clearFirebase, 
  addAppMessage, 
} = appSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
