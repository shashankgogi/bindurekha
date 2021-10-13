import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import TextInput from "./CustomInput";
import Colors from "../../constants/Colors";

const InputOutlined = (props) => {
  const [isTextValid, setIsTextValid] = useState(
    props.initValue ? true : false
  );
  const [enteredText, setEnteredText] = useState(props.initValue);
  const [isTouched, setIstTouched] = useState(props.initValue ? true : false);
  const [eyeClick, setEyeClick] = useState(props.password ? true : false);

  const onTextChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    setIsTextValid(isValid);
    setEnteredText(text);
  };

  const lostFocus = () => {
    setIstTouched(true);
  };

  const { textInputChangeHandler, id } = props;
  useEffect(() => {
    textInputChangeHandler(id, enteredText, isTextValid);
  }, [textInputChangeHandler, id, enteredText, isTextValid]);

  return (
    <View style={{ marginBottom: 10 }}>
      <TextInput
        editable={props.editable}
        {...props}
        style={{ ...styles.input, ...props.style }}
        placeholder={props.placeholder}
        focusedColor={Colors.textColor}
        defaultColor={Colors.tertiary_Color}
        value={enteredText}
        onChangeText={onTextChangeHandler}
        onSubmitEditing={lostFocus}
        secureTextEntry={eyeClick}
        onEyeClick={() => {
          setEyeClick(!eyeClick);
        }}
        maxFontSizeMultiplier={1}
      />
      {!isTextValid && isTouched && (
        <Text
          style={styles.errorText}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {enteredText &&
          enteredText.length != 0 &&
          enteredText.length < 6 &&
          props.errorText2
            ? props.errorText2
            : props.errorText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 15,
    fontFamily: "appfont-m",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    padding: 4,
    marginHorizontal: 15,
    marginTop: 2,
    fontSize: 15,
    fontFamily: "appfont-m",
  },
});

export default InputOutlined;
