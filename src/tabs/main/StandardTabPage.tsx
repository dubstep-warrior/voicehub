import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../config/theme.config.json";
import { ScrollView } from "react-native-gesture-handler";
import config from "../../../Images.config";
import { styles as globalStyles } from "../../../Styles.config";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/user.slice";
import { NavigationProps } from "../../interfaces/NavigationProps.interface";
import UserList from "../../shared/UserList";
import { selectApp } from "../../store/slices/app.slice";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RootStackParamList } from "../../interfaces/RootStackParamList.interface";

export default function StandardTabPage(props: any) {
  const userState = useAppSelector(selectUser);
  const Tab = createMaterialTopTabNavigator();

  const av = new Animated.Value(0);
  av.addListener(() => {
    return;
  });
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* HEADING */}
      <View style={globalStyles.headingContainer}>
        <View>{props.headerLeft}</View>
        <Text style={globalStyles.headerText}>{props.headerName}</Text>
        <View>{props.headerRight}</View>
      </View>
      {/* BODY */}
      {props.children}
    </SafeAreaView>
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
