import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";

import CustomButton from "../components/UI/CustomButton";
import OTPView from "../components/UI/OTPView";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { VALIDATION, ERROR_TEXT } from "../constants/Strings";
import * as LoginAcions from "../store/action/user/Login";

const VerifyMobileNo = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const dispatch = useDispatch();
  const [enteredOTP, setEnteredOTP] = useState("");
  const { mobileNo, from } = props.route.params;
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  const navigateToNextScreen = () => {
    if (from) {
      props.navigation.navigate("ResetPassword", {
        mobileNo: mobileNo,
      });
    } else {
      props.navigation.navigate("Home");
    }
  };

  const showAlert = (alertMesg) => {
    Alert.alert("", alertMesg, [{ text: "Okay" }]);
  };

  const onVerifyClick = async () => {
    if (!internetAvailable) {
      showAlert(ERROR_TEXT.no_internet);
      return;
    }

    if (enteredOTP.length < 4) {
      showAlert(VALIDATION.invalid_otp);
    } else {
      try {
        setErrorText(null);
        setIsLoading(true);
        await dispatch(LoginAcions.verifyOtpAction(mobileNo, enteredOTP));
        setIsLoading(false);
        navigateToNextScreen();
      } catch (error) {
        setErrorText(error);
        setIsLoading(false);
      }
    }
  };

  const onResendClicked = async () => {
    if (isLoading) {
      return;
    }

    try {
      setErrorText(null);
      setIsLoading(true);
      await dispatch(LoginAcions.forgotPasswordAction(mobileNo));
      setIsLoading(false);
    } catch (error) {
      setErrorText(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorText) {
      Alert.alert("", errorText.message, [{ text: "Okay" }]);
    }
  }, [errorText]);

  const otpTextChangeHandler = useCallback((enteredOTP) => {
    setEnteredOTP(enteredOTP);
  });

  return (
    <KeyboardAvoidingView
      style={styles.otpForm}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <ScrollView>
        <View>
          <TouchableOpacity
            style={styles.skipView}
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          >
            <Text
              style={styles.skip}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              Skip {">"}
            </Text>
          </TouchableOpacity>
          <Image
            resizeMode="contain"
            style={styles.appLogo}
            source={require("../assets/app_logo.png")}
          />
          <Text
            style={styles.otpLable}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Please enter verification code sent to your mobile number
          </Text>
          <OTPView otpTextChangeHandler={otpTextChangeHandler} />
          <TouchableOpacity style={styles.resendView} onPress={onResendClicked}>
            <Text
              style={styles.resendOtp}
              adjustsFontSizeToFit={true}
              maxFontSizeMultiplier={1}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary_color} />
          ) : (
            <CustomButton
              style={styles.button}
              title="Verify"
              titleStyle={styles.titleStyle}
              onPress={onVerifyClick}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  otpForm: {
    backgroundColor: "white",
    flex: 1,
  },
  skipView: {
    marginTop: 50,
    marginBottom: 30,
    marginRight: 15,
    padding: 4,
  },
  skip: {
    color: Colors.tertiary_Color,
    fontSize: 20,
    textAlign: "right",
    fontFamily: "appfont-m",
  },
  appLogo: {
    width: "80%",
    height: 120,
    marginHorizontal: 10,
    marginBottom: 30,
    alignSelf: "center",
  },

  otpLable: {
    fontSize: 18,
    fontFamily: "appfont-m",
    color: Colors.tertiary_Color,
    width: "75%",
    alignSelf: "center",
    textAlign: "center",
  },

  resendView: {
    marginTop: 80,
    width: "50%",
    alignSelf: "center",
  },
  resendOtp: {
    color: Colors.primary_color,
    fontSize: 18,
    fontFamily: "appfont-sb",
    alignSelf: "center",
    margin: 10,
  },

  button: {
    width: "80%",
    marginTop: 50,
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: 20,
  },

  backView: {
    marginTop: 50,
    marginBottom: 80,
    marginRight: 15,
    padding: 4,
  },

  back: {
    color: Colors.textColor,
    fontSize: 30,
    marginLeft: 20,
    textAlign: "left",
    fontFamily: "appfont-sb",
  },
});

export const screenOptions = (navData) => {
  return {
    header: () => null,
  };
};
export default VerifyMobileNo;
