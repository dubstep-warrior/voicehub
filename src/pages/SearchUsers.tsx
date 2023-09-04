import {
  ScrollView
} from "react-native-gesture-handler";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import SimpleForm from "./../shared/SimpleForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectApp } from "../store/slices/app.slice";
import UserList from "../shared/UserList";
import { Animated, Keyboard, Pressable, StyleSheet, View } from "react-native";
import theme from "./../../config/theme.config.json";
import { selectUser } from "../store/slices/user.slice";
import ActionSheet from "react-native-actionsheet";
import { useRef } from "react";
import actionSheetConfig from "../../config/actionSheet-config.json";
import { addUser, removeFriend } from "../store/actions/user.actions";
import { UserListUser } from "../interfaces/VHUser";
import { ActionSheetProps } from "../interfaces/ActionSheet.interface";

export default function SearchUsers({ route, navigation }: NavigationProps) {
  const dispatch = useAppDispatch();
  const appState = useAppSelector(selectApp);
  const userState = useAppSelector(selectUser);
  const selectedUser = useRef<UserListUser | null>(null);
  const actionSheetRefNew = useRef<ActionSheet>(null);
  const actionSheetRefExisting = useRef<ActionSheet>(null);
  const actionSheetPropsNew: ActionSheetProps = {
    ref: actionSheetRefNew,
    options: (actionSheetConfig as any)[route.name.toLowerCase()]["new"],
    cancelButtonIndex:
      (actionSheetConfig as any)[route.name.toLowerCase()]["new"].length -
      1,
    onPress: async (index: number): Promise<void> => {
      Animated.event(
        [],
        { useNativeDriver: true } // Add this line
      )
      if ([0].includes(index)) {
        dispatch(addUser(selectedUser.current));
      }
    },
  }


  const actionSheetPropsExisting: ActionSheetProps = {
    ref: actionSheetRefExisting,
    options: (actionSheetConfig as any)[route.name.toLowerCase()][
      "existing"
    ],
    cancelButtonIndex:
      (actionSheetConfig as any)[route.name.toLowerCase()]["existing"]
        .length - 1,
    onPress: async (index: number): Promise<void> => {
      Animated.event(
        [],
        { useNativeDriver: true } // Add this line
      )
      if ([0].includes(index)) {
        const friend = userState.friends?.find((connection) => connection.uid == selectedUser.current?.uid)
        dispatch(removeFriend(friend));
      }
    }
  }

  const userSelected = (user: UserListUser) => {
    selectedUser.current = user;
    if (userState.friends?.some((connection) => connection.uid == user.uid)) {
      // FRIEND ALREADY EXIST
      // TODO SET ONPRESS TO REMOVE FRIEND
      actionSheetPropsExisting.ref.current?.show()
    } else
      actionSheetPropsNew.ref.current?.show()
  };  

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SimpleForm route={route} navigation={navigation}></SimpleForm>
        {!!appState.users.length && (
          <ScrollView style={{ flex: 1 }}>
            <UserList
              identifier="uid"
              onPress={(user) => userSelected(user)}
              list={appState.users}
            ></UserList>
          </ScrollView>
        )}
      </View>
      <ActionSheet
        {...actionSheetPropsNew}
      ></ActionSheet>
      <ActionSheet
        {...actionSheetPropsExisting}
      ></ActionSheet>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    width: "100%",
    flex: 1,
    padding: 12,
  },
});
