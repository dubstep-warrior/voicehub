import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Pressable,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AuthRemove } from "../../../store/actions/auth.actions";
import theme from "../../../../config/theme.config.json";
import actionSheetConfig from "../../../../config/actionSheet-config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../../../../Images.config";
import { useRef, useState, useEffect } from "react";
import ActionSheet from "react-native-actionsheet";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import * as ImagePicker from "expo-image-picker";
import { selectUser } from "../../../store/slices/user.slice";
import routeConfig from "../../../../config/route-config.json";
import Input from "../../../shared/Input";
import { FormData } from "../../../shared/FormData";
import { UserUpdate } from "../../../store/actions/user.actions";
import { styles as globalStyles } from "../../../../Styles.config";
import { ScrollView } from "react-native-gesture-handler";
import { auth } from "../../../../firebase";
import ButtonBody from "../../../shared/Button";
import { selectApp } from "../../../store/slices/app.slice";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

export default function Default({ route, navigation }: NavigationProps) {
  console.log(route);

  const [editMode, setEditMode] = useState(false);
  const userState = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const appState = useAppSelector(selectApp);

  const userRef = {
    ...auth.currentUser,
    ...Object(userState),
  };
  const logout = async () => {
    dispatch(AuthRemove());
  };

  const messageLink: any = routeConfig;
  const current = "profile";

  const actionSheetRef = useRef<ActionSheet>(null);
  const actionSheetProps = {
    ref: actionSheetRef,
    options: (actionSheetConfig as any)[current]["profile_img"] as (
      | string
      | React.ReactNode
    )[],
    cancelButtonIndex: 2,
    onPress: async (index: number): Promise<void> => {
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
        handleFormValueChange("profile_img", result.assets[0]);
      }
    },
  };

  const [invalid, setFormInvalid] = useState(false);
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid,
    Object(userState)
  );

  useEffect(() => {
    if (editMode == false) return;
    reset();
  }, [editMode]);

  const submitProfileForm = async () => {
    if (invalid) return;
    console.log("clear invalid check, time to run dispatch", Object(userState));
    dispatch(UserUpdate(formValues, Object(userState), setEditMode));
  };

  const updateField = (key: any) => {
    navigation.navigate("UpdateField", {
      ...key,
      heading: `Update ${key.name.toLowerCase()} here:`.toUpperCase(),
    });
  };
  return (
    userState && (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.profileBanner}>
              <View style={styles.bannerLeft}>
                <View
                  style={{
                    position: "relative",
                    borderRadius: 50,
                    overflow: "hidden",
                    width: 80,
                    height: 80,
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      userState.profile_img || formValues.profile_img
                        ? {
                            uri:
                              formValues.profile_img.uri ??
                              userState.profile_img,
                          }
                        : config["profile-white"]
                    }
                  ></Image>
                  {editMode && (
                    <TouchableOpacity
                      style={styles.profilePicOverlay}
                      onPress={() => {
                        actionSheetRef.current?.show();
                      }}
                    >
                      <Image
                        style={[
                          styles.image,
                          {
                            margin: 20,
                          },
                        ]}
                        source={config["upload-image"]}
                      ></Image>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={[
                    styles.profileTextContainer,
                    { marginTop: editMode ? 0 : 4 },
                  ]}
                >
                  {editMode ? (
                    <>
                      <Input
                        name="Username"
                        formKey="username"
                        handleFormValueChange={handleFormValueChange}
                        value={formValues["username"]}
                        style="minimal"
                      />
                      <Input
                        name="Display Name"
                        formKey="displayedName"
                        handleFormValueChange={handleFormValueChange}
                        value={formValues["displayedName"]}
                        style="minimal"
                      />
                    </>
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.text,
                          { fontSize: 24, fontWeight: "bold", color: "white" },
                        ]}
                      >
                        {userState.username}
                      </Text>
                      <Text
                        style={[styles.text, { fontSize: 16, color: "white" }]}
                      >
                        {userState.displayedName ?? ""}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <View style={{ gap: 4 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.black,
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                  }}
                  onPress={() => setEditMode(!editMode)}
                >
                  <Image
                    style={{ width: 12, height: 12 }}
                    source={config[editMode ? "close" : "edit"]}
                  ></Image>
                </TouchableOpacity>
                {editMode && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.black,
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                    }}
                    onPress={() => submitProfileForm()}
                  >
                    {appState.submitting ? (
                      <MaterialIndicator
                        color="white"
                        size={12}
                      ></MaterialIndicator>
                    ) : (
                      <Image
                        style={{ width: 12, height: 12 }}
                        source={config["green-tick"]}
                      ></Image>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{ width: "100%", flex: 1 }}>
              <View style={{ margin: 12 }}>
                <Text style={styles.text}>STATUS</Text>
              </View>
              <Pressable
                onPress={() => setEditMode(!editMode)}
                style={{
                  backgroundColor: theme.smoothGrey,
                  flex: 1,
                  padding: 12,
                  position: "relative",
                  minHeight: 150,
                }}
              >
                {editMode ? (
                  <Input
                    name="Status"
                    formKey="status"
                    handleFormValueChange={handleFormValueChange}
                    value={formValues["status"]}
                    style="minimalTextarea"
                    multiline={true}
                    numberOfLines={4}
                  />
                ) : (
                  <>
                    <Text style={{ color: "white" }}>
                      {userState.status ?? ""}
                    </Text>
                    <Image
                      style={{
                        width: 12,
                        height: 12,
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                      }}
                      source={config["edit"]}
                    ></Image>
                  </>
                )}
              </Pressable>
            </View>
            {routeConfig[current].sections.map((section) => (
              <View
                style={{ width: "100%", marginBottom: 8 }}
                key={section.heading}
              >
                <View style={{ margin: 12 }}>
                  <Text style={styles.text}>
                    {section.heading.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.selectionContainer}>
                  {section.options.map((option) => (
                    <TouchableHighlight
                      key={option.key}
                      onPress={() => updateField(option)}
                      activeOpacity={0.6}
                      underlayColor="rgba(0, 0, 0, 0.266)"
                      style={styles.selection}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          {option.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "500",
                              color: theme.heading,
                            }}
                          >
                            {userRef[option.key]}
                          </Text>
                          <Image
                            style={{
                              width: 24,
                              height: 24,
                            }}
                            source={config["arrow-right"]}
                          ></Image>
                        </View>
                      </View>
                    </TouchableHighlight>
                  ))}
                </View>
              </View>
            ))}
            <View style={{ width: "80%" }}>
              <ButtonBody text={"Logout"} onPress={() => logout()}></ButtonBody>
            </View>
          </View>
        </ScrollView>
        <ActionSheet {...actionSheetProps}></ActionSheet>
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
  },
  container: {
    backgroundColor: theme.background,
    flex: 1,
    gap: 16,
    alignItems: "center",
  },
  profileBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    width: "100%",
    gap: 12,
  },
  bannerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    gap: 12,
    flex: 1,
  },
  profileTextContainer: {
    flexDirection: "column",
    gap: 12,
    flex: 1,
  },
  text: {
    color: theme.heading,
    fontWeight: "600",
  },
  selectionContainer: {
    backgroundColor: theme.smoothGrey,
    flexDirection: "column",
    width: "100%",
  },
  selection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: "100%",
    borderBottomWidth: 0.4,
  },
  // TODO FIX OVERLAY OPACITY ISSUE
  profilePicOverlay: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255, 0.3)",
    borderRadius: 50,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    flex: 1,
    aspectRatio: 1,
  },
});
