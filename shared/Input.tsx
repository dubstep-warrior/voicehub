import { Props } from "../interfaces/Props.interface";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { View } from "react-native";

interface IInput {
  name: string;
  handleFormValueChange: any; 
  textInputProps?: any;
  formKey: string
}

export default function Input(props: IInput) {
  const { name, handleFormValueChange, formKey, ...textInputProps } = props;

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        placeholder={name}
        style={styles.input}
        onChange={(event) =>
          handleFormValueChange(formKey, event.nativeEvent.text)
        }
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    backgroundColor: "white",
    marginBottom: 12,
    fontSize: 24,
    padding: 12,
    borderRadius: 12,
  },
});
