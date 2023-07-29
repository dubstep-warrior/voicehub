import { StyleSheet, View } from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import SimpleForm from "../shared/SimpleForm";
import theme from "./../../config/theme.config.json";
import { Pressable } from "react-native";
import { Keyboard } from "react-native";

export default function UpdateField({ route, navigation }: NavigationProps) {
  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <SimpleForm route={route} navigation={navigation}></SimpleForm>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    width: "100%",
    flex: 1,
    padding: 12,
  },
});
