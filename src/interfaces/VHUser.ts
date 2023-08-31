import { User } from "firebase/auth";

export type UID = string

export type VHUser = User & {
    username: string,
    displayedName: string,
    profile_img?: string | null
    status?: string
}