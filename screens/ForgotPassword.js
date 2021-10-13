import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import Input from "../components/UI/InputOutlined";
import { ERROR_TEXT } from "../constants/Strings";
import CustomButton from "../components/UI/CustomButton";
import * as loginActions from "../store/action/user/Login";

const ForgotPassword = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isNumberValid, setNumberValid] = useState(false);
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  const dispatch = useDispatch();

  const textInputChangeHandler = useCallback((inputId, value, isValid) => {
    setMobileNumber(value);
    setNumberValid(isValid);
  }, []);

  const navigateToVerifyOtp = () => {
    props.navigation.navigate("VerifyOTP", {
      mobileNo: mobileNumber,
      from: "ForgotPassword",
    });
  };

  const showAlert = (alertMesg) => {
    Alert.alert("", alertMesg, [{ text: "Okay" }]);
  };

  const onGetOtpClicked = async () => {
    if (!internetAvailable) {
      showAlert(ERROR_TEXT.no_internet);
      return;
    }
    if (isNumberValid) {
      try {
        setErrorText(null);
        setIsLoading(true);
        await dispatch(loginActions.forgotPasswordAction(mobileNumber));
        setIsLoading(false);
        navigateToVerifyOtp();
      } catch (error) {
        setErrorText(error);
        setIsLoading(false);
      }
    } else {
      showAlert(ERROR_TEXT.invalid_mobile);
    }
  };
  useEffect(() => {
    if (errorText) {
      Alert.alert("", errorText.message, [{ text: "Okay" }]);
    }
  }, [errorText]);

  return (
    <ScrollView style={styles.screen}>
      <View>
        <TouchableOpacity
          style={styles.skipView}
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Text
            style={styles.skip}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.appLogo}
          source={require("../assets/app_logo.png")}
        />
        <Text
          style={styles.titleLbl}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Please enter your mobile number
        </Text>
        <Input
          placeholder="Mobile No."
          errorText={ERROR_TEXT.invalid_mobile}
          required
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType="number-pad"
          minLength={10}
          maxLength={10}
          id="mobileNo"
          textInputChangeHandler={textInputChangeHandler}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary_color} />
        ) : (
          <CustomButton
            style={styles.button}
            title="Get OTP"
            titleStyle={styles.titleStyle}
            onPress={onGetOtpClicked}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  skipView: {
    marginTop: 50,
    marginBottom: 80,
    marginRight: 15,
    padding: 4,
  },
  skip: {
    color: Colors.textColor,
    fontSize: 30,
    marginLeft: 20,
    textAlign: "left",
    fontFamily: "appfont-sb",
  },
  appLogo: {
    width: "80%",
    height: 120,
    marginHorizontal: 10,
    marginBottom: 80,
    alignSelf: "center",
  },

  titleLbl: {
    fontFamily: "appfont-m",
    fontSize: 17,
    color: Colors.tertiary_Color,
    marginLeft: 20,
  },
  screen: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    width: "80%",
    marginTop: 50,
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: 18,
  },
});

export default ForgotPassword;
