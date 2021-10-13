import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const UnderlinedText = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ ...styles.view, ...props.style }}
      onPress={props.onTextClick}
    >
      <Text
        style={{ ...styles.text, ...props.textStyle }}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: "appfont-m",
  },
  view: {
    marginLeft: 5,
    borderBottomWidth: 1,
  },
});
export default UnderlinedText;
