import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import { useForm, Controller } from "react-hook-form";
import Input from "../shared/Input";
import Form from "react-native-form";
import { FormData } from "../shared/FormData";

export default function Access({ route, navigation }: NavigationProps) {
  const formObj: any = {
    email: "",
    password: "",
  };

  const [invalid, setFormInvalid] = useState(false);

  if (route.name == "Register") formObj["confirmpassword"] = "";
  const [formValues, handleFormValueChange, setFormValues] = FormData(
    formObj,
    setFormInvalid
  );

  const resolveAccess = (data?: any) => {
    console.log("submitted:", formValues);
    console.log(data);

    if (Object.keys(formValues).some((key) => !Boolean(formValues[key]))) {
      setFormInvalid(true);
    }
  };

  const messageLink: any = {
    login: {
      message: "No account? Sign up here!",
      navigateTo: "Register",
    },
    register: {
      message: "Have an existing account? Login here!",
      navigateTo: "Login",
    },
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
              formKey="confirmpassword"
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
                messageLink[route.name.toLowerCase()].navigateTo
              )
            }
          >
            <Text
              style={{
                fontSize: 16,
                textDecorationLine: "underline",
              }}
            >
              {messageLink[route.name.toLowerCase()].message}
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
