import { HashGenerator } from "react-native-payumoney";
import { Platform } from "react-native";

export const PAYUMONEY = {
  id: "5960507",
  key: "QylhKRVd",
  surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
  furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
  salt: "seVTUgzrgE",
};

export const getPayuMoneyHash = (orderNo, amount, userName, userEmail) => {
  // return (
  //   PAYUMONEY.key +
  //   "|" +
  //   orderNo +
  //   "|" +
  //   amount +
  //   "|" +
  //   Platform.OS +
  //   "|" +
  //   userName +
  //   "|" +
  //   userEmail +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   "" +
  //   "|" +
  //   PAYUMONEY.salt
  // );
  return HashGenerator({
    key: PAYUMONEY.key,
    amount: amount,
    email: userEmail,
    txnId: orderNo,
    productName: Platform.OS,
    firstName: userName,
    salt: PAYUMONEY.salt,
  });
};
