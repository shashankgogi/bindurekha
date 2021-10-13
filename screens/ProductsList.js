import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, FlatList, View, Image, Alert } from "react-native";
import ProductItem from "../components/product/ProductListItem";
import Loader from "../components/UI/CustomLoader";
import * as productActions from "../store/action/product/Product";
import { fetchCartItemsAction } from "../store/action/cart/Cart";
import HeaderButtons from "../components/UI/HeaderButtons";
import NoInternet from "../components/Internet/NoInternet";
import { ERROR_TEXT } from "../constants/Strings";
import EmptyView from "../components/UI/EmptyScreen";
import TouchableButton from "../components/UI/TouchableButton";
import HeaderTitle from "../components/UI/HeaderTitle";

const EmptyViewComponent = (
  <EmptyView
    title="Oops! No results found"
    subTitle="Please try again later or try something else"
    image={require("../assets/emptysearch.png")}
  />
);
const ProductList = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const emptyList = useSelector((state) => state.products.emptyList);
  const userDetails = useSelector((state) => state.user.user);
  const { isFrom, title } = props.route.params;

  let categoryId, tagIds;
  if (isFrom === "Wishlist") {
  } else {
    categoryId = props.route.params.categoryId;
    tagIds = props.route.params.tagIds;
  }

  console.log("from .........." + categoryId);
  let products;
  if (isFrom === "Wishlist") {
    products = useSelector((state) => state.products.wishlistProducts);
  } else {
    products = useSelector((state) => state.products.products);
  }

  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );

  const fetchProductList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      dispatch(productActions.resetProductList());
      if (userDetails) {
        await dispatch(fetchCartItemsAction());
      }
      await dispatch(
        productActions.fetchProductsAction(
          categoryId ? categoryId : "",
          tagIds ? tagIds.toString() : "",
          0
        )
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error);
    }
  }, [dispatch]);

  const fetchMoreProducts = async (productCount) => {
    if (!emptyList) {
      await dispatch(
        productActions.fetchProductsAction(
          categoryId ? categoryId : "",
          tagIds ? tagIds.toString() : "",
          productCount
        )
      );
    }
  };

  const fetchWishListProductList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      dispatch(productActions.resetProductList());
      if (userDetails) {
        await dispatch(fetchCartItemsAction());
      }
      await dispatch(productActions.fetchWishlistProductsAction());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  }, [dispatch]);

  const addProductToWishlist = async (id) => {
    if (userDetails) {
      try {
        setIsLoading(true);
        setError(null);
        await dispatch(productActions.addProductToWishlistAction(id));
        refreshList();
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
      refreshList();
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const refreshList = () => {
    if (isFrom === "Wishlist") {
      fetchWishListProductList();
    } else {
      fetchProductList();
    }
  };

  const navigateToCartList = () => {
    if (userDetails) {
      props.navigation.navigate("Cart", {
        params: {
          isFrom: "ProductList",
        },
      });
    } else {
      props.navigation.navigate("Login", { screen: "Login" });
    }
  };
  // useEffect(() => {
  //   fetchProductList();
  // }, [fetchProductList]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      if (isFrom === "Wishlist") {
        fetchWishListProductList();
      } else {
        fetchProductList();
      }
    });
    return unsubscribe;
  }, [props.navigation, fetchProductList]);

  useEffect(() => {
    console.log(error);
    if (error && error.message.toLowerCase() != ERROR_TEXT.no_internet) {
      Alert.alert("", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>{title}</HeaderTitle>;
      },
      headerRight: () => {
        return (
          <HeaderButtons
            firstImage={require("../assets/search.png")}
            secondImage={require("../assets/cart.png")}
            secondImageBadge={userDetails ? cartItems.length : 0}
            onHeaderButtonClick={(id) => {
              if (id === 1) {
                navigateToCartList();
                // props.navigation.navigate("Order Status", {
                //   status: false,
                //   orderId: 123,
                //   deliveryDay: "4 - 5 day's",
                //   orderNumber: "120930490",
                // });
              } else {
                dispatch(productActions.resetProductList());
                props.navigation.navigate("Search");
              }
            }}
          />
        );
      },
      headerLeft: () => (
        <TouchableButton
          imageStyle={
            isFrom === "Wishlist" ? null : { height: 25, width: 25, margin: 8 }
          }
          imgUrl={
            isFrom === "Wishlist"
              ? require("../assets/menu.png")
              : require("../assets/back.png")
          }
          onButtonClick={() => {
            if (isFrom === "Wishlist") {
              props.navigation.toggleDrawer();
            } else {
              props.navigation.goBack();
            }
          }}
        />
      ),
    });
  }, [props.navigation, cartItems]);

  // error && error.message.toLowerCase() === ERROR_TEXT.no_internet
  if (!internetAvailable) {
    return (
      <NoInternet
        onPress={() => {
          if (isFrom === "Wishlist") {
            fetchWishListProductList();
          } else {
            fetchProductList();
          }
        }}
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (products == null) {
    return <View></View>;
  }

  if (products && products.length === 0) {
    return EmptyViewComponent;
  }

  return (
    <FlatList
      keyExtractor={(item) => item.id.toString()}
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.name}
          list={true}
          id={itemData.item.id}
          price={itemData.item.discountedPrice}
          originalPrice={itemData.item.originalPrice}
          isWishlist={isFrom === "Wishlist" ? true : itemData.item.isInWishlist}
          addToWishlist={addProductToWishlist}
          removeFromWishlist={deleteProductFromWishlist}
          onItemClick={() => {
            props.navigation.navigate("Details", {
              productId: itemData.item.id,
              isFrom: "Home",
            });
          }}
        />
      )}
      onEndReached={() => {
        console.log("end reached....");
        if (isFrom != "Wishlist") {
          fetchMoreProducts(products.length);
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({});

export default ProductList;
