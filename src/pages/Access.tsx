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
import { resolveAccess } from "../store/auth/auth.actions";
import theme from './../../config/theme.config.json'

export default function Access({ route, navigation }: NavigationProps) {
  const current = route.name.toLowerCase();
  const dispatch = useAppDispatch();
  const messageLink: any = routeConfig;

  const [invalid, setFormInvalid] = useState(false);
  console.log('1')
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[current].form,
    setFormInvalid
  );
  console.log('2')
  const submitForm = (data?: any) => {
    console.log("submitted:", formValues);

    if (Object.keys(formValues).some((key) => !Boolean(formValues[key]))) {
      console.log("Form values is not valid");
      setFormInvalid(true);
      return;
    }

    dispatch(resolveAccess(formValues, current)); 
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
            handleFormValueChange={handleFormValueChange}
          ></Input>
          {route.name == "Register" && (
            <Input
              name="Confirm Password"
              formKey="confirmPassword"
              handleFormValueChange={handleFormValueChange}
            ></Input>
          )}
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={{
              width: "100%",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "center",
              padding: 12,
              borderRadius: 12,
              backgroundColor: theme.khaki,
              marginBottom: 12,
            }}
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
                color: "white"
              }}
            >
              {messageLink[current].message}
            </Text>
          </TouchableOpacity>
        </View>
        {invalid && (
          <View>
            <Text>Please fill up all fields</Text>
          </View>
        )}
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: theme.gunmetal,
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
