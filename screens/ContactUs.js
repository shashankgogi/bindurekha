import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import UndelinedText from "../components/UI/UnderlinedText";
import Colors from "../constants/Colors";
import TouchableButton from "../components/UI/TouchableButton";
import { APP_TEXT } from "../constants/Strings";
import { VALIDATION } from "../constants/Strings";
import HeaderTitle from "../components/UI/HeaderTitle";

const deviderLine = (
  <View
    style={{
      backgroundColor: "gray",
      height: 1,
      width: "100%",
      marginTop: 10,
    }}
  />
);

const TitleText = (props) => (
  <Text
    style={styles.titleText}
    adjustsFontSizeToFit={true}
    maxFontSizeMultiplier={1}
  >
    {props.text}
  </Text>
);
const ContactUs = (props) => {
  const { title } = props.route.params;

  const contactToNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const mailToEmailID = (email) => {
    Linking.canOpenURL("mailto:")
      .then((supported) => {
        if (!supported) {
          Alert.alert("", VALIDATION.mail_composer, [{ text: "Okay" }]);
        } else {
          return Linking.openURL(`mailto:${email}`);
        }
      })
      .catch((err) => {
        console.error("An error occurred", err);
      });
  };
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <HeaderTitle>{title}</HeaderTitle>;
      },
      headerLeft: () => (
        <TouchableButton
          imgUrl={require("../assets/menu.png")}
          onButtonClick={() => {
            props.navigation.toggleDrawer();
          }}
        />
      ),
    });
  });

  return (
    <ScrollView style={styles.main}>
      <Image
        resizeMode="contain"
        style={styles.appLogo}
        source={require("../assets/app_logo.png")}
      />
      <TitleText text="Contact Number" />
      <UndelinedText
        text="+919822296370"
        onTextClick={() => {
          contactToNumber("+919822296370");
        }}
        color={Colors.contact}
        style={styles.contactNumber}
        textStyle={styles.contactNumber}
      />
      {deviderLine}
      <TitleText text="Email" />
      <UndelinedText
        text="help@bindurekha.com"
        onTextClick={() => {
          mailToEmailID("help@bindurekha.com");
        }}
        color={Colors.contact}
        style={styles.contactNumber}
        textStyle={styles.contactNumber}
      />
      {deviderLine}
      <TitleText text="Visit us at" />
      <Text
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
        style={styles.descText}
      >
        {APP_TEXT.contact_us}
      </Text>
      <Text
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
        style={{
          ...styles.descText,
          fontSize: 15,
          textAlign: "right",
          marginRight: 10,
          marginTop: 10,
        }}
      >
        {"Version " + APP_TEXT.version_no}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 10,
  },

  appLogo: {
    width: "80%",
    height: 120,
    marginHorizontal: 10,
    marginBottom: 40,
    marginTop: 30,
    alignSelf: "center",
  },

  titleText: {
    fontSize: 22,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 15,
    fontFamily: "appfont-m",
    color: Colors.textColor,
  },

  contactNumber: {
    borderBottomColor: Colors.contact,
    color: Colors.contact,
    textAlign: "left",
    alignSelf: "flex-start",
  },

  descText: {
    color: Colors.tertiary_Color,
    fontSize: 19,
    marginLeft: 10,
    fontFamily: "appfont-r",
  },
});
export default ContactUs;
