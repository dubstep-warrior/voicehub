import { User } from "firebase/auth";

export interface VHUser extends User {
    status?: string
}