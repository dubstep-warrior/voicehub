import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import theme from "../../../../config/theme.config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Default from "./Default";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import { Dimensions } from "react-native";
import config from "./../../../../Images.config";
import { styles as globalStyles } from "../../../../Styles.config";
import UserList from "../../../shared/UserList";
import { useAppSelector } from "../../../store/hooks";
import {
  assign as assignUser,
  selectUser,
} from "../../../store/slices/user.slice";
import { ScrollView } from "react-native-gesture-handler";
import CreateChat from "../../../pages/CreateChat";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Overlay } from "react-native-elements";
import { useState } from "react";

export default function Home() {
  const Drawer = createDrawerNavigator();

  return (
    <>
      <Drawer.Navigator
        defaultStatus="open"
        screenOptions={{
          swipeEdgeWidth: Dimensions.get("window").width,
          drawerStyle: {
            width: "90%",
          },
          headerShown: false,
          drawerType: "slide",
        }}
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name={"Home" as keyof RootStackParamList}
          component={Default}
        />
      </Drawer.Navigator>
    </>
  );
}

const CustomDrawerContent = (props: any) => {
  const userState = useAppSelector(selectUser);
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View style={{ flexDirection: "row", flexGrow: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.background2,
          // flexDirection: "column",
          // gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          {/* ICON COMPONENT STARTS HERE */}
          <View
            style={{
              marginBottom: 18,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.background,
                alignSelf: "center",
              }}
            >
              <Image
                style={[{ width: 30, height: 30 }]}
                source={config["dms"]}
              ></Image>
            </View>
          </View>

          {/* {Array(10)
            .fill(0)
            .map((val, index) => (
              <View key={index}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.background,
                    alignSelf: "center",
                  }}
                >
                  <Image
                    style={[{ width: 30, height: 30 }]}
                    source={config["dms"]}
                  ></Image>
                </View>
              </View>
            ))} */}

          <TouchableOpacity onPress={toggleOverlay}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.background,
                alignSelf: "center",
              }}
            >
              <Image
                style={[{ width: 30, height: 30 }]}
                source={config["add"]}
              ></Image>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
      <View style={{ flex: 3, backgroundColor: theme.smoothGrey }}>
        <ScrollView>
          <SafeAreaView>
            <View style={{ flexDirection: "column", gap: 12 }}>
              <View style={{ padding: 8 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "white" }}
                >
                  Direct Messages
                </Text>
              </View>
              {/* <DrawerItemList {...props} /> */}
              <UserList list={userState.friends as any[]}></UserList>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}
      overlayStyle={{backgroundColor: theme.background}}>
        <CreateChat></CreateChat>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
  },
});
