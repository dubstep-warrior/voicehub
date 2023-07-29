import { NavigationProps } from "../interfaces/NavigationProps.interface";
import UpdateField from "./UpdateField";

export default function AddFriend({ route, navigation }: NavigationProps) {

    // TODO do retrieve of email on dispatch
    return(
        <UpdateField
        route={route}
        navigation={navigation}
        ></UpdateField>
    )

}