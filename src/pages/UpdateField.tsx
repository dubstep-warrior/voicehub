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
import Input from "../shared/Input";
import routeConfig from "../../config/route-config.json";
import { FormData } from "../shared/FormData";
import { useState } from "react";
import theme from "./../../config/theme.config.json";
import { selectUser } from "../store/slices/user.slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { auth, db } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { UserUpdate } from "../store/actions/user.actions";
import config from "./../../Images.config";

export default function UpdateField({ route, navigation }: NavigationProps) {
  //   console.log(route);
  const messageLink: any = routeConfig;
  const userState = useAppSelector(selectUser);
  const [invalid, setFormInvalid] = useState("");
  const [formValues, handleFormValueChange, setFormValues, reset] = FormData(
    messageLink[route.name.toLowerCase()][route.params!.key],
    setFormInvalid,
    {
      ...Object(userState),
    }
  );

  const formKeys = Object.keys(
    messageLink[route.name.toLowerCase()][route.params!.key]
  );
  const dispatch = useAppDispatch();

  const submit = async () => {
    if (
      !Object.keys(formValues).length ||
      Object.keys(formValues).some((key) => formValues[key] == "")
    ) {
      setFormInvalid("Fill up all fields");
      return;
    }

    if (["username", "displayedName"].includes(route.params!.key)) {
      //username && displayedname
      await dispatch(UserUpdate(formValues, Object(userState)));
      navigation.goBack();
      return;
    }
    console.log("retrieve cred");
    const credential = EmailAuthProvider.credential(
      auth.currentUser?.email!,
      formValues["currentPassword"]
    );

    const reauth = await reauthenticateWithCredential(
      auth.currentUser!,
      credential
    );
    if (reauth && reauth.user) {
      if (route.params!.key === "password") {
        //password
        if (formValues["newPassword"] !== formValues["confirmNewPassword"]) {
          setFormInvalid("Ensure your new passwords match!");
          console.log("password no match");
        } else {
          console.log("updaing password");
          updatePassword(auth.currentUser!, formValues["newPassword"])
            .then(() => navigation.goBack())
            .catch((err) => {
              console.log(err.code);
              setFormInvalid("There was an issue updating your password");
            });
        }
      } else {
        //email
        updateEmail(auth.currentUser!, formValues["email"]!)
          .then(() => {
            console.log("success");
            navigation.goBack();
          })
          .catch((error) => {
            console.log("fail", error);
            setFormInvalid(
              `There was an error changing your ${route.params!.name.toLowerCase()}`
            );
          });
      }
    } else {
      console.log("invalid password");
      setFormInvalid("Your password is invalid");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={navigation.goBack}
            style={[globalStyles.button, styles.button]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={submit}
            style={[globalStyles.button, styles.button]}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1, gap: 16 }}>
            <Text
              style={{ color: "white", fontSize: 24, fontWeight: "500" }}
            >{`Update ${route.params!.name.toLowerCase()} here:`}</Text>
            {formKeys.map((key) => (
              <Input
                key={key}
                name={messageLink[route.name.toLowerCase()].placeholders[key]}
                handleFormValueChange={handleFormValueChange}
                formKey={key}
                value={formValues[key]}
                style="square"
                background={theme.almond}
              />
            ))}
            {Boolean(invalid) && (
              <View
                style={{ 
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignContent: "center", 
                  gap: 12,
                  padding: 4,
                  borderRadius: 12,
                  borderColor: 'red',
                  borderWidth: 1
                }}
              >
                <Image
                  style={{ width: 22, height: 22 }}
                  source={config["error"]}
                ></Image>
                <Text
                  style={{
                    color: "red", 
                    fontWeight: "bold",
                    fontSize: 16,    
                  }}
                >
                  {invalid}
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.gunmetal,
    width: "100%",
    height: "100%",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  button: {
    flexGrow: 1,
    width: "auto",
    backgroundColor: "#283c46fa",
    padding: 8,
    borderRadius: 0,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
});
