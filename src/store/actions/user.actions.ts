import { REACT_APP_BACKEND_URL } from "@env";
import ApiConfig from "../../../config/api-config.json";
import { update } from "../slices/user.slice";
import { Platform } from "react-native/Libraries/Utilities/Platform";
import { assign as assignUser } from "../slices/user.slice";

import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const UserUpdate = (
  changes: any,
  currentUser: any,
  setEditMode?: any
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

    console.log("new changes ", newChanges);
    const ref = doc(db, 'userProfiles', auth.currentUser!.uid);
    const res = await setDoc(ref, newChanges, { merge: true })
      .then(async () => {
        const profile = await getDoc(ref)

        dispatch(assignUser({
          user: profile.data()
        }))


        return {
          success: true,
          data: profile.data(),
        };
      })
      .catch((error) => {
        return {
          success: false,
          error: error,
        };
      });

    console.log('response',res);
    if(setEditMode) {
      setEditMode(false);
    }

    return res;

    // const res = await fetch(`${REACT_APP_BACKEND_URL}/api/v1/user`, {
    //   ...ApiConfig["PUT"],
    //   headers: {
    //     Authorization: `Token ${auth.token}`,
    //   },
    //   body: { changes: data } as any,
    // }).then((response) => response.json());

    // dispatch(update(newChanges));
    // setEdit(false)
  };
};
