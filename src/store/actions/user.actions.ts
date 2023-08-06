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
    console.log("user action being run");

    console.log("new changes ", newChanges);
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
      console.log("retrieving users");
      console.log("query: ", changes.username, currentUser);
      const q = query(
        collection(db, "userProfiles"),
        where(documentId(), "!=", auth.currentUser?.uid)
      );
      const res = await getDocs(q);
      const users: any[] = [];
      if (res) {
        res.forEach((doc) => {
          console.log("res:", doc.data());
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
      // console.log('query retrieved: ', users)
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
    console.log("dispatching add user from:", auth.currentUser?.uid);
    console.log("dispatching add user to:", to.uid);
    if (auth.currentUser) {
      addDoc(collection(db, "requests"), {
        from: auth.currentUser?.uid,
        to: to.uid,
      })
        .then(() => {
          console.log("successfully sent a request");
          Alert.alert(
            `Successfully sent a request to ${to.username}`,
            undefined,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        })
        .catch((err) => {
          console.log("cant add user:", err);
          // Alert.alert(`Failed to send a request to ${to.username}`,undefined, [
          //   {text: 'OK', onPress: () => console.log('OK Pressed')},
          // ]);
        });
    }
  };
};

export const removeRequest = (to: any) => {
  return async (dispatch: any) => {
    console.log("dispatching delete request from:", auth.currentUser?.uid);
    console.log("dispatching delete request to:", to.uid);
    if (auth.currentUser) {
      // addDoc(collection(db, "requests"), {
      //   from: auth.currentUser?.uid,
      //   to: to.uid
      // })
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

          console.log("successfully sent a delete request");
          Alert.alert(`Successfully deleted request`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log("cant delete user:", err);
          // Alert.alert(`Failed to send a request to ${to.username}`,undefined, [
          //   {text: 'OK', onPress: () => console.log('OK Pressed')},
          // ]);
        });
    }
  };
};

export const rejectRequest = (from: any) => {
  return async (dispatch: any) => {
    console.log("dispatching reject request to:", from.uid);
    if (auth.currentUser) {
      // addDoc(collection(db, "requests"), {
      //   from: auth.currentUser?.uid,
      //   to: to.uid
      // })
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

          console.log("successfully sent a rejection");
          Alert.alert(`Successfully rejected request`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log("cant delete user:", err);
          // Alert.alert(`Failed to send a request to ${to.username}`,undefined, [
          //   {text: 'OK', onPress: () => console.log('OK Pressed')},
          // ]);
        });
    }
  };
};

export const acceptRequest = (from: any) => {
  return async (dispatch: any) => {
    console.log("dispatching accept request to:", from);
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
          console.log("retrieved", document.id);
          setDoc(doc(db, "friends", document.id), {
            group: [from.uid, auth.currentUser?.uid],
          })
            .then(() => {
              deleteDoc(document.ref);
              // dispatch(addChat({
              //   type: 'dms',
              //   users: [from.uid, auth.currentUser?.uid]
              // }))
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

        // console.log('successfully sent a rejection')
      });
      // addDoc(collection(db, "friends"), {
      //   from: auth.currentUser?.uid,
      //   to: to.uid
      // })
    }
  };
};

export const removeFriend = (friend: any) => {
  return async (dispatch: any) => {
    if (auth.currentUser) {
      console.log("removing friend", friend);
      await deleteDoc(doc(db, "friends", friend.friendshipID))
        .then(() => {
          Alert.alert(`Successfully deleted friend`, undefined, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log(`Request unsuccessful`, err);
          Alert.alert(`Request unsuccessful`, "Please try again later", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        });

      // console.log('successfully sent a rejection')

      // addDoc(collection(db, "friends"), {
      //   from: auth.currentUser?.uid,
      //   to: to.uid
      // })
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
      console.log("ADDING CHAT", chat);
      if ("chat_img" in chat && chat["chat_img"]) {
        const imageURI = await uploadImage(chat["chat_img"], "chat-images");
        chat["chat_img"] = imageURI;
      }

      const res = await addDoc(collection(db, "chats"), {
        ...chat,
      })
        .then((docRef) => {
          console.log("add chat worked");
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

          console.log("successfully added a chat");
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

          console.log("successfully join a chat");
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
     

    // const usersRef = db.collection('users').doc('id')
    // collection(db, 'chats', chat_id)

     

    // SEND MESSAGE
    console.log('sending message chat_id', chat_id)
    const message = {
      ...form,
      chatID: chat_id,
      by: auth.currentUser?.uid,
      created: serverTimestamp(),
    };

    // console.log('CURRENT APP STATE',getState().app)
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
    // .then(() => {
      
    // });
    console.log("SENDING MESSAGE SUCCESFULL YAYYY");

    dispatch(
      updateApp({
        submitting: false,
      })
    );
  };
};
