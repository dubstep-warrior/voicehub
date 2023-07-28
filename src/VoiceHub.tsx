import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Access from "./pages/Access";
import { RootStackParamList } from "./interfaces/RootStackParamList.interface";
import { useAppDispatch } from "./store/hooks";
import Main from "./pages/Main";
import { AuthOnRender } from "./store/actions/auth.actions";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import {useState, useEffect} from 'react'

export default function VoiceHub() {
  const Stack = createStackNavigator<RootStackParamList>();
  const dispatch = useAppDispatch();  
  const [authRef, setAuthRef] = useState<null | User>(null)
   

  onAuthStateChanged(auth, (user) => {
    setAuthRef(user ?? null) 
    dispatch(AuthOnRender())
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authRef ? (
          <Stack.Group>
            <Stack.Screen name="Main" component={Main} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={Access} />
            <Stack.Screen name="Register" component={Access} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
