import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";
import Input from "../components/UI/InputOutlined";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import * as orderActions from "../store/action/Order/Order";
import { VALIDATION, ERROR_TEXT } from "../constants/Strings";

const textInputReducer = (state, action) => {
  const updatedInputValues = {
    ...state.inputValues,
    [action.inputId]: action.value,
  };

  const updatedInputValidity = {
    ...state.inputValidity,
    [action.inputId]: action.isValid,
  };

  let updatedFormValidState = true;
  for (const key in updatedInputValidity) {
    updatedFormValidState = updatedFormValidState && updatedInputValidity[key];
  }
  return {
    inputValues: updatedInputValues,
    inputValidity: updatedInputValidity,
    isFormValid: updatedFormValidState,
  };
};

const AddAddress = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const { addressObj } = props.route.params;

  const dispatch = useDispatch();
  const [formState, dispatchAction] = useReducer(textInputReducer, {
    inputValues: {
      mobileno: addressObj ? addressObj.mobileNumber : "",
      flatno: addressObj ? addressObj.address : "",
      colony: addressObj ? addressObj.landmark : "",
      area: addressObj ? addressObj.locality : "",
      city: addressObj ? addressObj.city : "",
      state: addressObj ? addressObj.state : "",
      country: addressObj ? addressObj.country : "",
      pincode: addressObj ? addressObj.pincode : "",
    },

    inputValidity: {
      mobileno: addressObj ? true : false,
      flatno: addressObj ? true : false,
      colony: addressObj ? true : false,
      area: addressObj ? true : false,
      city: addressObj ? true : false,
      state: addressObj ? true : false,
      country: addressObj ? true : false,
      pincode: addressObj ? true : false,
    },

    isFormValid: addressObj ? true : false,
  });

  const showAlert = useCallback((alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  });

  const textInputChangeHandler = useCallback(
    (inputId, value, isValid) => {
      dispatchAction({ inputId, value, isValid });
    },
    [dispatchAction]
  );

  useEffect(() => {
    if (errorText) {
      Alert.alert("", errorText.message, [{ text: "Okay" }]);
    }
  }, [errorText]);

  const onSubmitClick = async (edit) => {
    if (formState.isFormValid) {
      try {
        setErrorText(null);
        setIsLoading(true);
        if (edit) {
          await dispatch(
            orderActions.editDeliveryAddressAction(
              formState.inputValues.mobileno,
              formState.inputValues.pincode,
              formState.inputValues.flatno,
              formState.inputValues.colony,
              formState.inputValues.city,
              formState.inputValues.state,
              formState.inputValues.country,
              formState.inputValues.area,
              addressObj.id
            )
          );
        } else {
          await dispatch(
            orderActions.addDeliveryAddressAction(
              formState.inputValues.mobileno,
              formState.inputValues.pincode,
              formState.inputValues.flatno,
              formState.inputValues.colony,
              formState.inputValues.city,
              formState.inputValues.state,
              formState.inputValues.country,
              formState.inputValues.area
            )
          );
        }

        await dispatch(orderActions.fetchUserAddressesAction());
        props.navigation.goBack();
        setIsLoading(false);
      } catch (error) {
        setErrorText(error);
        setIsLoading(false);
      }
    } else {
      showAlert(VALIDATION.invalid_address);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.addressForm}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <ScrollView>
        <View style={{ marginBottom: 50 }}>
          <Input
            placeholder="Mobile number"
            errorText={ERROR_TEXT.invalid_mobile}
            required
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            keyboardType="number-pad"
            minLength={10}
            maxLength={10}
            initValue={formState.inputValues.mobileno}
            id="mobileno"
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="Flat No/House No/Floor/Building"
            errorText={ERROR_TEXT.invalid_flatno}
            required
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            id="flatno"
            initValue={formState.inputValues.flatno}
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="Colony/Street/Landmark"
            errorText={ERROR_TEXT.invalid_streetname}
            required
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            id="colony"
            initValue={formState.inputValues.colony}
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="Area/Locality"
            errorText={ERROR_TEXT.invalid_area}
            required
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            id="area"
            initValue={formState.inputValues.area}
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="City"
            errorText={ERROR_TEXT.invalid_city}
            required
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            id="city"
            initValue={formState.inputValues.city}
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="State"
            errorText={ERROR_TEXT.invalid_state}
            required
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            id="state"
            initValue={formState.inputValues.state}
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="Country"
            errorText={ERROR_TEXT.invalid_country}
            required
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            id="country"
            initValue={formState.inputValues.country}
            textInputChangeHandler={textInputChangeHandler}
          />
          <Input
            placeholder="Pin Code"
            errorText={ERROR_TEXT.invalid_pin}
            required
            autoCapitalize="words"
            returnKeyType="done"
            keyboardType="number-pad"
            id="pincode"
            initValue={formState.inputValues.pincode}
            textInputChangeHandler={textInputChangeHandler}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary_color} />
          ) : (
            <CustomButton
              titleStyle={styles.titleStyle}
              style={styles.button}
              title={addressObj ? "Save" : "Add Address"}
              onPress={onSubmitClick.bind(this, addressObj)}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  addressForm: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    width: "80%",
    marginTop: 50,
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: 20,
  },
});

export default AddAddress;
