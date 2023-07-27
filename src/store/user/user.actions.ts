import { REACT_APP_BACKEND_URL } from "@env";
import ApiConfig from "../../../config/api-config.json";
import { update } from "./user.slice";
import { Platform } from "react-native/Libraries/Utilities/Platform";

export const UserUpdate = (
  changes: any,
  currentUser: any,
  auth: any,
  setEditMode: any
) => {
  return async (dispatch: any) => {
    //   const res = await Promise.all([
    //     SecureStore.setItemAsync("token", ""),
    //     SecureStore.setItemAsync(token, ""),
    //   ])
    //     .then((res) => true)
    //     .catch((err) => false);

    //   if (res) {
    //     dispatch(
    //       assignAuth({
    //         token: "",
    //       }),
    //       assignUser({
    //         user: {},
    //       })
    //     );
    //   }

    const newChanges: any = {};
    Object.keys(changes).forEach((key) => {
      if (
        JSON.stringify(currentUser[key as keyof typeof currentUser]) !==
        JSON.stringify(changes[key])
      )
        newChanges[key] = changes[key];
    });
    console.log("user action being run");

    const data = new FormData();

    // TODO fix and ensure all change data is sent to backend
    Object.keys(newChanges).forEach((key) => {
      if (key == "profile_img") {
        data.append(key, newChanges[key]);
      } else {
        data.append(key, JSON.stringify(newChanges[key]));
      }
    });

    console.log('new changes ', newChanges)
    const res = await fetch(`${REACT_APP_BACKEND_URL}/api/v1/user`, {
      ...ApiConfig["PUT"],
      headers: {
        Authorization: `Token ${auth.token}`,
      },
      body: { changes: data } as any,
    }).then((response) => response.json());

    dispatch(update(newChanges));
    // setEdit(false)

    setEditMode(false);
  };
};
