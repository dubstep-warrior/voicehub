import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "./../../../config/theme.config.json";
import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "../../store/hooks";
import { selectApp } from "../../store/slices/app.slice";
import StandardTabPage from "./StandardTabPage";
import { selectUser } from "../../store/slices/user.slice";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";


export default function Notification() {
  const appState = useAppSelector(selectApp);
  const userState = useAppSelector(selectUser)
  const [notifications, setNotifications] = useState<any[]>([])


  useEffect(() => {
    if (!!Object.keys(appState?.notifications).length) {
      let localNotifications: any[] = []
      Object.keys(appState.notifications).forEach(chat_notifications_id => {
        localNotifications = [...localNotifications, ...appState.notifications[chat_notifications_id]]
      })
      setNotifications(localNotifications.sort((a, b) => { return a.created - b.created }))
    }
  }, [appState?.notifications]) 

  return (
    <StandardTabPage headerName="Notifications">
      <View style={styles.safeAreaContainer}>
        {!!notifications?.length ? (
          <FlatList
            data={notifications}
            renderItem={({ item, index }) => (
              <TouchableOpacity key={index + item.id}
                style={{ backgroundColor: theme.smoothGrey, gap: 12, alignItems: 'center', padding: 8, borderRadius: 4, flexDirection: 'row' }}>
                <View>
                  <ExpoImage
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25
                    }}
                    source={userState?.chats?.["chat"]?.[item.chatID]?.["chat_img"]}
                    cachePolicy={"memory-disk"}
                  ></ExpoImage>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[{ fontWeight: 'bold', flex: 1, flexWrap: 'wrap', color: theme.lightGrey }]}>
                      <Text style={styles.text}>{appState.userProfiles?.[item.by]?.displayedName}</Text>
                      {` tagged you in `}
                      <Text style={styles.text}>{userState.chats['chat']?.[item.chatID]?.name}</Text>
                    </Text>
                  </View>
                  <Text style={{ color: theme.lightGrey }}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            )}
          ></FlatList>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: theme.black, fontSize: 24, fontWeight: "bold" }}
            >
              You have no notifications
            </Text>
            <Text
              style={{
                color: theme.background,
                maxWidth: "80%",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Notifications appear when someone in your chat channels have
              tagged you, please check again later.
            </Text>
          </View>
        )}
      </View>
    </StandardTabPage>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background2,
    flex: 1,
    minHeight: Dimensions.get("window").height - 135,
    padding: 8
  },
  text: {
    color: "white",
    textDecorationLine: 'underline'
  }
});
