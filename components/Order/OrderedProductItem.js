import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import CardView from "../../components/UI/Card";
import Colors from "../../constants/Colors";

const OrderedItem = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={props.onItemClick}
    >
      <CardView
        style={{
          overflow: "hidden",
          flexDirection: "row",
          padding: 10,
          //   height: 100,
        }}
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: props.imageUrl }}
        />
        <View style={{ margin: 10, width: "98%" }}>
          <Text
            style={styles.title}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            {props.title}
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={props.onBuyAgainClick}>
            <Text
              style={{
                ...styles.subTitle,
                color: Colors.primary_color,
                marginTop: 5,
              }}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {props.subTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </CardView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  image: {
    width: "25%",
    height: "90%",
    margin: 5,
    alignSelf: "center",
  },

  title: {
    fontSize: 17,
    width: "80%",
    textAlign: "left",
    fontFamily: "appfont-r",
  },
});

export default OrderedItem;
