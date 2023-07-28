import { Image, Text } from "react-native";
import { View } from "react-native";
import config from "./../../Images.config";

export default function Error({ ...props }) {
  return (
    <View
      style={{
        justifyContent: "flex-start",
        flexDirection: "row",
        alignContent: "center",
        gap: 12,
        padding: 4,
        borderRadius: 12,
        borderColor: "red",
        borderWidth: 1,
      }}
    >
      <Image style={{ width: 22, height: 22 }} source={config["error"]}></Image>
      <Text
        style={{
          color: "red",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {props.message}
      </Text>
    </View>
  );
}
