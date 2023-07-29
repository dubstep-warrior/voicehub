import { createSlice } from '@reduxjs/toolkit' 
import type { RootState } from '../store' 

// Define a type for the slice state
interface App {  
    submitting: boolean
}

// Define the initial state using that type
const initialState: App = {  
    submitting: false
}  

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
      console.log('redux store has been updated in state slice: ', actions.payload)
    
      state.submitting = actions.payload.submitting 
    }, 
  },
})

export const { assign } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app 

export default appSlice.reducer