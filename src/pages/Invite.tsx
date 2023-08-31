import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../config/theme.config.json";
import config from "../../Images.config";
import * as Clipboard from "expo-clipboard";
import { showMessage } from "react-native-flash-message";

export default function Invite(props: any) {
  
  const copyString = async (string: string) => {
    await Clipboard.setStringAsync(string).then(() => {
      showMessage({
        message: "Successfully copied!",
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.flexRow, { padding: 16 }]}>
        <Text
          style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
        >{`Invite users to ${[props.chat.name]}`}</Text>
        <TouchableOpacity style={{ padding: 8 }} onPress={props.onClose}>
          <Image
            style={{ width: 15, height: 15 }}
            source={config["close"]}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 16, gap: 8, marginBottom: 24 }}>
        <Text
          style={{ fontSize: 16, fontWeight: "bold", color: theme.heading }}
        >
          Send your chat ID to your friend
        </Text>
        <View
          style={[
            {
              padding: 4,
              backgroundColor: theme.background2,
            },
            styles.flexRow,
          ]}
        >
          <Text style={{ padding: 12, fontSize: 18, color: "black" }}>
            {props.chat.id}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.button,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
            onPress={() => {
              copyString(props.chat.id);
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  //   image: {
  //     resizeMode: "contain",
  //     borderRadius: 50,
  //     flex: 1,
  //     aspectRatio: 1,
  //   },
});
