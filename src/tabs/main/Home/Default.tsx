import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";

import theme from "../../../../config/theme.config.json";

import { NavigationProps } from "../../../interfaces/NavigationProps.interface";

export default function Default({ route, navigation }: NavigationProps) {
  return <View style={styles.safeAreaContainer}>
    <Text>Hello Home</Text>
  </View>;
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
    flexDirection: "column",
    position: "relative",
  },
});
