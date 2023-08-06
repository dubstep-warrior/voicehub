import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import config from "../../../../Images.config";
import { styles as globalStyles } from "../../../../Styles.config";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import UserList from "../../../shared/UserList";
import { selectApp } from "../../../store/slices/app.slice";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FriendsTab from "./DefaultTabs/Friends";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import StandardTabPage from "../StandardTabPage";

export default function Default({ route, navigation }: NavigationProps) {
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
        style={{ minHeight: Dimensions.get("window").height - 135 }}
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
          component={FriendsTab}
        />
        <Tab.Screen
          name={"Requests" as keyof RootStackParamList}
          component={FriendsTab}
        />
        <Tab.Screen
          name={"Pending" as keyof RootStackParamList}
          component={FriendsTab}
        />
      </Tab.Navigator>
    </StandardTabPage>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
    flexDirection: "column",
    position: "relative",
  },
});
