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
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import config from "../../../../Images.config";

import theme from "../../../../config/theme.config.json";
import { styles as globalStyles } from "../../../../Styles.config";

import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { selectApp } from "../../../store/slices/app.slice";
import Input from "../../../shared/Input";
import routeConfig from "../../../../config/route-config.json";
import React, { useState, useRef, useEffect, Ref } from "react";
import { FormData } from "../../../shared/FormData";
import ActionSheet from "react-native-actionsheet";
import actionSheetConfig from "../../../../config/actionSheet-config.json";
import * as ImagePicker from "expo-image-picker";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { Icon } from "react-native-elements";
import { addMessage } from "../../../store/actions/user.actions";
import { ImageGallery } from '@georstat/react-native-image-gallery';

export default function Default({ route, navigation }: any) {
  const current = "message";
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const dispatch = useAppDispatch();
  const selectedChat =
    userState?.chats?.[
    appState.home.selectedCat as keyof typeof userState.chats
    ]?.[appState.home.selectedSubCat as string];
  const messages = appState.messages[appState.home.selectedSubCat as any];
  console.log("messages now", messages);
  const messageLink: any = routeConfig;
  const [invalid, setFormInvalid] = useState<string | null>(null);

  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid
  );

  useEffect(() => {
    reset();
  }, [appState]);
  const scrollViewRef = useRef<ScrollView>(null);
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
        handleFormValueChange("images", [
          ...formValues["images"],
          result.assets[0],
        ]);
      }
    },
  };

  //TODO SETTLE SEND MESSAGE
  const submit = async () => {
    if (formValues && appState.home.selectedSubCat) {
      await dispatch(addMessage(formValues, appState.home.selectedSubCat));
      scrollViewRef.current?.scrollToEnd();
    }
  };

  const [closeToBottom, setCloseToBottom] = useState(false)
  // const [gallery, setGallery] = useState<null | any[]>(null)
  const gallery = useRef<null | any[]>(null)
  const setIsCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    setCloseToBottom(layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom)
  };

  useEffect(() => {
    if (closeToBottom) {
      scrollViewRef.current?.scrollToEnd();
    }
  }, [messages]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollToEnd();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ android: undefined, ios: "height" })}
      keyboardVerticalOffset={useHeaderHeight()}
      style={{ flex: 1 }}
    >
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
            onPress={() => {
              Keyboard.dismiss();
              route.params.leftNavigation.openDrawer();
            }}
          >
            <Image
              style={{ width: 32, height: 24 }}
              source={config["menu"]}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 8, zIndex: 5 }}
            onPress={() => {
              Keyboard.dismiss();
              navigation.openDrawer();
            }}
          >
            <Image
              style={{ width: 32, height: 24 }}
              source={config["friends-white"]}
            ></Image>
          </TouchableOpacity>
          <Text style={globalStyles.headerText}>{selectedChat?.name}</Text>
        </View>
      </SafeAreaView>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1, backgroundColor: theme.background2 }}>
          <ScrollView style={{ flex: 1 }} ref={scrollViewRef}
            onScroll={({ nativeEvent }) => {
              setIsCloseToBottom(nativeEvent as any)
            }}
            scrollEventThrottle={30}
          >
            {!!messages &&
              !!messages.length &&
              messages.map((message: any, index: number) => (
                <View
                  key={message.id}
                  style={[
                    {
                      flexDirection: "row",
                      padding: 12,
                      gap: 8,
                    },
                    index !== messages.length - 1 && { borderBottomWidth: 0.4 },
                  ]}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                      }}
                      source={{
                        uri: appState.userProfiles[message?.by].profile_img,
                      }}
                    ></Image>
                  </View>
                  <View style={{ justifyContent: "space-between" }}>
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                        padding: 4,
                      }}
                    >
                      {appState.userProfiles[message?.by].displayedName}
                    </Text>
                    <Text style={{ color: "black", padding: 4, marginBottom: 12 }}>
                      {message.desc}
                    </Text>
                    {/* IMAGE GALLERY HERE : TODO FIND BETTER IMAGE GALLERY THIS ONE TOO MANY PROBLEMS*/}
                    {!!message?.images?.length && <TouchableOpacity onPress={() => {gallery.current = message.images}} style={{ flexDirection: 'row', flexWrap: 'wrap', width: '90%', padding: 1, gap: 1, backgroundColor: 'white', justifyContent: 'space-between' }}>
                      {message?.images?.map((image: string) => (
                        <Image style={{ height: message?.images?.length > 1 ? 100 : 200, width: message?.images?.length > 1 ? '49.5%' : '100%' }} source={{ uri: image }}></Image>
                      ))}
                    </TouchableOpacity>}
                    {!!gallery.current?.length && <ImageGallery 
                      close={() => gallery.current = null} isOpen={!!gallery} images={gallery.current?.map((image: string) => { return { url: image } })} />
                    }
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: theme.background,
            padding: 12,
          }}
        >
          {/* ADD CAROUSEL HERE? */}
          {!!formValues.images.length && (
            <View style={{ marginBottom: 12 }}>
              <ScrollView horizontal={true}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {formValues.images.map((image: any, index: number) => (
                    <Image
                      key={index}
                      style={{ width: 120, height: 100 }}
                      source={{ uri: image.uri }}
                    ></Image>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              zIndex: 3,
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.show()}
              style={styles.button}
            >
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
                multiline={true}
              ></Input>
            </View>
            <TouchableOpacity style={[styles.button]} onPress={submit}>
              {/* <Image
                style={styles.buttonImage}
                source={config["send"]}
              ></Image> */}
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ActionSheet {...actionSheetProps}></ActionSheet>
    </KeyboardAvoidingView>
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
    backgroundColor: theme.background2,
    width: 30,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
});
