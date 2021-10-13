import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Platform,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import Loader from "../components/UI/CustomLoader";
import * as logiActions from "../store/action/user/Login";
import {
  placeOrderAction,
  updateOrderStatusAction,
} from "../store/action/Order/Order";
import PayuMoney from "react-native-payumoney";
import * as Constants from "../constants/Constants";
import HeaderTitle from "../components/UI/HeaderTitle";
import CheckBox from "../components/UI/CheckBox";
import { APP_TEXT } from "../constants/Strings";
import { VALIDATION } from "../constants/Strings";
import TouchableButton from "../components/UI/TouchableButton";
import OrderDetails from "./OrderDetails";

const OrderSumary = (props) => {
  const { selectedAddress, comment, termsAndCondValue } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  console.log("..... value...." + termsAndCondValue);
  const [termsAndCondition, setTermsAndCondition] = useState(termsAndCondValue);

  const [error, setError] = useState(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const userDetails = useSelector((state) => state.user.user);
  let dispatch = useDispatch();

  const SummaryView = (props) => {
    return (
      <View style={styles.summaryView}>
        <Text
          style={{ ...styles.summaryText, ...props.style }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.title}
        </Text>
        <Text
          style={{ ...styles.summaryText, ...props.style }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {"\u20B9"}
          {props.value}
        </Text>
      </View>
    );
  };

  const OrderDetailsView = (props) => {
    return (
      <View style={{ ...styles.summaryView }}>
        <Text
          style={{ ...styles.summaryText, ...props.style, textAlign: "left" }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.title}
        </Text>
        <Text
          style={{ ...styles.summaryText, ...props.style }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.quantity}
        </Text>
        <Text
          style={{ ...styles.summaryText, ...props.style, textAlign: "right" }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {"\u20B9"}
          {props.value}
        </Text>
      </View>
    );
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await dispatch(logiActions.fetchUserDetailsAction());
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const placeOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const resData = await dispatch(
        placeOrderAction(selectedAddress.id, comment, {
          sumOfOriginalPrice: totalAmount.sumOfOriginalPrice,
          sumOfDiscountPrice: totalAmount.sumOfDiscountPrice,
          shippingCharges: totalAmount.shippingCharges,
          gstCharges: totalAmount.gstCharges,
          // coupon: null,
        })
      );
      console.log(resData);
      proceedToPay(resData.orderId, resData.deliveryDay, resData.orderNumber);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const proceedToPay = async (orderNo, deliveryDay, orderNumber) => {
    const amt =
      totalAmount.sumOfOriginalPrice -
      (totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice);
    let options = {
      amount: amt.toString(),
      txnId: orderNo.toString(),
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
        orderNo,
        amt,
        userDetails.name,
        userDetails.email
      ),
    };
    console.log(".............." + options);
    try {
      setError(null);
      const resData = await PayuMoney(options);
      console.log(resData);
      console.log("Successs.......");
      updatePaymentStatus(true, orderNo, deliveryDay, orderNumber);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      updatePaymentStatus(false, orderNo, deliveryDay, orderNumber);
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
        updateOrderStatusAction(orderId, status)
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
    props.navigation.navigate("Order Status", {
      status: status,
      orderId: orderId,
      deliveryDay: deliveryDay,
      orderNumber: orderNumber,
    });
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>Order Summary</HeaderTitle>;
      },
    });
  }, [props.navigation]);

  useEffect(() => {
    if (error) {
      showAlert(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <Loader />;
  }

  const showAlert = (alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  };

  const saveTermsAndConditionValue = (status) => {
    console.log(JSON.stringify(status));
    AsyncStorage.setItem("TermsAndCondition", JSON.stringify(status));
  };

  const showTermsAndConditionAlert = () => {
    console.log(termsAndCondition);
    Alert.alert("Remember me", VALIDATION.terms_condition, [
      {
        text: "No",
        onPress: () => {
          saveTermsAndConditionValue(false);
        },
      },
      {
        text: "Yes",
        onPress: () => {
          saveTermsAndConditionValue(true);
        },
      },
    ]);
  };
  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Text
          style={styles.headerLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Delivery Address:
        </Text>
        <View style={styles.cardView}>
          <Text
            numberOfLines={1}
            style={styles.name}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            {selectedAddress.name}
          </Text>
          <Text
            style={styles.address}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            {selectedAddress.address +
              ", " +
              selectedAddress.landmark +
              ", " +
              selectedAddress.locality +
              ", " +
              selectedAddress.city +
              ", " +
              selectedAddress.state +
              ", " +
              selectedAddress.country +
              "- " +
              selectedAddress.pincode}
          </Text>
          <Text
            style={{ ...styles.address, marginTop: 5 }}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Contact No.: {selectedAddress.mobileNumber}
          </Text>
        </View>
        {!APP_TEXT.is_freeVersion && (
          <View>
            <Text
              style={styles.headerLbl}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              Coupon Code:
            </Text>
            <View style={styles.cardView}>
              <View style={styles.couponView}>
                <TextInput
                  placeholder="Enter your code"
                  style={styles.couponInput}
                />
                <TouchableOpacity
                  style={styles.applyView}
                  onPress={() => {
                    console.log("Apply cliked...");
                  }}
                >
                  <Text
                    style={styles.apply}
                    adjustsFontSizeToFit={true}
                    maxFontSizeMultiplier={1}
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <Text
          style={styles.headerLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Total Amount:
        </Text>
        <View style={styles.cardView}>
          <SummaryView
            title="Sub Total"
            value={
              totalAmount.sumOfOriginalPrice -
              (totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice)
            }
          />
          <SummaryView
            title="Products Discount"
            value={
              totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice
            }
          />
          <SummaryView
            title="Shipping Charges"
            value={
              totalAmount.shippingCharges > 0
                ? totalAmount.shippingCharges
                : "Free"
            }
          />
          <View style={styles.devideLine} />
          <SummaryView
            style={{ fontFamily: "appfont-sb", fontSize: 18 }}
            title="Total Amount"
            value={
              totalAmount.sumOfOriginalPrice -
              (totalAmount.sumOfOriginalPrice - totalAmount.sumOfDiscountPrice)
            }
          />
        </View>
        <Text
          style={styles.headerLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Other Details:
        </Text>
        <View style={styles.cardView}>
          {cartItems.map((p1) => (
            <OrderDetailsView
              key={p1.productId}
              title={p1.productName}
              quantity={p1.quantity}
              value={p1.discountedPrice}
              style={{
                flex: 1,
                textAlign: "center",
              }}
            />
          ))}
        </View>
        {comment.length != 0 && (
          <Text
            style={styles.headerLbl}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Gift Message:
          </Text>
        )}
        {comment.length != 0 && (
          <View style={styles.cardView}>
            <Text
              style={styles.commentText}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              {comment}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.termsAndCondition}
        onPress={() => {
          setTermsAndCondition(!termsAndCondition);
          if (!termsAndCondition) {
            showTermsAndConditionAlert();
          } else {
            saveTermsAndConditionValue(false);
          }
        }}
      >
        <CheckBox
          isChecked={termsAndCondition}
          onCheckClick={() => {
            setTermsAndCondition(!termsAndCondition);
            if (!termsAndCondition) {
              showTermsAndConditionAlert();
            } else {
              saveTermsAndConditionValue(false);
            }
          }}
          style={styles.checkBox}
        />
        <Text
          style={styles.titleLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Please agree to our{" "}
        </Text>
        <TouchableButton
          buttonStyle={{
            marginLeft: 1,
          }}
          text="terms and condition"
          textStyle={{ color: Colors.contact, marginTop: 10 }}
          onButtonClick={() => {
            console.log("web");
            props.navigation.navigate("Teams of use", {
              htmlPath: require("../resources/termsuse.html"),
              title: "Teams of use",
              isFrom: "Summary",
            });
          }}
        />
      </TouchableOpacity>
      <CustomButton
        style={styles.button}
        cardStyle={{
          backgroundColor: termsAndCondition
            ? Colors.primary_color
            : Colors.tertiary_Color,
        }}
        title="Place Order"
        titleStyle={styles.titleStyle}
        onPress={() => {
          if (termsAndCondition) {
            placeOrderDetails();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, margin: 10 },
  devideLine: {
    backgroundColor: Colors.tertiary_Color,
    height: "0.5%",
    margin: 10,
  },
  headerLbl: {
    margin: 5,
    fontSize: 17,
    fontFamily: "appfont-sb",
  },
  cardView: {
    borderRadius: 5,
    borderColor: Colors.tertiary_Color,
    borderWidth: 0.5,
    marginBottom: 20,
    paddingVertical: 10,
  },
  name: {
    fontSize: 18,
    marginHorizontal: 15,
    marginTop: 5,
    textAlign: "left",
    fontFamily: "appfont-l",
  },

  address: {
    fontSize: 16,
    marginHorizontal: 15,
    marginTop: 5,
    textAlign: "left",
    fontFamily: "appfont-m",
    color: Colors.tertiary_Color,
  },

  couponView: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  couponInput: {
    padding: 5,
    borderBottomColor: Colors.textColor,
    borderBottomWidth: 0.5,
    width: "80%",
    marginRight: 10,
    fontFamily: "appfont-r",
    fontSize: 17,
  },
  applyView: {
    marginHorizontal: 10,
    padding: 4,
  },
  apply: {
    color: Colors.primary_color,
    fontSize: 18,
    textAlign: "right",
    fontFamily: "appfont-m",
  },

  summaryText: {
    margin: 10,
    fontSize: 16,
    fontFamily: "appfont-r",
  },

  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },

  button: {
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
    marginBottom: 36,
  },
  titleStyle: {
    fontSize: 20,
  },

  commentText: {
    marginHorizontal: 10,
    fontFamily: "appfont-r",
    fontSize: 15,
    color: Colors.tertiary_Color,
  },

  titleLbl: {
    fontSize: 16,
    fontFamily: "appfont-sb",
    marginLeft: 10,
    marginTop: 10,
  },
  termsAndCondition: {
    flexDirection: "row",
    paddingTop: 10,
    alignItems: "center",
    marginBottom: 10,
    borderTopColor: "gray",
    borderTopWidth: 0.5,
  },
  checkBox: {
    marginLeft: 12,
  },
});

export default OrderSumary;
