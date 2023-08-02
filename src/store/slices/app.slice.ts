import { createSlice } from '@reduxjs/toolkit' 
import type { RootState } from '../store' 

// Define a type for the slice state
interface App {  
    submitting: boolean,
    users: any[],
    home: {
      selectedCat: string | null,
      selectedSubCat: string | null
    },
    messages: any,
    userProfiles: any
}

// Define the initial state using that type
const initialState: App = {  
    submitting: false,
    users: [],
    home: {
      selectedCat: 'p2p',
      selectedSubCat: null
    },
    messages: {}, 
    userProfiles: {}
}  

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
      // console.log('redux store has been updated in state slice: ', actions.payload)
    
      state.submitting = actions.payload.submitting ?? false
      state.users = actions.payload.users ?? []
    }, 
    update: (state, actions) => {
      Object.keys(actions.payload).forEach((key) => {
        state[key as keyof typeof state] = actions.payload[key]
      })
      console.log('updated app state', state)
    },
    updateAppMessages: (state, actions) => {
      state.messages[actions.payload.chat_id] = actions.payload.messages
      console.log('updated app state messages', state)
    },
  },
})

export const { assign, update, updateAppMessages } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app 

export default appSlice.reducer