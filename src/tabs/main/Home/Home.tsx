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
import { Image as ExpoImage } from "expo-image";
import { auth, db } from "../../../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
// import Daily from '@daily-co/react-native-daily-js';



export default function Home({ route, navigation }: any) {
  const Drawer = createDrawerNavigator();
  console.log("navigated to home", route?.params?.drawerStatus);
  return (
    <>
      <Drawer.Navigator
        key={route?.params?.drawerStatus ?? "open"}
        defaultStatus={route?.params?.drawerStatus ?? "open"}
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
    console.log(cat, subcat);
    dispatch(
      updateApp({
        home: {
          selectedCat: cat,
          selectedSubCat:
            subcat ??
            (!!Object.keys(userState.chats.dms).length &&
              Object.keys(userState.chats.dms)[0]),
        },
      })
    );
    if (cat == "dms" && subcat !== null) navigation.closeDrawer();
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

  const resolveAddChat = () => {
    setOverlay({
      type: overlay.type,
      visible: false,
    });
    navigation.navigate("Main", {
      screen: "Home",
      params: {
        screen: "Chat",
        params: {
          drawerStatus: "closed",
          screen: "Default",
        },
      },
    });
  }; 

  const joinVoiceLounge = async (chatId: string | null) => {
    // const call = Daily.createCallObject({
    //   audioSource: true, // Start with audio on to get mic permission from participant at start
    //   videoSource: false,
    // });
    // call.join({ url: `https://voicehub.daily.co/${chatId}` });

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
            onPress={() => selectHomeState("dms", null)}
          >
            {appState.home.selectedCat == "dms" && (
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
                appState.home.selectedCat == "dms" && {
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
                      cachePolicy={"memory-disk"}
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
              {appState.home.selectedCat == "dms" && (
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      padding: 8,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      Direct Messages
                    </Text>
                    <TouchableOpacity style={{ padding: 5 }}>
                      <Image
                        style={{ width: 15, height: 15 }}
                        source={config["add"]}
                      ></Image>
                    </TouchableOpacity>
                  </View>
                  {/* <DrawerItemList {...props} /> */}
                  <View style={{ padding: 8 }}>
                    <UserList
                      list={Object.keys(userState?.chats?.["dms"]).map(
                        (chatID) => {
                          return {
                            ...appState.userProfiles[
                              userState?.chats?.["dms"][chatID].users.find(
                                (userID: string) =>
                                  userID !== auth.currentUser!.uid
                              )
                            ],
                            dmRef: chatID,
                          };
                        }
                      )}
                      identifier="dmRef"
                      selected={appState?.home?.selectedSubCat}
                      small={true}
                      onPress={(user) => selectHomeState("dms", user.dmRef)}
                    ></UserList>
                  </View>
                </View>
              )}
              {appState.home.selectedCat &&
                appState.home.selectedCat !== "dms" && (
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
                          ]?.name
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
                      <TouchableOpacity
                        style={[styles.subCatOption]}
                        onPress={() =>
                          joinVoiceLounge(appState.home.selectedSubCat)
                        }
                      >
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
                onSubmit={resolveAddChat}
                navigation={navigation}
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
