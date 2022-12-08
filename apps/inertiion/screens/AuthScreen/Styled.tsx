import { ComponentPropsWithoutRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import {
  APP_FONT_SIZE,
  APP_PADDING_SIZE,
  AUTH_BUTTON_ELEVATION,
  BUTTON_COLOR_PRIMARY,
  BUTTON_COLOR_SECONDARY,
  BUTTON_TEXT_COLOR,
  CARD_COLOR,
  TEXT_BOX_BORDER_RADIUS,
  TEXT_BOX_ELEVATION,
  TEXT_BOX_PADDING,
} from "@theme";

export const AuthScreenButton = ({
  disabled,
  flex,
  marginLeft,
  secondary,
  ...props
}: {
  flex?: boolean;
  marginLeft?: boolean;
  secondary?: boolean;
} & ComponentPropsWithoutRef<typeof Pressable>) => {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        authScreenStyles.button,
        {
          backgroundColor: !!disabled
            ? "gray"
            : !!secondary
            ? BUTTON_COLOR_SECONDARY
            : BUTTON_COLOR_PRIMARY,

          elevation: pressed ? 0 : AUTH_BUTTON_ELEVATION,

          flex: !!flex ? 1 : 0,

          marginLeft: !!marginLeft ? APP_PADDING_SIZE : 0,
        },
      ]}
    />
  );
};

export const AuthScreenButtonText = ({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Text>) => {
  return (
    <Text {...props} style={[authScreenStyles.text]}>
      {children}
    </Text>
  );
};

export const authScreenStyles = StyleSheet.create({
  button: {
    borderRadius: TEXT_BOX_BORDER_RADIUS,

    flexDirection: "row",

    justifyContent: "center",

    padding: APP_PADDING_SIZE * 2,
  },
  text: {
    color: BUTTON_TEXT_COLOR,

    fontSize: APP_FONT_SIZE * 1.5,
    fontWeight: "bold",

    textAlign: "center",
  },
  textInput: {
    backgroundColor: CARD_COLOR,
    borderRadius: TEXT_BOX_BORDER_RADIUS,
    borderWidth: 2,

    elevation: TEXT_BOX_ELEVATION,

    fontSize: APP_FONT_SIZE,

    padding: TEXT_BOX_PADDING,
  },
});
