import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "@screens/LoginScreen";
import { SignUpScreen } from "@screens/SignUpScreen";

import { AuthNavigatorProps } from "@types";

const AuthNavigator = createNativeStackNavigator<AuthNavigatorProps>();

export const AuthScreen = () => {
  return (
    <AuthNavigator.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <AuthNavigator.Screen component={LoginScreen} name="LoginScreen" />
      <AuthNavigator.Screen component={SignUpScreen} name="SignUpScreen" />
    </AuthNavigator.Navigator>
  );
};
