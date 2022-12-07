import * as SecureStore from "expo-secure-store";
import { Button, Text } from "react-native";

import { ScreenContainer } from "@components/ScreenContainer";
import { useAppDispatch } from "@hooks";
import { clearUser } from "@store";

export const HomeScreen = () => {
  const dispatch = useAppDispatch();

  return (
    <ScreenContainer>
      <Text>Home Screen</Text>
      <Button
        onPress={async () => {
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("userData");

          dispatch(clearUser());
        }}
        title="sign out"
      />
    </ScreenContainer>
  );
};
