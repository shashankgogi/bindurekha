import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
} from "react-native";

import Address from "../components/Order/AddressListItem";
import Colors from "../constants/Colors";
import * as orderActions from "../store/action/Order/Order";
import CustomButton from "../components/UI/CustomButton";
import Loader from "../components/UI/CustomLoader";
import { VALIDATION, ERROR_TEXT } from "../constants/Strings";
import NoInternet from "../components/Internet/NoInternet";
import CheckBox from "../components/UI/CheckBox";
import HeaderTitle from "../components/UI/HeaderTitle";

const ReviewOrder = (props) => {
  // let selectedAddr;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [isGiftWrap, setGiftWrap] = useState(false);
  const [commentText, setCommentText] = useState("");
  const termsAndCondition = useRef();
  // termsAndCondition.current = false;

  let dispatch = useDispatch();
  const addressItems = useSelector((state) => state.order.addresses);
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );

  const getTermsConditionValue = useCallback(async () => {
    let value = await AsyncStorage.getItem("TermsAndCondition");

    if (value) {
      termsAndCondition.current = JSON.parse(value);
    } else {
      termsAndCondition.current = false;
    }
    console.log("Value......." + termsAndCondition.current);
  });

  const fetchUserAddresses = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await dispatch(orderActions.fetchUserAddressesAction());
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [dispatch]);

  const addressItemClick = (addressId) => {
    if (addressId > 0) {
      let address = addressItems.find((address) => address.id === addressId);
      setSelectedAddr(address);
    } else {
      props.navigation.navigate("New Address", { addressObj: null });
    }
  };

  const navigateToReviewOrder = () => {
    if (isGiftWrap && commentText.length === 0) {
      showAlert(VALIDATION.invalid_comment);
      return;
    }
    console.log("navigation value..." + termsAndCondition.current);
    if (selectedAddr) {
      props.navigation.navigate("Order Summary", {
        selectedAddress: selectedAddr,
        comment: commentText,
        termsAndCondValue: termsAndCondition.current,
      });
    } else {
      showAlert(VALIDATION.invalid_address);
    }
  };

  const showAlert = (alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  };
  useEffect(() => {
    if (addressItems && addressItems.length > 1) {
      setSelectedAddr(addressItems[0]);
    }
  }, [addressItems]);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>Delivery Address</HeaderTitle>;
      },
    });
  }, [props.navigation]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      getTermsConditionValue();
    });
    return unsubscribe;
  }, [props.navigation, getTermsConditionValue]);

  const deleteAddressClick = useCallback(
    async (id) => {
      try {
        setError(null);
        setIsLoading(true);
        await dispatch(orderActions.deleteDeliveryAddresstAction(id));
        fetchUserAddresses();
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err);
      }
    },
    [dispatch]
  );

  const editAddressClick = (addressId) => {
    let address = addressItems.find((address) => address.id === addressId);
    props.navigation.navigate("New Address", { addressObj: address });
  };

  useEffect(() => {
    if (error && error.message.toLowerCase() != ERROR_TEXT.no_internet) {
      showAlert(error.message);
    }
  }, [error]);

  if (!internetAvailable) {
    return (
      <NoInternet
        onPress={() => {
          fetchProductList();
        }}
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (addressItems == null) {
    return <View></View>;
  }

  return (
    <View style={styles.screen}>
      <ScrollView>
        <Text
          style={styles.titleLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Your order will be delivered to selected address
        </Text>
        <FlatList
          horizontal
          keyExtractor={(item) => item.id.toString()}
          data={addressItems}
          renderItem={(itemData) => (
            <Address
              name={itemData.item.name}
              id={itemData.item.id}
              address={
                itemData.item.address +
                ", " +
                itemData.item.landmark +
                ", " +
                itemData.item.locality +
                ", " +
                itemData.item.city +
                ", " +
                itemData.item.state +
                ", " +
                itemData.item.country +
                "- " +
                itemData.item.pincode
              }
              contactNo={itemData.item.mobileNumber}
              onItemClick={addressItemClick}
              onDeleteClick={deleteAddressClick}
              onEditClick={editAddressClick}
              selectedId={selectedAddr ? selectedAddr.id : null}
            />
          )}
          extraData={selectedAddr}
        />

        <Text
          style={styles.bottomLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Your order will be delivered in 6-8 days{" "}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.commentView}
          onPress={() => {
            setGiftWrap(!isGiftWrap);
            if (!isGiftWrap) {
              showAlert(VALIDATION.giftwrap_msg);
            } else {
              setCommentText("");
            }
          }}
        >
          <CheckBox
            isChecked={isGiftWrap}
            onCheckClick={() => {
              setGiftWrap(!isGiftWrap);
              if (!isGiftWrap) {
                showAlert(VALIDATION.giftwrap_msg);
              } else {
                setCommentText("");
              }
            }}
            style={styles.checkBox}
          />
          <Text
            style={styles.titleLbl}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Would you like to gift wrap it?
          </Text>
        </TouchableOpacity>
        {isGiftWrap && (
          <View style={styles.cardView}>
            <TextInput
              placeholder="Type message"
              style={styles.textInput}
              multiline
              maxLength={200}
              selectionColor={Colors.tertiary_Color}
              onChangeText={(value) => {
                setCommentText(value);
              }}
              blurOnSubmit
            />
          </View>
        )}
      </ScrollView>

      <CustomButton
        style={styles.button}
        title="Review order"
        titleStyle={styles.titleStyle}
        onPress={() => {
          navigateToReviewOrder();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleLbl: {
    fontSize: 16,
    fontFamily: "appfont-sb",
    marginLeft: 10,
    marginTop: 10,
  },
  bottomLbl: {
    fontSize: 16,
    fontFamily: "appfont-r",
    color: Colors.textColor,
    marginLeft: 10,
    marginTop: 10,
  },
  button: {
    width: "95%",
    marginTop: 50,
    alignSelf: "center",
    marginBottom: 36,
  },
  titleStyle: {
    fontSize: 20,
  },

  commentView: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },

  checkBox: {
    marginLeft: 12,
  },
  cardView: {
    borderRadius: 5,
    borderColor: Colors.tertiary_Color,
    borderWidth: 0.5,
    marginBottom: 20,
    marginTop: 15,
    marginHorizontal: 10,
    paddingVertical: 10,
  },

  textInput: {
    marginHorizontal: 10,
    fontFamily: "appfont-r",
    fontSize: 16,
  },
});
export default ReviewOrder;
