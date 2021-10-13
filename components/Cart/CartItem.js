import React, { useState, useEffect } from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import CardView from "../../components/UI/Card";
import { View } from "react-native-animatable";
import NumericInput from "../UI/Stepper/NumericInput";
import Colors from "../../constants/Colors";

const CartItem = (props) => {
  const [quantity, setQuantity] = useState(props.cartItem.quantity);

  const { onQuantityClick, cartItem } = props;
  useEffect(() => {
    if (cartItem.quantity === quantity) {
      return;
    }
    onQuantityClick(cartItem.productId, quantity);
  }, [quantity, onQuantityClick]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={props.onItemClick}
    >
      <CardView style={{ overflow: "hidden", flexDirection: "row" }}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{ uri: props.cartItem.imageUrl }}
        />
        <View style={{ margin: 10, width: "98%" }}>
          <View style={styles.titleView}>
            <Text
              numberOfLines={2}
              style={styles.title}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {props.cartItem.productName}
            </Text>
            <TouchableOpacity
              style={styles.deleteView}
              onPress={props.onDeleteClick.bind(this, props.cartItem.productId)}
            >
              <Text style={styles.delete}>X</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sizeView}>
            {props.cartItem.size && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={styles.details}
                  adjustsFontSizeToFit={true}
                  maxFontSizeMultiplier={1}
                >
                  Size:
                </Text>
                <View
                  style={{
                    ...styles.color,
                  }}
                >
                  <Text style={styles.size}>{props.cartItem.size.data}</Text>
                </View>
              </View>
            )}
            {props.cartItem.color && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={styles.details}
                  adjustsFontSizeToFit={true}
                  maxFontSizeMultiplier={1}
                >
                  Color:
                </Text>
                <View
                  style={{
                    ...styles.color,
                    backgroundColor: props.cartItem.color.data,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
              </View>
            )}
          </View>

          <View style={styles.titleView}>
            <Text
              numberOfLines={1}
              style={styles.price}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {"\u20B9"}
              {props.cartItem.discountedPrice + "  "}
              {props.cartItem.discountedPrice !=
                props.cartItem.originalPrice && (
                <Text
                  style={{
                    textDecorationLine: "line-through",
                    textDecorationStyle: "solid",
                    color: Colors.tertiary_Color,
                  }}
                >
                  {"\u20B9"}
                  {props.cartItem.originalPrice}
                </Text>
              )}
            </Text>
            <NumericInput
              rounded
              totalWidth={110}
              totalHeight={35}
              onChange={(value) => {
                props.onQuantityClick(props.cartItem.productId, value);
              }}
              textColor={Colors.primary_color}
              iconStyle={{ color: "white" }}
              rightButtonBackgroundColor={Colors.primary_color}
              leftButtonBackgroundColor={Colors.primary_color}
              iconSize={50}
              minValue={1}
              initValue={props.cartItem.quantity}
              value={props.cartItem.quantity}
              style={{ fontSize: 20 }}
            />
          </View>
        </View>
      </CardView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // height: 110,
    marginHorizontal: 8,
    marginVertical: 5,
  },
  image: {
    width: "20%",
    height: "90%",
    margin: 5,
    alignSelf: "center",
  },

  deleteView: {
    padding: 5,
    paddingHorizontal: 10,
    // backgroundColor: "red",
  },
  delete: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "appfont-m",
    alignSelf: "center",
  },

  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "75%",
    margin: 2,
    // backgroundColor: "red",
  },
  title: {
    fontSize: 18,
    width: "80%",
    textAlign: "left",
    fontFamily: "appfont-r",
    marginRight: 5,
  },

  sizeView: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
  },

  price: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "appfont-m",
    marginRight: 10,
  },

  details: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "appfont-m",
    margin: 2,
  },

  color: {
    height: 25,
    width: 25,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 1,
    marginRight: 5,
    marginLeft: 2,
  },
  size: {
    fontSize: 13,
    color: Colors.tertiary_Color,
    textAlign: "center",
  },
});

export default CartItem;
