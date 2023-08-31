import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import Default from "./Default";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import { createStackNavigator } from "@react-navigation/stack";
import UpdateField from "../../../pages/UpdateField";  

export default function Profile() {
  const Stack = createStackNavigator();
  const userState = useAppSelector(selectUser);

  return (
    userState && (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={"Default" as keyof RootStackParamList}
          component={Default as any}
          initialParams={{
            current: 'profile'
          }}
        />
        <Stack.Screen
          name={"UpdateField" as keyof RootStackParamList}
          component={UpdateField as any}
          initialParams={{
            current: 'profile/update'
          }}
        />
      </Stack.Navigator>
    )
  );
}
