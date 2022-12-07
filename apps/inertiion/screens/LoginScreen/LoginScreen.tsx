import { zodResolver } from "@hookform/resolvers/zod";
import * as SecureStore from "expo-secure-store";
import { ComponentPropsWithoutRef, useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

import {
  AuthScreenButton,
  AuthScreenButtonText,
  authScreenStyles,
} from "../AuthScreen/Styled";
import { ScreenContainer } from "@components/ScreenContainer";
import { useAppDispatch } from "@hooks";
import { setUser } from "@store";
import { ERROR_CODE_COLOR } from "@theme";
import {
  AuthTextInputProps,
  LoginScreenProps,
  LoginScreenFormProps,
  LoginScreenTextInputProps,
} from "@types";
import { trpc } from "@utils";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password is required - 8 characters minimum" }),
});

const loginScreenToastSettings = {
  animation: true,
  duration: Toast.durations.SHORT,
  hideOnPress: true,
  position: Toast.positions.BOTTOM,
  shadow: true,
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const dispatch = useAppDispatch();

  const [tempEmail, setTempEmail] = useState<string>("");

  const { control, handleSubmit, resetField } = useForm<LoginScreenFormProps>({
    mode: "onBlur",
    resolver: zodResolver(loginFormSchema),
  });

  const { mutateAsync: loginMutateAsync, isLoading: loginIsLoading } =
    trpc.auth.login.useMutation();

  const onSubmit: SubmitHandler<LoginScreenFormProps> = async ({
    email,
    password,
  }) => {
    try {
      const loginRes = await loginMutateAsync({ email, password });

      Toast.show(`${email} signed in successfully!`, loginScreenToastSettings);

      await Promise.all(
        [
          { item: loginRes.token, key: "token" },
          { item: loginRes.userData, key: "userData" },
        ].map(
          async ({ item, key }) =>
            await SecureStore.setItemAsync(key, JSON.stringify(item))
        )
      );

      resetField("email");
      resetField("password");

      dispatch(setUser({ ...loginRes.userData }));
    } catch (e) {
      if (e instanceof Error) {
        Toast.show(e.message, loginScreenToastSettings);
      } else {
        Toast.show("GENERIC_ERROR_MESSAGE", loginScreenToastSettings);
      }
    }
  };

  return (
    <ScreenContainer>
      <LoginScreenTextInput
        additionalOnChange={(e) => setTempEmail(() => e)}
        control={control}
        keyboardType="email-address"
        name="email"
        placeholder="Email"
      />
      <LoginScreenTextInput
        control={control}
        name="password"
        placeholder="Password"
        secure
      />
      <View style={{ flexDirection: "row" }}>
        <AuthScreenButton
          disabled={!!loginIsLoading}
          onPress={() => {
            navigation.navigate("SignUpScreen", { email: tempEmail });
          }}
          secondary
        >
          <AuthScreenButtonText>Sign Up</AuthScreenButtonText>
        </AuthScreenButton>
        <AuthScreenButton
          disabled={!!loginIsLoading}
          flex
          marginLeft
          onPress={handleSubmit(onSubmit)}
        >
          <AuthScreenButtonText>
            {loginIsLoading ? "Logging in..." : "Log in"}
          </AuthScreenButtonText>
        </AuthScreenButton>
      </View>
    </ScreenContainer>
  );
};

export const LoginScreenTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: AuthTextInputProps &
  LoginScreenTextInputProps &
  ComponentPropsWithoutRef<typeof TextInput>) => {
  const {
    field,
    formState: { errors },
  } = useController({ control, defaultValue, name });

  return (
    <View>
      <TextInput
        {...props}
        autoCapitalize="none"
        onBlur={field.onBlur}
        onChangeText={(e) => {
          if (!!additionalOnChange) {
            additionalOnChange(e);
          }

          field.onChange(e);
        }}
        secureTextEntry={!!secure}
        style={[
          authScreenStyles.textInput,
          {
            borderColor: !!errors[name] ? "red" : "white",
          },
        ]}
        value={field.value}
      />
      <Text style={{ color: ERROR_CODE_COLOR }}>{errors[name]?.message}</Text>
    </View>
  );
};
