import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Access from "./pages/Access";
import { useEffect, useState } from "react";
import { RootStackParamList } from "./interfaces/RootStackParamList.interface";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import * as SecureStore from "expo-secure-store";
import { assign, selectAuth } from "./store/auth/auth.slice";
import Main from "./pages/Main";
import { AuthOnRender } from "./store/auth/auth.actions";
// import { useNavigation } from '@react-navigation/native';

export default function VoiceHub() {
  const Stack = createStackNavigator<RootStackParamList>();
  const authState = useAppSelector(selectAuth); 
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AuthOnRender())
  }, [])
 
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authState.token ? (
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
