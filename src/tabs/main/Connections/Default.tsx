import { TouchableOpacity, Image, Animated } from "react-native";
import config from "../../../../Images.config";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ConnectionsTab from "./DefaultTabs/ConnectionsTab";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import StandardTabPage from "../StandardTabPage";

export default function Default({ navigation }: NavigationProps) {
  const userState = useAppSelector(selectUser);
  const Tab = createMaterialTopTabNavigator();

  const av = new Animated.Value(0);
  av.addListener(() => {
    return;
  });
  return (
    <StandardTabPage
      headerName="Friends"
      headerRight={
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() =>
            navigation.navigate("AddFriend", {
              key: "username",
              heading: "FiND A USER HERE:",
              submit: "Search",
            })
          }
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={config["add-user"]}
          ></Image>
        </TouchableOpacity>
      }
    >
      <Tab.Navigator
        initialRouteName="FriendsDefault"
        style={{ minHeight: "100%" }}
        screenListeners={{
          focus: () => {
            Animated.timing(av, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
      >
        <Tab.Screen
          name={"Friends" as keyof RootStackParamList}
          component={ConnectionsTab}
        />
        <Tab.Screen
          name={"Requests" as keyof RootStackParamList}
          component={ConnectionsTab}
        />
        <Tab.Screen
          name={"Pending" as keyof RootStackParamList}
          component={ConnectionsTab}
        />
      </Tab.Navigator>
    </StandardTabPage>
  );
}
