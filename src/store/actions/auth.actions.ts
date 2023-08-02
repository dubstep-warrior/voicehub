import {
  assign as assignUser,
  update as updateUser,
  updateUserChat,
  updateUserChatMessages,
} from "../slices/user.slice";
import { assign as assignApp, update as updateApp, updateAppMessages } from "../slices/app.slice";
import { auth, db } from "../../../firebase";
import {
  EmailAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";

export const resolveAccess = (data: any, current: string) => {
  //   const dispatch = useAppDispatch();
  return async (dispatch: any) => {
    console.log("logging in");

    dispatch(
      assignApp({
        submitting: true,
      })
    );

    const res = (await (current == "register"
      ? createUserWithEmailAndPassword(auth, data.email, data.password)
      : signInWithEmailAndPassword(auth, data.email, data.password)
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (current == "register") {
          await setDoc(doc(db, "userProfiles", user.uid!), {
            username:
              auth.currentUser?.email?.split("@")[0] + " " + user.uid.slice(-4),
            displayedName: auth.currentUser?.email?.split("@")[0],
          });
        }

        // const profile = await getDoc(doc(db, "userProfiles", user.uid!));

        dispatch(AuthOnRender);

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

    dispatch(
      assignApp({
        submitting: false,
      })
    );
    return res;
  };
};

export const AuthOnRender = () => {
  console.log("auth on render calle0");
  return async (dispatch: any, getState: any) => {
    console.log("auth on render called");
    if (auth.currentUser) {
      // const profile = await getDoc(
      //   doc(db, "userProfiles", auth.currentUser.uid!)
      // );
      onSnapshot(doc(db, "userProfiles", auth.currentUser.uid!), (profile) => {
        dispatch(
          assignUser({
            user: profile.data(),
          })
        );
      });

      const requestQuery = query(
        collection(db, "requests"),
        or(
          where("from", "==", auth.currentUser.uid),
          where("to", "==", auth.currentUser.uid)
        )
      );
      onSnapshot(requestQuery, async (snapshot) => {
        const pending: any[] = ["xxx"],
          requests: any[] = ["xxx"];
        snapshot.forEach((doc) => {
          const request = doc.data();
          if (request.from == auth.currentUser!.uid) pending.push(request.to);
          else requests.push(request.from);
        });

        const pendingQuery = query(
          collection(db, "userProfiles"),
          where(documentId(), "in", pending)
        );

        const requestsQuery = query(
          collection(db, "userProfiles"),
          where(documentId(), "in", requests)
        );

        const [pendingRes, requestsRes] = await Promise.all([
          getDocs(pendingQuery),
          getDocs(requestsQuery),
        ]);

        const pendingProfiles: any[] = [],
          requestsProfiles: any[] = [];

        pendingRes.forEach((doc) => {
          pendingProfiles.push({ ...doc.data(), uid: doc.id });
        });

        requestsRes.forEach((doc) => {
          requestsProfiles.push({ ...doc.data(), uid: doc.id });
        });

        dispatch(
          updateUser({
            pending: pendingProfiles,
            requests: requestsProfiles,
          })
        );
      });

      const friendsQuery = query(
        collection(db, "friends"),
        where("group", "array-contains", auth.currentUser.uid)
      );

      onSnapshot(friendsQuery, async (snapshot) => {
        const friends: any[] = ["xxx"];
        const friendshipRef: any = {};
        snapshot.forEach((doc) => {
          const friend = doc.data();
          const friendUID = friend.group.find(
            (uid: string) => uid !== auth.currentUser!.uid
          );
          friends.push(friendUID);
          friendshipRef[friendUID] = doc.id;
        });

        const q = query(
          collection(db, "userProfiles"),
          where(documentId(), "in", friends)
        );

        const res = await getDocs(q);

        const friendProfiles: any[] = [];

        res.forEach((doc) => {
          friendProfiles.push({
            ...doc.data(),
            uid: doc.id,
            friendshipID: friendshipRef[doc.id],
          });
        });

        dispatch(
          updateUser({
            friends: friendProfiles,
          })
        );
      });

      const chatsQeury = query(
        collection(db, "chats"),
        where("users", "array-contains", auth.currentUser?.uid)
      ); 
      onSnapshot(chatsQeury, async (snapshot) => {
        const chats: any = {
          chat: {},
          p2p: {},
        };

        let users: Set<string> | string[] = new Set();
        snapshot.forEach((document) => {
          const chat = document.data();

          users = new Set([...users, ...chat.users]);
          chats[chat.type][document.id] = { ...chat }; 
        });

        users = Array.from(users);

        const q = query(
          collection(db, "userProfiles"),
          where(documentId(), "in", users)
        );

        const res = await getDocs(q);
        const profiles: any = {};
        res.forEach((doc) => {
          profiles[doc.id] = doc.data();
        });

        dispatch(
          updateApp({
            userProfiles: profiles,
          })
        );

         dispatch(
          updateUser({
            chats: chats,
          })
        );
 
      });

      

      const chats = await getDocs(chatsQeury)
      // console.log('gathered chatIDS', chatIDs)
      chats.forEach((document) => {
        const id = document.id
        const messagesQuery = query(
          collection(doc(db, "chats", id), "messages"),
          orderBy("created")
        );
         
        onSnapshot(messagesQuery, async (snapshot) => {
          const messages: any[] = []
          snapshot.forEach((messageDoc) => {
            const message = messageDoc.data();
            messages.push({
              ...message,
              created: new Date(messageDoc.data().created).toLocaleDateString(
                "en-US"
              ),
              id: messageDoc.id,
            });
          });
           
          dispatch(
            updateAppMessages({
              messages: messages,
              chat_id: id
            })
          );
        });
      });
    } else {
      console.log("but no auth current user");
    }
  };
};

export const AuthRemove = () => {
  return async (dispatch: any) => {
    dispatch(
      assignApp({
        submitting: true,
      })
    );

    await signOut(auth)
      .then((res) => {
        dispatch(
          assignUser({
            user: {},
          })
        );
      })
      .catch((err) => {});

    dispatch(
      assignApp({
        submitting: false,
      })
    );
  };
};

export const AuthUpdate = (
  formValues: any,
  route: any,
  navigation: StackNavigationProp<any, any>,
  setFormInvalid: any
) => {
  return async (dispatch: any) => {
    dispatch(
      assignApp({
        submitting: true,
      })
    );

    const credential = EmailAuthProvider.credential(
      auth.currentUser?.email!,
      formValues["currentPassword"]
    );

    const reauth = await reauthenticateWithCredential(
      auth.currentUser!,
      credential
    );

    if (reauth && reauth.user) {
      if (route.params!.key === "password") {
        //password
        if (formValues["newPassword"] !== formValues["confirmNewPassword"]) {
          setFormInvalid("Ensure your new passwords match!");
          console.log("password no match");
        } else {
          console.log("updaing password");
          updatePassword(auth.currentUser!, formValues["newPassword"])
            .then(() => navigation.goBack())
            .catch((err) => {
              console.log(err.code);
              setFormInvalid("There was an issue updating your password");
            });
        }
      } else {
        //email
        updateEmail(auth.currentUser!, formValues["email"]!)
          .then(() => {
            console.log("success");
            navigation.goBack();
          })
          .catch((error) => {
            console.log("fail", error);
            setFormInvalid(
              `There was an error changing your ${route.params!.name.toLowerCase()}`
            );
          });
      }
    } else {
      setFormInvalid("Your password is invalid");
    }

    dispatch(
      assignApp({
        submitting: false,
      })
    );
  };
};
