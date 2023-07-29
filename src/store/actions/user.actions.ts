import { REACT_APP_BACKEND_URL } from "@env";
import ApiConfig from "../../../config/api-config.json";
import { update } from "../slices/user.slice";
import { Platform } from "react-native/Libraries/Utilities/Platform";
import { assign as assignUser } from "../slices/user.slice";

import { auth, db } from "../../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query, 
  setDoc,
  where,
} from "firebase/firestore";
import { assign as assignApp, update as updateApp } from "../slices/app.slice";
import { getAuth } from "firebase/auth";

export const UserUpdate = (
  changes: any,
  currentUser: any,
  setEditMode?: any
) => {
  return async (dispatch: any) => {
    dispatch(
      assignApp({
        submitting: true,
      })
    );

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
    const ref = doc(db, "userProfiles", auth.currentUser!.uid);
    const res = await setDoc(ref, newChanges, { merge: true })
      .then(async () => {
        const profile = await getDoc(ref);

        dispatch(
          assignUser({
            user: profile.data(),
          })
        );

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

    console.log("response", res);
    if (setEditMode) {
      setEditMode(false);
    }

    dispatch(
      assignApp({
        submitting: false,
      })
    );

    return res;
  };
};

export const SearchUsers = (changes: any) => {
  return async (dispatch: any) => {
    dispatch(
      updateApp({
        submitting: true,
      })
    );

    

     
    // ([
    //   { uid: "uid1" },
    //   { email: "user2@example.com" },
    //   { phoneNumber: "+15555550003" },
    //   { providerId: "google.com", providerUid: "google_uid4" },
    // ]);
    console.log('check username')
    if (changes.username) {
      console.log('retrieving users')
      const q = query(collection(db, "userProfiles"), where("username", ">=", changes.username.toLowerCase()));
      const res = (await getDocs(q));
      const users: any[] = []
      if(res) {
        res.forEach(doc => { 
          users.push(doc.data())
        })
      }
      
      dispatch(updateApp({
        users: users
      }))
    }

    dispatch(
      updateApp({
        submitting: false,
      })
    );
  };
};
