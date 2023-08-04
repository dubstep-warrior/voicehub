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
  ImageProps,
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
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { Header, Icon } from "react-native-elements";
import { addChat, addMessage } from "../../../store/actions/user.actions";
import Modal from "react-native-modal";
import { Image as ExpoImage } from "expo-image";
import {
  ImageGallery,
  ImageObject,
} from "@georstat/react-native-image-gallery";
// import Gallery from "react-native-image-gallery";
import AnimatedGallery from "@akumzy/react-native-animated-gallery";
import { auth } from "../../../../firebase";
import { MaterialIndicator } from "react-native-indicators";
// import Gallery from "react-native-image-gallery";

export default function Default({ route, navigation }: any) {
  const current = "message";
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  const dispatch = useAppDispatch();
  const [selectedChat, setSelectedChat] = useState<any>(null)
     

  
  useEffect(() => {
    setSelectedChat(userState?.chats?.[
      appState.home.selectedCat as keyof typeof userState.chats
    ]?.[appState.home.selectedSubCat as string])
    
    console.log('selected CHAT', selectedChat)
  }, [userState, appState])

  // console.log("messages now", messages);
  const messageLink: any = routeConfig;
  const [invalid, setFormInvalid] = useState<string | null>(null);

  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid
  );

  useEffect(() => {
    reset();
  }, [appState.home]);

  const scrollViewRef = useRef<FlatList>(null);
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
            quality: 0,
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
      // CHECK CHAT EXIST
      if (
        appState.home.selectedSubCat?.includes("temp") &&
        appState.home.selectedSubCat.split("-")[0] == "temp"
      ) {
        const res = await dispatch(
          addChat({
            users: [
              auth.currentUser?.uid,
              appState.home.selectedSubCat.split("-")[1],
            ],
            type: "dms",
          })
        );
        await dispatch(addMessage(formValues, res?.data.id));
      } else {
        await dispatch(addMessage(formValues, appState.home.selectedSubCat));
      }
      reset()
      scrollViewRef.current?.scrollToEnd();
    }
  };

  const [scrollViewPostion, setScrollViewPosition] = useState();
  const [closeToBottom, setCloseToBottom] = useState(false);
  const [gallery, setGallery] = useState<any[] | null>(null);
  // const gallery = useRef<null | any[]>(null);
  const setIsCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    setCloseToBottom(
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
    setScrollViewPosition(contentOffset.y);
  };
 

  useEffect(() => {
    if (closeToBottom) {
      scrollViewRef.current?.scrollToEnd();
    }
  }, [appState.messages[appState.home.selectedSubCat as any]]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd();
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      scrollViewRef.current?.scrollToEnd();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const GalleryImage = (image: ImageObject) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ExpoImage
          style={{
            width: "100%",
            height: "100%",
          }}
          source={image.url}
          cachePolicy={"memory-disk"}
          contentFit="contain"
        ></ExpoImage>
      </View>
    );
  };

  const renderHeaderComponent = () => {
    return (
      <SafeAreaView
        style={{ position: "absolute", top: 0, width: "100%", zIndex: 7 }}
      >
        <View
          style={{
            width: "100%",
            padding: 16,
            marginTop: 48,
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => setGallery(null)}
            style={{ padding: 8, borderRadius: 16 }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={config["close"]}
            ></Image>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ android: undefined, ios: "height" })}
      keyboardVerticalOffset={useHeaderHeight()}
      style={{ flex: 1 }}
    >
      {!!gallery?.length && (
        <Modal
          isVisible={!!gallery?.length}
          onSwipeComplete={() => setGallery(null)}
          swipeDirection="up"
          style={{
            // flex: 0.2,
            // position: 'absolute',
            // bottom: 0,
            // width: '100%',
            margin: 0,
            // borderRadius: 20,
            backgroundColor: "rgba(0,0,0,0.2)",
            position: "relative",
          }}
          presentationStyle="overFullScreen"
          onBackdropPress={() => {
            setGallery(null);
          }}
          // transparent={false}
          // hasBackdrop={false}
          // animated
          animationIn="slideInUp"
        >
          {/* <AnimatedGallery
            imageUrls={gallery}
            disablefullScreen={false}
            thumbBorderWidth={3}
            thumbBorderColor={"white"}
            spacing={8}
            imageSize={90}
            backgroundColor={"#000000"}
            onEndReached={() => {
              console.log("yay! end reached");
            }}
            invertThumbDirection={false}
            invertGalleryDirection={false}
          /> */}
          {/* <Gallery images={gallery} imageComponent={GalleryImage}></Gallery> */}
          <ImageGallery
            close={() => setGallery(null)}
            hideThumbs
            images={gallery}
            isOpen={!!gallery?.length}
            renderCustomImage={GalleryImage}
            renderHeaderComponent={renderHeaderComponent}
          ></ImageGallery>
        </Modal>
      )}
      <>
        <SafeAreaView style={[styles.safeAreaContainer]}>
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
            <Text style={globalStyles.headerText}>
              {selectedChat?.type == "chat"
                ? selectedChat?.name
                : appState?.userProfiles?.[
                    selectedChat?.users.find(
                      (userID: string) => userID !== auth.currentUser!.uid
                    )
                  ]?.displayedName}
            </Text>
          </View>
        </SafeAreaView>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ flex: 1, backgroundColor: theme.background2 }}>
            
            {!!appState.messages[appState.home.selectedSubCat as any] && !!appState.messages[appState.home.selectedSubCat as any].length && (
              <FlatList
                ref={scrollViewRef}
                data={appState.messages[appState.home.selectedSubCat as any]}
                renderItem={({ item, index }) => (
                  <View
                    key={item.id}
                    style={[
                      {
                        flexDirection: "row",
                        padding: 12,
                        gap: 8,
                      },
                      index !== appState.messages[appState.home.selectedSubCat as any].length - 1 && {
                        borderBottomWidth: 0.4,
                      },
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
                      <ExpoImage
                        style={{
                          width: 60,
                          height: 60,
                        }}
                        source={appState.userProfiles[item?.by].profile_img}
                        cachePolicy={"memory-disk"}
                      ></ExpoImage>
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
                        {appState.userProfiles[item?.by].displayedName}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          padding: 4,
                          marginBottom: 12,
                        }}
                      >
                        {item.desc}
                      </Text>
                      {!!item?.images?.length && (
                        <TouchableOpacity
                          onPress={() => {
                            setGallery(item.images);
                          }}
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width: "90%",
                            padding: 1,
                            gap: 1,
                            backgroundColor: "white",
                            justifyContent: "space-between",
                          }}
                        >
                          {item?.images?.map((image: any, index: number) => (
                            <ExpoImage
                              key={index + image}
                              style={{
                                height: item?.images?.length > 1 ? 100 : 200,
                                width:
                                  item?.images?.length > 1 ? "49.5%" : "100%",
                              }}
                              source={image.uri}
                              // cachePolicy={"memory-disk"}
                            ></ExpoImage>
                          ))}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
                keyExtractor={(message) => message.id}
              />
            )}
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
                {appState.submitting ? (
                  <MaterialIndicator
                    color="white"
                    size={12}
                  ></MaterialIndicator>
                ) : (
                  <Icon name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ActionSheet {...actionSheetProps}></ActionSheet>
      </>
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
