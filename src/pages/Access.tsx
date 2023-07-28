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
} from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import Input from "../shared/Input";
import { FormData } from "../shared/FormData";
import routeConfig from "../../config/route-config.json";
import { useAppDispatch } from "./../store/hooks";
import { resolveAccess } from "../store/actions/auth.actions";
import theme from "./../../config/theme.config.json";
import { styles as globalStyles } from "../../Styles.config";
import Error from "../shared/Error";

export default function Access({ route, navigation }: NavigationProps) {
  const current = route.name.toLowerCase();
  const dispatch = useAppDispatch();
  const messageLink: any = routeConfig;
  console.log(route)
  const [invalid, setFormInvalid] = useState("");
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid
  );

  const submitForm = async (data?: any) => {
    console.log("submitted:", formValues);

    if (Object.keys(formValues).some((key) => !Boolean(formValues[key]))) {
      console.log("Form values is not valid");
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
    console.log("response returned:", res);
    if (res && !res.success) {
      setFormInvalid("User credentials are invalid");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={require("./../../assets/logo-white.png")}
          />
        </View>
        <View style={styles.row}>
          <Input
            name="Email"
            formKey="email"
            handleFormValueChange={handleFormValueChange}
          ></Input>

          <Input
            name="Password"
            formKey="password"
            secureTextEntry={true}
            handleFormValueChange={handleFormValueChange}
          ></Input>
          {route.name == "Register" && (
            <Input
              name="Confirm Password"
              formKey="confirmPassword"
              secureTextEntry={true}
              handleFormValueChange={handleFormValueChange}
            ></Input>
          )}
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => submitForm()}
          >
            <Text
              style={{
                fontSize: 24,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(messageLink[current].navigateTo)}
          >
            <Text
              style={{
                fontSize: 16,
                textDecorationLine: "underline",
                color: "white",
              }}
            >
              {messageLink[current].message}
            </Text>
          </TouchableOpacity>
        </View>
        {Boolean(invalid) && <Error message={invalid}></Error>}
        <StatusBar style="auto" />
      </View>
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
