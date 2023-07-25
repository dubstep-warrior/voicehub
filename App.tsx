import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Access from "./pages/Access";
import { RootStackParamList } from "./interfaces/RootStackParamList.interface";

export default function App() {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Access} />
        <Stack.Screen name="Register" component={Access} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
