import { REACT_APP_BACKEND_URL } from "@env";
import ApiConfig from "../../../config/api-config.json";
import { update } from "../slices/user.slice";
import { Platform } from "react-native/Libraries/Utilities/Platform";
import { assign as assignUser } from "../slices/user.slice";

import { auth, db } from "../../../firebase";
import {
  FieldPath,
  addDoc,
  and,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  addAppMessage,
  assign as assignApp,
  update as updateApp,
  updateAppMessages,
} from "../slices/app.slice";
import { getAuth } from "firebase/auth";
import { Alert } from "react-native";
import uploadImage from "../../utils/FileUploader";
import { getChatSubscription } from "../../utils/Subscribers";

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
    if ("profile_img" in newChanges) {
      const imageURI = await uploadImage(
        newChanges["profile_img"],
        "profile-images"
      );
      newChanges["profile_img"] = imageURI;
    }
    const ref = doc(db, "userProfiles", auth.currentUser!.uid);
    const res = await setDoc(ref, newChanges, { merge: true })
      .then(async () => {
        // const profile = await getDoc(ref);

        // dispatch(
        //   assignUser({
        //     user: profile.data(),
        //   })
        // );

        return {
          success: true,
          // data: profile.data(),
        };
      })
      .catch((error) => {
        return {
          success: false,
          error: error,
        };
      });
 
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

export const SearchUsers = (changes: any, currentUser: any) => {
  return async (dispatch: any, getState: any) => {
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

    // TODO use cloud functions
    // const currentUser = getState().user
    if (changes.username) { 
      const q = query(
        collection(db, "userProfiles"),
        where(documentId(), "!=", auth.currentUser?.uid)
      );
      const res = await getDocs(q);
      const users: any[] = [];
      if (res) {
        res.forEach((doc) => { 
          const user = doc.data();
          // const filter = [...getState().user.friends,]
          if (
            user.username
              .trim()
              .toLowerCase()
              .includes(changes.username.trim().toLowerCase())
          ) {
            users.push({ ...doc.data(), uid: doc.id });
          }
        });
      } 
      dispatch(
        updateApp({
          users: users,
          submitting: false,
        })
      );
    }

    dispatch(
      updateApp({
        submitting: false,
      })
    );
  };
};

export const addUser = (to: any) => {
  return async (dispatch: any) => { 
    if (auth.currentUser) {
      addDoc(collection(db, "requests"), {
        from: auth.currentUser?.uid,
        to: to.uid,
      })
        .then(() => { 
          Alert.alert(
            `Successfully sent a request to ${to.username}`,
            undefined,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        })
        .catch((err) => {
          console.log("cant add user:", err); 
        });
    }
  };
};

export const removeRequest = (to: any) => {
  return async (dispatch: any) => { 
    if (auth.currentUser) { 
      const q = query(
        collection(db, "requests"),
        and(
          where("from", "==", auth.currentUser?.uid),
          where("to", "==", to.uid)
        )
      );
      getDocs(q)
        .then((snapshot) => {
          snapshot.forEach((doc) => deleteDoc(doc.ref));
 
          Alert.alert(`Successfully deleted request`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log("cant delete user:", err); 
        });
    }
  };
};

export const rejectRequest = (from: any) => {
  return async (dispatch: any) => { 
    if (auth.currentUser) { 
      const q = query(
        collection(db, "requests"),
        and(
          where("from", "==", from.uid),
          where("to", "==", auth.currentUser?.uid)
        )
      );
      getDocs(q)
        .then((snapshot) => {
          snapshot.forEach((doc) => deleteDoc(doc.ref)); 
          Alert.alert(`Successfully rejected request`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log("cant delete user:", err); 
        });
    }
  };
};

export const acceptRequest = (from: any) => {
  return async (dispatch: any) => { 
    if (auth.currentUser) {
      const q = query(
        collection(db, "requests"),
        and(
          where("from", "==", from.uid),
          where("to", "==", auth.currentUser?.uid)
        )
      );
      getDocs(q).then((snapshot) => {
        snapshot.forEach(async (document) => { 
          setDoc(doc(db, "friends", document.id), {
            group: [from.uid, auth.currentUser?.uid],
          })
            .then(() => {
              deleteDoc(document.ref); 
              Alert.alert(`Successfully accepted request`, undefined, [
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]);
            })
            .catch((err) => {
              console.log("request accept unsuccessful:", err);
              Alert.alert(
                `Request unsuccessful`,
                "There was a problem trying to accept your friend request, please try again later",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
              );
            });
        });
 
      }); 
    }
  };
};

export const removeFriend = (friend: any) => {
  return async (dispatch: any) => {
    if (auth.currentUser) { 
      await deleteDoc(doc(db, "friends", friend.friendshipID))
        .then(() => {
          Alert.alert(`Successfully deleted friend`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => { 
          Alert.alert(`Request unsuccessful`, "Please try again later", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }); 
    }
  };
};

export const addChat = (chatObject: any): any => {
  return async (dispatch: any) => {
    if (auth.currentUser) {
      dispatch(
        updateApp({
          submitting: true,
        })
      );

      const chat = chatObject; 
      if ("chat_img" in chat && chat["chat_img"]) {
        const imageURI = await uploadImage(chat["chat_img"], "chat-images");
        chat["chat_img"] = imageURI;
      }

      const res = await addDoc(collection(db, "chats"), {
        ...chat,
      })
        .then((docRef) => { 
          dispatch(getChatSubscription(docRef.id)).then(async () => {
            await dispatch(
              updateApp({
                home: {
                  selectedCat: chat.type,
                  selectedSubCat: docRef.id,
                },
              })
            ); 
          });
 
          if (chat.type == "chat") {
            Alert.alert(`Successfully added chat ${chat.name}`, undefined, [
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
          }
          return {
            success: true,
            data: docRef,
          };
        })
        .catch((err) => {
          console.log("cant add chat:", err);
          if (chat.type == "chat") {
            Alert.alert(
              `Could not add chat ${chat.name}`,
              "There was an issue with adding your chat, please try again later",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
          }
          if (chat.type == "dms") {
            Alert.alert(
              `Could not send message`,
              "There was an issue, please try again later",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
          }
          return {
            success: false,
            data: err,
          };
        });

      dispatch(
        updateApp({
          submitting: false,
        })
      );

      return res;
    } else {
      return {
        success: false,
        data: 'Not logged in'
      }
    }
  };
};

export const joinChat = (form: any) => {
  return async (dispatch: any) => {
    if (auth.currentUser) {
      dispatch(
        updateApp({
          submitting: true,
        })
      );

      const ref = doc(db, "chats", form.chat_id);
      await updateDoc(ref, {
        users: arrayUnion(auth.currentUser!.uid),
      })
        .then(() => {
          dispatch(getChatSubscription(form.chat_id)).then(async () => {
            await dispatch(
              updateApp({
                home: {
                  selectedCat: 'chat',
                  selectedSubCat: form.chat_id,
                },
              })
            ); 
          });
 
          Alert.alert(`Successfully joined chat!`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log("cant join chat:", err);
          Alert.alert(
            `Could not join chat`,
            "There was an issue with joining the chat, please try again later",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        });

      dispatch(
        updateApp({
          submitting: false,
        })
      );
    }
  };
};

export const addMessage = (form: any, chat_id: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch(
      updateApp({
        submitting: true,
      })
    ); 

     

    // SEND MESSAGE
    console.log('sending message chat_id', chat_id)
    const message = {
      ...form,
      chatID: chat_id,
      by: auth.currentUser?.uid,
      created: serverTimestamp(),
    };
 
    dispatch(addAppMessage({
      chat_id: chat_id,
      message: message
    }))

    if ("images" in message && message["images"]?.length > 0) {
      const imageURIs = await Promise.all(
        message["images"].map((image: any) =>
          uploadImage(image, "message-images")
        )
      );
      message["images"] = imageURIs;
    }

    await addDoc(collection(doc(db, "chats", chat_id!), "messages"), message)
   

    dispatch(
      updateApp({
        submitting: false,
      })
    );
  };
};


export const leaveChat = (chat_id: string) => {
  return async (dispatch: any, getState: any) => {
    const ref = doc(db, "chats", chat_id);
    await updateDoc(ref, {
      users: arrayRemove(auth.currentUser!.uid),
    }).then(() => { 
      Alert.alert(`Successfully left chat!`, undefined, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      dispatch( updateApp({
        home: {
          selectedCat: 'dms',
          selectedSubCat:( !!Object.keys(getState?.user?.chats?.dms ?? {}).length ? Object.keys(getState.user.chats.dms)[0] : null),
        },
      }))
    })
    .catch((err) => {
      console.log("cant join chat:", err);
      Alert.alert(
        `Could not leave chat`,
        "There was an issue with leaving the chat, please try again later",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    });
  };
};


export const deleteChat = (chat_id: string) => {
  return async (dispatch: any, getState: any) => {
    const ref = doc(db, "chats", chat_id);
    await deleteDoc(ref).then(() => { 
      Alert.alert(`Successfully deleted chat!`, undefined, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      dispatch( updateApp({
        home: {
          selectedCat: 'dms',
          selectedSubCat:( !!Object.keys(getState?.user?.chats?.dms ?? {}).length ? Object.keys(getState.user.chats.dms)[0] : null),
        },
      }))
    })
    .catch((err) => {
      console.log("cant delete chat:", err);
      Alert.alert(
        `Could not delete chat`,
        "There was an issue with deleting the chat, please try again later",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    });
  };
};
