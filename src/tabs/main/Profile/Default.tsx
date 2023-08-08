import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Pressable,
  Platform,
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
  MaterialIndicator, 
} from "react-native-indicators";
import { Image as ExpoImage } from "expo-image";
import ProfileOverview from "../../../shared/ProfileOverview";


export default function Default({ route, navigation }: NavigationProps) {
  console.log(route);

   const userState = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
 
  const userRef = {
    ...auth.currentUser,
    ...Object(userState),
  };
  const logout = async () => {
    dispatch(AuthRemove());
  };
 
  const current = "profile"; 
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
            <ProfileOverview
            user={userState}
            readOnly={false}
            ></ProfileOverview> 

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
