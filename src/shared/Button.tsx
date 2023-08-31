import { Image, Text, StyleSheet } from "react-native";
import { View } from "react-native";
import config from "../../Images.config";
import { styles as globalStyles } from "../../Styles.config";
import { TouchableOpacity } from "react-native-gesture-handler";
import themeConfig from "./../../config/theme.config.json";
import { DotIndicator } from "react-native-indicators";
import { useAppSelector } from "../store/hooks";
import { selectApp } from "../store/slices/app.slice";

interface DotIndicatorConfig {
  [key: string]: number, 
}

interface IButtonProps {
  theme?: keyof DotIndicatorConfig
  text: string
  onPress: () => void
}


export default function Button({ theme = "purple", ...props }: IButtonProps) {
  const load = ["submit", "search", "logout"].includes(props.text.toLowerCase());

  const appState = useAppSelector(selectApp);

  const dotIndicatorConfig: DotIndicatorConfig = {
    purple: 14.75,
    minimal: 8,
  };

  return (
    <TouchableOpacity
      style={[styles[theme as keyof typeof styles]]}
      onPress={() => props.onPress()}
    >
      {appState.submitting && load ? (
        <DotIndicator
          size={dotIndicatorConfig[theme]}
          count={3}
          color={themeConfig.lightGrey}
        />
      ) : (
        <Text
          style={[
            {
              fontSize: 24,
            },
            theme == "minimal" && {
              fontSize: 18,
              color: "white",
              fontWeight: "500",
            },
          ]}
        >
          {props.text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  minimal: {
    width: "auto",
    minWidth: 80,
    minHeight: 36,
    backgroundColor: themeConfig.smoothGrey,
    padding: 8,
    borderRadius: 0,
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  purple: globalStyles.button,
});
