import { Text, View, TouchableOpacity, Image } from "react-native";
import theme from "../../config/theme.config.json";
import config from "../../Images.config";
import { styles as globalStyles } from "../../Styles.config";

export interface IUserListProps {
  list: any[];
  onMore?: () => void;
  onPress?: (user: any) => void;
}

export default function UserList({ list = [], ...props }: IUserListProps) {
  console.log(list)
  return (
    <>
      {list.map((user) => (
        <TouchableOpacity
          key={user.username}
          style={{
            flexDirection: "row",
            gap: 8,
            padding: 10,
            alignItems: "center",
            borderBottomWidth: 0.3,
            borderBottomColor: "rgba(255,255,255,0.3)",
          }}
          onPress={() => props.onPress ? props.onPress!(user) : null}
        >
          <Image
            style={globalStyles.icon}
            source={
              user.profile_img
                ? { uri: user.profile_img }
                : config["profile-grey"]
            }
          ></Image>
          <View
            style={{
              gap: 8,
              maxWidth: "60%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {user.displayedName}
            </Text>
            <Text
              style={{
                color: theme.heading,
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              {user.status}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {props.onMore && (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.background,
                  width: 35,
                  height: 35,
                  borderRadius: 17,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={config["more"]}
                ></Image>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}
