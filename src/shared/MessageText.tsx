import { Text } from "react-native-elements";
import { useAppSelector } from "../store/hooks";
import { selectApp } from "../store/slices/app.slice";
import { selectUser } from "../store/slices/user.slice";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";


export default function MessageText(props: any) {
    const {text} = props  

    return (
        <Text style={styles.text}>
            {text}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: "black",
        padding: 4,
        marginBottom: 12,
    }
})