import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import Default from "./Default"; 
import SearchUsers from "../../../pages/SearchUsers";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";

export default function Connections({ route }: NavigationProps) {
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
