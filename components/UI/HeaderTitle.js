import React from "react";
import { Text, StyleSheet } from "react-native";

const HeaderTitle = (props) => {
  return (
    <Text
      style={styles.title}
      adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: "appfont-sb",
  },
});

export default HeaderTitle;
