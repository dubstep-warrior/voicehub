import { StyleSheet, TouchableOpacity, View, Image, Text, Pressable } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { RootStackParamList } from "../interfaces/RootStackParamList.interface";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUser } from "../store/slices/user.slice";
import { selectApp } from "../store/slices/app.slice";
import { auth } from "../../firebase";
import routeConfig from "../../config/route-config.json";
import actionSheetConfig from "../../config/actionSheet-config.json";
import ActionSheet from "react-native-actionsheet";
import * as ImagePicker from "expo-image-picker";
import { FormData } from "../shared/FormData";
import { UserUpdate } from "../store/actions/user.actions";
import config from "../../Images.config";
import Input from "./Input";
import theme from "../../config/theme.config.json";
import { 
    MaterialIndicator, 
  } from "react-native-indicators";
// interface IProfileOverviewProps {
//   styles: any;
//   route: RootStackParamList,
//   navigation: RootStackParamList
// }

export default function ProfileOverview(props: any) {
 
    const [editMode, setEditMode] = useState(false);
    const userState = useAppSelector(selectUser);
  
    const dispatch = useAppDispatch();
    const appState = useAppSelector(selectApp);
   
  
    const messageLink: any = routeConfig;
    const current = "profile";
    const options = (actionSheetConfig as any)[current]["profile_img"] as (
      | string
      | React.ReactNode
    )[]
    const actionSheetRef = useRef<ActionSheet>(null);
    const actionSheetProps = {
      ref: actionSheetRef,
      options:  options,
      cancelButtonIndex: options.length - 1,
      onPress: async (index: number): Promise<void> => {
        if(![0,1].includes(index)) return;
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



  return (
    <>
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
            <ExpoImage
              style={styles.image}
              source={
                props.user.profile_img || formValues.profile_img
                  ? formValues.profile_img?.uri ?? props.user.profile_img
                  : config["profile-white"]
              }
              cachePolicy={"memory-disk"}
            ></ExpoImage>
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
                  {props.user.username}
                </Text>
                <Text style={[styles.text, { fontSize: 16, color: "white" }]}>
                  {props.user.displayedName ?? ""}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={{ gap: 4 }}>
          {!props.readOnly && <TouchableOpacity
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
          </TouchableOpacity>}
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
                <MaterialIndicator color="white" size={12}></MaterialIndicator>
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
          onPress={() => !props.readOnly && setEditMode(!editMode)}
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
              <Text style={{ color: "white" }}>{props.user.status ?? ""}</Text>
              {!props.readOnly && <Image
                style={{
                  width: 12,
                  height: 12,
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                }}
                source={config["edit"]}
              ></Image>}
            </>
          )}
        </Pressable>
      </View>
      <ActionSheet {...actionSheetProps}></ActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
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
      profileTextContainer: {
        flexDirection: "column",
        gap: 12,
        flex: 1,
      },
      text: {
        color: theme.heading,
        fontWeight: "600",
      },
  });