import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard
} from "react-native";
import config from "../../../../Images.config";

import theme from "../../../../config/theme.config.json";
import { styles as globalStyles } from "../../../../Styles.config";

import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { selectApp } from "../../../store/slices/app.slice";
import Input from "../../../shared/Input";
import routeConfig from "../../../../config/route-config.json";
import { useState, useRef } from "react";
import { FormData } from "../../../shared/FormData";
import ActionSheet from "react-native-actionsheet";
import actionSheetConfig from "../../../../config/actionSheet-config.json";
import * as ImagePicker from "expo-image-picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Default({ route, navigation }: any) {
  const current = "message";
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const selectedChat =
    userState?.chats?.[
      appState.home.selectedCat as keyof typeof userState.chats
    ]?.[appState.home.selectedSubCat as string];

  const messageLink: any = routeConfig;
  const [invalid, setFormInvalid] = useState<string | null>(null);

  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid
  );

  const actionSheetRef = useRef<ActionSheet>(null);
  const options = (actionSheetConfig as any)[current] as (
    | string
    | React.ReactNode
  )[];

  const actionSheetProps = {
    ref: actionSheetRef,
    options: options,
    cancelButtonIndex: options.length - 1,
    onPress: async (index: number): Promise<void> => {
      if (![0, 1].includes(index)) return;
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) return;

      const result = await (index == 0
        ? ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          })
        : ImagePicker.launchCameraAsync());

      if (!result.canceled) {
        handleFormValueChange("chat_img", result.assets[0]);
      }
    },
  };

  // TODO FIX KEYBOARD INPUT ISSUE
  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {/* Header */}
        <View
          style={[
            globalStyles.headingContainer,
            { justifyContent: "space-between" },
          ]}
        >
          <TouchableOpacity
            style={{ padding: 8, zIndex: 5 }}
            onPress={() => route.params.leftNavigation.openDrawer()}
          >
            <Image
              style={{ width: 32, height: 24 }}
              source={config["menu"]}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 8, zIndex: 5 }}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              style={{ width: 32, height: 24 }}
              source={config["friends-white"]}
            ></Image>
          </TouchableOpacity>
          <Text style={globalStyles.headerText}>{selectedChat?.name}</Text>
        </View>
      </SafeAreaView>
      <View style={{ backgroundColor: theme.background2, flex: 1 }}>
        <View style={{ backgroundColor: "yellow", flex: 1 }}></View>
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              backgroundColor: "red",
              padding: 12,
              flexDirection: "row",
              gap: 8,
            }}
          >
            <TouchableOpacity style={styles.button}>
              <Image
                style={styles.buttonImage}
                source={config["photo"]}
              ></Image>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Input
                name="Type your message here"
                formKey="desc"
                handleFormValueChange={handleFormValueChange}
                value={formValues["desc"]}
                style="minimal"
                background="white"
              ></Input>
            </View>
            <TouchableOpacity style={styles.button}>
              <Image
                style={styles.buttonImage}
                source={config["photo"]}
              ></Image>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flexDirection: "column",
    position: "relative",
    maxHeight: 104,
  },
  button: {
    padding: 8,
    backgroundColor: theme.background2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
});
