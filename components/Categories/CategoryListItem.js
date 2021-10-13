import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import CardView from "../../components/UI/Card";

const CategoryItem = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={props.onItemClick}
    >
      <CardView>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: props.imageUrl }}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.title}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.title}
        </Text>
      </CardView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 280,
    margin: 8,
  },
  image: {
    width: "100%",
    height: "80%",
    marginTop: 15,
  },
  title: {
    fontSize: 17,
    height: "15%",
    padding: 10,
    width: "100%",
    textAlign: "center",
    fontFamily: "appfont-r",
  },
});

export default CategoryItem;
