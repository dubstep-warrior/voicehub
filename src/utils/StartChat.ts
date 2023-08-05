import { auth } from "../../firebase";
import { useAppDispatch } from "../store/hooks";
import { update as updateApp } from "../store/slices/app.slice";
import { updateUserChat } from "../store/slices/user.slice";

const StartChat = async (selectedUser: any, navigation: any) => {
  console.log('START CHAT CALLED')
  const dispatch = useAppDispatch();
  const dms: any = {};
  dms[`temp-${selectedUser.current.uid}`] = {
    users: [auth.currentUser!.uid, selectedUser.current.uid],
    type: "dms",
  };
 dispatch(
    updateUserChat({
      chat: {
        dms: dms,
      },
    })
  );
  dispatch(
    updateApp({
      home: {
        selectedCat: "dms",
        selectedSubCat: `temp-${selectedUser.current.uid}`,
      },
    })
  );

  
  await navigation.navigate("Main", {
    screen: "Home",
    params: {
      screen: "Chat",
      params: {
        drawerStatus: "closed",
        screen: "Default",
      },
    },
  });
};
export default StartChat
