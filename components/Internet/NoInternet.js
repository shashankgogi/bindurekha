import React from "react";
import EmptyView from "../UI/EmptyScreen";

const NoInternet = (props) => {
  return (
    <EmptyView
      title="Oops No internet connection"
      subTitle="Please check your connection and try again"
      buttonTitle="Try again"
      image={require("../../assets/nointernet.png")}
      onPress={props.onPress}
    />
  );
};

export default NoInternet;
