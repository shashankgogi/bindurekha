import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const OTPView = (props) => {
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");

  let firstInput = null;
  let secondInput = null;
  let thirdInput = null;
  let forthInput = null;

  const textInputHandler = (id, text) => {
    console.log(text);
    switch (id) {
      case "otp1":
        {
          if (text.trim().length != 0 && text.length === 1) {
            setOtp1(text);
            secondInput.focus();
          }
        }
        break;
      case "otp2":
        {
          if (text.trim().length != 0 && text.length === 1) {
            setOtp2(text);
            thirdInput.focus();
          }
        }
        break;
      case "otp3":
        {
          if (text.trim().length != 0 && text.length === 1) {
            setOtp3(text);
            forthInput.focus();
          }
        }
        break;
      case "otp4":
        {
          if (text.trim().length != 0 && text.length === 1) {
            setOtp4(text);
            forthInput.blur();
          }
        }
        break;
    }
  };

  const { otpTextChangeHandler } = props;
  useEffect(() => {
    otpTextChangeHandler(otp1 + otp2 + otp3 + otp4);
  }, [otpTextChangeHandler, otp1, otp2, otp3, otp4]);

  return (
    <View style={styles.view}>
      <View style={styles.otpView}>
        <TextInput
          maxFontSizeMultiplier={1}
          selectionColor={Colors.primary_color}
          style={styles.input}
          maxLength={1}
          numberOfLines={1}
          returnKeyType="next"
          onChangeText={textInputHandler.bind(this, "otp1")}
          blurOnSubmit={false}
          ref={(input) => {
            firstInput = input;
          }}
          onSubmitEditing={() => {
            firstInput.blur();
          }}
        />
      </View>
      <View style={styles.otpView}>
        <TextInput
          maxFontSizeMultiplier={1}
          style={styles.input}
          selectionColor={Colors.primary_color}
          maxLength={1}
          numberOfLines={1}
          onChangeText={textInputHandler.bind(this, "otp2")}
          returnKeyType="next"
          ref={(input) => {
            secondInput = input;
          }}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            secondInput.blur();
          }}
        />
      </View>
      <View style={styles.otpView}>
        <TextInput
          maxFontSizeMultiplier={1}
          style={styles.input}
          selectionColor={Colors.primary_color}
          maxLength={1}
          numberOfLines={1}
          onChangeText={textInputHandler.bind(this, "otp3")}
          returnKeyType="next"
          ref={(input) => {
            thirdInput = input;
          }}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            thirdInput.blur();
          }}
        />
      </View>
      <View style={styles.otpView}>
        <TextInput
          maxFontSizeMultiplier={1}
          style={styles.input}
          selectionColor={Colors.primary_color}
          maxLength={1}
          numberOfLines={1}
          returnKeyType="next"
          onChangeText={textInputHandler.bind(this, "otp4")}
          ref={(input) => {
            forthInput = input;
          }}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            forthInput.blur();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30,
    height: 60,
    marginHorizontal: 30,
  },
  otpView: {
    borderBottomColor: Colors.primary_color,
    borderBottomWidth: 2,
    marginHorizontal: 10,
    flex: 1,
  },
  input: {
    fontFamily: "appfont-m",
    fontSize: 30,
    height: "100%",
    width: "100%",
    textAlign: "center",
  },
});
export default OTPView;
