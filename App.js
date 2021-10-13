import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigation } from "./navigation/ProductNavigation";
import { Provider, useDispatch } from "react-redux";

import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import CategoryReducer from "./store/reducer/categories/Category";
import ProductReducer from "./store/reducer/product/Product";
import LoginReducer from "./store/reducer/user/Login";
import CartReducer from "./store/reducer/cart/Cart";
import OrderReducer from "./store/reducer/Order/Order";
import * as SplashScreen from "expo-splash-screen";

import * as Font from "expo-font";
import { AppLoading } from "expo";
import Loader from "./components/UI/CustomLoader";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  console.log("In app....");
  const [isFontLoaded, setFontLoaded] = useState(true);

  const fetchFonts = async () => {
    await Font.loadAsync({
      "appfont-m": require("./assets/fonts/Avenir-Book.otf"),
      "appfont-l": require("./assets/fonts/Avenir-Light.ttf"),
      "appfont-r": require("./assets/fonts/Avenir-Roman.otf"),
      "appfont-sb": require("./assets/fonts/Avenir-Roman.otf"),
    });

    setFontLoaded(true);
    hideSplashScreen();
  };

  const hideSplashScreen = () => {
    // setFontLoaded(async () => {
    //   // const result = await SplashScreen.hideAsync();
    //   return true;
    // });
  };
  const showSplashScreen = useCallback(async () => {
    try {
      const res = await SplashScreen.preventAutoHideAsync();
      console.log("Server...." + res);
    } catch (e) {
      console.warn(e);
    }
    fetchFonts();
  });

  useEffect(() => {
    // showSplashScreen();
  }, [showSplashScreen]);

  // const [isConnected, setIsConnected] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     if (state.isInternetReachable === false) {
  //       console.log("APP Disonnected..");
  //       // setIsConnected(false);

  //       globalThis.isConnected = false;
  //     } else {
  //       console.log("APP Connected..");
  //       // setIsConnected(true);

  //       globalThis.isConnected = true;
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  const rootReducer = combineReducers({
    categories: CategoryReducer,
    products: ProductReducer,
    user: LoginReducer,
    cart: CartReducer,
    order: OrderReducer,
  });

  const reduxStore = createStore(rootReducer, applyMiddleware(ReduxThunk));

  if (!isFontLoaded) {
    return <Loader />;
    // return (
    //   <AppLoading
    //     startAsync={fetchFonts}
    //     onFinish={() => {
    //       console.log("font-loaded");
    //       setFontLoaded(true);
    //     }}
    //     onError={(err) => {
    //       console.log(err);
    //     }}
    //   />
    // );
  }

  return (
    <Provider store={reduxStore}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </Provider>
  );
}
