import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import { ScreenContainer } from "@components/ScreenContainer";
import { HomeScreenRoot } from "@screens/HomeScreenRoot";
import { PickOrderScreen } from "@screens/PickOrderScreen";
import { HomeScreenNavigatorProps } from "@types";

const HomeScreenNavigator =
  createNativeStackNavigator<HomeScreenNavigatorProps>();

export const HomeScreen = () => {
  return (
    <HomeScreenNavigator.Navigator
      initialRouteName="HomeScreenRoot"
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <HomeScreenNavigator.Screen
        component={HomeScreenRoot}
        name="HomeScreenRoot"
      />
      <HomeScreenNavigator.Screen
        component={PickOrderScreen}
        name="PickOrderScreen"
      />
    </HomeScreenNavigator.Navigator>
  );
};
