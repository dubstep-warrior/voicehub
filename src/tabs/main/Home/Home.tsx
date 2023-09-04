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
  DrawerContentComponentProps,
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
import { useEffect, useRef, useState } from "react";
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
import Spinner from "react-native-loading-spinner-overlay";
import ProfileOverview from "../../../shared/ProfileOverview";
import { deleteChat, leaveChat } from "../../../store/actions/user.actions";
import { UID } from "../../../interfaces/VHUser";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
// import Call from "../../../utils/Call";

export default function Home({ route, navigation }: NavigationProps) {
  const Drawer = createDrawerNavigator();
  const appState = useAppSelector(selectApp);
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
        {appState?.home?.selectedCat && appState?.home?.selectedSubCat ? (
          <Drawer.Screen
            name={"Chat" as keyof RootStackParamList}
            component={Chat}
          />
        ) : (
          <Drawer.Screen
            name={"Default" as keyof RootStackParamList}
            component={Default}
          />
        )}
      </Drawer.Navigator>
    </>
  );
}

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const current = "leftDrawer";
  // const [visible, setVisible] = useState(false);
  const [overlay, setOverlay] = useState({
    type: "",
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
  const owner =
    !!appState.home.selectedSubCat &&
    auth.currentUser?.uid ==
    userState.chats.chat[appState.home.selectedSubCat]?.owner;
  const options = (actionSheetConfig as any)[current][
    owner ? "owner" : "norm"
  ] as (string | React.ReactNode)[];
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
      if (index == 1) {
        if (appState.home.selectedSubCat) {
          if (owner) {
            dispatch(deleteChat(appState.home.selectedSubCat));
          } else {
            dispatch(leaveChat(appState.home.selectedSubCat));
          }
        }
      }
    },
  };

  useEffect(() => { }, [appState.home.selectedSubCat]);

  const chatOptions = () => {
    actionSheetRef.current?.show();
  };

  const resolveAddChat = () => {
    setOverlay({
      type: overlay.type,
      visible: false,
    });
  };

  return (
    <View style={{ flexDirection: "row", flexGrow: 1 }}>
      <ScrollView
        style={{
          maxWidth: 80,
          backgroundColor: theme.background2,
          paddingVertical: 8
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
              <View style={styles.indicator}></View>
            )}
            <View
              style={[
                styles.icon,
                appState.home.selectedCat == "dms" && {
                  borderWidth: 2,
                  borderColor: theme.black,
                  borderRadius: 20,
                },
              ]}
            >
              <Image style={styles.iconImage} source={config["dms"]}></Image>
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
                    <View style={styles.indicator}></View>
                  )}
                <View
                  style={[
                    styles.icon,
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
                      {userState?.chats?.["chat"]?.[key]?.["name"]?.[0]}
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
            <View style={styles.icon}>
              <Image style={styles.iconImage} source={config["add"]}></Image>
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
                  <View style={{ padding: 8 }}>
                    <UserList
                      list={Object.keys(userState?.chats?.["dms"]).map(
                        (chatID) => {
                          return {
                            ...appState?.userProfiles?.[
                            userState?.chats?.["dms"][chatID]?.users.find(
                              (userID: UID) =>
                                userID !== auth.currentUser?.uid
                            ) as UID
                            ],
                            dmRef: chatID,
                          };
                        }
                      )}
                      identifier="dmRef"
                      selected={appState?.home?.selectedSubCat}
                      small={true}
                      onPress={(user) => selectHomeState("dms", user.dmRef ?? null)}
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
                          style={[
                            styles.iconImage,
                            {
                              transform: [{ rotateZ: "90deg" }],
                            },
                          ]}
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
                type: "",
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
                      type: "",
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
        <>
          <Modal
            isVisible={overlay.visible}
            style={styles.modalContainer}
            presentationStyle="overFullScreen"
            onBackdropPress={() => {
              setOverlay({
                type: "",
                visible: false,
              });
            }}
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
                  type: "",
                  visible: false,
                });
              }}
            ></Invite>
          </Modal>
        </>
      )}
      <Modal
        isVisible={!!appState.openProfileModal}
        style={styles.modalContainer}
        presentationStyle="overFullScreen"
        onBackdropPress={() => {
          dispatch(
            updateApp({
              openProfileModal: "",
            })
          );
        }}
        animationIn="slideInUp"
      >
        <View
          style={[
            styles.safeAreaContainer,
            {
              position: "absolute",
              width: "100%",
              bottom: 0,
            },
          ]}
        >
          {!!appState.openProfileModal && (
            <ProfileOverview
              user={appState.userProfiles[appState.openProfileModal]}
              readOnly={true}
            ></ProfileOverview>
          )}
        </View>
      </Modal>
      <ActionSheet {...actionSheetProps}></ActionSheet>
      <Spinner
        visible={appState.loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
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
  spinnerTextStyle: {
    color: "white",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "5%",
    backgroundColor: theme.smoothGrey,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.background,
    alignSelf: "center",
    overflow: "hidden",
  },
  iconImage: { width: 30, height: 30 },
  modalContainer: {
    margin: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    position: "relative",
  }
});
