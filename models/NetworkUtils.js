// import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
export default class NetworkUtils {
  static async isNetworkAvailable() {
    const response = await NetInfo.fetch();
    return response.isConnected;
  }
}

// useEffect(() => {
//   const unsubscribe = NetInfo.addEventListener((state) => {
//     if (state.isInternetReachable === false) {
//       console.log("Disonnected..");
//       setIsConnected(false);
//     } else {
//       console.log("Connected..");
//       setIsConnected(true);
//     }
//   });

//   return () => unsubscribe();
// }, []);
