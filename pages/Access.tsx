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
import * as SecureStore from "expo-secure-store";
import { FormData } from "../shared/FormData";
import routeConfig from './../config/route-config.json'
import {REACT_APP_BACKEND_URL} from "@env"

export default function Access({ route, navigation }: NavigationProps) { 
  const current = route.name.toLowerCase();
  // console.log(JSON.parse(routeConfig as any))
  const messageLink: any = routeConfig;

  const [invalid, setFormInvalid] = useState(false);
 
  const [formValues, handleFormValueChange, setFormValues] = FormData(
    messageLink[current].form,
    setFormInvalid
  );

  const resolveAccess = async (data?: any) => {
    console.log("submitted:", formValues);

    if (Object.keys(formValues).some((key) => !Boolean(formValues[key]))) {
      console.log("Form values is not valid");
      setFormInvalid(true);
      return;
    }

    console.log(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/${current}`)
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/${current}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      }
    ).then((response) => response.json());

    if (res && res.success) {
      await Promise.all([
        SecureStore.setItemAsync("token", res.data.token),
        SecureStore.setItemAsync("res.data.token", res.data.user),
      ]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View>
          <Image style={styles.logo} source={require("./../assets/logo.png")} />
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
              backgroundColor: "#F99C9C",
              marginBottom: 12,
            }}
            onPress={() => resolveAccess()}
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
            onPress={() =>
              navigation.navigate(
                messageLink[current].navigateTo
              )
            }
          >
            <Text
              style={{
                fontSize: 16,
                textDecorationLine: "underline",
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
    backgroundColor: "#6A6A6A",
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
