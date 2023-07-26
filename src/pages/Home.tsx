import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { assign, selectAuth } from "../store/auth/auth.slice";
import * as SecureStore from "expo-secure-store";
import { AuthRemove } from "../store/auth/auth.actions";

export default function Home({ route, navigation }: NavigationProps) {
  const authState = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const logout = async () => {
     dispatch(AuthRemove(authState.token))
  };

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
      <TouchableOpacity
            style={{
              width: "100%",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "center",
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#F99C9C",
              marginBottom: 12,
            }}
            onPress={() => logout()}
          >
            <Text
              style={{
                fontSize: 24,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#6A6A6A",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
});
