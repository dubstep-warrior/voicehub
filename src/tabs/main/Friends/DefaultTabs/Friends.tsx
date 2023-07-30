import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import config from "../../../../../Images.config";
import { styles as globalStyles } from "../../../../../Styles.config";
import { useAppSelector } from "../../../../store/hooks";
import { selectUser } from "../../../../store/slices/user.slice";
import { NavigationProps } from "../../../../interfaces/NavigationProps.interface";
import UserList from "../../../../shared/UserList";
import { selectApp } from "../../../../store/slices/app.slice";

export default function Friends({ route, navigation }: NavigationProps) {
  const userState = useAppSelector(selectUser); 
  const messageNouns = {
    friends: "friends",
    requests: "friend requests",
    pending: "outgoing requests"
  }
  const current = route.name.toLowerCase();
  console.log(current)
  return (
    <>
      {Boolean(userState.friends?.length) ? (
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          <UserList
            list={userState[current as keyof typeof userState] as any[]}
          ></UserList>
        </ScrollView>
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: theme.smoothGrey,
            minHeight: "100%",
          }}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {`You have no ${messageNouns[current as keyof typeof messageNouns]}!`}
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
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
    flexDirection: "column",
    position: "relative",
  },
});
