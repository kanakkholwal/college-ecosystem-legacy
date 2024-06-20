import { UserWithId } from "src/models/user";

export type sessionUserType = Partial<UserWithId>;

export type sessionType = {
  user: UserWithId;
  expires: Date;
};
