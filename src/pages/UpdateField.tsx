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
import { UserUpdate } from "../store/actions/user.actions";
import config from "./../../Images.config";
import { AuthUpdate } from "../store/actions/auth.actions";
import Error from "../shared/Error";

export default function UpdateField({ route, navigation }: NavigationProps) {
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
      Object.keys(formValues).some((key) => !Boolean(formValues[key]))
    ) {
      setFormInvalid("Fill up all fields");
      return;
    }

    if (["username", "displayedName"].includes(route.params!.key)) {
       await dispatch(UserUpdate(formValues, Object(userState)));
      navigation.goBack();
      return;
    }
    
    dispatch(AuthUpdate(formValues, route, navigation, setFormInvalid))
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
              style={{ color: theme.heading, fontSize: 16, fontWeight: "700" }}
            >{`Update ${route.params!.name.toLowerCase()} here:`.toUpperCase()}</Text>
            {formKeys.map((key) => (
              <Input
                key={key}
                name={messageLink[route.name.toLowerCase()].placeholders[key]}
                handleFormValueChange={handleFormValueChange}
                formKey={key}
                value={formValues[key]}
                style="square"
                background={theme.almond}
                secureTextEntry={key.toLowerCase().includes('password')}
              />
            ))}
            {Boolean(invalid) && (
              <Error
              message={invalid}
              ></Error>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    width: "100%",
    height: "100%",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  button: {
    flexGrow: 1,
    width: "auto",
    backgroundColor: theme.smoothGrey,
    padding: 8,
    borderRadius: 0,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
});
