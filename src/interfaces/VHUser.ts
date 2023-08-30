import { User } from "firebase/auth";

export type UID = string

export interface VHUser extends User {
    status?: string
}