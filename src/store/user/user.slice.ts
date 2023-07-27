import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface UserState {
  email: string
  profile_img: any,
  username: string,
  display_name: string,
  status?: string
}

// Define the initial state using that type
const initialState: UserState = {
  email: '',
  profile_img: null,
  username: '',
  display_name: ''
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
      console.log('redux store has been updated in user slice: ', actions.payload)
      state.email = actions.payload.user.email ?? ''
      state.profile_img = actions.payload.user.profile_img ?? null
      state.username = actions.payload.user.username ?? ''
      state.display_name = actions.payload.user.display_name ?? ''
      console.log('assigned store,', state)
    },
    update: (state, actions) => {
      Object.keys(actions.payload).forEach(key => {
        state[key as keyof UserState] = actions.payload[key]
      })
      console.log('updated store', state)
    }
  },
})

export const { assign, update } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user 

export default userSlice.reducer