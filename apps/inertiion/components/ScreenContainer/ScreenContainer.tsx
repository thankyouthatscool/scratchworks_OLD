import { ComponentPropsWithoutRef } from "react";
import { Dimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { APP_PADDING_SIZE } from "@theme";

const { height } = Dimensions.get("screen");

export const ScreenContainer = ({
  children,
}: ComponentPropsWithoutRef<typeof SafeAreaView>) => {
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        {
          height: height - (top + APP_PADDING_SIZE),

          padding: APP_PADDING_SIZE,
        },
      ]}
    >
      {children}
    </SafeAreaView>
  );
};
