export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_SEARCH_PRODUCTS = "SET_SEARCH_PRODUCTS";
export const SET_PRODUCTS_DETAILS = "SET_PRODUCTS_DETAILS";
export const SET_WISHLIST_PRODUCTS = "SET_WISHLIST_PRODUCTS";
export const SET_PRODUCTS_RECOMMENDED = "SET_PRODUCTS_RECOMMENDED";
export const RESET_PRODUCTS = "RESET_PRODUCTS";

import { API_URL } from "../../../constants/Strings";

export const fetchProductsAction = (categoryIds, tagIds, skip, searchText) => {
  console.log("Skip count..." + searchText);
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(`${API_URL.api_base_url}/product`, {
        method: "POST",
        body: JSON.stringify({
          skip: skip,
          take: 10,
          search: searchText ? searchText : "",
          minimumPrice: 0,
          maximumPrice: 0,
          sortByPriceHighToLow: false,
          sortByPriceLowToHigh: false,
          sortByDateNewestToOldest: true,
          sortByDateOldestToNewest: false,
          showOnlyExclusive: false,
          categoryIds: categoryIds > 0 ? [categoryIds] : [],
          seriesIds: [],
          subcategoryIds: [],
          tagIds: tagIds > 0 ? [tagIds] : [],
          materialTypeIds: [],
          colorIds: [],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const resData = await responseData.json();
      console.log("product response" + resData.length);

      if (!responseData.ok) {
        if (searchText) {
          dispatch({ type: SET_SEARCH_PRODUCTS, products: [] });
        } else {
          dispatch({ type: SET_PRODUCTS, products: [] });
        }

        throw new Error(resData.error);
      } else {
        if (searchText) {
          dispatch({ type: SET_SEARCH_PRODUCTS, products: resData });
        } else {
          dispatch({ type: SET_PRODUCTS, products: resData });
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const fetchProductDetailsAction = (id) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/product/${id}`,
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
      dispatch({ type: SET_PRODUCTS_DETAILS, details: resData });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchRecommendedProductsAction = (id, take) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Product/${id}/recommended?take=${take}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resData = await responseData.json();
      dispatch({ type: SET_PRODUCTS_RECOMMENDED, recommended: resData });
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
    } catch (err) {
      throw err;
    }
  };
};

export const fetchWishlistProductsAction = () => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(`${API_URL.api_base_url}/Wishlist`, {
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
      dispatch({ type: SET_WISHLIST_PRODUCTS, products: resData });
    } catch (err) {
      throw err;
    }
  };
};

export const addProductToWishlistAction = (productId) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Wishlist/${productId}`,
        {
          method: "POST",
          body: JSON.stringify({
            ProductId: productId,
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

export const deleteProductFromWishlistAction = (productId) => {
  return async (dispatch, getState) => {
    let token = getState().user.token;
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Wishlist/${productId}`,
        {
          method: "DELETE",
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

export const resetProductList = () => {
  return { type: RESET_PRODUCTS };
};
