export const SET_BANNERS = "SET_BANNERS";
export const SET_CATEGORIES = "SET_CATEGORIES";
import { API_URL } from "../../../constants/Strings";

export const setCategoryAction = () => {
  return { type: SET_CATEGORIES };
};

export const fetchBannerAction = (take) => {
  return async (dispatch) => {
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Advertisement?take=${take}`
      );

      const resData = await responseData.json();
      console.log("baner resonse....");
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
      dispatch({ type: SET_BANNERS, banners: resData });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchCategoriesAction = (take) => {
  return async (dispatch) => {
    try {
      const responseData = await fetch(
        `${API_URL.api_base_url}/Category?take=${take}`
      );
      const resData = await responseData.json();
      console.log("category resonse....");
      if (!responseData.ok) {
        throw new Error(resData.error);
      }
      dispatch({ type: SET_CATEGORIES, categories: resData });
    } catch (err) {
      throw err;
    }
  };
};
