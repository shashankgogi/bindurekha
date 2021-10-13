import { SET_CATEGORIES, SET_BANNERS } from "../../action/categories/Category";
import Advertisement from "../../../models/Advertisement";
import Category from "../../../models/Category";

const initialState = {
  categories: null,
  banners: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES: {
      return {
        ...state,
        categories: action.categories.map(
          (category) =>
            new Category(category.id, category.name, category.imageUrl)
        ),
      };
    }
    case SET_BANNERS: {
      return {
        ...state,
        banners: action.banners.map(
          (banner) =>
            new Advertisement(
              banner.id,
              banner.title,
              banner.imageUrl,
              banner.tagIds
            )
        ),
      };
    }

    default:
      return state;
  }
};
