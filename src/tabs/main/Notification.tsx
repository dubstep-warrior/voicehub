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

export default function Notification() {
  const appState = useAppSelector(selectApp);
  return (
    <StandardTabPage headerName="Notifications">
      <View style={styles.safeAreaContainer}>
        {!!appState.notifications?.length ? (
          <FlatList
            data={appState.notifications}
            renderItem={({ item, index }) => (
              <View key={index + item.id}>
                <Text style={{ color: "white" }}>{item.desc}</Text>
              </View>
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
  },
});
