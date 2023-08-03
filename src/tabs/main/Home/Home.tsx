import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  Keyboard,
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
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  assign as assignUser,
  selectUser,
} from "../../../store/slices/user.slice";
import {
  selectApp,
  update as updateApp,
} from "../../../store/slices/app.slice";
import { ScrollView } from "react-native-gesture-handler";
import ResolveChat from "../../../pages/ResolveChat";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Overlay } from "react-native-elements";
import { useRef, useState } from "react";
import Chat from "./Chat";
import ActionSheet from "react-native-actionsheet";
import actionSheetConfig from "../../../../config/actionSheet-config.json";
import Invite from "../../../pages/Invite";
import Modal from "react-native-modal";
import FlashMessage from "react-native-flash-message";
import FastImage from "react-native-fast-image";
import { Image as ExpoImage } from 'expo-image';


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
          drawerPosition: "left",
          headerShown: false,
          // drawerType: "slide",
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"Chat" as keyof RootStackParamList}
          component={Chat}
        />
      </Drawer.Navigator>
    </>
  );
}

const CustomDrawerContent = ({ navigation }: any) => {
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const current = "leftDrawer";
  // const [visible, setVisible] = useState(false);
  const [overlay, setOverlay] = useState({
    type: "add",
    visible: false,
  });
  const dispatch = useAppDispatch();
  const toggleOverlay = (type: string) => {
    setOverlay({
      type: type,
      visible: !overlay.visible,
    });
  };

  const selectHomeState = (cat: string | null, subcat: string | null) => {
    dispatch(
      updateApp({
        home: {
          selectedCat: cat,
          selectedSubCat: subcat,
        },
      })
    );
  };

  const actionSheetRef = useRef<ActionSheet>(null);
  const options = (actionSheetConfig as any)[current][
    !!appState?.call ? "call" : "norm"
  ] as (string | React.ReactNode)[];
  // options[1] = !!appState.call ? "Leave call" : "Join call";
  const actionSheetProps = {
    ref: actionSheetRef,
    options: options,
    cancelButtonIndex: options.length - 1,
    onPress: async (index: number): Promise<void> => {
      if (index == 0) {
        setOverlay({
          type: "invite",
          visible: !overlay.visible,
        });
      }
    },
  };

  const chatOptions = () => {
    actionSheetRef.current?.show();
  };

  return (
    <View style={{ flexDirection: "row", flexGrow: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.background2,
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
          <TouchableOpacity
            style={{
              marginBottom: 18,
              position: "relative",
            }}
            onPress={() => selectHomeState("p2p", null)}
          >
            {appState.home.selectedCat == "p2p" && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "5%",
                  backgroundColor: theme.smoothGrey,
                  borderBottomRightRadius: 15,
                  borderTopRightRadius: 15,
                }}
              ></View>
            )}
            {appState.home.selectedCat == "home" && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "5%",
                  backgroundColor: theme.smoothGrey,
                  borderBottomRightRadius: 15,
                  borderTopRightRadius: 15,
                }}
              ></View>
            )}
            <View
              style={[
                {
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.background,
                  alignSelf: "center",
                },
                appState.home.selectedCat == "p2p" && {
                  borderWidth: 2,
                  borderColor: theme.black,
                  borderRadius: 20,
                },
              ]}
            >
              <Image
                style={[{ width: 30, height: 30 }]}
                source={config["dms"]}
              ></Image>
            </View>
          </TouchableOpacity>

          {!!Object.keys(userState?.chats?.["chat"]).length &&
            Object.keys(userState?.chats?.["chat"]).map((key) => (
              <TouchableOpacity
                key={key}
                style={{ position: "relative" }}
                onPress={() => selectHomeState("chat", key)}
              >
                {appState.home.selectedCat == "chat" &&
                  appState.home.selectedSubCat == key && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "5%",
                        backgroundColor: theme.smoothGrey,
                        borderBottomRightRadius: 15,
                        borderTopRightRadius: 15,
                      }}
                    ></View>
                  )}
                <View
                  style={[
                    {
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.background,
                      alignSelf: "center",
                      overflow: "hidden",
                    },
                    appState.home.selectedCat == "chat" &&
                      appState.home.selectedSubCat == key && {
                        borderWidth: 2,
                        borderColor: theme.black,
                        borderRadius: 20,
                      },
                  ]}
                >
                  {!!userState?.chats?.["chat"]?.[key]?.["chat_img"] ? (
                    <ExpoImage
                      style={{
                        flex: 1,
                        width: 60,
                        height: 60,
                      }}
                      source={userState?.chats?.["chat"]?.[key]?.["chat_img"]}
                      cachePolicy={'memory-disk'}
                    ></ExpoImage>
                  ) : (
                    <Text style={{ fontWeight: "bold", color: "white" }}>
                      {userState?.chats?.["chat"]?.[key]["name"][0]}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

          <TouchableOpacity
            onPress={() => {
              toggleOverlay("add");
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
              {appState.home.selectedCat == "home" && (
                <View>
                  <View style={{ padding: 8 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      Direct Messages
                    </Text>
                  </View>
                  {/* <DrawerItemList {...props} /> */}
                  <UserList list={userState.friends as any[]}></UserList>
                </View>
              )}
              {appState.home.selectedCat &&
                appState.home.selectedCat !== "p2p" && (
                  <View style={{ flexDirection: "column" }}>
                    <View
                      style={{
                        padding: 16,
                        borderBottomWidth: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {
                          userState.chats.chat[
                            appState.home
                              .selectedSubCat as keyof typeof userState.chats
                          ].name
                        }
                      </Text>
                      <TouchableOpacity onPress={() => chatOptions()}>
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            transform: [{ rotateZ: "90deg" }],
                          }}
                          source={config["more"]}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                    <View style={{ padding: 8, gap: 4 }}>
                      <TouchableOpacity
                        style={[
                          styles.subCatOption,
                          { backgroundColor: theme.background2 },
                        ]}
                        onPress={() => navigation.closeDrawer()}
                      >
                        <Image
                          style={{ borderRadius: 0, width: 20, height: 20 }}
                          source={config["message"]}
                        ></Image>
                        <Text
                          style={[styles.subCatOptionText, { color: "white" }]}
                        >
                          Text channel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.subCatOption]}>
                        <Image
                          style={{ borderRadius: 0, width: 20, height: 20 }}
                          source={config["voice"]}
                        ></Image>
                        <Text style={[styles.subCatOptionText]}>
                          Voice lounge
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
      {overlay.type == "add" ? (
        <Overlay
          isVisible={overlay.visible}
          onBackdropPress={() =>
            Keyboard.isVisible()
              ? Keyboard.dismiss()
              : setOverlay({
                  type: overlay.type,
                  visible: false,
                })
          }
          backdropStyle={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          overlayStyle={{ backgroundColor: theme.background, borderRadius: 15 }}
        >
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 8,
                  zIndex: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setOverlay({
                      type: overlay.type,
                      visible: false,
                    })
                  }
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={config["close"]}
                  ></Image>
                </TouchableOpacity>
              </View>
              <ResolveChat
                onSubmit={() =>
                  setOverlay({
                    type: overlay.type,
                    visible: false,
                  })
                }
              ></ResolveChat>
            </View>
          </Pressable>
        </Overlay>
      ) : (
        <Modal
          isVisible={overlay.visible}
          style={{
            // flex: 0.2,
            // position: 'absolute',
            // bottom: 0,
            // width: '100%',
            margin: 0,
            // borderRadius: 20,
            backgroundColor: "rgba(0,0,0,0.2)",
            position: "relative",
          }}
          presentationStyle="overFullScreen"
          onBackdropPress={() => {
            setOverlay({
              type: overlay.type,
              visible: false,
            });
          }}
          // transparent={false}
          // hasBackdrop={false}
          // animated
          animationIn="slideInUp"
        >
          {overlay.visible && <FlashMessage position="top" />}

          <Invite
            chat={
              userState.chats.chat[
                appState.home.selectedSubCat as keyof typeof userState.chats
              ]
            }
            onClose={() => {
              setOverlay({
                type: overlay.type,
                visible: false,
              });
            }}
          ></Invite>
        </Modal>
      )}
      <ActionSheet {...actionSheetProps}></ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
  },
  subCatOption: {
    padding: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subCatOptionText: {
    color: theme.heading,
    textTransform: "uppercase",
  },
});
