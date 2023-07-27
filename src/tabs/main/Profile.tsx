import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AuthRemove } from "../../store/auth/auth.actions";
import { selectAuth } from "../../store/auth/auth.slice";
import theme from "./../../../config/theme.config.json";
import actionSheetConfig from "./../../../config/actionSheet-config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "./../../../Images.config";
import { useRef, useState, useEffect } from "react";
import ActionSheet from "react-native-actionsheet";
import { NavigationProps } from "../../interfaces/NavigationProps.interface";
import * as ImagePicker from "expo-image-picker";
import { selectUser, update } from "../../store/user/user.slice";
import routeConfig from "./../../../config/route-config.json";
import Input from "../../shared/Input";
import { FormData } from "../../shared/FormData";
import { UserUpdate } from "../../store/user/user.actions";

export default function Profile({ route }: NavigationProps) {
  // console.log(route.name);
  const [editMode, setEditMode] = useState(false);
  const authState = useAppSelector(selectAuth);
  const userState = useAppSelector(selectUser); 
  const dispatch = useAppDispatch();

  const [count, setCount] = useState(0);
  const onPress = () => setCount(count + 1);

  const logout = async () => {
    dispatch(AuthRemove(authState.token));
  };

  const actionSheetRef = useRef<ActionSheet>(null);
  const actionSheetProps = {
    ref: actionSheetRef,
    options: (actionSheetConfig as any)[route.name.toLowerCase()][
      "profile_img"
    ] as (string | React.ReactNode)[],
    cancelButtonIndex: 2,
    onPress: async (index: number): Promise<void> => {
      if (index == 0) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          handleFormValueChange("profile_img", result.assets[0]);
          console.log(formValues);
          // dispatch(update({ profile_img: result.assets[0].uri }));
        }
      }
    },
  };

  const messageLink: any = routeConfig;
  const current = route.name.toLowerCase();
  const [invalid, setFormInvalid] = useState(false);
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid,
    Object(userState)
  );

  useEffect(() => {
    if(editMode == false) return
    reset();
  }, [editMode]);

  const handleUploadPhoto = () => {};

  const submitProfileForm = async () => {
    if(invalid) return
    console.log('clear invalid check, time to run dispatch', Object(userState))
    dispatch(UserUpdate(formValues, Object(userState), Object(authState), setEditMode)) 
  }

  return (
    authState.token && (
      <SafeAreaView style={styles.safeAreaContainer}>
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
                      ? { uri: formValues.profile_img.uri ?? userState.profile_img }
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
                          margin: 4,
                        },
                      ]}
                      source={config["add"]}
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
                      name="Email"
                      formKey="email"
                      handleFormValueChange={handleFormValueChange}
                      value={formValues["email"]}
                      style="minimal"
                    />
                    <Input
                      name="Status"
                      formKey="status"
                      handleFormValueChange={handleFormValueChange}
                      value={formValues["status"]}
                      style="minimalTextarea"
                      multiline={true}
                      numberOfLines={4}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.text,
                        { fontSize: 24, fontWeight: "bold" },
                      ]}
                    >
                      {userState.email}
                    </Text>
                    <Text style={[styles.text, { fontSize: 16 }]}>
                      {userState.status ?? ""}
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
                  <Image
                    style={{ width: 12, height: 12 }}
                    source={config["green-tick"]}
                  ></Image>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <View style={{ margin: 12 }}>
              <Text style={styles.text}>Account Information</Text>
            </View>
            <View style={styles.selectionContainer}>
              <TouchableHighlight
                onPress={onPress}
                activeOpacity={0.6}
                underlayColor="rgba(0, 0, 0, 0.266)"
                style={styles.selection}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  Username
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={onPress}
                activeOpacity={0.6}
                underlayColor="rgba(0, 0, 0, 0.266)"
                style={styles.selection}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  Display Name
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={onPress}
                activeOpacity={0.6}
                underlayColor="rgba(0, 0, 0, 0.266)"
                style={styles.selection}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>Email</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={onPress}
                activeOpacity={0.6}
                underlayColor="rgba(0, 0, 0, 0.266)"
                style={styles.selection}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  Password
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: "90%",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "center",
              padding: 12,
              borderRadius: 12,
              backgroundColor: theme.khaki,
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
        <ActionSheet {...actionSheetProps}></ActionSheet>
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.gunmetal,
    flex: 1,
  },
  container: {
    backgroundColor: theme.gunmetal,
    flex: 1,
    gap: 24,
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
    color: "white",
  },
  selectionContainer: {
    backgroundColor: theme.almond,
    flexDirection: "column",
    width: "100%",
  },
  selection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: "100%",
  },
  // TODO FIX OVERLAY OPACITY ISSUE
  profilePicOverlay: {
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.3,
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
