import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import CustomButton from "../UI/CustomButton";
import Colors from "../../constants/Colors";

const EmptyView = (props) => {
  return (
    <View style={styles.screen}>
      <Image style={styles.image} source={props.image} resizeMode="contain" />
      <Text
        style={styles.title}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.title}
      </Text>
      <Text
        style={styles.subTitle}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.subTitle}
      </Text>
      {props.buttonTitle && (
        <CustomButton
          style={styles.button}
          title={props.buttonTitle}
          titleStyle={styles.titleStyle}
          onPress={props.onPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: "60%",
    height: "40%",
    // alignSelf: "center",
    marginTop: 70,
  },
  title: {
    fontFamily: "appfont-sb",
    fontSize: 20,
    color: Colors.textColor,
    marginTop: 20,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "appfont-m",
    fontSize: 17,
    color: Colors.tertiary_Color,
    marginTop: 15,
    textAlign: "center",
  },
  button: {
    width: "50%",
    marginTop: 50,
    alignSelf: "center",
    marginTop: 40,
  },
  titleStyle: {
    fontSize: 20,
  },
});

export default EmptyView;
