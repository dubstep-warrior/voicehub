import { REACT_APP_BACKEND_URL } from "@env";
import ApiConfig from "../../../config/api-config.json";
import { useAppDispatch } from "../hooks";
import { assign as assignAuth } from "./auth.slice";
import { assign as assignUser } from "./../user/user.slice";
import * as SecureStore from "expo-secure-store"; 

export const resolveAccess = (data: any, current: string) => {
  //   const dispatch = useAppDispatch();
  return async (dispatch: any) => {
    console.log("logging in");
    const res = await fetch(`${REACT_APP_BACKEND_URL}/api/v1/auth/${current}`, {
      ...ApiConfig["POST"],
      body: JSON.stringify(data),
    }).then((response) => response.json());
    console.log(res.success);
    if (res && res["success"]) {
      console.log("login success");
      await Promise.all([
        SecureStore.setItemAsync("token", res.data.token),
        SecureStore.setItemAsync(res.data.token, JSON.stringify(res.data.user)),
      ]).then(() => {
        dispatch(
          assignAuth({
            token: res.data.token,
          }),
          assignUser({
            user: res.data.user,
          })
        );
      });
    } else {
      console.log("failed");
    }
  };
};

export const AuthOnRender = () => {
  return async (dispatch: any) => {
    SecureStore.getItemAsync("token")
      .then((token) => {
        if (token) {
          SecureStore.getItemAsync(token)
            .then((user) => {
              if (user) {
                dispatch(
                  assignAuth({
                    token: token,
                  })
                );
                dispatch(
                  assignUser({
                    user: JSON.parse(user),
                  })
                );
              }
            })
            .catch((err) => {
              throw "Cant get user";
            });
        }
      })
      .catch((err) => {
        console.log("Couldnt get token or user: ", err);
      });
  };
};

export const AuthRemove = (token: string) => {
  return async (dispatch: any) => {
    const res = await Promise.all([
      SecureStore.setItemAsync("token", ""),
      SecureStore.setItemAsync(token, ""),
    ])
      .then((res) => true)
      .catch((err) => false);

    if (res) {
      dispatch(
        assignAuth({
          token: "",
        }),
        assignUser({
          user: {},
        })
      );
    }
  };
};
