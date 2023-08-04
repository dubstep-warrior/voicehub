import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions, View } from "react-native";
import Default from "./Default";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../../../config/theme.config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import {
  selectApp,
  update as updateApp,
} from "../../../store/slices/app.slice";
import UserList from "../../../shared/UserList";
import { useRef } from "react";
import ActionSheet from "react-native-actionsheet";
import StartChat from "../../../utils/StartChat";
import { auth } from "../../../../firebase";

export default function Chat({ route, navigation }: any) {
  const Drawer = createDrawerNavigator();
  if (route?.params?.drawerStatus == "closed") {
    navigation.closeDrawer();
  }

  return (
    <>
      <Drawer.Navigator
        defaultStatus={"closed"}
        screenOptions={{
          swipeEdgeWidth: Dimensions.get("window").width / 3,
          drawerStyle: {
            width: "90%",
          },
          headerShown: false,
          drawerType: "slide",
          drawerPosition: "right",
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"Default" as keyof RootStackParamList}
          component={Default}
          initialParams={{ leftNavigation: navigation }}
        />
      </Drawer.Navigator>
    </>
  );
}

const CustomDrawerContent = ({ navigation }: any) => {
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const selectedChat =
    userState?.chats?.[
      appState.home.selectedCat as keyof typeof userState.chats
    ]?.[appState.home.selectedSubCat as string];
  console.log("user selected chat: ", selectedChat);

  const dispatch = useAppDispatch();

  const selectedUser = useRef<any>(null);
  const currectActionSheetRef = useRef<ActionSheet>(null);
  const currentActionSheetProps = {
    ref: currectActionSheetRef,
    options: ["Send Message", "Cancel"],
    cancelButtonIndex: 1,
    onPress: async (index: number): Promise<void> => {
      console.log(index);
      if ([0].includes(index) && selectedUser.current) {
        // Send message
        // ENABLE SEND MESSAGE OVERLAY HERE

        const existingChatID = Object.keys(userState.chats.dms).find(
          (chatID) => {
            return userState.chats.dms[chatID].users.includes(
              selectedUser.current.uid
            );
          }
        );
        if (existingChatID) {
          dispatch(
            updateApp({
              home: {
                selectedCat: "dms",
                selectedSubCat: existingChatID,
              },
            })
          );
        } else {
          // console.log(auth.currentUser!.uid, selectedUser.current.uid)
          StartChat(selectedUser, navigation);
        }

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
      }
    },
  };

  const tappedUser = (user: any) => {
    if (user.uid !== auth.currentUser!.uid) {
      selectedUser.current = user;
      currentActionSheetProps.ref.current!.show();
    }
  };
  return (
    <View style={{ flexDirection: "row", flexGrow: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.smoothGrey,
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
          {/* TODO ENABLE SEND DMS HERE TOO */}
          <UserList
            identifier="uid"
            onPress={(user) => {
              tappedUser(user);
            }}
            list={selectedChat?.users.map((id: string) => {
              return { ...appState.userProfiles[id], uid: id };
            })}
          ></UserList>
        </SafeAreaView>
      </ScrollView>
      <ActionSheet {...currentActionSheetProps}></ActionSheet>
    </View>
  );
};
