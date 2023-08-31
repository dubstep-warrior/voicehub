import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../shared/Input";
import { FormData } from "../shared/FormData";
import routeConfig from "../../config/route-config.json";
import theme from "../../config/theme.config.json";
import { styles as globalStyles } from "../../Styles.config";
import Error from "../shared/Error";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../../Images.config";
import ActionSheet from "react-native-actionsheet";
import actionSheetConfig from "../../config/actionSheet-config.json";
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addChat, joinChat } from "../store/actions/user.actions";
import { auth } from "../../firebase";
import { selectApp } from "../store/slices/app.slice";
import { DotIndicator } from "react-native-indicators";
import { ActionSheetConfig } from "../interfaces/ActionSheet.interface";

export default function ResolveChat(props: any) {
  const dispatch = useAppDispatch();
  const [chatType, setChatType] = useState<"new" | "existing">("new");
  const appState = useAppSelector(selectApp);
  const current = "createchat";
  const dotIndicatorConfig = {
    purple: 14.75,
    minimal: 8,
  };
  const messageLink: any = routeConfig;
  const [invalid, setFormInvalid] = useState<string | null>(null);
  const [formValues, handleFormValueChange, setFormValues, reset, replaceForm] =
    FormData(messageLink[current][chatType].form, setFormInvalid);

  useEffect(() => {
    replaceForm(messageLink[current][chatType].form);
  }, [chatType]); 

  const actionSheetRef = useRef<ActionSheet>(null);
  const options = (actionSheetConfig as ActionSheetConfig)[current]['image'];
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
            quality: 0
          })
        : ImagePicker.launchCameraAsync());

      if (!result.canceled) {
        handleFormValueChange("chat_img", result.assets[0]);
      }
    },
  };

  const submit = async () => {
    if (chatType == "new") {
      if (!formValues["name"]) {
        setFormInvalid("Please fill in your chat's name");
      } else {
        await dispatch(
          addChat({
            ...formValues,
            owner: auth.currentUser?.uid,
            users: [auth.currentUser?.uid],
            type: "chat",
          })
        );
        if (props.onSubmit) {
          props.onSubmit();
        }
      }
    } else if (chatType == "existing") {
      if (!formValues["chat_id"]) {
        setFormInvalid("Please fill in the chat ID");
      } else {
        await dispatch(joinChat(formValues));
        if (props.onSubmit) {
          props.onSubmit();
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ padding: 16, gap: 12 }}>
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text style={[globalStyles.text, { fontSize: 24, fontWeight: "bold" }]}>
          {routeConfig[current][chatType].heading}
        </Text>
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: "500",
              color: theme.heading,
              textAlign: "center",
            },
          ]}
        >
          {routeConfig[current][chatType].subheading}
        </Text>
      </View>
      <View style={{ backgroundColor: theme.background, padding: 8 }}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 32,
          }}
        >
          {chatType == "new" && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 100,
                height: 100,
                alignSelf: "center",
                backgroundColor: theme.background2,
                borderRadius: 50,
                borderWidth: 2,
                borderStyle: "dashed",
                overflow: "hidden",
              }}
            >
              {formValues.chat_img && (
                <Image
                  style={styles.image}
                  source={{ uri: formValues.chat_img.uri }}
                ></Image>
              )}
              <TouchableOpacity
                style={styles.profilePicOverlay}
                onPress={() => {
                  actionSheetRef.current?.show();
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={[
                      {
                        width: 30,
                        height: 30,
                        marginBottom: 8,
                      },
                    ]}
                    source={config["upload-image"]}
                  ></Image>
                  <Text style={{ color: theme.background, fontWeight: "bold" }}>
                    UPLOAD
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ gap: 8 }}>
            <Text style={{ color: theme.heading, fontWeight: "bold" }}>
              {routeConfig[current][chatType].inputLabel}
            </Text>
            <Input
              name="Chat name"
              formKey={chatType == "new" ? "name" : "chat_id"}
              handleFormValueChange={handleFormValueChange}
              value={formValues[chatType == "new" ? "name" : "chat_id"]}
              // style="minimal"
              background="white"
            ></Input>
          </View>
        </View>
        <TouchableOpacity style={globalStyles.button} onPress={submit}>
          {appState.submitting ? (
            <DotIndicator
              size={
                dotIndicatorConfig["purple" as keyof typeof dotIndicatorConfig]
              }
              count={3}
              color={theme.lightGrey}
            />
          ) : (
            <Text
              style={{
                fontSize: 24,
              }}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
        <View style={{ width: "100%", alignItems: "center", marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setChatType(chatType == "new" ? "existing" : "new")}
          >
            <Text
              style={{
                color: theme.heading,
                textDecorationLine: "underline",
                fontSize: 14,
                textTransform: "uppercase",
              }}
            >
              {chatType == "new"
                ? "Join an existing chat"
                : "Create a new chat"}
            </Text>
          </TouchableOpacity>
        </View>
        {invalid && <Error message={invalid}></Error>}
      </View>

      <ActionSheet {...actionSheetProps}></ActionSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profilePicOverlay: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  image: {
    resizeMode: "contain",
    borderRadius: 50,
    flex: 1,
    aspectRatio: 1,
  },
});
