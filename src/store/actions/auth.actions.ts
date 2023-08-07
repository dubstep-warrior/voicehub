import {
  assign as assignUser, 
  update as updateUser,
  updateUserChat,
  updateUserChatMessages,
} from "../slices/user.slice";
import {
  addFirebaseListener,
  assign as assignApp,
  clearFirebase,
  update as updateApp,
  updateAppMessages,
} from "../slices/app.slice";
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
import { getChatSubscription } from "../../utils/Subscribers";

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

    dispatch(updateApp({
      loading: true
    }))

    if (auth.currentUser) {
      // const profile = await getDoc(
      //   doc(db, "userProfiles", auth.currentUser.uid!)
      // );
      dispatch(
        addFirebaseListener({
          listener: onSnapshot(
            doc(db, "userProfiles", auth.currentUser.uid!),
            (profile) => {
              dispatch(
                assignUser({
                  user: profile.data(),
                })
              );
            }
          ),
        })
      );

      const requestQuery = query(
        collection(db, "requests"),
        or(
          where("from", "==", auth.currentUser.uid),
          where("to", "==", auth.currentUser.uid)
        )
      );
      dispatch(
        addFirebaseListener({
          listener: onSnapshot(requestQuery, async (snapshot) => {
            const pending: any[] = [],
              requests: any[] = [];
            snapshot.forEach((doc) => {
              const request = doc.data();
              if (request.from == auth.currentUser!.uid)
                pending.push({ uid: request.to, id: doc.id });
              else requests.push({ uid: request.from, id: doc.id });
            });

            dispatch(
              updateUser({
                pending: pending,
                requests: requests,
              })
            );
          }),
        })
      );

      const friendsQuery = query(
        collection(db, "friends"),
        where("group", "array-contains", auth.currentUser.uid)
      );

      dispatch(
        addFirebaseListener({
          listener: onSnapshot(friendsQuery, async (snapshot) => {
            const friends: any[] = [];
            snapshot.forEach((doc) => {
              const friend = doc.data();
              const friendUID = friend.group.find(
                (uid: string) => uid !== auth.currentUser!.uid
              );
              friends.push({ uid: friendUID, friendshipRef: doc.id });
            });

            dispatch(
              updateUser({
                friends: friends,
              })
            );
          }),
        })
      );

      const chatsQeury = query(
        collection(db, "chats"),
        where("users", "array-contains", auth.currentUser?.uid)
      );
      dispatch(
        addFirebaseListener({
          listener: onSnapshot(chatsQeury, async (snapshot) => {
            const chats: any = {
              chat: {},
              dms: {},
            };
            snapshot.forEach((document) => {
              const chat = document.data();
              chats[chat.type][document.id] = { ...chat, id: document.id };

              // if (
              //   !!getState?.app?.call &&
              //   getState?.app?.call == document.id &&
              //   !!chat?.answer
              // ) {
              //   const answer = new RTCSessionDescription(chat.answer);
              //   getState.app.RTCPeerConnection.setRemoteDescription(answer);
              // }
            });
            // dispatch(updateDMReferences(users))

            dispatch(
              updateUser({
                chats: chats,
              })
            );

            if (!!Object.keys(chats.dms).length) {
              console.log('yes this is true we are setting dms')
              dispatch(
                updateApp({
                  home: {
                    selectedCat: "dms",
                    selectedSubCat: Object.keys(chats.dms)[0],
                  },
                })
              );
            }
          }),
        })
      );

      const chats = await getDocs(chatsQeury);
      // console.log('gathered chatIDS', chatIDs)
      chats.forEach((document) => {
        const id = document.id;
        dispatch(getChatSubscription(id));
      });

      const allUsers = query(collection(db, "userProfiles"));

      dispatch(
        addFirebaseListener({
          listener: onSnapshot(allUsers, async (snapshot) => {
            const profiles: any = {};
            snapshot.forEach((document) => {
              const user = document.data();
              profiles[document.id] = { ...user, uid: document.id };
            });

            console.log("updating profiles here", Object.keys(profiles));
            dispatch(
              updateApp({
                userProfiles: profiles,
              })
            );
          }),
        })
      );
    } else {
      console.log("but no auth current user");
    }

    dispatch(updateApp({
      loading: false
    }))

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
        dispatch(clearFirebase());
        dispatch(
          updateApp({
            submitting: false,
            users: [],
            home: {
              selectedCat: "dms",
              selectedSubCat: null,
            },
            messages: {},
            userProfiles: {},
            call: null,
            firebaseListeners: [],
            notifications: []
          })
        );
        dispatch(updateUser({
          profile_img: null,
          username: "",
          displayedName: "",
          chats: {
            chat: {},
            dms: {},
          },
        }));
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
