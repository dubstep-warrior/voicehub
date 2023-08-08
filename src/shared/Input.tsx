import { Props } from "../interfaces/Props.interface";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { View } from "react-native";

export interface IInput {
  name: string;
  handleFormValueChange: any; 
  textInputProps?: any;
  formKey: string
  value?: string,
  style?: keyof typeof styles
  multiline?: boolean
  numberOfLines?: number,
  secureTextEntry?: boolean,
  background?: string
  onTextChange?: (text: string) => void
}

export default function Input({ style = 'input' ,...props}: IInput) {
  const { name, handleFormValueChange, formKey, ...textInputProps } = props;

  const textChanged = (text: string) => {
    // console.log('text is changing:', text)
    if(props.onTextChange) {
      props.onTextChange(text)
    }
  }

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        placeholder={name}
        style={[styles[style], {backgroundColor: props.background ?? 'white'}]}
        onChange={(event) =>
          handleFormValueChange(formKey, event.nativeEvent.text)
        }
        {...textInputProps}
        {...props}
        defaultValue={props.value ?? ''}
        multiline={props.multiline ?? false}
        numberOfLines={props.numberOfLines ?? 1}
        onChangeText={textChanged}
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
  minimal: {
    width: "100%", 
    backgroundColor: "white",
    borderRadius: 12,
    fontSize: 16,
    padding: 4
  },
  minimalTextarea: {
    width: "100%", 
    height: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    fontSize: 16,
    padding: 4
  },
  square: {
    width: "100%",  
    backgroundColor: "white", 
    fontSize: 18,
    padding: 8,
    borderRadius: 4
  }
});
