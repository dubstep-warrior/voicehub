export type UID = string;
export type FriendID = string;
export type FriendRequestID = string;

export type User = {
  username: string;
  displayedName: string;
  profile_img?: string | null;
  status?: string;
};

export type VHUser = User & {
  uid: UID;
};

export type Connection = {
  uid: UID;
  id: FriendID | FriendRequestID;
};

export type Connections = {
  friends?: Connection[];
  requests?: Connection[];
  pending?: Connection[];
};

export interface UserListReferences {
  dmRef?: string;
  uid?: string;
}

export type UserListUser = VHUser & UserListReferences;
