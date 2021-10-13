import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Pages } from "react-native-pages";
import Colors from "../../constants/Colors";
const ProductBannerView = (props) => {
  return (
    <View style={{ height: 350, margin: 8 }}>
      <Pages
        indicatorColor={Colors.primary_color}
        containerStyle={styles.viewPager}
        startPage={0}
      >
        {props.images.map((image) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={Math.random().toString()}
            style={styles.imageContainer}
            onPress={props.onBannerClick}
          >
            <View style={styles.imageContainer}>
              <ImageBackground
                resizeMode="cover"
                source={{ uri: image }}
                style={styles.bannerImage}
              >
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
              </ImageBackground>
            </View>
          </TouchableOpacity>
        ))}
      </Pages>
    </View>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    marginTop: 8,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
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
export default ProductBannerView;
