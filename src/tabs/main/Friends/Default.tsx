import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import config from "../../../../Images.config";
import { styles as globalStyles } from "../../../../Styles.config";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { NavigationProps } from "../../../interfaces/NavigationProps.interface";
import UserList from "../../../shared/UserList";
import { selectApp } from "../../../store/slices/app.slice";

export default function Default({ route, navigation }: NavigationProps) {
  const userState = useAppSelector(selectUser);
  const appState = useAppSelector(selectApp);
  console.log(Boolean(userState.friends?.length));
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View
        style={{
          padding: 12,
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          zIndex: 2
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          Friends
        </Text>
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() =>
            navigation.navigate("AddFriend", {
              key: "username",
              heading: "FiND A USER HERE:",
              submit: "Search"
            })
          }
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={config["add-user"]}
          ></Image>
        </TouchableOpacity>
      </View>

      {Boolean(userState.friends?.length) ? (
        <ScrollView
          style={{ 
            flex: 1
          }}
        >
          {/* {userState.friends!.map((friend) => (
            <TouchableOpacity
              key={friend.uid}
              style={{
                flexDirection: "row",
                gap: 8,
                padding: 10,
                alignItems: "center",
                borderBottomWidth: 0.3,
                borderBottomColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Image
                style={globalStyles.icon}
                source={config["profile-grey"]}
              ></Image>
              <View
                style={{
                  gap: 8,
                  maxWidth: "60%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {friend.displayedName}
                </Text>
                <Text
                  style={{
                    color: theme.heading,
                    fontWeight: "500",
                  }}
                  numberOfLines={1}
                >
                  {friend.status}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.background,
                    width: 35,
                    height: 35,
                    borderRadius: 17,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    source={config["more"]}
                  ></Image>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))} */}
          <UserList list={userState.friends as any[]}></UserList>
        </ScrollView>
      ) : (
        <View
          style={{ 
            alignItems: "center",
            justifyContent: "center",
            gap: 8, 
            backgroundColor:  theme.smoothGrey, 
            minHeight: '100%',
          }}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            You have no friends!
          </Text>
          <Text
            style={{
              color: theme.heading,
              maxWidth: "80%",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {"Press the add friend icon on the top right to get started".toUpperCase()}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
    flexDirection: "column",
    position: 'relative' 
  },
});
