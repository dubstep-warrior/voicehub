import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import SimpleForm from "./../shared/SimpleForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectApp } from "../store/slices/app.slice";
import UserList from "../shared/UserList";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import theme from "./../../config/theme.config.json";
import { selectUser } from "../store/slices/user.slice";
import ActionSheet from "react-native-actionsheet";
import { useEffect, useRef, useState } from "react";
import actionSheetConfig from "../../config/actionSheet-config.json";
import { addUser, removeFriend } from "../store/actions/user.actions";
import { UserListUser } from "../interfaces/VHUser";
import { ActionSheetProps } from "../interfaces/ActionSheet.interface";

export default function SearchUsers({ route, navigation }: NavigationProps) {
  const dispatch = useAppDispatch();
  const appState = useAppSelector(selectApp);
  const userState = useAppSelector(selectUser); 
  const selectedUser = useRef<UserListUser | null>(null);
  const actionSheetRef = useRef<ActionSheet>(null);

  const [actionSheetProps, setActionSheetProps] = useState<ActionSheetProps>({
    ref: actionSheetRef,
    options: (actionSheetConfig as any)[route.name.toLowerCase()]["new"],
    cancelButtonIndex:
      (actionSheetConfig as any)[route.name.toLowerCase()]["new"].length - 1,
    onPress: async (index: number): Promise<void> => {
      if ([0].includes(index)) {
        dispatch(addUser(selectedUser.current));
      }
    },
  });

  const userSelected = (user: UserListUser) => {
    selectedUser.current = user;
    if (userState.friends?.some((connection) => connection.uid == user.uid)) {
      // FRIEND ALREADY EXIST
      // TODO SET ONPRESS TO REMOVE FRIEND
      setActionSheetProps({
        ref: actionSheetRef,
        options: (actionSheetConfig as any)[route.name.toLowerCase()][
          "existing"
        ],
        cancelButtonIndex:
          (actionSheetConfig as any)[route.name.toLowerCase()]["existing"]
            .length - 1,
        onPress: async (index: number): Promise<void> => {
          if ([0].includes(index)) {
            dispatch(removeFriend(selectedUser.current));
          }
        },
      });
    } else
      setActionSheetProps({
        ref: actionSheetRef,
        options: (actionSheetConfig as any)[route.name.toLowerCase()]["new"],
        cancelButtonIndex:
          (actionSheetConfig as any)[route.name.toLowerCase()]["new"].length -
          1,
        onPress: async (index: number): Promise<void> => {
          if ([0].includes(index)) {
            dispatch(addUser(selectedUser.current));
          }
        },
      }); 
     
  };


  useEffect(() => {
    // TODO FIX PREVENT FIRST TIME RENDER LOGIC
    actionSheetProps.ref?.current?.show();
  }, [actionSheetProps])


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
      <ActionSheet {...actionSheetProps}></ActionSheet>
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
