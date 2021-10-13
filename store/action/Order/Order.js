export const SET_ADDRESSES = "SET_ADDRESSES";
export const ADD_ADDRESS = "ADD_ADDRESS";
export const SET_ORDERS = "SET_ORDERS";
export const SET_ORDER_DETAILS = "SET_ORDER_DETAILS";
export const RESET_ORDERS_DETAILS = "RESET_ORDERS_DETAILS";

import { API_URL } from "../../../constants/Strings";

//Orders API

export const fetchUserOrdersAction = () => {
  return async (dispatch, getState) => {
    let token = getState().user.token;

    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Order`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const resData = await responseData.json();

      if (!responseData.ok) {
        dispatch({
          type: SET_ORDERS,
          orders: null,
        });
        throw new Error(resData.error);
      }
      dispatch({
        type: SET_ORDERS,
        orders: resData,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchOrderDetailsAction = (id) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;

    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Order/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const resData = await responseData.json();
      console.log(resData);
      if (!responseData.ok) {
        dispatch({
          type: SET_ORDER_DETAILS,
          orderDetails: null,
        });
        throw new Error(resData.error);
      }
      dispatch({
        type: SET_ORDER_DETAILS,
        orderDetails: resData,
      });
    } catch (err) {
      throw err;
    }
  };
};

// Address API
export const fetchUserAddressesAction = (id) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;

    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Address`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const resData = await responseData.json();
      console.log(resData);
      if (!responseData.ok) {
        dispatch({
          type: SET_ADDRESSES,
          addresses: null,
        });
        throw new Error(resData.error);
      }
      dispatch({
        type: SET_ADDRESSES,
        addresses: resData,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const addDeliveryAddressAction = (
  mobileNumber,
  pincode,
  address,
  landmark,
  city,
  state,
  country,
  locality
) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Address`, {
        method: "POST",
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          pincode: pincode,
          address: address,
          landmark: landmark,
          city: city,
          state: state,
          countryName: country,
          locality: locality,
          countryCode: "+91",
          countryId: 100,
          name: "Shashank",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const resData = await responseData.json();
      if (!responseData.ok) {
        throw new Error(resData.error);
      } else {
        /* dispatch({
          type: ADD_ADDRESS,
          addressData: {
            mobileNumber: resData.mobileNumber,
            pincode: resData.pincode,
            address: resData.address,
            landmark: resData.landmark,
            city: resData.city,
            state: resData.state,
            country: resData.country,
            locality: resData.locality,
          },
        });*/
      }
    } catch (err) {
      throw err;
    }
  };
};

export const editDeliveryAddressAction = (
  mobileNumber,
  pincode,
  address,
  landmark,
  city,
  state,
  country,
  locality,
  id
) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Address/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            mobileNumber: mobileNumber,
            pincode: pincode,
            address: address,
            landmark: landmark,
            city: city,
            state: state,
            countryName: country,
            locality: locality,
            countryCode: "+91",
            countryId: "1",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const resData = await responseData.json();
      if (!responseData.ok) {
        throw new Error(resData.error);
      } else {
      }
    } catch (err) {
      throw err;
    }
  };
};

export const deleteDeliveryAddresstAction = (id) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Address/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
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

export const placeOrderAction = (addressId, comment, priceDetails) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Order/Place`, {
        method: "POST",
        body: JSON.stringify({
          addressId: addressId,
          comment: comment.length == 0 ? null : comment,
          priceDetails: priceDetails,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const resData = await responseData.json();

      if (!responseData.ok) {
        throw new Error(resData.error);
      } else {
        return resData;
      }
    } catch (err) {
      throw err;
    }
  };
};

export const updateOrderStatusAction = (orderId, status) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Order/status/update`,
        {
          method: "POST",
          body: JSON.stringify({
            orderId: orderId,
            isPaymentSucceeded: status,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const resData = await responseData.json();

      if (!responseData.ok) {
        throw new Error(resData.error);
      } else {
        return resData;
      }
    } catch (err) {
      throw err;
    }
  };
};

export const resetOrderDetails = () => {
  return { type: RESET_ORDERS_DETAILS };
};
