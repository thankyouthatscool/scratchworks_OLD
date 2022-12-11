import * as SecureStorage from "expo-secure-store";
import { useCallback } from "react";

import { useAppDispatch } from "@store/hooks";
import { clearUser } from "@store/appSlice";

export const useAuthHooks = () => {
  const dispatch = useAppDispatch();

  const signOut = useCallback(async () => {
    await SecureStorage.deleteItemAsync("token");
    await SecureStorage.deleteItemAsync("userData");

    dispatch(clearUser());
  }, []);

  return { signOut };
};
