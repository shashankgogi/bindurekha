import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-action-sheet";

const ImageLoader = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const showImagePickerOptions = () => {
    var options = ["Take photo", "Select from library", "Cancel"];
    var DESTRUCTIVE_INDEX = 2;

    ActionSheet.showActionSheetWithOptions(
      {
        options: options,
        // cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        // tintColor: "blue",
        title: "Select Avatar",
      },
      (buttonIndex) => {
        if (buttonIndex != 2) {
          openPhotoLibrary(buttonIndex);
        }
      }
    );
  };

  const { onSelectImage } = props;

  useEffect(() => {
    onSelectImage(selectedImage);
  }, [onSelectImage, selectedImage]);

  const openPhotoLibrary = async (index) => {
    if (Platform.OS === "ios") {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    let result;
    if (index === 0) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
    }

    console.log(result);

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          showImagePickerOptions();
        }}
      >
        <Image
          resizeMode="cover"
          style={styles.profile}
          source={
            selectedImage
              ? { uri: selectedImage }
              : require("../../assets/profilepic.png")
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginBottom: 30,
    alignSelf: "center",
  },
});
export default ImageLoader;
