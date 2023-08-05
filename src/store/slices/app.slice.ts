import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Unsubscribe } from "firebase/auth";
import { Call } from "../../utils/Call";

// Define a type for the slice state
interface App {
  submitting: boolean;
  users: any[];
  home: {
    selectedCat: string | null;
    selectedSubCat: string | null;
  };
  messages: any;
  userProfiles: any;
  call: any;
  firebaseListeners: Unsubscribe[];
  // RTCPeerConnection: RTCPeerConnection
  // localMediaStream?: any
}

// Define the initial state using that type
const initialState: App = {
  submitting: false,
  users: [],
  home: {
    selectedCat: "dms",
    selectedSubCat: null,
  },
  messages: {},
  userProfiles: {},
  call: null,
  firebaseListeners: [],
  // RTCPeerConnection: new RTCPeerConnection({
  //   iceServers: [
  //     {
  //       urls: [
  //         'stun:stun1.l.google.com:19302',
  //         'stun:stun2.l.google.com:19302',
  //       ],
  //     },
  //   ],
  //   iceCandidatePoolSize: 10,
  // })
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
      // console.log('redux store has been updated in state slice: ', actions.payload)

      state.submitting = actions.payload.submitting ?? false;
      state.users = actions.payload.users ?? [];
    },
    update: (state, actions) => {
      Object.keys(actions.payload).forEach((key) => {
        state[key as keyof typeof state] = actions.payload[key];
      });
      console.log("updated app state", state);
    },
    updateAppMessages: (state, actions) => {
      state.messages[actions.payload.chat_id] = actions.payload.messages;
      console.log("updated app state messages", state.messages[actions.payload.chat_id].desc, state.messages[actions.payload.chat_id].images);
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
  },
});

export const {
  assign,
  update,
  updateAppMessages,
  addFirebaseListener,
  clearFirebase, 
} = appSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
