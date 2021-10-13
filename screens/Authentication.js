import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, AsyncStorage, Alert } from "react-native";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import * as loginActions from "../store/action/user/Login";
import NetInfo from "@react-native-community/netinfo";
import Loader from "../components/UI/CustomLoader";
import * as Font from "expo-font";

const Authentication = (props) => {
  let dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleUserAuth = useCallback(async () => {
    try {
      const res = await Font.loadAsync({
        "appfont-m": require("../assets/fonts/Avenir-Book.otf"),
        "appfont-l": require("../assets/fonts/Avenir-Light.ttf"),
        "appfont-r": require("../assets/fonts/Avenir-Roman.otf"),
        "appfont-sb": require("../assets/fonts/Avenir-Roman.otf"),
      });
      const userData = await AsyncStorage.getItem("UserData");
      let data = JSON.parse(userData);

      console.log("in auth....");
      if (data && data.token && data.refreshToken) {
        console.log("in auth....Done");
        await dispatch(
          loginActions.authenticateUser(data.token, data.refreshToken)
        );
        fetchUserDetails();
      } else {
        props.navigation.navigate("Login");
      }
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    handleUserAuth();
  }, [handleUserAuth]);

  const fetchUserDetails = useCallback(async () => {
    try {
      await dispatch(loginActions.fetchUserDetailsAction());
      props.navigation.navigate("Home");
    } catch (err) {
      setError(err);
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable === false) {
        console.log("APP Disonnected..");
        dispatch(loginActions.noInternerAction(false));
      } else {
        console.log("APP Connected..");
        dispatch(loginActions.noInternerAction(true));
      }
    });
    return () => unsubscribe();
  }, []);

  return <Loader />;
};

const styles = StyleSheet.create({
  activityView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const screenOptions = (navData) => {
  return {
    header: () => null,
  };
};

export default Authentication;
