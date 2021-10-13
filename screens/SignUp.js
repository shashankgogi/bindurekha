import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";
import Input from "../components/UI/InputOutlined";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import * as LoginAcions from "../store/action/user/Login";
import { VALIDATION, ERROR_TEXT } from "../constants/Strings";
import UndelinedText from "../components/UI/UnderlinedText";
import ImageLoder from "../components/UI/ImageLoader";

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

const SignUp = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const profileImage = useRef(null);

  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );
  const [formState, dispatchAction] = useReducer(textInputReducer, {
    inputValues: {
      name: "",
      emailId: "",
      mobileNo: "",
      password: "",
      city: "",
    },

    inputValidity: {
      name: false,
      emailId: false,
      mobileNo: false,
      password: false,
      city: false,
    },

    isFormValid: false,
  });

  const showAlert = useCallback((alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  });

  const navigateToVerifyOTP = () => {
    props.navigation.navigate("VerifyOTP", {
      mobileNo: formState.inputValues.mobileNo,
    });
  };

  const textInputChangeHandler = useCallback(
    (inputId, value, isValid) => {
      dispatchAction({ inputId, value, isValid });
    },
    [dispatchAction]
  );

  const profilePicSelectHandler = useCallback((imageUrl) => {
    profileImage.current = imageUrl;
  }, []);

  useEffect(() => {
    if (errorText) {
      Alert.alert("", errorText.message, [{ text: "Okay" }]);
    }
  }, [errorText]);

  const onSubmitClick = async () => {
    if (!internetAvailable) {
      showAlert(ERROR_TEXT.no_internet);
      return;
    }
    if (formState.isFormValid) {
      if (profileImage.current != null) {
        try {
          setIsLoading(true);
          setErrorText(null);
          const imageUrl = await dispatch(
            LoginAcions.saveProfileImageAction(profileImage.current)
          );

          saveProfileSignUpData(imageUrl);
        } catch (err) {
          setErrorText(err);
          setIsLoading(false);
        }
      } else {
        saveProfileSignUpData("");
      }
    } else {
      showAlert(VALIDATION.invalid_signup);
    }
  };

  const saveProfileSignUpData = async (imgUrl) => {
    try {
      setErrorText(null);
      setIsLoading(true);
      await dispatch(
        LoginAcions.signUpUserAction(
          formState.inputValues.name,
          formState.inputValues.emailId,
          formState.inputValues.mobileNo,
          formState.inputValues.password,
          formState.inputValues.city,
          imgUrl
        )
      );
      setIsLoading(false);
      navigateToVerifyOTP();
    } catch (error) {
      setErrorText(error);
      setIsLoading(false);
    }
  };

  return (
    // <KeyboardAvoidingView
    //   style={styles.signupForm}
    //   behavior="position"
    //   keyboardVerticalOffset={50}
    // >
    <ScrollView>
      <View style={{ marginBottom: 50 }}>
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
        {/* <Image
            resizeMode="contain"
            style={styles.profile}
            source={require("../assets/profilepic.png")}
          /> */}

        <ImageLoder onSelectImage={profilePicSelectHandler} />
        <Text
          style={styles.account}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Create Account
        </Text>
        <Input
          placeholder="Name"
          errorText={ERROR_TEXT.invalid_name}
          required
          autoCapitalize="words"
          returnKeyType="next"
          keyboardType="default"
          id="name"
          textInputChangeHandler={textInputChangeHandler}
        />
        <Input
          placeholder="Email id"
          email
          errorText={ERROR_TEXT.invalid_email}
          required
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType="email-address"
          id="emailId"
          textInputChangeHandler={textInputChangeHandler}
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
          secureTextEntry={true}
          keyboardType="default"
          id="password"
          password
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
          textInputChangeHandler={textInputChangeHandler}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary_color} />
        ) : (
          <CustomButton
            titleStyle={styles.titleStyle}
            style={styles.button}
            title="Sign up"
            onPress={onSubmitClick}
          />
        )}
        <View style={styles.signUpView}>
          <Text
            style={styles.signupLable}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            Already have a account?
          </Text>
          <UndelinedText
            text="Login"
            onTextClick={() => {
              props.navigation.goBack();
            }}
            color={Colors.primary_color}
            style={styles.login}
            textStyle={styles.loginText}
          />
        </View>
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  signupForm: {
    backgroundColor: "white",
    flex: 1,
  },

  account: {
    fontSize: 22,
    marginLeft: 20,
    fontFamily: "appfont-m",
    color: Colors.textColor,
  },
  skipView: {
    marginTop: 50,
    marginRight: 15,
    padding: 4,
  },
  skip: {
    color: Colors.tertiary_Color,
    fontSize: 20,
    textAlign: "right",
    fontFamily: "appfont-m",
  },
  profile: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginBottom: 30,
    alignSelf: "center",
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
  },
  signupLable: {
    fontSize: 17,
    fontFamily: "appfont-m",
  },
  login: {
    borderBottomColor: Colors.primary_color,
  },
  loginText: {
    color: Colors.primary_color,
  },
});

export const screenOptions = (navData) => {
  return {
    header: () => null,
  };
};
export default SignUp;
