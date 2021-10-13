import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";
import * as orderActions from "../store/action/Order/Order";
import OrderedItem from "../components/Order/OrderedProductItem";
import Loader from "../components/UI/CustomLoader";
import Colors from ".././constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import NoInternet from "../components/Internet/NoInternet";
import { ERROR_TEXT } from "../constants/Strings";
import HeaderTitle from "../components/UI/HeaderTitle";
import * as Constants from "../constants/Constants";
import PayuMoney from "react-native-payumoney";

const OrderDetails = (props) => {
  const { orderId } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const orderDetails = useSelector((state) => state.order.orderDetails);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const userDetails = useSelector((state) => state.user.user);

  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  let dispatch = useDispatch();

  const DetailsView = (props) => {
    return (
      <View style={styles.detailView}>
        <Text
          style={{ ...styles.detailText, ...props.style }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.title}
        </Text>
        <Text
          style={{ ...styles.detailText }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.value}
        </Text>
      </View>
    );
  };

  const fetchOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(orderActions.fetchOrderDetailsAction(orderId));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const proceedToPay = async () => {
    const amt = orderDetails.order.createdDate;

    let options = {
      amount: amt.toString(),
      txnId: orderId.toString(),
      productName: Platform.OS,
      firstName: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phoneNumber,
      merchantId: Constants.PAYUMONEY.id,
      key: Constants.PAYUMONEY.key,
      successUrl: Constants.PAYUMONEY.surl,
      failedUrl: Constants.PAYUMONEY.furl,
      isDebug: true,
      hash: Constants.getPayuMoneyHash(
        orderId,
        amt,
        userDetails.name,
        userDetails.email
      ),
    };

    try {
      setError(null);
      setIsLoading(true);
      const resData = await PayuMoney(options);
      console.log(resData);
      // setIsLoading(false);
      console.log("Successs.......");
      updatePaymentStatus(
        true,
        orderId,
        orderDetails.order.deliveryDay,
        orderDetails.order.orderNumber
      );
    } catch (err) {
      console.log("Fail.......");
      console.log(err);
      setIsLoading(false);
      updatePaymentStatus(
        false,
        orderId,
        orderDetails.order.deliveryDay,
        orderDetails.order.orderNumber
      );
    }
  };

  const updatePaymentStatus = async (
    status,
    orderId,
    deliveryDay,
    orderNumber
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      const statusData = await dispatch(
        orderActions.updateOrderStatusAction(orderId, status)
      );
      setIsLoading(false);
      navigateToPaymentStatusScreen(status, orderId, deliveryDay, orderNumber);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  const navigateToPaymentStatusScreen = (
    status,
    orderId,
    deliveryDay,
    orderNumber
  ) => {
    props.navigation.navigate("ProductStack", {
      screen: "Order Status",
      params: {
        status: status,
        orderId: orderId,
        deliveryDay: deliveryDay,
        orderNumber: orderNumber,
      },
    });
  };

  useEffect(() => {
    if (
      error &&
      error.message &&
      error.message.toLowerCase() != ERROR_TEXT.no_internet
    ) {
      Alert.alert("", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>Order Detail</HeaderTitle>;
      },
    });
  }, [props.navigation]);

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

  if (orderDetails == null) {
    return <View></View>;
  }

  console.log(
    "Order Status----->" + orderDetails.order.orderStatus.toLowerCase()
  );
  return (
    <View style={styles.screen}>
      <ScrollableTabView
        tabBarActiveTextColor="black"
        style={styles.tabView}
        tabBarUnderlineStyle={styles.tabUnderlineStyle}
        tabBarTextStyle={styles.tabTextStyle}
      >
        <View
          tabLabel="ORDER DETAIL"
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          <View style={styles.cardView}>
            <DetailsView
              title="Order Date:"
              value={orderDetails.order.orderedDate}
              style={{ fontFamily: "appfont-sb", color: Colors.textColor }}
            />
            {orderDetails.order.orderStatus.toLowerCase() !=
              "order payment cancelled" &&
              orderDetails.order.orderStatus.toLowerCase() !=
                "awaiting payment" && (
                <DetailsView
                  title={
                    orderDetails.order.orderStatus.toLowerCase() !=
                    "delivered on"
                      ? "Arriving On:"
                      : "Delivered Date"
                  }
                  value={
                    orderDetails.order.orderStatus.toLowerCase() !=
                    "delivered on"
                      ? orderDetails.order.deliveryDay
                      : orderDetails.order.deliveredDate
                  }
                  style={{ fontFamily: "appfont-sb", color: Colors.textColor }}
                />
              )}
            <DetailsView
              title="Order Id:"
              value={orderDetails.order.orderNumber}
              style={{ fontFamily: "appfont-sb", color: Colors.textColor }}
            />

            <DetailsView
              title="Order Total:"
              value={"\u20B9" + orderDetails.order.createdDate}
              style={{ fontFamily: "appfont-sb", color: Colors.textColor }}
            />
            {(orderDetails.order.orderStatus.toLowerCase() ===
              "order payment cancelled" ||
              orderDetails.order.orderStatus.toLowerCase() ===
                "awaiting payment") && (
              <CustomButton
                titleStyle={styles.titleStyle}
                style={styles.button}
                title="Make payment"
                onPress={() => {
                  proceedToPay();
                }}
              />
            )}
          </View>
          <View style={styles.cardView}>
            <Text
              style={styles.shippingTitle}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              Shipping Address
            </Text>
            <Text
              style={styles.shippingDetail}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {orderDetails.order.address}
            </Text>
          </View>
          {orderDetails.order.orderStatus.toLowerCase() !==
            "order payment cancelled" &&
            orderDetails.order.orderStatus.toLowerCase() !=
              "awaiting payment" &&
            orderDetails.order.orderStatus.toLowerCase() != "delivered on" && (
              <View style={styles.cardView}>
                <Text
                  style={styles.shippingDetail}
                  adjustsFontSizeToFit={true}
                  maxFontSizeMultiplier={1}
                >
                  To check early delivery timing, kindly contact to Bindurekha
                  support team
                </Text>
              </View>
            )}
        </View>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={orderDetails.products}
          renderItem={(itemData) => (
            <OrderedItem
              title={itemData.item.productName}
              imageUrl={itemData.item.productImageURL}
              subTitle="Buy it again"
              onBuyAgainClick={() => {
                props.navigation.navigate("ProductStack", {
                  screen: "Details",
                  params: {
                    productId: itemData.item.productId,
                    isFrom: "Orders",
                  },
                });
              }}
            />
          )}
          tabLabel="PRODUCT"
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        />
      </ScrollableTabView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabView: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },

  tabUnderlineStyle: {
    height: 2,
    backgroundColor: "black",
  },
  tabTextStyle: {
    fontSize: 16,
    fontFamily: "appfont-sb",
  },

  detailText: {
    margin: 6,
    fontSize: 16,
    fontFamily: "appfont-r",
    color: Colors.tertiary_Color,
  },

  detailView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },

  shippingTitle: {
    fontSize: 17,
    fontFamily: "appfont-sb",
    color: Colors.textColor,
    marginLeft: 10,
    marginTop: 5,
  },

  shippingDetail: {
    fontSize: 16,
    fontFamily: "appfont-sb",
    color: Colors.tertiary_Color,
    marginLeft: 10,
    marginTop: 5,
    marginRight: 8,
  },
  cardView: {
    borderRadius: 5,
    borderColor: Colors.tertiary_Color,
    borderWidth: 0.5,
    marginBottom: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  button: {
    width: "50%",
    marginTop: 10,
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: 20,
  },
});

export default OrderDetails;
