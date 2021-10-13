import React, { useEffect } from "react";
import WebView from "react-native-webview";
import TouchableButton from "../components/UI/TouchableButton";
import HeaderTitle from "../components/UI/HeaderTitle";
const HtmlContent = (props) => {
  const { htmlPath, title, isFrom } = props.route.params;

  useEffect(() => {
    if (isFrom === undefined) {
      props.navigation.setOptions({
        title: title,
        headerLeft: () => (
          <TouchableButton
            imgUrl={require("../assets/menu.png")}
            onButtonClick={() => {
              props.navigation.toggleDrawer();
            }}
          />
        ),
      });
    } else {
      props.navigation.setOptions({
        headerTitle: () => {
          return <HeaderTitle>Terms Of Use</HeaderTitle>;
        },
      });
    }
  });

  return (
    <WebView
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      source={htmlPath}
      style={{ marginTop: 10 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

export default HtmlContent;
