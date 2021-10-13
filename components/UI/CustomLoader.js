import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const Loader = (props) => {
  return (
    <View style={styles.activityView}>
      <ActivityIndicator size="large" color={Colors.primary_color} />
    </View>
  );
};

const styles = StyleSheet.create({
  activityView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Loader;
