import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import BannerView from "../components/product/ProductBannerView";
import Colors from "../constants/Colors";
import * as productActions from "../store/action/product/Product";
import { fetchCartItemsAction } from "../store/action/cart/Cart";
import ProductItem from "../components/product/ProductListItem";
import HTMLView from "react-native-htmlview";
import HTML from "react-native-render-html";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";
import * as cartActions from "../store/action/cart/Cart";
import CustomButton from "../components/UI/CustomButton";
import Loader from "../components/UI/CustomLoader";
import HeaderButtons from "../components/UI/HeaderButtons";
import NoInternet from "../components/Internet/NoInternet";
import { ERROR_TEXT, VALIDATION } from "../constants/Strings";
import ImageViewer from "react-native-image-zoom-viewer";
import HeaderTitle from "../components/UI/HeaderTitle";
import TouchableButton from "../components/UI/TouchableButton";

const ProductDetails = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const { productId, isFrom } = props.route.params;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const productsDetails = useSelector((state) => state.products.details);
  const userDetails = useSelector((state) => state.user.user);
  const product = productsDetails ? productsDetails.product : null;

  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  const recommendedProducts = useSelector(
    (state) => state.products.recommended
  );

  const dispatch = useDispatch();

  const fetchProductDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(productActions.fetchProductDetailsAction(productId));
      await dispatch(
        productActions.fetchRecommendedProductsAction(productId, 5)
      );
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const fetchCartItems = useCallback(async () => {
    if (userDetails) {
      setIsLoading(true);
      await dispatch(fetchCartItemsAction());
      setIsLoading(false);
      console.log(cartItems);
    }
  }, [dispatch, cartItems]);

  const navigateToCartList = () => {
    if (userDetails) {
      props.navigation.navigate("Cart", { isFrom: "ProductDetails" });
    } else {
      props.navigation.navigate("Login", { screen: "Login" });
    }
  };

  const showAlert = (alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetchCartItems();
    });
    return unsubscribe;
  }, [props.navigation, fetchCartItems]);

  useEffect(() => {
    console.log(error);
    if (error && error.message.toLowerCase() != ERROR_TEXT.no_internet) {
      showAlert(error.message);
    }
  }, [error]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>Details</HeaderTitle>;
      },
      headerLeft: () => {
        return (
          <TouchableButton
            imageStyle={{ height: 25, width: 25, margin: 8 }}
            imgUrl={require("../assets/back.png")}
            onButtonClick={() => {
              props.navigation.goBack();
            }}
          />
        );
      },
      headerRight: () => {
        return (
          <HeaderButtons
            // firstImage={require("../assets/share.png")}
            secondImage={require("../assets/cart.png")}
            secondImageBadge={userDetails ? cartItems.length : 0}
            onHeaderButtonClick={(id) => {
              if (id === 1) {
                navigateToCartList();
              }
            }}
          />
        );
      },
    });
  }, [props.navigation, userDetails, cartItems]);

  // error && error.message.toLowerCase() === ERROR_TEXT.no_internet
  if (!internetAvailable) {
    return (
      <NoInternet
        onPress={() => {
          if (!isLoading) {
            fetchProductDetails();
          }
        }}
      />
    );
  }

  const validateProduct = () => {
    if (productsDetails.colorList.length != 0 && selectedColor == 0) {
      showAlert(VALIDATION.invalid_color);
      return false;
    } else if (productsDetails.sizeList.length != 0 && selectedSize == 0) {
      showAlert(VALIDATION.invalid_size);
      return false;
    }
    return true;
  };

  const addproductToCart = async (id) => {
    if (isLoading || !product.isAvailable) {
      return;
    }
    if (!validateProduct()) {
      return;
    }

    if (userDetails) {
      try {
        setIsLoading(true);
        await dispatch(
          cartActions.addItemToCartAction(
            product.id,
            selectedColor,
            selectedSize
          )
        );
        fetchCartItems();
        setIsLoading(false);
        if (id === 1) {
          props.navigation.navigate("Cart", {
            params: {
              isFrom: "ProductDetails",
            },
          });
        }
      } catch (err) {
        setIsLoading(false);
        if (err.message === "Item already exist in the cart" && id === 1) {
          props.navigation.navigate("Cart", {
            params: {
              isFrom: "ProductDetails",
            },
          });
        } else {
          setError(err);
        }
      }
    } else {
      props.navigation.navigate("Login", { screen: "Login" });
    }
  };

  const addProductToWishlist = async (id) => {
    if (userDetails) {
      try {
        setIsLoading(true);
        setError(null);
        await dispatch(productActions.addProductToWishlistAction(id));
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    } else {
      props.navigation.navigate("Login", { screen: "Login" });
    }
  };

  const deleteProductFromWishlist = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(productActions.deleteProductFromWishlistAction(id));
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  if (isLoading || productsDetails == null || product == null) {
    return <Loader />;
  }

  if (showImages && productsDetails.imageUrls) {
    return (
      <Modal visible={showImages} transparent={true} animationType="slide">
        <ImageViewer
          enableSwipeDown={true}
          imageUrls={productsDetails.imageUrls.map((str) => ({ url: str }))}
          onSwipeDown={() => {
            setShowImages(!showImages);
          }}
          enablePreload={true}
          renderFooter={() => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.imageViewerClose}
              onPress={() => {
                setShowImages(!showImages);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  width: "100%",
                  // alignSelf: "flex-start",
                }}
                adjustsFontSizeToFit={true}
                maxFontSizeMultiplier={1}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{}}>
        <View style={{}}>
          <BannerView
            images={productsDetails.imageUrls}
            id={productId}
            isWishlist={product.isInWishlist}
            addToWishlist={addProductToWishlist}
            removeFromWishlist={deleteProductFromWishlist}
            onBannerClick={() => {
              setShowImages(!showImages);
            }}
          />
          <View style={styles.titleView}>
            <Text
              style={styles.title}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {product.name}
            </Text>
            <Text
              style={{
                ...styles.availability,
                color: product.isAvailable ? "green" : "red",
              }}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {product.isAvailable ? "In Stock" : "Out of stock"}
            </Text>
          </View>
          {/* Color Picker */}
          {productsDetails.colorList.length != 0 && (
            <View style={{ marginLeft: 20 }}>
              <Text
                style={styles.title}
                adjustsFontSizeToFit={true}
                maxFontSizeMultiplier={1}
              >
                Color varient:
              </Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.sizeContainer}
              >
                {productsDetails.colorList.map((color) => (
                  <View
                    key={color.id}
                    style={{
                      ...styles.selectedView,
                      borderWidth: selectedColor === color.id ? 1.5 : 0,
                      overflow: "hidden",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        ...styles.color,
                      }}
                      onPress={() => {
                        setSelectedColor(color.id);
                      }}
                    >
                      {color.hashCode === "multicolor" ? (
                        <Image
                          source={require("../assets/rainbowcircle.png")}
                          resizeMode="contain"
                          key={color.id}
                          style={{
                            ...styles.color,
                            borderWidth: 0,
                            // borderColor: "black",
                            // borderWidth: 1,
                          }}
                        />
                      ) : (
                        <View
                          key={color.id}
                          style={{
                            ...styles.color,
                            backgroundColor: color.hashCode,
                            borderColor: "black",
                            borderWidth: 1,
                            // overflow: "hidden",
                          }}
                        ></View>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          {/* Size Picker */}
          {productsDetails.sizeList.length != 0 && (
            <View style={{ marginLeft: 20 }}>
              <Text
                style={styles.title}
                adjustsFontSizeToFit={true}
                maxFontSizeMultiplier={1}
              >
                Size varient:
              </Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.sizeContainer}
              >
                {productsDetails.sizeList.map((size) => (
                  <View
                    key={size.id}
                    style={{
                      ...styles.selectedView,
                      borderWidth: selectedSize === size.id ? 1.5 : 0,
                      overflow: "hidden",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        ...styles.color,
                      }}
                      onPress={() => {
                        setSelectedSize(size.id);
                      }}
                    >
                      <Text
                        style={styles.size}
                        adjustsFontSizeToFit={true}
                        maxFontSizeMultiplier={1}
                      >
                        {size.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          <Text
            style={styles.price}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Price : {"\u20B9" + product.discountedPrice}
          </Text>
          <ScrollableTabView
            tabBarActiveTextColor="black"
            style={styles.tabView}
            tabBarUnderlineStyle={styles.tabUnderlineStyle}
            tabBarTextStyle={styles.tabTextStyle}
            showsHorizontalScrollIndicator={false}
          >
            <HTML
              html={productsDetails.description}
              baseFontStyle={{ fontFamily: "appfont-r", fontSize: 17 }}
              ignoredStyles={["font-family", "letter-spacing"]}
              tabLabel="Description"
            />

            {productsDetails.precautions && (
              <View tabLabel="Instruction">
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 17,
                    color: Colors.textColor,
                  }}
                  adjustsFontSizeToFit={true}
                  maxFontSizeMultiplier={1}
                >
                  Precautions:
                </Text>
                <HTML
                  containerStyle={{ marginTop: 10 }}
                  html={productsDetails.precautions}
                  baseFontStyle={{ fontFamily: "appfont-r", fontSize: 16 }}
                  ignoredStyles={["font-family", "letter-spacing"]}
                />
              </View>
            )}
          </ScrollableTabView>
          <Text
            style={styles.recommendedHeader}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Also recommended
          </Text>
          <FlatList
            horizontal
            keyExtractor={(item) => item.id.toString()}
            data={recommendedProducts}
            renderItem={(itemData) => (
              <ProductItem
                imageUrl={itemData.item.imageUrl}
                title={itemData.item.name}
                list={false}
                price={itemData.item.discountedPrice}
                id={itemData.item.id}
                isWishlist={itemData.item.isInWishlist}
                addToWishlist={addProductToWishlist}
                removeFromWishlist={deleteProductFromWishlist}
                onItemClick={() => {
                  props.navigation.push("Details", {
                    product: itemData.item,
                  });
                }}
              />
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          style={{ width: "45%" }}
          cardStyle={{
            ...styles.button,
            backgroundColor: product.isAvailable
              ? Colors.primary_color
              : Colors.tertiary_Color,
          }}
          title="Add to cart"
          titleStyle={styles.titleStyle}
          onPress={addproductToCart.bind(this, 0)}
        />
        <CustomButton
          style={{ width: "45%" }}
          cardStyle={{
            ...styles.button,
            backgroundColor: product.isAvailable
              ? Colors.primary_color
              : Colors.tertiary_Color,
          }}
          title="Buy now"
          titleStyle={styles.titleStyle}
          onPress={addproductToCart.bind(this, 1)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    width: "70%",
    marginRight: 15,
    fontFamily: "appfont-r",
  },
  color: {
    height: 34,
    width: 34,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
    borderColor: "black",
  },

  selectedView: {
    height: 42,
    width: 42,
    borderRadius: 21,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  sizeContainer: {
    marginBottom: 10,
    marginTop: 5,
  },

  size: {
    fontSize: 15,
    color: Colors.tertiary_Color,
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    marginLeft: 20,
    marginTop: 5,
    fontFamily: "appfont-r",
  },
  availability: {
    color: "green",
    fontSize: 17,
    width: "30%",
    textAlign: "center",
    fontFamily: "appfont-r",
  },
  html: {
    fontWeight: "300",
    color: "red", // make links coloured pink
    margin: 10,
  },
  tabView: {
    marginTop: 25,
    marginHorizontal: 10,
    // marginBottom: 10,
    // flex: 1,
  },

  tabUnderlineStyle: {
    height: 2,
    backgroundColor: "black",
  },
  tabTextStyle: {
    fontSize: 16,
    fontFamily: "appfont-r",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 10,
  },
  titleStyle: {
    fontSize: 18,
  },
  recommendedHeader: {
    fontSize: 20,
    marginLeft: 10,
    padding: 5,
    fontFamily: "appfont-sb",
  },
  imageViewerClose: {
    marginBottom: 40,
    marginLeft: 20,
    alignItems: "center",
  },
});

export default ProductDetails;
