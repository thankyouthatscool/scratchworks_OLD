import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Navigators
export type RootNavigatorProps = {
  AuthScreen: undefined;
  HomeScreen: undefined;
  PickScreen: undefined;
  SettingsScreen: undefined;
};

export type AuthNavigatorProps = {
  LoginScreen: { email?: string };
  ForgotPasswordScreen: { email?: string };
  SignUpScreen: { email?: string };
};

export type HomeScreenNavigatorProps = {
  HomeScreenRoot: undefined;
  PickOrderScreen: undefined;
};

// Screens
export type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthNavigatorProps, "LoginScreen">,
  DrawerScreenProps<RootNavigatorProps>
>;

export type SignUpScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthNavigatorProps, "SignUpScreen">,
  DrawerScreenProps<RootNavigatorProps>
>;

export type ForgotPasswordScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthNavigatorProps, "ForgotPasswordScreen">,
  DrawerScreenProps<RootNavigatorProps>
>;

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeScreenNavigatorProps, "HomeScreenRoot">,
  DrawerScreenProps<RootNavigatorProps>
>;
