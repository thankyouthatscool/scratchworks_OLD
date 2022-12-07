import type { Control } from "react-hook-form";

export type AuthTextInputProps = {
  additionalOnChange?: (value: string) => void;
  secure?: boolean;
};

// Sign Up Form
export type SignUpScreenFormProps = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type SignUpFormFieldNames = keyof SignUpScreenFormProps;

export type SignUpScreenTextInputProps = {
  control: Control<SignUpScreenFormProps>;
  name: SignUpFormFieldNames;
};

// Login Form
export type LoginScreenFormProps = {
  email: string;
  password: string;
};

export type LoginFormFieldNames = keyof LoginScreenFormProps;

export type LoginScreenTextInputProps = {
  control: Control<LoginScreenFormProps>;
  name: LoginFormFieldNames;
};
