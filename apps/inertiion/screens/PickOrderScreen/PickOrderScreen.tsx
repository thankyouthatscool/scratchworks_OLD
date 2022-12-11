import axios from "axios";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import { Button, Text } from "react-native";
import Toast from "react-native-root-toast";
import UUID from "react-native-uuid";

import { ScreenContainer } from "@components/ScreenContainer";
import { trpc } from "@utils";

const pickOrderScreenToastSettings = {
  animation: true,
  duration: Toast.durations.SHORT,
  hideOnPress: true,
  position: Toast.positions.BOTTOM,
  shadow: true,
};

export const PickOrderScreen = () => {
  const { mutateAsync: uploadOrderImageMutateAsync } =
    trpc.order.uploadOrderImage.useMutation();

  const { mutateAsync: analyzeOrderImageMutateAsync } =
    trpc.order.analyzeOrderImage.useMutation();

  const handlePickImage = async (imageSource: "camera" | "library") => {
    try {
      let imagePickerRes: ImagePicker.ImagePickerResult;

      const imagePickerOptions = {
        allowsEditing: true,
        allowsMultipleSelection: false,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.25,
      };

      if (imageSource === "camera") {
        imagePickerRes = await ImagePicker.launchCameraAsync(
          imagePickerOptions
        );
      } else {
        imagePickerRes = await ImagePicker.launchImageLibraryAsync(
          imagePickerOptions
        );
      }

      if (!imagePickerRes.canceled) {
        const imageName = UUID.v4() as string;

        const base64Representation = imagePickerRes.assets[0].base64!;

        const uploadUrl = await uploadOrderImageMutateAsync({ imageName });

        await axios.put(uploadUrl, Buffer.from(base64Representation, "base64"));

        Toast.show(
          "Image uploaded for textracting...",
          pickOrderScreenToastSettings
        );

        const cells = await analyzeOrderImageMutateAsync({ imageName });

        console.log(cells.length);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }

      Toast.show("Probably a permission error.", pickOrderScreenToastSettings);
    }
  };

  return (
    <ScreenContainer>
      <Text>PickOrderScreen</Text>
      <Button
        onPress={async () => {
          await handlePickImage("camera");
        }}
        title="pick from camera"
      />
      <Button
        onPress={async () => {
          await handlePickImage("library");
        }}
        title="pick from library"
      />
    </ScreenContainer>
  );
};
