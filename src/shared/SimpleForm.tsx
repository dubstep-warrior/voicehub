import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles as globalStyles } from "../../Styles.config";
import Input from "./Input";
import routeConfig from "../../config/route-config.json";
import { FormData } from "./FormData";
import { useState } from "react";
import theme from "../../config/theme.config.json";
import { selectUser } from "../store/slices/user.slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { SearchUsers, UserUpdate } from "../store/actions/user.actions";
import config from "../../Images.config";
import { AuthUpdate } from "../store/actions/auth.actions";
import Error from "./Error";
import Button from "./Button";

export default function SimpleForm({ route, navigation }: NavigationProps) {
  const messageLink: any = routeConfig;
  const userState = useAppSelector(selectUser);
  const [invalid, setFormInvalid] = useState("");
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[route.name.toLowerCase()]['form'][route.params!.key],
    setFormInvalid,
    route.name.toLowerCase().includes("update")
      ? {
          ...Object(userState),
        }
      : {}
  );

  console.log('printing in simpleform', route.name.toLowerCase(), route.params)
  const formKeys = Object.keys(
    messageLink[route.name.toLowerCase()]['form'][route.params!.key]
  );
  const dispatch = useAppDispatch();

  const submit = async () => {
    if (route.name.toLowerCase().includes("update")) {
      if (
        !Object.keys(formValues).length ||
        Object.keys(formValues).some((key) => !Boolean(formValues[key]))
      ) {
        setFormInvalid("Fill up all fields");
        return;
      }

      if (["username", "displayedName"].includes(route.params!.key)) {
        await dispatch(UserUpdate(formValues, Object(userState)));
        navigation.goBack();
        return;
      } else if (["email", "password"].includes(route.params!.key)) {
        dispatch(AuthUpdate(formValues, route, navigation, setFormInvalid));
      }
    }
    if (route.name.toLowerCase().includes("addfriend")) {
      dispatch(SearchUsers(formValues, Object(userState)));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Button
            onPress={navigation.goBack}
            text={
              route.name.toLowerCase().includes("update") ? "Cancel" : "Back"
            }
            theme="minimal"
          ></Button>
          <Button
            onPress={submit}
            text={route.params!.submit ?? "Submit"}
            theme="minimal"
          ></Button>
        </View> 
        <View style={{ gap: 16 }}>
          <Text
            style={{ color: theme.heading, fontSize: 16, fontWeight: "700" }}
          >
            {route.params?.heading}
          </Text>
          {formKeys.map((key) => (
            <Input
              key={key}
              name={messageLink[route.name.toLowerCase()].placeholders[key]}
              handleFormValueChange={handleFormValueChange}
              formKey={key}
              value={formValues[key]}
              style="square"
              background={theme.almond}
              secureTextEntry={key.toLowerCase().includes("password")}
            />
          ))}
          {Boolean(invalid) && <Error message={invalid}></Error>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // flex: 1,
    // backgroundColor: 'red'
    // padding: 12,
    // justifyContent: "center",
  },
});
