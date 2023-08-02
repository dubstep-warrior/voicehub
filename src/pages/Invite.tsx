import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../shared/Input";
import { FormData } from "../shared/FormData";
import routeConfig from "../../config/route-config.json";
import theme from "../../config/theme.config.json";
import { styles as globalStyles } from "../../Styles.config";
import Error from "../shared/Error";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../shared/Button";
import config from "../../Images.config";
import ActionSheet from "react-native-actionsheet";
import actionSheetConfig from "../../config/actionSheet-config.json";
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch } from "../store/hooks";
import { addChat } from "../store/actions/user.actions";
import { auth } from "../../firebase";
import * as Clipboard from 'expo-clipboard';
import FlashMessage, { showMessage } from 'react-native-flash-message';


export default function Invite(props: any) {
    console.log(props.chat)

    const copyString = async (string: any) => {
        await Clipboard.setStringAsync(string).then(() => {
            showMessage({
                message: 'Successfully copied!'
              });
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background, position: 'absolute' , width: '100%', bottom: 0}}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{`Invite users to ${[props.chat.name]}`}</Text>
                <TouchableOpacity style={{ padding: 8 }} onPress={props.onClose}>
                    <Image style={{ width: 15, height: 15 }} source={config['close']}></Image>
                </TouchableOpacity>
            </View>
            {/* <View>
                <Text>Hello invite</Text>
            </View> */}
            <View style={{ padding: 16, gap: 8, marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.heading }}>Send your chat ID to your friend</Text>
                <View style={{ padding: 4, backgroundColor: theme.background2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ padding: 12, fontSize: 18, color: 'black' }}>{props.chat.id}</Text>
                    <TouchableOpacity style={{ backgroundColor: theme.button, paddingVertical: 16, paddingHorizontal: 24, borderRadius: 8 }} onPress={() => {
                       copyString(props.chat.id)
                    }}>
                        <Text style={{fontWeight: 'bold'}}>Copy</Text>
                    </TouchableOpacity>
                    {/* <Button text=></Button> */}
                </View>
            </View> 
        </View>
    );
}

const styles = StyleSheet.create({
    //   profilePicOverlay: {
    //     justifyContent: "center",
    //     alignItems: "center",
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    //     backgroundColor: "rgba(255,255,255,0.4)",
    //   },
    //   image: {
    //     resizeMode: "contain",
    //     borderRadius: 50,
    //     flex: 1,
    //     aspectRatio: 1,
    //   },
});
