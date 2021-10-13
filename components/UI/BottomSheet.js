import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const BottomSheet = forwardRef((props, ref) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const screenHeight = Dimensions.get("window").height;

  const backdrop = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 0.01],
          outputRange: [screenHeight, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0.01, 0.5],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  const slideUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -1 * screenHeight],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  useImperativeHandle(ref, () => ({
    handleOpenOrClose(status) {
      console.log("status...." + status);
      if (status) {
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  }));

  return (
    <Animated.View style={(styles.cover, backdrop)}>
      <View style={[styles.sheet]}>
        <Animated.View style={[styles.popup, slideUp]}>
          {props.children}
        </Animated.View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
    position: "absolute",
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height + 15,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    marginHorizontal: 5,
    borderRadius: 5,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: "white",
    elevation: 5,
  },
});

export default BottomSheet;
