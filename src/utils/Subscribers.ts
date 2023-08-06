import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  addFirebaseListener,
  update as updateApp,
  updateAppMessages,
} from "../store/slices/app.slice";
import { auth, db } from "../../firebase";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/slices/user.slice";

// const userState = useAppSelector(selectUser);

export const getChatSubscription = (id: string) => {
  return async (dispatch: any, getState: any) => {
    const messageQuery = query(
      collection(doc(db, "chats", id), "messages"),
      orderBy("created")
    );

    dispatch(
      addFirebaseListener({
        listener: onSnapshot(messageQuery, async (snapshot) => {
          const messages: any[] = [];
          const notifications: any[] = [];
          snapshot.forEach((messageDoc) => {
            const message = messageDoc.data();

            if (
              message.by !== auth.currentUser?.uid &&
              message.chatID in getState().user.chats.chat &&
              message.desc.includes("@")
            ) {
              const tags = message.desc
                .split(" ")
                .filter((word: string) => word.includes("@"));
              if (
                tags.some(
                  (tag: string) => tag == `@${getState().user.displayedName}`
                )
              ) {
                notifications.push({
                  ...message,
                  created: new Date(
                    messageDoc.data().created
                  ).toLocaleDateString("en-US"),
                  images:
                    message?.images?.map((uri: string, index: number) => {
                      return {
                        id: index,
                        uri: uri,
                        url: uri,
                        source: { uri: uri },
                      };
                    }) ?? [],
                  id: messageDoc.id,
                });
              }
            }

            messages.push({
              ...message,
              created: new Date(messageDoc.data().created).toLocaleDateString(
                "en-US"
              ),
              images:
                message?.images?.map((uri: string, index: number) => {
                  return {
                    id: index,
                    uri: uri,
                    url: uri,
                    source: { uri: uri },
                  };
                }) ?? [],
              id: messageDoc.id,
            });
          });

          dispatch(
            updateApp({
              notifications: notifications,
            })
          );

          dispatch(
            updateAppMessages({
              messages: messages,
              chat_id: id,
            })
          );
        }),
      })
    );
  };
};
