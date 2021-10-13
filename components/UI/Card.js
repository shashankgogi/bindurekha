import React from "react";
import { View, StyleSheet } from "react-native";

const CardView = (props) => {
  return (
    <View style={{ ...styles.view, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  view: {
    shadowColor: "gray",
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
});

export default CardView;
