import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  Text,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Pages } from "react-native-pages";
import * as categoryActions from "../store/action/categories/Category";
import Colors from "../constants/Colors";
import CategoryListItem from "../components/Categories/CategoryListItem";
import Loader from "../components/UI/CustomLoader";
import HeaderButtons from "../components/UI/HeaderButtons";
import NoInternet from "../components/Internet/NoInternet";
import * as productAction from "../store/action/product/Product";
import { ERROR_TEXT, APP_TEXT } from "../constants/Strings";
import { fetchCartItemsAction } from "../store/action/cart/Cart";
import TouchableButton from "../components/UI/TouchableButton";
import HeaderTitle from "../components/UI/HeaderTitle";

const DashBoard = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const banners = useSelector((state) => state.categories.banners);
  const categories = useSelector((state) => state.categories.categories);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userDetails = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );

  const fetchAdvertisementsAndCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (userDetails) {
        await dispatch(fetchCartItemsAction());
      }
      await dispatch(categoryActions.fetchBannerAction(10));
      await dispatch(categoryActions.fetchCategoriesAction(10));
      setIsLoading(0);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const navigateToProductList = (itemData) => {
    props.navigation.navigate("ProductStack", {
      screen: "Products",
      params: {
        isFrom: "Dashboard",
        categoryId: itemData.item.id,
        title: itemData.item.name,
      },
    });
  };

  const navigateToBannerProductList = (banner) => {
    props.navigation.navigate("ProductStack", {
      screen: "Products",
      params: {
        isFrom: "Dashboard",
        tagIds: banner.tagIds,
        title: banner.title,
      },
    });
  };

  const navigateToCartList = () => {
    console.log(userDetails);
    if (userDetails) {
      props.navigation.navigate("ProductStack", {
        screen: "Cart",
        params: {
          isFrom: "Dashboard",
        },
      });
    } else {
      props.navigation.navigate("Login", { screen: "Login" });
    }
  };

  //   useEffect(() => {
  //     fetchAdvertisementsAndCategories();
  //   }, [fetchAdvertisementsAndCategories]);

  useEffect(() => {
    if (error && error.message.toLowerCase() != ERROR_TEXT.no_internet) {
      console.log(error);
      Alert.alert("", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetchAdvertisementsAndCategories();
    });
    return unsubscribe;
  }, [props.navigation, fetchAdvertisementsAndCategories]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return (
          <Image
            style={styles.dashboardLogo}
            resizeMode="contain"
            source={require("../assets/dashboardlogo.png")}
          />
        );
      },
      headerTitleAlign: "left",
      headerRight: () => {
        return (
          <HeaderButtons
            // firstImage={require("../assets/cart.png")}
            // firstImageBadge={cartItems ? cartItems.length : 0}
            secondImage={require("../assets/cart.png")}
            secondImageBadge={userDetails && cartItems ? cartItems.length : 0}
            onHeaderButtonClick={(id) => {
              if (id === 0) {
              } else {
                navigateToCartList();
              }
            }}
          />
        );
      },

      headerLeft: () => (
        <TouchableButton
          imgUrl={require("../assets/menu.png")}
          onButtonClick={() => {
            props.navigation.toggleDrawer();
          }}
        />
      ),
    });
  }, [props.navigation, cartItems, userDetails]);

  //   error && error.message.toLowerCase() === ERROR_TEXT.no_internet
  if (!internetAvailable) {
    return (
      <NoInternet
        onPress={() => {
          fetchAdvertisementsAndCategories();
        }}
      />
    );
  }
  if (isLoading) {
    return <Loader />;
  }

  if (banners == null || categories == null) {
    return <View></View>;
  }

  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.searchView}
        onPress={() => {
          dispatch(productAction.resetProductList());
          props.navigation.navigate("Search");
        }}
      >
        <Image
          source={require("../assets/globalsearch.png")}
          style={styles.searchImg}
        />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
          style={styles.searchText}
        >
          What would you like to shop?
        </Text>
      </TouchableOpacity>
      {!APP_TEXT.is_freeVersion && (
        <Pages
          indicatorColor={Colors.primary_color}
          containerStyle={styles.viewPager}
          startPage={0}
        >
          {banners.map((banner) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={banner.id}
              style={styles.imageContainer}
              onPress={navigateToBannerProductList.bind(this, banner)}
            >
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="cover"
                  source={{ uri: banner.imageUrl }}
                  style={styles.bannerImage}
                />
              </View>
            </TouchableOpacity>
          ))}
        </Pages>
      )}
      <View style={{ height: APP_TEXT.is_freeVersion ? "100%" : "65%" }}>
        <FlatList
          keyExtractor={(itemData) => itemData.id.toString()}
          numColumns={2}
          data={categories}
          renderItem={(itemData) => (
            <CategoryListItem
              title={itemData.item.name}
              imageUrl={itemData.item.imageUrl}
              onItemClick={navigateToProductList.bind(this, itemData)}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1 },
  dashboardLogo: {
    height: 40,
    width: "60%",
    marginLeft: -20,
    alignSelf: "flex-start",
  },
  viewPager: {
    margin: 8,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  searchView: {
    backgroundColor: "#dbdbdb",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    flexDirection: "row",
    // justifyContent: "center",
  },

  searchText: {
    marginVertical: 10,
    textAlign: "left",
    fontSize: 20,
    fontFamily: "appfont-m",
    color: Colors.tertiary_Color,
  },

  searchImg: {
    height: 25,
    width: 25,
    alignSelf: "center",
    marginHorizontal: 15,
  },
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "Dashboard",
    headerLeft: () => (
      <Button
        title="Orders"
        color={Colors.primary_color}
        onPress={() => {
          // AsyncStorage.removeItem("UserData");
          //   navData.navigation.navigate("LoginStack", { screen: "Login" });
          navData.navigation.navigate("OrderStack");
          //   navData.navigation.toggleDrawer();
        }}
      />
    ),
  };
};
export default DashBoard;
