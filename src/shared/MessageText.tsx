import { Text } from "react-native-elements";
import { useAppSelector } from "../store/hooks";
import { selectApp } from "../store/slices/app.slice";
import { selectUser } from "../store/slices/user.slice";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";


export default function MessageText(props: any) {
    const text = props.text.split(' ');
    const appState = useAppSelector(selectApp)
    const userState = useAppSelector(selectUser)
    const users = userState?.chats?.[
        appState.home.selectedCat as keyof typeof userState.chats
    ]?.[appState.home.selectedSubCat as string].users.map((id: string) => {
        return { ...appState.userProfiles[id], uid: id };
    }) 



    return (
        <Text style={styles.text}>
            {text.map((text: string, index: number) => {
                if (text.startsWith('@') && users.map((user: any) => user.displayedName).includes(text.replace('@', ''))) {
                    return (
                        <Text key={text + index} onPress={() => {
                            console.log('this works')
                        }} style={[styles.text, { fontWeight: 'bold', color: 'blue', textDecorationLine: 'underline' }]}>
                            {`${text} `}
                        </Text>
                    );
                }
                return `${text} `;
            })}
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