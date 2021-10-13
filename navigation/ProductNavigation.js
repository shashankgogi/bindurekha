import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image, Alert } from "react-native";
import { logoutFromApp } from "../store/action/user/Login";
import EditProfile from "../screens/EditProfile";
import { useSelector, useDispatch } from "react-redux";
import { VALIDATION } from "../constants/Strings";
import DashBoard, {
  screenOptions as DashboardScreenOptions,
} from "../screens/Dashboard";
import ProductList from "../screens/ProductsList";
import ProductDetails from "../screens/ProductsDetails";
import Login, { screenOptions as LoginOptions } from "../screens/Login";
import SignUp, { screenOptions as SignUpOprions } from "../screens/SignUp";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import AddAddress from "../screens/AddAddress";
import Cart from "../screens/CartItemList";
import Orders from "../screens/Orders";
import OrderDetails from "../screens/OrderDetails";
import SearchProduct from "../screens/SearchProducts";
import HtmlContent from "../screens/HtmlContent";
import ContactUs from "../screens/ContactUs";
import PaymentStatus from "../screens/PaymentStatus";

import VerifyOTP, {
  screenOptions as VerifyOptions,
} from "../screens/VerifyMobileNumber";

import Authentication, {
  screenOptions as AuthOptions,
} from "../screens/Authentication";
import ReviewOrder from "../screens/ReviewOrder";
import OrderSummary from "../screens/OrderSummary";
import Button from "../components/UI/Stepper/Button";
import Colors from "../constants/Colors";
import Color from "../models/Color";

const AppDrawerNavigation = createDrawerNavigator();
const ProductStackNavigaton = createStackNavigator();
const OrderStackNavigaton = createStackNavigator();
const LoginStackNavigaton = createStackNavigator();

const backImageHandler = (tintColor) => (
  <Image
    style={{ height: 25, width: 25, margin: 8 }}
    resizeMode="contain"
    source={require("../assets/back.png")}
  />
);

const drawerLableStyle = {
  fontSize: 18,
  fontFamily: "appfont-sb",
};

export const DashboardNavigation = () => {
  return (
    <ProductStackNavigaton.Navigator
      screenOptions={{
        headerBackImage: backImageHandler,
        headerBackTitleVisible: false,
      }}
    >
      <ProductStackNavigaton.Screen
        component={DashBoard}
        name="Home"
        options={DashboardScreenOptions}
      />

      <ProductStackNavigaton.Screen
        component={ProductNavigation}
        name="ProductStack"
        options={{ headerShown: false }}
      />
    </ProductStackNavigaton.Navigator>
  );
};

const ProductStack = createStackNavigator();

const ProductNavigation = () => {
  return (
    <ProductStack.Navigator
      screenOptions={{
        headerBackImage: backImageHandler,
        headerBackTitleVisible: false,
      }}
    >
      <ProductStackNavigaton.Screen component={ProductList} name="Products" />
      <ProductStackNavigaton.Screen component={ProductDetails} name="Details" />
      <ProductStackNavigaton.Screen component={Cart} name="Cart" />

      <ProductStackNavigaton.Screen
        component={ReviewOrder}
        name="Delivery Address"
      />
      <ProductStackNavigaton.Screen component={AddAddress} name="New Address" />

      <ProductStackNavigaton.Screen
        component={OrderSummary}
        name="Order Summary"
      />

      <ProductStackNavigaton.Screen
        component={SearchProduct}
        name="Search"
        options={LoginOptions}
      />
      <ProductStackNavigaton.Screen
        component={HtmlContent}
        name="Teams of use"
      />

      <ProductStackNavigaton.Screen
        component={PaymentStatus}
        name="Order Status"
      />
    </ProductStack.Navigator>
  );
  return;
};
const LoginNavigation = () => {
  return (
    <LoginStackNavigaton.Navigator>
      <LoginStackNavigaton.Screen
        component={Authentication}
        name="Auth"
        options={AuthOptions}
      />
      <LoginStackNavigaton.Screen
        component={Login}
        name="Login"
        options={LoginOptions}
      />
      <LoginStackNavigaton.Screen
        component={SignUp}
        name="SignUp"
        options={SignUpOprions}
      />
      <LoginStackNavigaton.Screen
        component={VerifyOTP}
        name="VerifyOTP"
        options={VerifyOptions}
      />

      <LoginStackNavigaton.Screen
        component={ForgotPassword}
        name="ForgotPassword"
        options={VerifyOptions}
      />

      <LoginStackNavigaton.Screen
        component={ResetPassword}
        name="ResetPassword"
        options={VerifyOptions}
      />
    </LoginStackNavigaton.Navigator>
  );
};

const OrderNavigaton = () => {
  return (
    <OrderStackNavigaton.Navigator
      initialRouteName="Orders"
      screenOptions={{
        headerBackImage: backImageHandler,
        headerBackTitleVisible: false,
      }}
    >
      <OrderStackNavigaton.Screen component={Orders} name="Orders" />
      <OrderStackNavigaton.Screen
        component={OrderDetails}
        name="Order Detail"
      />
      <OrderStackNavigaton.Screen
        component={ProductNavigation}
        name="ProductStack"
        options={{ headerShown: false }}
      />
    </OrderStackNavigaton.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  let dispatch = useDispatch();

  const navigation = props.navigation;
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={"Hello " + props.userName}
        icon={({ focused, color, size }) => (
          <Image
            style={{ marginRight: -20 }}
            source={require("../assets/profileavatar.png")}
          />
        )}
        labelStyle={{ ...drawerLableStyle, color: "white" }}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate("Profile");
        }}
        style={{ backgroundColor: "red" }}
      />
      {props.userName.length === 0 && (
        <DrawerItem
          label="Login/Signup"
          labelStyle={drawerLableStyle}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate("Login", { screen: "Login" });
          }}
        />
      )}
      <DrawerItemList {...props} />
      {props.userName.length != 0 && (
        <DrawerItem
          label="Logout"
          labelStyle={drawerLableStyle}
          onPress={() => {
            navigation.closeDrawer();
            Alert.alert("", VALIDATION.logout_confirmation, [
              { text: "Cancel" },
              {
                text: "Ok",
                onPress: () => {
                  dispatch(logoutFromApp());
                },
              },
            ]);
          }}
        />
      )}
    </DrawerContentScrollView>
  );
};

const HtmlStack = createStackNavigator();
const HtmlNavigaton = () => {
  return (
    <HtmlStack.Navigator>
      <HtmlStack.Screen component={HtmlContent} name="Html" />
    </HtmlStack.Navigator>
  );
};

const ContactUsStack = createStackNavigator();
const ContactUsNavigaton = () => {
  return (
    <ContactUsStack.Navigator>
      <ContactUsStack.Screen component={ContactUs} name="ContactUs" />
    </ContactUsStack.Navigator>
  );
};

export const DrawerNavigation = () => {
  const userDetails = useSelector((state) => state.user.user);

  return (
    <AppDrawerNavigation.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          userName={userDetails ? userDetails.name : ""}
        />
      )}
      initialRouteName="Home"
      drawerContentOptions={{
        activeTintColor: Colors.primary_color,
        labelStyle: drawerLableStyle,
      }}
    >
      <AppDrawerNavigation.Screen component={DashboardNavigation} name="Home" />

      {userDetails && (
        <AppDrawerNavigation.Screen
          component={OrderNavigaton}
          name="Orders"
          initialRouteName="Orders"
        />
      )}
      {userDetails && (
        <AppDrawerNavigation.Screen
          component={ProductNavigation}
          name="Wishlist"
          initialParams={{
            screen: "Products",
            params: {
              isFrom: "Wishlist",
              title: "Wish List",
            },
          }}
        />
      )}

      <AppDrawerNavigation.Screen
        component={HtmlNavigaton}
        name="Privacy Policy"
        initialParams={{
          screen: "Html",
          params: {
            htmlPath: require("../resources/privacypolicy.html"),
            title: "Privacy Policy",
          },
        }}
      />

      <AppDrawerNavigation.Screen
        component={HtmlNavigaton}
        name="FAQ's"
        initialParams={{
          screen: "Html",
          params: {
            htmlPath: require("../resources/faq.html"),
            title: "FAQ's",
          },
        }}
      />

      <AppDrawerNavigation.Screen
        component={HtmlNavigaton}
        name="About Us"
        initialParams={{
          screen: "Html",
          params: {
            htmlPath: require("../resources/aboutus.html"),
            title: "About Us",
          },
        }}
      />

      <AppDrawerNavigation.Screen
        component={ContactUsNavigaton}
        name="Contact Us"
        initialParams={{
          screen: "ContactUs",
          params: {
            title: "Contact Us",
          },
        }}
      />
    </AppDrawerNavigation.Navigator>
  );
};

const RootStackNavigator = createStackNavigator();

export const RootNavigation = () => {
  return (
    <RootStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <RootStackNavigator.Screen
        component={LoginNavigation}
        name="Login"
        options={LoginOptions}
      />
      <RootStackNavigator.Screen component={DrawerNavigation} name="Home" />
      <RootStackNavigator.Screen component={EditProfile} name="Profile" />
    </RootStackNavigator.Navigator>
  );
};
