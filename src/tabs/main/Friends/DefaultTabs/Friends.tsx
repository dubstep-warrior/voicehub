import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import config from "../../../../../Images.config";
import { styles as globalStyles } from "../../../../../Styles.config";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectUser } from "../../../../store/slices/user.slice";
import { NavigationProps } from "../../../../interfaces/NavigationProps.interface";
import UserList from "../../../../shared/UserList";
import { selectApp } from "../../../../store/slices/app.slice";
import { useRef } from "react";
import ActionSheet from "react-native-actionsheet";
import { acceptRequest, rejectRequest, removeRequest } from "../../../../store/actions/user.actions";

export default function Friends({ route, navigation }: NavigationProps) {
  const userState = useAppSelector(selectUser);
  const dispatch = useAppDispatch()
  const selectedUser = useRef(null)

  const friendsConfig = {
    friends: {
      empty: "friends",
      actionSheetProps: {
        ref: useRef<ActionSheet>(null),
        options: ["Send Message","Remove Friend", "Cancel"],
        cancelButtonIndex: 2,
        onPress: async (index: number): Promise<void> => {},
      },
    },
    requests: {
      empty: "friend requests",
      actionSheetProps: {
        ref: useRef<ActionSheet>(null),
        options: ["Accept Request", "Reject Request", "Cancel"],
        cancelButtonIndex: 2,
        onPress: async (index: number): Promise<void> => {
          if([0].includes(index)) {  
            // ACCEPT REQUEST
            dispatch(acceptRequest(selectedUser.current))
          }
          if([1].includes(index)) {  
            // Reject request
            dispatch(rejectRequest(selectedUser.current))
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
          if([0].includes(index)) {  
            dispatch(removeRequest(selectedUser.current))
          }
        },
      },
    },
  };
  const current = route.name.toLowerCase();
  const currentActionSheetProps =
    friendsConfig[current as keyof typeof friendsConfig].actionSheetProps;

  const tappedUser = (user: any) => { 
    selectedUser.current = user
    currentActionSheetProps.ref.current!.show();
  };

  return (
    <>
      {Boolean(userState[current as keyof typeof userState]?.length) ? (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme.smoothGrey,
          }}
        >
          <UserList
            list={userState[current as keyof typeof userState] as any[]}
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
