import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import Input from "../shared/Input";
import { FormData } from "../shared/FormData";
import routeConfig from "../../config/route-config.json";
import { useAppDispatch } from "./../store/hooks";
import { resolveAccess } from "../store/actions/auth.actions";
import theme from "./../../config/theme.config.json";
import { styles as globalStyles } from "../../Styles.config";
import Error from "../shared/Error";
import ButtonBody from "../shared/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleForm from "../shared/SimpleForm";
import Button from "../shared/Button";

export default function CreateChat() {
  const submit = async () => {};

  return (
    <SafeAreaView style={{ flex: 0.6, padding: 16 }}>
      <View style={{ backgroundColor: theme.background, padding: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        > 
          <Button
            onPress={submit}
            text={"Submit"}
            theme="minimal"
          ></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
