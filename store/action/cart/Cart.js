export const SET_CART_ITEMS = "SET_CART_ITEMS";
export const SET_TOTAL_AMOUNT = "SET_TOTAL_AMOUNT";

import { API_URL } from "../../../constants/Strings";

export const fetchCartItemsAction = () => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const resData = await responseData.json();
      // console.log(resData);
      if (!responseData.ok) {
        dispatch({ type: SET_CART_ITEMS, cartItems: null });
        throw new Error(resData.error);
      }
      dispatch({ type: SET_CART_ITEMS, cartItems: resData });
    } catch (err) {
      throw err;
    }
  };
};

export const addItemToCartAction = (productId, colorId, sizeId) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Cart`, {
        method: "POST",
        body: JSON.stringify({
          productId,
          colorId,
          sizeId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

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

export const fetchTotalAmountAction = () => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Cart/calculate/price?countryId=100`,
        {
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
        type: SET_TOTAL_AMOUNT,
        totalAmt: resData,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const changeItemQuantityAction = (productId, quantity) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Cart/product/change/quantity`,
        {
          method: "POST",
          body: JSON.stringify({
            productId,
            quantity,
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
      }
    } catch (err) {
      throw err;
    }
  };
};

export const deleteItemFromCartAction = (productId) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Cart/${productId}`,
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
