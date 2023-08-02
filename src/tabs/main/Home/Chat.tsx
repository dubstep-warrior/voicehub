import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions, View } from "react-native";
import Default from "./Default";
import { RootStackParamList } from "../../../interfaces/RootStackParamList.interface";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../../../config/theme.config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/user.slice";
import { selectApp } from "../../../store/slices/app.slice";
import UserList from "../../../shared/UserList";

export default function Chat({ navigation }: any) {
  const Drawer = createDrawerNavigator();

  return (
    <>
      <Drawer.Navigator
        defaultStatus="closed"
        screenOptions={{
          swipeEdgeWidth: Dimensions.get("window").width/3,
          drawerStyle: {
            width: "90%",
          },
          headerShown: false,
          drawerType: "slide",
          drawerPosition: "right",
        }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"Default" as keyof RootStackParamList}
          component={Default}
          initialParams={{ leftNavigation: navigation }}
        />
      </Drawer.Navigator>
    </>
  );
}


const CustomDrawerContent = ({ navigation }: any) => {
    const userState = useAppSelector(selectUser);
    const appState = useAppSelector(selectApp); 
    const selectedChat = userState?.chats?.[appState.home.selectedCat as keyof typeof userState.chats]?.[appState.home.selectedSubCat as string]
    console.log('user selected chat: ', selectedChat)
    return (
      <View style={{ flexDirection: "row", flexGrow: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme.smoothGrey,
            // flexDirection: "column",
            // gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView
            style={{
              flexDirection: "column",
              gap: 8,
            }}
          > 

            {/* {!!Object.keys(userState?.chats?.["chat"]).length &&
              Object.keys(userState?.chats?.["chat"]).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={{ position: "relative" }}
                  onPress={() => selectHomeState(key, "messages")}
                >
                  {appState.home.selectedCat == key && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "5%",
                        backgroundColor: theme.smoothGrey,
                        borderBottomRightRadius: 15,
                        borderTopRightRadius: 15,
                      }}
                    ></View>
                  )}
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.background,
                      alignSelf: "center",
                    }}
                  >
                    {!!userState?.chats?.["chat"]?.[key]?.["chat_img"] && (
                      <Image
                        style={[
                          { width: 60, height: 60, borderRadius: 30 },
                          appState.home.selectedCat == key && {
                            borderWidth: 2,
                            borderColor: theme.black,
                          },
                        ]}
                        source={{
                          uri: userState?.chats?.["chat"]?.[key]?.["chat_img"]
                            ?.uri,
                        }}
                      ></Image>
                    )}
                  </View>
                </TouchableOpacity>
              ))} */}

              <UserList list={selectedChat?.users.map((id: string) => appState.userProfiles[id])}></UserList>
   
          </SafeAreaView>
        </ScrollView> 
      </View>
    );
  };
