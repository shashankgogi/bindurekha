import React, { useState } from "react";
import {
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import CardView from "../../components/UI/Card";
import Color from "../../models/Color";
import Colors from "../../constants/Colors";

const ProductItem = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ ...styles.card, width: props.list ? null : 200 }}
      onPress={props.onItemClick}
    >
      <CardView style={{ overflow: "hidden" }}>
        <ImageBackground
          resizeMode="cover"
          style={styles.image}
          source={{ uri: props.imageUrl }}
          onLoadEnd={() => {
            setImageLoaded(true);
          }}
        >
          {!imageLoaded && (
            <Image
              resizeMode="cover"
              source={require("../../assets/imgplaceholder.png")}
              style={{ height: 200, width: "100%" }}
            />
          )}
          {imageLoaded && (
            <TouchableOpacity
              style={styles.wishlist}
              activeOpacity={0.2}
              onPress={() => {
                if (props.isWishlist) {
                  props.removeFromWishlist(props.id);
                } else {
                  props.addToWishlist(props.id);
                }
              }}
            >
              <Image
                style={styles.wishlistImg}
                source={
                  props.isWishlist
                    ? require("../../assets/wishlistactive.png")
                    : require("../../assets/wishlistinactive.png")
                }
              />
            </TouchableOpacity>
          )}
        </ImageBackground>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.title}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.title}
        </Text>
        <Text
          numberOfLines={1}
          style={styles.price}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {"\u20B9"}
          {props.price + "  "}
          {props.originalPrice && props.price != props.originalPrice && (
            <Text
              style={{
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
                color: Colors.tertiary_Color,
              }}
            >
              {"\u20B9"}
              {props.originalPrice}
            </Text>
          )}
        </Text>
      </CardView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 270,
    margin: 8,
  },
  image: {
    height: 200,
    marginTop: 5,
    borderRadius: 10,
    margin: 4,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    height: "10%",
    marginLeft: 10,
    marginTop: 5,
    width: "100%",
    textAlign: "left",
    fontFamily: "appfont-r",
    marginRight: 10,
  },

  price: {
    fontSize: 17,
    height: "10%",
    marginLeft: 10,
    width: "100%",
    textAlign: "left",
    fontFamily: "appfont-m",
  },

  wishlist: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginTop: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "white",
  },
  wishlistImg: {
    height: 25,
    width: 25,
  },
});

export default ProductItem;
