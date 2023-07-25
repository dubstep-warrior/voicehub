import { Props } from "../interfaces/Props.interface";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { View } from "react-native";

export default function Input(props: Props) {
  return (
    <View style={{width: '100%'}}> 
      <TextInput
        placeholder={props.name}
        style={styles.input}
        onChange={(event) =>
          props.handleFormValueChange(props.formKey, event.nativeEvent.text)
        }
        {...props.textInputProps}
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
