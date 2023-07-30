import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
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

export default function Default({ route, navigation }: NavigationProps) {
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const Tab = createMaterialTopTabNavigator();
  console.log(Boolean(userState.friends?.length));
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* HEADING */}
      <View
        style={{
          padding: 12,
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          Friends
        </Text>
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
      </View>
      {/* BODY */}
      <Tab.Navigator style={{minHeight: '100%'}}>
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
    </SafeAreaView>
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
