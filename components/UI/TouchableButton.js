import React from "react";
import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";

const TouchableButton = (props) => {
  let chiledComponent;
  if (props.imgUrl) {
    chiledComponent = (
      <Image
        source={props.imgUrl}
        style={{ ...styles.image, ...props.imageStyle }}
        resizeMode="contain"
      />
    );
  } else {
    chiledComponent = (
      <Text style={{ ...styles.text, ...props.textStyle }}>{props.text}</Text>
    );
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onButtonClick}
      style={{ ...styles.main, ...props.buttonStyle }}
    >
      {chiledComponent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    alignSelf: "center",
    marginLeft: 10,
  },

  image: {
    height: 20,
    width: 25,
    alignSelf: "center",
  },

  text: {
    fontSize: 17,
    fontFamily: "appfont-r",
    textAlign: "center",
  },
});
export default TouchableButton;
