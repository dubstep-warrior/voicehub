import { StyleSheet } from "react-native";
import theme from "./config/theme.config.json"

export const styles = StyleSheet.create({ 
    icon: {
         
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
    }
  }); 