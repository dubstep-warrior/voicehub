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
  const friendsConfig = {
    friends: {
      empty: "friends"
    },
    requests: {
      empty:"friend requests"
    },
    pending: {
      empty: "outgoing requests",
    }
  };
  const current = route.name.toLowerCase();
  console.log(current);

  const tappedUser = (user: any) => {
    console.log(user)
  }

  return (
    <>
      {Boolean(userState[current as keyof typeof userState]?.length) ? (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme.smoothGrey,
          }}
        >
          <UserList
            list={userState[current as keyof typeof userState] as any[]}
            onPress={(user) => tappedUser(user)}
          ></UserList>
        </ScrollView>
      ) : (
        <View
          style={styles.container}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {`You have no ${
              friendsConfig[current as keyof typeof friendsConfig].empty
            }!`}
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
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.smoothGrey,
    minHeight: "100%",
  },
});
