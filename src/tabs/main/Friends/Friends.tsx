import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import config from "../../../../Images.config";
import { styles as globalStyles } from "../../../../Styles.config";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import Default from "./Default"; 
import SearchUsers from "../../../pages/SearchUsers";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";

export default function Friends({ route, navigation }: NavigationProps) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={route.name}
    >
      <Stack.Screen
        name={"Default" as keyof RootStackParamList}
        component={Default as any}
      />
      <Stack.Screen
        name={"AddFriend" as keyof RootStackParamList}
        component={SearchUsers as any}
      />
    </Stack.Navigator>
  );
}
