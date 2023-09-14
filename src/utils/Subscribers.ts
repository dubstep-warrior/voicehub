import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  addFirebaseListener,
  updateAppMessages,
} from "../store/slices/app.slice";
import { db } from "../../firebase"; 

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
          snapshot.forEach((messageDoc) => {
            const message = messageDoc.data(); 
 
            messages.push({
              ...message,
              created: message.created?.toDate(),
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
