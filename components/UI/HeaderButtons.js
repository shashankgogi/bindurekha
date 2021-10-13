import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";

const HeaderButtons = (props) => {
  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        style={styles.container}
        onPress={props.onHeaderButtonClick.bind(this, 0)}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={props.firstImage}
          />
          {props.firstImageBadge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeCount}>{props.firstImageBadge}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={props.onHeaderButtonClick.bind(this, 1)}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={props.secondImage}
          />
          {props.secondImageBadge > 0 && (
            <View style={styles.badge}>
              <Text
                style={styles.badgeCount}
                adjustsFontSizeToFit={true}
                maxFontSizeMultiplier={1}
              >
                {props.secondImageBadge}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  container: {
    margin: 5,
  },

  image: {
    height: 30,
    width: 30,
    margin: 5,
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    height: 20,
    width: 20,
    marginLeft: -15,
    justifyContent: "center",
  },
  badgeCount: {
    textAlign: "center",
    fontSize: 11,
    color: "white",
  },
});
export default HeaderButtons;
