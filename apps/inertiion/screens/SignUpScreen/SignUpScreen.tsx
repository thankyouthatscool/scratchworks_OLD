import { zodResolver } from "@hookform/resolvers/zod";
import * as SecureStore from "expo-secure-store";
import { ComponentPropsWithoutRef } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
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
  SignUpScreenFormProps,
  SignUpScreenProps,
  SignUpScreenTextInputProps,
} from "@types";
import { trpc } from "@utils";

const signUpFormSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password is required - 8 chars min" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password is required - 8 chars min" }),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: "Passwords must match",
      path: ["passwordConfirmation"],
    }
  );

const signUpScreenToastSettings = {
  animation: true,
  duration: Toast.durations.SHORT,
  hideOnPress: true,
  position: Toast.positions.BOTTOM,
  shadow: true,
};

export const SignUpScreen = ({
  navigation,
  route: {
    params: { email },
  },
}: SignUpScreenProps) => {
  const { control, handleSubmit, resetField } = useForm<SignUpScreenFormProps>({
    mode: "onBlur",
    resolver: zodResolver(signUpFormSchema),
  });

  const { mutateAsync: signUpMutateAsync, isLoading: signUpIsLoading } =
    trpc.auth.signUp.useMutation();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<SignUpScreenFormProps> = async ({
    email,
    password,
    passwordConfirmation,
  }) => {
    if (password === passwordConfirmation) {
      try {
        const signUpRes = await signUpMutateAsync({
          application: "INERTIION",
          email,
          password,
        });

        Toast.show(signUpRes.message, signUpScreenToastSettings);

        await Promise.all(
          [
            { item: signUpRes.token, key: "token" },
            { item: signUpRes.userData, key: "userData" },
          ].map(
            async ({ item, key }) =>
              await SecureStore.setItemAsync(key, JSON.stringify(item))
          )
        );

        dispatch(
          setUser({
            application: signUpRes.userData.application,
            email: signUpRes.userData.email,
            id: signUpRes.userData.id,
          })
        );
      } catch (e) {
        if (e instanceof Error) {
          Toast.show(e.message, signUpScreenToastSettings);
        } else {
          Toast.show("GENERIC_ERROR_MESSAGE", signUpScreenToastSettings);
        }
      }

      resetField("email");
      resetField("password");
      resetField("passwordConfirmation");
    } else {
      Toast.show(
        "Password confirmation did not match the password",
        signUpScreenToastSettings
      );
    }
  };

  return (
    <ScreenContainer>
      <SignUpScreenTextInput
        control={control}
        defaultValue={email || ""}
        keyboardType="email-address"
        name="email"
        placeholder="Email Address"
      />
      <SignUpScreenTextInput
        control={control}
        name="password"
        placeholder="Password"
        secure
      />
      <SignUpScreenTextInput
        control={control}
        name="passwordConfirmation"
        placeholder="Confirm Password"
        secure
      />
      <View style={{ flexDirection: "row" }}>
        <AuthScreenButton
          disabled={signUpIsLoading}
          onPress={() => {
            navigation.goBack();
          }}
          secondary
        >
          <AuthScreenButtonText>Back</AuthScreenButtonText>
        </AuthScreenButton>
        <AuthScreenButton
          disabled={signUpIsLoading}
          flex
          marginLeft
          onPress={handleSubmit(onSubmit)}
        >
          <AuthScreenButtonText>
            {signUpIsLoading ? "Signing Up..." : "Sign Up"}
          </AuthScreenButtonText>
        </AuthScreenButton>
      </View>
    </ScreenContainer>
  );
};

export const AuthTextInputBase = (
  props: AuthTextInputProps & ComponentPropsWithoutRef<typeof TextInput>
) => {
  return (
    <TextInput
      autoCapitalize="none"
      defaultValue={props.defaultValue}
      secureTextEntry={!!props.secure}
      {...props}
    />
  );
};

export const SignUpScreenTextInput = ({
  additionalOnChange,
  control,
  defaultValue,
  name,
  secure,
  ...props
}: SignUpScreenTextInputProps &
  ComponentPropsWithoutRef<typeof AuthTextInputBase>) => {
  const {
    field,
    formState: { errors },
  } = useController({ control, defaultValue, name });

  return (
    <View>
      <AuthTextInputBase
        {...props}
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
