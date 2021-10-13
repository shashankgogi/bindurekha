import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import Input from "../components/UI/InputOutlined";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import * as LoginAcions from "../store/action/user/Login";
import { VALIDATION, ERROR_TEXT } from "../constants/Strings";
import UndelinedText from "../components/UI/UnderlinedText";

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

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  const [formState, dispatchAction] = useReducer(textInputReducer, {
    inputValues: {
      mobileNo: "",
      password: "",
    },

    inputValidity: {
      mobileNo: false,
      password: false,
    },

    isFormValid: false,
  });

  const navigateToSignUp = () => {
    setRefreshPage(true);
    props.navigation.navigate("SignUp");
  };

  const navigateToDashboard = () => {
    setRefreshPage(true);
    props.navigation.navigate("Home");
  };

  const navigateToForgotPassword = () => {
    setRefreshPage(true);
    props.navigation.navigate("ForgotPassword");
  };
  const showAlert = useCallback((alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  });

  const onSubmitClick = async () => {
    if (!internetAvailable) {
      showAlert(ERROR_TEXT.no_internet);
      return;
    }
    if (formState.isFormValid) {
      try {
        setErrorText(null);
        setIsLoading(true);
        await dispatch(
          LoginAcions.signInUserAction(
            formState.inputValues.mobileNo,
            formState.inputValues.password
          )
        );
        await dispatch(LoginAcions.fetchUserDetailsAction());
        setIsLoading(false);
        navigateToDashboard();
      } catch (error) {
        setErrorText(error);
        setIsLoading(false);
      }
    } else {
      showAlert(VALIDATION.invalid_login);
    }
  };

  const textInputChangeHandler = useCallback(
    (inputId, value, isValid) => {
      dispatchAction({ inputId, value, isValid });
      setRefreshPage(false);
    },
    [dispatchAction]
  );

  useEffect(() => {
    if (errorText) {
      Alert.alert("", errorText.message, [{ text: "Okay" }]);
    }
  }, [errorText]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      setRefreshPage(!refreshPage);
    });
    return unsubscribe;
  }, [props.navigation, refreshPage]);

  return (
    // <KeyboardAvoidingView
    //   style={styles.loginForm}
    //   behavior="padding"
    //   keyboardVerticalOffset={0}
    // >
    <ScrollView>
      <View>
        <TouchableOpacity style={styles.skipView} onPress={navigateToDashboard}>
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
          refresh={refreshPage ? !refreshPage : refreshPage}
        />

        <Input
          placeholder="Password"
          errorText={ERROR_TEXT.invalid_password}
          errorText2={ERROR_TEXT.invalid_password2}
          minLength={6}
          required
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          keyboardType="default"
          id="password"
          textInputChangeHandler={textInputChangeHandler}
          password
          refresh={refreshPage ? !refreshPage : refreshPage}
        />
        <UndelinedText
          text="Forgot password"
          onTextClick={navigateToForgotPassword}
          color={Colors.secondry_Color}
          style={styles.forgotPassword}
          textStyle={styles.fpText}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary_color} />
        ) : (
          <CustomButton
            style={styles.button}
            title="Sign in"
            titleStyle={styles.titleStyle}
            onPress={onSubmitClick}
          />
        )}
        <View style={styles.signUpView}>
          <Text
            style={styles.signupLable}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Not a member?
          </Text>
          <UndelinedText
            text="Sign up"
            onTextClick={navigateToSignUp}
            color={Colors.primary_color}
            style={styles.signup}
            textStyle={styles.signUpText}
          />
        </View>
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  activityView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  loginForm: {
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
  signUpView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  signupLable: {
    fontSize: 18,
    fontFamily: "appfont-m",
    color: Colors.secondry_Color,
  },

  forgotPassword: {
    borderBottomColor: Colors.secondry_Color,
    marginTop: 10,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  fpText: {
    fontSize: 17,
  },

  signUpText: {
    color: Colors.primary_color,
  },
  signup: {
    borderBottomColor: Colors.primary_color,
  },
});

export const screenOptions = (navData) => {
  return {
    header: () => null,
  };
};
export default Login;
