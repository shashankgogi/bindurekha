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
import TouchableButton from "../components/UI/TouchableButton";

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

const EditProfile = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const profileImage = useRef(null);
  const userDetails = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.user.internetAvailable
  );

  const [formState, dispatchAction] = useReducer(textInputReducer, {
    inputValues: {
      name: userDetails ? userDetails.name : "",
      city: userDetails ? userDetails.city : "",
    },

    inputValidity: {
      name: userDetails ? true : false,
      city: userDetails ? true : false,
    },

    isFormValid: false,
  });

  const showAlert = useCallback((alertMsg) => {
    Alert.alert("", alertMsg, [{ text: "Okay" }]);
  });

  const navigateToDashboard = () => {
    props.navigation.navigate("Home");
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

  const onUpdateClick = async () => {
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
      showAlert(VALIDATION.invalid_profile);
    }
  };

  const saveProfileSignUpData = async (imgUrl) => {
    try {
      setErrorText(null);
      setIsLoading(true);
      await dispatch(
        LoginAcions.signUpUserAction(
          formState.inputValues.name,
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

  if (userDetails == null) {
    return <View />;
  }
  return (
    <ScrollView>
      <View style={{ marginBottom: 50 }}>
        <TouchableButton
          buttonStyle={styles.skipView}
          imgUrl={require("../assets/back.png")}
          onButtonClick={navigateToDashboard}
        />

        <ImageLoder onSelectImage={profilePicSelectHandler} />
        <Text
          style={styles.account}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          Update Account
        </Text>
        <Input
          placeholder="Name"
          errorText={ERROR_TEXT.invalid_name}
          required
          autoCapitalize="words"
          returnKeyType="next"
          keyboardType="default"
          id="name"
          initValue={userDetails.name}
          textInputChangeHandler={textInputChangeHandler}
        />
        <Input
          placeholder={userDetails.email}
          email
          errorText={ERROR_TEXT.invalid_email}
          required
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType="email-address"
          id="emailId"
          textInputChangeHandler={textInputChangeHandler}
          editable={false}
        />
        <Input
          placeholder={userDetails.phoneNumber}
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
          editable={false}
        />

        <Input
          placeholder="City"
          errorText={ERROR_TEXT.invalid_city}
          required
          autoCapitalize="words"
          returnKeyType="next"
          keyboardType="default"
          id="city"
          initValue={userDetails.city}
          textInputChangeHandler={textInputChangeHandler}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary_color} />
        ) : (
          <CustomButton
            titleStyle={styles.titleStyle}
            style={styles.button}
            title="Update"
            onPress={onUpdateClick}
          />
        )}
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
    alignSelf: "flex-start",
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
});

export default EditProfile;
