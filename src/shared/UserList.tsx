import { Text, View, TouchableOpacity, Image } from "react-native";
import theme from "../../config/theme.config.json";
import config from "../../Images.config";
import { styles as globalStyles } from "../../Styles.config";
import { Image as ExpoImage } from "expo-image";

export interface IUserListProps {
  list: any[];
  small?: boolean;
  selected?: string | null;
  identifier: string;
  onMore?: () => void;
  onPress?: (user: any) => void;
}

export default function UserList({ list = [], ...props }: IUserListProps) {
  console.log(list);
  return (
    <>
      {list.map((user, index) => {
        console.log(props?.selected, props.identifier ,user?.[props.identifier])
        return (
          <TouchableOpacity
            key={props.identifier ? user?.[props.identifier] : index}
            style={[
              {
                flexDirection: "row",
                gap: 8,
                padding: 10,
                alignItems: "center",
                borderBottomWidth: 0.3,
                borderBottomColor: "rgba(255,255,255,0.3)",
              },
              !!props?.selected &&
                props?.selected == user?.[props.identifier] && {
                  backgroundColor: theme.lightSmoothGrey,
                  borderRadius: 8
                },
            ]}
            onPress={() => (props.onPress ? props.onPress!(user) : null)}
          >
            <ExpoImage
              style={
                props.small
                  ? { width: 30, height: 30, borderRadius: 15 }
                  : globalStyles.icon
              }
              source={
                user?.profile_img ? user?.profile_img : config["profile-grey"]
              }
              cachePolicy={"memory-disk"}
            ></ExpoImage>
            <View
              style={{
                gap: 8,
                maxWidth: "60%",
              }}
            >
              <Text
                style={[
                  {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                  },
                  props?.small && { fontSize: 14 },
                ]}
              >
                {user?.displayedName}
              </Text>
              {!props?.small && (
                <Text
                  style={{
                    color: theme.heading,
                    fontWeight: "500",
                  }}
                  numberOfLines={1}
                >
                  {user?.status}
                </Text>
              )}
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
        )
      })}
    </>
  );
}
