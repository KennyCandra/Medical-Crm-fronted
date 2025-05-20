import { User } from "../../public/types/types";
import { userStore } from "../zustand/userStore";

interface AuthHelper {
  (accessToken: string, user: User): void;
}

export const authHelper: AuthHelper = (
  accessToken: string,
  user: User,
): void => {
  const { setUser, setAccessToken } = userStore();
  setAccessToken(accessToken);
  setUser(user);
};
