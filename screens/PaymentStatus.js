import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import HeaderTitle from "../components/UI/HeaderTitle";
import TouchableButton from "../components/UI/TouchableButton";

const SummaryView = (props) => {
  return (
    <View style={styles.summaryView}>
      <Text
        style={{ ...styles.summaryText, ...props.style }}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.title}
      </Text>
      <Text
        style={{ ...styles.summaryText, color: Colors.tertiary_Color }}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.value}
      </Text>
    </View>
  );
};

const PaymentStatus = (props) => {
  const { orderId, deliveryDay, status, orderNumber } = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>Order Status</HeaderTitle>;
      },
      headerLeft: () => (
        <TouchableButton
          imageStyle={{ height: 25, width: 25, margin: 8 }}
          imgUrl={require("../assets/back.png")}
          onButtonClick={() => {
            props.navigation.goBack();
            props.navigation.goBack();
            props.navigation.navigate("Home");
          }}
        />
      ),
    });
  }, [props.navigation]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.main}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={
            status
              ? require("../assets/success.png")
              : require("../assets/fail.png")
          }
        />
        <Text style={styles.title}>
          {status ? "Thank You !" : "Transaction Failed"}
        </Text>
        <Text style={styles.subTitle}>
          {status
            ? "Your order is confirmed"
            : "Oops! Looks like your transaction is failed, please visit order section to complete your payment, Thank you !"}
        </Text>
        <View style={styles.orderDetails}>
          <SummaryView title="Your Order Number" value={orderNumber} />

          {status && <View style={styles.devideLine} />}
          {status && <SummaryView title="Delivery Day" value={deliveryDay} />}
          {status && <View style={styles.devideLine} />}

          <SummaryView title="Payment Method" value="Online payment" />
        </View>
        {status && (
          <Text style={styles.bottomText}>
            To check early delivery timing, kindly contact to Bindurekha support
            team.
          </Text>
        )}
      </ScrollView>
      <CustomButton
        style={styles.button}
        title="Shop More"
        titleStyle={styles.titleStyle}
        onPress={() => {
          props.navigation.goBack();
          props.navigation.goBack();
          props.navigation.navigate("Home");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },

  main: {
    // justifyContent: "center",
    // alignItems: "center",
    margin: 8,
  },

  image: {
    marginTop: 50,
    height: 120,
    width: 150,
    alignSelf: "center",
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    fontFamily: "appfont-sb",
    fontWeight: "bold",
    textAlign: "center",
  },

  orderDetails: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 10,
  },
  subTitle: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "appfont-sb",
    color: Colors.tertiary_Color,
    marginBottom: 30,
  },
  summaryText: {
    margin: 10,
    fontSize: 17,
    fontFamily: "appfont-r",
  },

  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  devideLine: {
    backgroundColor: Colors.tertiary_Color,
    height: 0.5,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  button: {
    width: "95%",
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 36,
  },
  titleStyle: {
    fontSize: 20,
  },

  bottomText: {
    marginTop: 50,
    fontSize: 18,
    fontFamily: "appfont-r",
    textAlign: "center",
    color: Colors.tertiary_Color,
    marginHorizontal: 10,
  },
});

export default PaymentStatus;
