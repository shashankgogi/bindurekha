import React, { useCallback, useState, useEffect, useReducer } from "react";
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
import Colors from "../constants/Colors";
import Input from "../components/UI/InputOutlined";
import { VALIDATION, ERROR_TEXT } from "../constants/Strings";
import CustomButton from "../components/UI/CustomButton";
import * as loginActions from "../store/action/user/Login";
import { useDispatch, useSelector } from "react-redux";

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

const ResetPassword = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  const { mobileNo } = props.route.params;
  const [formState, dispatchAction] = useReducer(textInputReducer, {
    inputValues: {
      newPassword: "",
      confirmPassword: "",
    },

    inputValidity: {
      newPassword: false,
      confirmPassword: false,
    },

    isFormValid: false,
  });

  const textInputChangeHandler = useCallback(
    (inputId, value, isValid) => {
      dispatchAction({ inputId, value, isValid });
    },
    [dispatchAction]
  );

  const navigateToLogin = () => {
    props.navigation.popToTop();
  };

  const showAlert = (alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  };
  const savePasswordClicked = async () => {
    if (!internetAvailable) {
      showAlert(ERROR_TEXT.no_internet);
      return;
    }

    if (
      formState.inputValues.newPassword !==
      formState.inputValues.confirmPassword
    ) {
      showAlert(VALIDATION.invalid_newPassword);
      return;
    }
    if (formState.isFormValid) {
      try {
        setErrorText(null);
        setIsLoading(true);
        await dispatch(
          loginActions.resetPasswordAction(
            mobileNo,
            formState.inputValues.newPassword
          )
        );
        setIsLoading(false);
        navigateToLogin();
      } catch (error) {
        setErrorText(error);
        setIsLoading(false);
      }
    } else {
      showAlert(VALIDATION.invalid_resetPassword);
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
          Create New Password
        </Text>

        <Input
          placeholder="Enter new password"
          errorText={ERROR_TEXT.invalid_new_password}
          errorText2={ERROR_TEXT.invalid_password2}
          minLength={6}
          required
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          secureTextEntry={true}
          keyboardType="default"
          id="newPassword"
          password
          textInputChangeHandler={textInputChangeHandler}
        />
        <Input
          placeholder="Re-enter new password"
          errorText={ERROR_TEXT.invalid_confirm_password}
          errorText2={ERROR_TEXT.invalid_password2}
          minLength={6}
          required
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          secureTextEntry={true}
          keyboardType="default"
          id="confirmPassword"
          password
          textInputChangeHandler={textInputChangeHandler}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary_color} />
        ) : (
          <CustomButton
            style={styles.button}
            title="Save password"
            titleStyle={styles.titleStyle}
            onPress={savePasswordClicked}
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
    marginBottom: 50,
    alignSelf: "center",
  },

  titleLbl: {
    fontFamily: "appfont-m",
    fontSize: 20,
    color: Colors.tertiary_Color,
    marginLeft: 24,
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
    fontSize: 20,
  },
});

export default ResetPassword;
