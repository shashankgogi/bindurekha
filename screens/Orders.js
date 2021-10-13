import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as orderActions from "../store/action/Order/Order";
import OrderListItem from "../components/Order/OrderListItem";
import Loader from "../components/UI/CustomLoader";
import HeaderButtons from "../components/UI/HeaderButtons";
import NoInternet from "../components/Internet/NoInternet";
import { ERROR_TEXT } from "../constants/Strings";
import EmptyView from "../components/UI/EmptyScreen";
import TouchableButton from "../components/UI/TouchableButton";
import HeaderTitle from "../components/UI/HeaderTitle";

const Orders = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const orderItems = useSelector((state) => state.order.orders);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userDetails = useSelector((state) => state.user.user);
  const emptyList = useSelector((state) => state.order.emptyList);

  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );

  const EmptyViewComponent = (
    <EmptyView
      title="Empty order list!"
      subTitle="You haven't placed any order yet!"
      buttonTitle="Start Shopping"
      image={require("../assets/emptycart.png")}
      onPress={() => {
        props.navigation.navigate("Home");
      }}
    />
  );

  const fetchOrdersList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(orderActions.fetchUserOrdersAction());
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetchOrdersList();
    });
    return unsubscribe;
  }, [props.navigation, fetchOrdersList]);

  useEffect(() => {
    if (error && error.message.toLowerCase() != ERROR_TEXT.no_internet) {
      Alert.alert("", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>Orders</HeaderTitle>;
      },
      headerRight: () => {
        return (
          <HeaderButtons
            secondImage={require("../assets/cart.png")}
            secondImageBadge={userDetails ? cartItems.length : 0}
            onHeaderButtonClick={(id) => {
              props.navigation.navigate("ProductStack", {
                screen: "Cart",
                params: {
                  isFrom: "Orders",
                },
              });
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
  }, [props.navigation, cartItems]);

  //   error && error.message.toLowerCase() === ERROR_TEXT.no_internet
  if (!internetAvailable) {
    return (
      <NoInternet
        onPress={() => {
          fetchUserOrdersAction();
        }}
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (emptyList) {
    return EmptyViewComponent;
  }

  if (orderItems == null) {
    return <View></View>;
  }

  const getDeliveryTruckImage = (status) => {
    switch (status) {
      case "order payment cancelled": {
        return require("../assets/ordercancel.png");
      }

      case "delivered on": {
        return require("../assets/orderdelivered.png");
      }

      default: {
        return require("../assets/orderarriving.png");
      }
    }
  };

  return (
    <FlatList
      keyExtractor={(item) => item.id.toString()}
      data={orderItems}
      renderItem={(itemData) => (
        <OrderListItem
          imageUrl={getDeliveryTruckImage(
            itemData.item.orderStatus.toLowerCase()
          )}
          title={itemData.item.orderNumber}
          subTitle={itemData.item.orderStatus}
          deliveredDate={itemData.item.deliveredDate}
          orderDate={itemData.item.orderedDate}
          onItemClick={() => {
            dispatch(orderActions.resetOrderDetails());
            props.navigation.navigate("Order Detail", {
              orderId: itemData.item.id,
            });
          }}
        />
      )}
    />
  );
};

const styels = StyleSheet.create({});
export default Orders;
