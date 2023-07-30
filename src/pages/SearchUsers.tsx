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
import {useRef, useState} from "react"
import actionSheetConfig from "../../config/actionSheet-config.json";


export default function SearchUsers({ route, navigation }: NavigationProps) {
  // TODO do retrieve of email on dispatch
  const dispatch = useAppDispatch()
  const appState = useAppSelector(selectApp); 
  const selectedUser = useRef(null)
  const actionSheetRef = useRef<ActionSheet>(null);
  const options = (actionSheetConfig as any)[route.name.toLowerCase()]["user"] as (
    | string
    | React.ReactNode
  )[]
  const actionSheetProps = {
    ref: actionSheetRef,
    options:  options,
    cancelButtonIndex: options.length - 1,
    onPress: async (index: number): Promise<void> => {
      console.log(index)
      console.log(selectedUser)
      if([0].includes(index)) {
        // TODO find a way to get docid of other user
        // dispatch(addUser())
      }
    },
  };

  const userSelected = (user: any) => {
    console.log(user)
    selectedUser.current = user
    actionSheetRef.current?.show()
  }
  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SimpleForm route={route} navigation={navigation}></SimpleForm>
        {appState.users.length ? (
          <ScrollView style={{ flex: 1 }}>
            <UserList onPress={(user)=> userSelected(user)} list={appState.users}></UserList>
          </ScrollView>
        ) : (
          <></>
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
