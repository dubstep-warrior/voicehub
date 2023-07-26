import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface AuthState {
  token: string
  user: any
}

// Define the initial state using that type
const initialState: AuthState = {
  token: '',
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
        console.log('redux store has been updated: ', actions.payload)
    //   state = actions.payload
      state.token = actions.payload.token
      state.user = actions.payload.user
    }
  },
})

export const { assign } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth 

export default authSlice.reducer