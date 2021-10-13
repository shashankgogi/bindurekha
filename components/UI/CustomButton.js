import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
const CustomButton = (props) => {
  return (
    <TouchableOpacity
      style={{ ...props.style, ...styles.button }}
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <Card style={{ ...styles.card, ...props.cardStyle }}>
        <Text
          style={{ ...styles.title, ...props.titleStyle }}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.title}
        </Text>
        {props.icon && <Image source={props.icon} />}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary_color,
    padding: 10,
  },
  title: {
    color: "white",
    alignSelf: "center",
    fontFamily: "appfont-sb",
  },
});
export default CustomButton;
