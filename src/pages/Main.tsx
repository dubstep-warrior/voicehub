import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { NavigationProps } from "../interfaces/NavigationProps.interface";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectAuth } from "../store/auth/auth.slice";
import  MainTab from './../config/Main.config'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import theme from "./../../config/theme.config.json";

export default function Main({ route, navigation }: NavigationProps) {
  const authState = useAppSelector(selectAuth);
  const Tab = createBottomTabNavigator();
  const dispatch = useAppDispatch();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.black, borderTopWidth: 0 },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      {MainTab.map((option) => (
        <Tab.Screen
          key={option.name}
          name={option.name}
          component={option.component}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Image style={styles.image} source={option.imageSelected} />
              ) : (
                <Image style={styles.image} source={option.image} />
              ),
            tabBarLabel: "Home",
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
  },
});
