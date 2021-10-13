import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

const CheckBox = (props) => {
  console.log("terms......." + props.isChecked);
  return (
    <TouchableOpacity
      style={{ ...props.style }}
      activeOpacity={0.7}
      onPress={() => {
        props.onCheckClick(!props.isChecked);
      }}
    >
      <Image
        style={styles.image}
        resizeMode="contain"
        source={
          props.isChecked
            ? require("../../assets/check.png")
            : require("../../assets/uncheck.png")
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 22,
    width: 22,
  },
});
export default CheckBox;
