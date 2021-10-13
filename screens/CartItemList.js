import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../store/action/cart/Cart";
import Carttem from "../components/Cart/CartItem";
import CustomButton from "../components/UI/CustomButton";
import Loader from "../components/UI/CustomLoader";
import NoInternet from "../components/Internet/NoInternet";
import { ERROR_TEXT } from "../constants/Strings";
import EmptyView from "../components/UI/EmptyScreen";
import Colors from "../constants/Colors";
import BottomSheet from "../components/UI/BottomSheet";
import TouchableButton from "../components/UI/TouchableButton";
import HeaderTitle from "../components/UI/HeaderTitle";

const DetailsView = (props) => {
  return (
    <View style={styles.detailsView}>
      <Text
        style={{ ...styles.detailsText, ...props.style }}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.title}
      </Text>
      <Text
        style={{ ...styles.detailsText, ...props.style }}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {"\u20B9"}
        {props.value}
      </Text>
    </View>
  );
};

const CartList = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const bottomRef = useRef();
  const showDetails = useRef();
  showDetails.current = false;

  const { isFrom } = props.route.params;

  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  let dispatch = useDispatch();

  const EmptyViewComponent = (
    <EmptyView
      title="Your cart is empty"
      subTitle="Add some items to shop"
      buttonTitle="Start Shopping"
      image={require("../assets/emptycart.png")}
      onPress={() => {
        props.navigation.navigate("Home");
      }}
    />
  );

  const fetchCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(cartActions.fetchCartItemsAction());
      await dispatch(cartActions.fetchTotalAmountAction());
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const deleteCartItem = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(cartActions.deleteItemFromCartAction(id));
      setIsLoading(false);
      fetchCartItems();
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  const changeItemQuantity = useCallback(
    async (id, quantity) => {
      try {
        // setIsLoading(true);
        setError(null);
        await dispatch(cartActions.changeItemQuantityAction(id, quantity));
        fetchCartItems();
        // setIsLoading(false);
      } catch (err) {
        // setIsLoading(false);
        setError(err);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (error && error.message.toLowerCase() != ERROR_TEXT.no_internet) {
      Alert.alert("", error.message, [
        {
          text: "Okay",
          onPress: () => {
            if (cartItems && cartItems.length != 0) {
              //   fetchCartItems();  //Need to verify
            }
          },
        },
      ]);
    }
  }, [error]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    if (isFrom === "Dashboard" || isFrom === "Orders") {
      props.navigation.setOptions({
        headerTitle: () => {
          return <HeaderTitle>Cart</HeaderTitle>;
        },
        headerLeft: () => (
          <TouchableButton
            imageStyle={{ height: 25, width: 25, margin: 8 }}
            imgUrl={require("../assets/back.png")}
            onButtonClick={() => {
              props.navigation.goBack();
            }}
          />
        ),
      });
    } else {
      props.navigation.setOptions({
        headerTitle: () => {
          return <HeaderTitle>Cart</HeaderTitle>;
        },
      });
    }
  }, [props.navigation]);

  //   error && error.message.toLowerCase() === ERROR_TEXT.no_internet
  if (!internetAvailable) {
    return (
      <NoInternet
        onPress={() => {
          fetchCartItems();
        }}
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (cartItems && cartItems.length === 0) {
    return EmptyViewComponent;
  }

  if (cartItems == null || totalAmount == null) {
    return <View></View>;
  }

  return (
    <View style={styles.screen}>
      <Text
        style={styles.countTitle}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        Total Items ( {cartItems.length} )
      </Text>
      <FlatList
        keyExtractor={(item) => item.productId.toString()}
        data={cartItems}
        renderItem={(itemData) => (
          <Carttem
            cartItem={itemData.item}
            onDeleteClick={deleteCartItem}
            onQuantityClick={changeItemQuantity}
          />
        )}
      />

      <BottomSheet ref={bottomRef}>
        <TouchableOpacity
          onPress={() => {
            showDetails.current = false;
            bottomRef.current.handleOpenOrClose(showDetails.current);
          }}
        >
          <Image
            style={{ height: 35, width: 35 }}
            source={require("../assets/down.png")}
          />
        </TouchableOpacity>

        <View style={{ width: "100%" }}>
          <DetailsView
            title="Sub Total"
            value={
              totalAmount.sumOfOriginalPrice -
              (totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice)
            }
          />
          <DetailsView
            title="Products Discount"
            value={
              totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice
            }
          />

          <View style={styles.devideLine} />
          <DetailsView
            style={{ fontFamily: "appfont-sb", fontSize: 18 }}
            title="Total Amount"
            value={
              totalAmount.sumOfOriginalPrice -
              (totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice)
            }
          />
        </View>
      </BottomSheet>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            showDetails.current = !showDetails.current;
            bottomRef.current.handleOpenOrClose(showDetails.current);
          }}
        >
          <View>
            <Text
              style={styles.total}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              Total: {"\u20B9"}
              {totalAmount.sumOfOriginalPrice -
                (totalAmount.sumOfOriginalPrice -
                  totalAmount.sumOfDiscountPrice)}
            </Text>
            <Text
              style={styles.priceDetails}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              View price details
            </Text>
          </View>
        </TouchableOpacity>
        <CustomButton
          style={styles.button}
          title="Next"
          icon={require("../assets/next.png")}
          cardStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          onPress={() => {
            props.navigation.navigate("Delivery Address");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  countTitle: {
    fontSize: 16,
    marginHorizontal: 10,
    marginTop: 10,
    fontFamily: "appfont-m",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: "gray",
    borderTopWidth: 0.5,
  },
  total: {
    fontFamily: "appfont-r",
    fontSize: 18,
    alignSelf: "center",
  },
  priceDetails: {
    fontFamily: "appfont-r",
    fontSize: 16,
    color: Colors.primary_color,
  },

  buttonStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
  },
  button: {
    width: "40%",
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: 22,
    alignSelf: "center",
  },
  detailsText: {
    margin: 10,
    fontSize: 16,
    fontFamily: "appfont-r",
  },

  detailsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  devideLine: {
    backgroundColor: Colors.tertiary_Color,
    height: "0.5%",
    margin: 10,
  },
});

export default CartList;
