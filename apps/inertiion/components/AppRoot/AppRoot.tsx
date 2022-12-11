import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import * as SecureStorage from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-root-toast";

import { useAppDispatch, useAppSelector, useAuthHooks } from "@hooks";
import { AuthScreen } from "@screens/AuthScreen";
import { HomeScreen } from "@screens/HomeScreen";
import { clearUser, setUser } from "@store";
import { APP_FONT_SIZE } from "@theme";
import { LocalUser, RootNavigatorProps } from "@types";
import { trpc } from "@utils";

const appRootToastSettings = {
  animation: true,
  duration: Toast.durations.SHORT,
  hideOnPress: true,
  position: Toast.positions.BOTTOM,
  shadow: true,
};

const RootNavigator = createDrawerNavigator<RootNavigatorProps>();

export const AppRoot = () => {
  const { user } = useAppSelector(({ app }) => app);

  const dispatch = useAppDispatch();

  const initialLoadRef = useRef<boolean>(false);

  const { mutateAsync: verifyToken } = trpc.auth.verifyToken.useMutation();

  const handleInitialLoad = async () => {
    const [token, userData] = await Promise.all(
      ["token", "userData"].map(
        async (item) => await SecureStorage.getItemAsync(item)
      )
    );

    if (!!userData) {
      const user = JSON.parse(userData) as LocalUser;

      dispatch(setUser(user));
    }

    if (!!token) {
      try {
        const { status } = await verifyToken({
          token: JSON.parse(token),
        });

        if (status !== "OK") {
          throw new Error("Invalid token.");
        }
      } catch (e) {
        if (e instanceof Error) {
          Toast.show(
            `${e.message}\nPlease log in again.`,
            appRootToastSettings
          );
        }

        await SecureStorage.deleteItemAsync("token");
        await SecureStorage.deleteItemAsync("userData");

        dispatch(clearUser());
      }
    }

    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (!initialLoadRef.current) {
      handleInitialLoad();
    }

    initialLoadRef.current = true;
  }, [initialLoadRef]);

  return (
    <RootNavigator.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="AuthScreen"
      screenOptions={{ headerShown: false }}
    >
      {!!user ? (
        <RootNavigator.Screen
          component={HomeScreen}
          name="HomeScreen"
          options={{ title: "Home" }}
        />
      ) : (
        <RootNavigator.Screen
          component={AuthScreen}
          name="AuthScreen"
          options={{ title: "Login" }}
        />
      )}
    </RootNavigator.Navigator>
  );
};

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { signOut } = useAuthHooks();

  const { user } = useAppSelector(({ app }) => app);

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: APP_FONT_SIZE * 2 }}>
          INERTiiON!
        </Text>
      </View>
      <DrawerItemList {...props} />
      {!!user && (
        <DrawerItem
          label="Sign Out"
          onPress={async () => {
            await signOut();

            props.navigation.closeDrawer();
          }}
        />
      )}
    </DrawerContentScrollView>
  );
};
