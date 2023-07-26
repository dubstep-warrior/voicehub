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
import { useRef, useState } from "react";
// import { ActionSheetRef } from "react-native-actionsheet";
import ActionSheet from "react-native-actionsheet";
import { NavigationProps } from "../../interfaces/NavigationProps.interface";
// TODO TO SOLVE THIS TYPE ISSUE
import { ActionSheetProps } from "react-native-actionsheet";
 

export default function Profile({ route }: NavigationProps) {
  console.log(route.name);
  const [editMode, setEditMode] = useState(false);
  const authState = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const [count, setCount] = useState(0);
  const onPress = () => setCount(count + 1);

  const logout = async () => {
    dispatch(AuthRemove(authState.token));
  };

  const actionSheetRef = useRef<ActionSheet>(null);
  const actionSheetProps: ActionSheetProps = {
    ref: actionSheetRef,
    options: (actionSheetConfig as any)[route.name.toLowerCase()][
      "profile_img"
    ] as (string | React.ReactNode)[],
    cancelButtonIndex: 2,
    onPress: (index: number): void => {},
  }; 


  const handleUploadPhoto = () => { 
  };

  return (
    authState.token &&
    authState.user && (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <View style={styles.profileBanner}>
            <View style={styles.bannerLeft}>
              <View style={{ position: "relative" }}>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={config["profile-white"]}
                ></Image>
                {editMode && (
                  <TouchableOpacity
                    style={styles.profilePicOverlay}
                    onPress={() => {
                      actionSheetRef.current?.show();
                    }}
                  >
                    <Image
                      style={{ width: 100, height: 100, opacity: 3 }}
                      source={config["add"]}
                    ></Image>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.profileTextContainer}>
                <Text
                  style={[styles.text, { fontSize: 24, fontWeight: "bold" }]}
                >
                  {authState.user.email}
                </Text>
                <Text style={[styles.text, { fontSize: 16 }]}>
                  {authState.user.status ?? ""}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.black,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                }}
                onPress={() => setEditMode(true)}
              >
                <Image
                  style={{ width: 15, height: 15 }}
                  source={config["edit"]}
                ></Image>
              </TouchableOpacity>
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
        <ActionSheet
          {...actionSheetProps}
        >
          <TouchableHighlight
            style={{ padding: 24, width: '100%', alignItems: 'center' }}
            onPress={onPress}
            activeOpacity={0.6}
            underlayColor="rgba(0, 0, 0, 0.266)"
          >
            <Text style={[{ fontSize: 16, fontWeight: "600" }]}>
        
            </Text>
          </TouchableHighlight>
        </ActionSheet>
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
  },
  bannerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 12,
  },
  profileTextContainer: {
    marginTop: 12,
    flexDirection: "column",
    gap: 12,
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
  },
});
