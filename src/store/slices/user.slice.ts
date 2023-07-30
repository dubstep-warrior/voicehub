import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { User, UserCredential } from 'firebase/auth'

// Define a type for the slice state
interface UserState extends User { 
  profile_img: any,
  username: string,
  displayedName: string,
  status?: string,
  friends?: UserState[],
  requests?: UserState[],
  pending?: UserState[]
}

// Define the initial state using that type
const initialState: UserState = {  
  profile_img: null,
  username: '',
  displayedName: '', 
} as UserState

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    assign: (state, actions) => {
      console.log('redux store has been updated in user slice: ', actions.payload)
      // state = actions.payload.user
      const user = actions.payload.user
      state.displayedName = user.displayedName
      state.username = user.username
      state.status = user.status
      state.friends = user.friends ?? []
      state.profile_img = user.profile_img
      console.log(state)
    },
    update: (state: UserState, actions) => {
      Object.keys(actions.payload).forEach(key => {
        (state[key as keyof UserState] as any) = actions.payload[key]
      })
      console.log('updated store', state)
    }
  },
})

export const { assign, update } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user 

export default userSlice.reducer