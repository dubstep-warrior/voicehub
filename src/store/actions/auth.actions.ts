import {
  assign as assignUser,
  update as updateUser,
} from "../slices/user.slice";
import { assign as assignApp } from "../slices/app.slice";
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
  getDoc,
  onSnapshot,
  or,
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
  return async (dispatch: any) => {
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
      onSnapshot(requestQuery, (snapshot) => {
        const pending: any[] = [];
        const requests: any[] = [];
        snapshot.forEach((doc) => {
          const user = doc.data();
          if (user.from == auth.currentUser!.uid) pending.push(user);
          else requests.push(user);
        });

        dispatch(
          updateUser({
            pending: pending,
            requests: requests,
          })
        );
      });

      // const q = query(
      //   collection(db, "userProfiles"),
      //   where(documentId(), "!=", auth.currentUser?.uid)
      // );
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
