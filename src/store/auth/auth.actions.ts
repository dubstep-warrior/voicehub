import { REACT_APP_BACKEND_URL } from "@env";
import ApiConfig from "../../../config/api-config.json";
import { useAppDispatch } from "../hooks";
import { assign as assignAuth } from "./auth.slice";
import { assign as assignUser } from "./../user/user.slice";
import * as SecureStore from "expo-secure-store";
import { auth, db } from "../../../firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const resolveAccess = (data: any, current: string) => {
  //   const dispatch = useAppDispatch();
  return async (dispatch: any) => {
    console.log("logging in"); 
    
    const res = (await (current == "register"
      ? createUserWithEmailAndPassword(auth, data.email, data.password)
      : signInWithEmailAndPassword(auth, data.email, data.password)
    )
      .then(async (userCredential) => {
        const user = userCredential.user; 
        if(current == 'register') {  
          await setDoc(doc(db, "userProfiles", user.uid!), {
            username: auth.currentUser?.email?.split('@')[0],
            displayedName: auth.currentUser?.email?.split('@')[0] 
          });
        } 

        const profile = await getDoc(doc(db, "userProfiles", user.uid!))

        console.log('profile', profile.data)

        return {
          success: true,
          data: user,
        };
      })
      .catch((error) => {
        return {
          success: false,
          error: error,
        };
      })) as { success: boolean; data: any };

    // if (res && res.success) {
    //   console.log(res.data)
    //   dispatch(
    //     assignUser({
    //       user: res.data,
    //     })
    //   );
    // }

    return res;

    // await fetch(`${REACT_APP_BACKEND_URL}/api/v1/auth/${current}`, {
    //   ...ApiConfig["POST"],
    //   body: JSON.stringify(data),
    // }).then((response) => response.json());
    // console.log(res.success);
    // if (res && res["success"]) {
    //   console.log("login success");
    //   await Promise.all([
    //     SecureStore.setItemAsync("token", res.data.token),
    //     SecureStore.setItemAsync(res.data.token, JSON.stringify(res.data.user)),
    //   ]).then(() => {
    //     dispatch(
    //       assignAuth({
    //         token: res.data.token,
    //       }),
    //       assignUser({
    //         user: res.data.user,
    //       })
    //     );
    //   });
    // } else {
    //   console.log("failed");
    // }
  };
};

export const AuthOnRender = () => {
  return async (dispatch: any) => {
    if(auth.currentUser) {
      dispatch(
        assignUser({
          user: auth.currentUser
        })
      );
    }



  //   SecureStore.getItemAsync("token")
  //     .then((token) => {
  //       if (token) {
  //         SecureStore.getItemAsync(token)
  //           .then((user) => {
  //             if (user) {
  //               dispatch(
  //                 assignAuth({
  //                   token: token,
  //                 })
  //               );
  //               dispatch(
  //                 assignUser({
  //                   user: JSON.parse(user),
  //                 })
  //               );
  //             }
  //           })
  //           .catch((err) => {
  //             throw "Cant get user";
  //           });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Couldnt get token or user: ", err);
  //     });
  };
};

export const AuthRemove = (token: string) => {
  return async (dispatch: any) => {

    signOut(auth).then(res => {
      dispatch(assignUser({
        user: {}
      }))
    }).catch(err => {
       
    })

    // const res = await Promise.all([
    //   SecureStore.setItemAsync("token", ""),
    //   SecureStore.setItemAsync(token, ""),
    // ])
    //   .then((res) => true)
    //   .catch((err) => false);

    // if (res) {
    //   dispatch(
    //     assignAuth({
    //       token: "",
    //     }),
    //     assignUser({
    //       user: {},
    //     })
    //   );
    // }
  };
};
