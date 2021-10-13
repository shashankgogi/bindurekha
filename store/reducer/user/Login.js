import {
  AUTHENTICATE,
  SIGN_UP,
  NO_INTERNET,
  SET_USER_DETAILS,
  LOGOUT,
} from "../../action/user/Login";
import User from "../../../models/User";

const initialState = {
  token: null,
  refreshToken: null,
  user: null,
  internetAvailable: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      return {
        ...state,
        token: action.token,
        refreshToken: action.refreshToken,
      };
    }
    case SIGN_UP: {
      return {
        ...state,
        user: new User(
          action.userData.name,
          action.userData.emailId,
          action.userData.city,
          action.userData.password,
          action.userData.mobileNo,
          action.userData.imageUrl
        ),
      };
    }

    case SET_USER_DETAILS: {
      return {
        ...state,
        user: new User(
          action.userData.name,
          action.userData.emailId,
          action.userData.city,
          "",
          action.userData.mobileNo,
          action.userData.imageUrl
        ),
      };
    }

    case NO_INTERNET: {
      return {
        ...state,
        internetAvailable: action.status,
      };
    }

    case LOGOUT: {
      console.log("in logout.....");
      return {
        ...state,
        token: null,
        refreshToken: null,
        user: null,
      };
    }
    default: {
      return state;
    }
  }
};
