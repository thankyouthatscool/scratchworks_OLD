import { Button, Text } from "react-native";

import { ScreenContainer } from "@components/ScreenContainer";
import { HomeScreenProps } from "@types";

export const HomeScreenRoot = ({ navigation }: HomeScreenProps) => {
  return (
    <ScreenContainer>
      <Text>HomeScreenRoot</Text>
      <Button
        onPress={() => {
          navigation.navigate("PickOrderScreen");
        }}
        title="Pick Orders"
      />
    </ScreenContainer>
  );
};
