import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import SimpleForm from "./../shared/SimpleForm";
import { useAppSelector } from "../store/hooks";
import { selectApp } from "../store/slices/app.slice";
import UserList from "../shared/UserList";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import theme from "./../../config/theme.config.json";
import { selectUser } from "../store/slices/user.slice";

export default function SearchUsers({ route, navigation }: NavigationProps) {
  // TODO do retrieve of email on dispatch
  const appState = useAppSelector(selectApp); 
  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SimpleForm route={route} navigation={navigation}></SimpleForm>
        {appState.users.length ? (
          <ScrollView style={{ flex: 1 }}>
            <UserList list={appState.users}></UserList>
          </ScrollView>
        ) : (
          <></>
        )}
      </View>
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
