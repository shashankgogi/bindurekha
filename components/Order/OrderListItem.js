import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import CardView from "../../components/UI/Card";
import Colors from "../../constants/Colors";

const OrderListItem = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={props.onItemClick}
    >
      <CardView
        style={{ overflow: "hidden", flexDirection: "row", padding: 15 }}
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          source={props.imageUrl}
        />
        <View style={{ margin: 10, width: "98%" }}>
          <Text style={styles.title}>#{props.title}</Text>
          {props.subTitle.toLowerCase() === "delivered on" && (
            <Text
              style={{
                ...styles.subTitle,
                color: Colors.tertiary_Color,
                marginTop: 5,
              }}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {"Ordered On " + props.orderDate}
            </Text>
          )}

          <Text
            style={{
              ...styles.subTitle,
              color:
                props.subTitle.toLowerCase() === "order payment cancelled"
                  ? Colors.primary_color
                  : Colors.tertiary_Color,
              marginTop: 5,
            }}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            {props.subTitle.toLowerCase() === "delivered on"
              ? props.subTitle + " " + props.deliveredDate
              : props.subTitle}
          </Text>
        </View>
      </CardView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // height: 100,
    margin: 8,
  },
  image: {
    width: "20%",
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

export default OrderListItem;
