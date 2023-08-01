import { StyleSheet } from "react-native";
import theme from "./config/theme.config.json";

export const styles = StyleSheet.create({
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  button: {
    width: "100%",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.button,
    marginBottom: 12,
  },
  text: {
    color: 'white'
  },
  headingContainer: {
    padding: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    zIndex: 2,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  }
});
