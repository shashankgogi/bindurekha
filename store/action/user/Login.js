export const AUTHENTICATE = "AUTHENTICATE";
export const SIGN_UP = "SIGN_UP";
export const NO_INTERNET = "NO_INTERNET";
export const SET_USER_DETAILS = "SET_USER_DETAILS";
export const LOGOUT = "LOGOUT";

import { AsyncStorage } from "react-native";
import { API_URL } from "../../../constants/Strings";
import { Platform } from "react-native";

export const signInUserAction = (mobileNo, password) => {
  return async (dispatch) => {
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/Login`,
        {
          method: "POST",
          body: JSON.stringify({
            phoneNumber: mobileNo,
            password: password,
            countryCode: "+91",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await responseData.json();
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
      dispatch(authenticateUser(resData.token, resData.refreshToken));
      saveUserData(resData);
    } catch (err) {
      throw err;
    }
  };
};

export const signUpUserAction = (
  name,
  emaiId,
  mobileNo,
  password,
  city,
  imageUrl
) => {
  return async (dispatch) => {
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/register`,
        {
          method: "POST",
          body: JSON.stringify({
            phoneNumber: mobileNo,
            password: password,
            name: name,
            email: emaiId,
            city: city,
            countryCode: "+91",
            imageUrl: imageUrl,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await responseData.json();
      if (!responseData.ok) {
        throw new Error(resData.error);
      } else {
        dispatch({
          type: SIGN_UP,
          userData: {
            name: resData.name,
            emailId: resData.emailId,
            mobileNo: resData.mobileNo,
            password: resData.password,
            city: resData.city,
            imageUrl: resData.imageUrl,
          },
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const fetchUserDetailsAction = () => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/Profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resData = await responseData.json();
      console.log(resData);
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
      dispatch({
        type: SET_USER_DETAILS,
        userData: {
          name: resData.name,
          emailId: resData.email,
          mobileNo: resData.phoneNumber,
          city: resData.city,
          imageUrl: resData.imageUrl,
        },
      });
    } catch (err) {
      throw err;
    }
  };
};

export const verifyOtpAction = (mobileNo, entredOtp) => {
  return async (dispatch) => {
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/otp/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            phoneNumber: mobileNo,
            otp: entredOtp,
            countryCode: "+91",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await responseData.json();
      console.log(resData);
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
      dispatch(authenticateUser(resData.token, resData.refreshToken));
      saveUserData(resData);
    } catch (err) {
      throw err;
    }
  };
};

export const forgotPasswordAction = (mobileNo) => {
  return async (dispatch) => {
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/otp/send`,
        {
          method: "POST",
          body: JSON.stringify({
            phoneNumber: mobileNo,
            countryCode: "+91",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await responseData.json();
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
    } catch (err) {
      throw err;
    }
  };
};

export const resetPasswordAction = (mobileNo, newPassword) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/Password/Reset`,
        {
          method: "PUT",
          body: JSON.stringify({
            phoneNumber: mobileNo,
            password: newPassword,
            countryCode: "+91",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const resData = await responseData.json();
      console.log(resData);
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
    } catch (err) {
      throw err;
    }
  };
};

export const authenticateUser = (token, refreshToken) => {
  return {
    type: AUTHENTICATE,
    token: token,
    refreshToken: refreshToken,
  };
};

const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(
      "UserData",
      JSON.stringify({
        token: userData.token,
        refreshToken: userData.refreshToken,
      })
    );
  } catch (err) {
    throw err;
  }
};

export const saveProfileImageAction = (imageUrl) => {
  return async (dispatch) => {
    // let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Account/image`,
        {
          method: "POST",
          body: createFormData(imageUrl),
          headers: {
            "Content-Type": "multipart/form-data;",
          },
        }
      );

      const resData = await responseData.json();
      console.log(resData);
      if (!responseData.ok) {
        throw new Error(resData.error);
      } else {
        return resData.imageUrl;
      }
    } catch (err) {
      throw err;
    }
  };
};

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("file", {
    name: "profile.png",
    // type: "image/jpg",
    uri: Platform.OS === "android" ? photo : photo.replace("file://", ""),
  });

  // Object.keys(body).forEach((key) => {
  //   data.append(key, body[key]);
  // });

  console.log(data);
  return data;
};

export const noInternerAction = (status) => {
  return { type: NO_INTERNET, status: status };
};

export const logoutFromApp = () => {
  AsyncStorage.removeItem("UserData");
  return { type: LOGOUT };
};
