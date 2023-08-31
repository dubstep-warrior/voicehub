import { StyleSheet, Text, View } from "react-native";
import theme from "../../../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectUser,
  updateUserChat,
} from "../../../../store/slices/user.slice";
import { NavigationProps } from "../../../../interfaces/NavigationProps.interface";
import UserList from "../../../../shared/UserList";
import {
  selectApp,
  update as updateApp,
} from "../../../../store/slices/app.slice";
import { useRef } from "react";
import ActionSheet from "react-native-actionsheet";
import {
  acceptRequest,
  rejectRequest,
  removeFriend,
  removeRequest,
} from "../../../../store/actions/user.actions";
import { auth } from "../../../../../firebase";
import {
  Connection,
  Connections,
  UID,
  VHUser,
} from "../../../../interfaces/VHUser";

export default function ConnectionsTab({ route, navigation }: NavigationProps) {
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const dispatch = useAppDispatch();
  const selectedUser = useRef<any>(null);

  const friendsConfig = {
    friends: {
      empty: "friends",
      actionSheetProps: {
        ref: useRef<ActionSheet>(null),
        options: ["Send Message", "Remove Friend", "Cancel"],
        cancelButtonIndex: 2,
        onPress: async (index: number): Promise<void> => {
          if ([0].includes(index) && selectedUser.current) {
            const existingChatID = Object.keys(userState.chats.dms).find(
              (chatID) => {
                return (userState.chats.dms[chatID]?.users ?? []).includes(
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
            } else {
              const dms: any = {};
              dms[`temp-${selectedUser.current.uid}`] = {
                users: [auth.currentUser!.uid, selectedUser.current.uid],
                type: "dms",
              };
              dispatch(
                updateUserChat({
                  chat: {
                    dms: dms,
                  },
                })
              );
              dispatch(
                updateApp({
                  home: {
                    selectedCat: "dms",
                    selectedSubCat: `temp-${selectedUser.current.uid}`,
                  },
                })
              );

              navigation.navigate("Main", {
                screen: "Home",
                params: {
                  screen: "Chat",
                  drawerStatus: "closed",
                  params: {
                    screen: "Default",
                  },
                },
              });
            }
          } else if ([1].includes(index)) {
            dispatch(removeFriend(selectedUser.current));
          }
        },
      },
    },
    requests: {
      empty: "friend requests",
      actionSheetProps: {
        ref: useRef<ActionSheet>(null),
        options: ["Accept Request", "Reject Request", "Cancel"],
        cancelButtonIndex: 2,
        onPress: async (index: number): Promise<void> => {
          if ([0].includes(index)) {
            // ACCEPT REQUEST
            dispatch(acceptRequest(selectedUser.current));
          }
          if ([1].includes(index)) {
            // Reject request
            dispatch(rejectRequest(selectedUser.current));
          }
        },
      },
    },
    pending: {
      empty: "outgoing requests",
      actionSheetProps: {
        ref: useRef<ActionSheet>(null),
        options: ["Remove Request", "Cancel"],
        cancelButtonIndex: 1,
        onPress: async (index: number): Promise<void> => {
          if ([0].includes(index)) {
            dispatch(removeRequest(selectedUser.current));
          }
        },
      },
    },
  };
  const current: keyof Connections = route.name.toLowerCase() as keyof Connections;
  const currentActionSheetProps =
    friendsConfig[current as keyof typeof friendsConfig].actionSheetProps;

  const tappedUser = (user: any) => {
    selectedUser.current = user;
    currentActionSheetProps.ref.current!.show();
  };

  const users: Connection[] = userState[current] ?? [];

  return (
    <>
      {!!users.length ? (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme.smoothGrey,
          }}
        >
          <UserList
            identifier="uid"
            list={users.map((ref: Connection) => {
              return { uid: ref.uid, ...appState.userProfiles[ref.uid] };
            })}
            onPress={(user) => tappedUser(user)}
          ></UserList>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {`You have no ${
              friendsConfig[current as keyof typeof friendsConfig].empty
            }`}
          </Text>
          <Text
            style={{
              color: theme.heading,
              maxWidth: "80%",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {"Press the add friend icon on the top right to get started".toUpperCase()}
          </Text>
        </View>
      )}
      <ActionSheet {...currentActionSheetProps}></ActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.smoothGrey,
    minHeight: "100%",
  },
});
