import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import Input from "../shared/Input";
import { FormData } from "../shared/FormData";
import routeConfig from "../../config/route-config.json";
import { useAppDispatch } from "./../store/hooks";
import { resolveAccess } from "../store/actions/auth.actions";
import theme from "./../../config/theme.config.json";
import Error from "../shared/Error";
import ButtonBody from "../shared/Button";
import { RouteConfiguration } from "../interfaces/RouteConfiguration.interface";
import config from "../../Images.config"; 
import { FormControl } from "../interfaces/RouteConfig.interface";

export default function Access({ route, navigation }: NavigationProps) {
  const current = route.name.toLowerCase();
  const dispatch = useAppDispatch();
  const messageLink: RouteConfiguration = routeConfig;
  const [invalid, setFormInvalid] = useState("");
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid
  );

  const submitForm = async () => {
    if (Object.keys(formValues).some((key) => !Boolean(formValues[key]))) {
      setFormInvalid("Please fill up all fields");
      return;
    }
    if (
      current == "register" &&
      formValues["password"] !== formValues["confirmPassword"]
    ) {
      setFormInvalid("Passwords are not the same");
      return;
    }

    const res = await dispatch(resolveAccess(formValues, current));
    if (res && !res.success) {
      setFormInvalid(messageLink[current]['invalid-message']);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: "height" })}
        style={styles.container}
      >
        <View>
          <Image style={styles.logo} source={config["logo"]} />
        </View>
        <View style={styles.row}>
          {messageLink[current]["form-keys"].map((formControl: FormControl) => (
            <Input
              key={formControl.key}
              name={formControl.name}
              formKey={formControl.key}
              secureTextEntry={!!formControl.secureTextEntry}
              handleFormValueChange={handleFormValueChange}
            ></Input>
          ))}
        </View>
        <View style={{ width: "80%" }}>
          <ButtonBody text={"Submit"} onPress={() => submitForm()}></ButtonBody>
          <TouchableOpacity
            onPress={() => navigation.navigate(messageLink[current].navigateTo)}
          >
            <Text
              style={{
                fontSize: 16,
                textDecorationLine: "underline",
                color: "white",
                textAlign: "center",
              }}
            >
              {messageLink[current].message}
            </Text>
          </TouchableOpacity>
        </View>
        {!!invalid && <Error message={invalid}></Error>}
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  row: { width: "80%", flexDirection: "column", alignItems: "center" },
});
