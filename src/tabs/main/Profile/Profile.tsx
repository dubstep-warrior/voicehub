import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AuthRemove } from "../../../store/actions/auth.actions";
import theme from "../../../../config/theme.config.json";
import actionSheetConfig from "../../../../config/actionSheet-config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../../../../Images.config";
import { useRef, useState, useEffect } from "react";
import ActionSheet from "react-native-actionsheet";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import * as ImagePicker from "expo-image-picker";
import { selectUser, update } from "../../../store/slices/user.slice";
import routeConfig from "../../../../config/route-config.json";
import Input from "../../../shared/Input";
import { FormData } from "../../../shared/FormData";
import { UserUpdate } from "../../../store/actions/user.actions";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase";
import { VHUser } from "../../../interfaces/VHUser";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Default from "./Default";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import { createStackNavigator } from "@react-navigation/stack";
import SimpleForm from "../../../shared/SimpleForm";
import UpdateField from "../../../pages/UpdateField";

export default function Profile({ route }: NavigationProps) {
  // console.log(route.name);
  const Stack = createStackNavigator(); 
  const userState = useAppSelector(selectUser);

  return (
    userState && (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen name={"Default" as keyof RootStackParamList} component={Default as any} /> 
        <Stack.Screen name={"UpdateField" as keyof RootStackParamList} component={UpdateField as any} /> 
      </Stack.Navigator>
    )
  );
}
 