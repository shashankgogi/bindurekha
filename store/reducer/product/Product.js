import {
  SET_PRODUCTS,
  SET_PRODUCTS_DETAILS,
  SET_PRODUCTS_RECOMMENDED,
  RESET_PRODUCTS,
  SET_SEARCH_PRODUCTS,
  SET_WISHLIST_PRODUCTS,
} from "../../action/product/Product";

import Product from "../../../models/Product";
import ProductDetails from "../../../models/ProductDetails";
import Color from "../../../models/Color";
import Size from "../../../models/Size";

const initialState = {
  products: [],
  searchProducts: [],
  wishlistProducts: [],
  details: null,
  recommended: null,
  emptyList: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS: {
      if (action.products && action.products.length === 0) {
        return {
          ...state,
          emptyList: true,
        };
      } else {
        return {
          ...state,
          emptyList: false,
          products: state.products.concat(
            action.products.map(
              (p1) =>
                new Product(
                  p1.id,
                  p1.categoryName,
                  p1.name,
                  p1.originalPrice,
                  p1.discountedPrice,
                  p1.imageUrl,
                  p1.isAvailable,
                  p1.isExclusive,
                  p1.isInWishlist,
                  p1.filterId,
                  p1.quantity,
                  p1.unit,
                  p1.seriesId,
                  p1.averageRating
                )
            )
          ),
        };
      }
    }

    case SET_PRODUCTS_DETAILS: {
      let colorList;
      if (action.details.colorList && action.details.colorList != null) {
        colorList = action.details.colorList.map(
          (c1) => new Color(c1.id, c1.name, c1.hashCode)
        );
      } else {
        colorList = [];
      }
      let sizeList;
      if (action.details.sizeList && action.details.sizeList != null) {
        sizeList = action.details.sizeList.map(
          (s1) => new Size(s1.id, s1.fullName, s1.name)
        );
      } else {
        sizeList = [];
      }

      const detailsObj = new ProductDetails(
        new Product(
          action.details.id,
          action.details.categoryName,
          action.details.name,
          action.details.originalPrice,
          action.details.discountedPrice,
          action.details.imageUrl,
          action.details.isAvailable,
          action.details.isExclusive,
          action.details.isInWishlist,
          action.details.filterId,
          action.details.quantity,
          action.details.unit,
          action.details.seriesId,
          action.details.averageRating
        ),
        action.details.weight,
        action.details.height,
        action.details.width,
        action.details.description,
        action.details.length,
        action.details.brand,
        action.details.unitName,
        action.details.materialType,
        action.details.includedAccesories,
        action.details.precautions,
        action.details.imageUrls,
        colorList,
        sizeList,
        action.details.productWebLink
      );
      return {
        ...state,
        details: detailsObj,
      };
    }

    case SET_PRODUCTS_RECOMMENDED: {
      return {
        ...state,
        recommended: action.recommended.map(
          (p1) =>
            new Product(
              p1.id,
              p1.categoryName,
              p1.name,
              p1.originalPrice,
              p1.discountedPrice,
              p1.imageUrl,
              p1.isAvailable,
              p1.isExclusive,
              p1.isInWishlist,
              p1.filterId,
              p1.quantity,
              p1.unit,
              p1.seriesId,
              p1.averageRating
            )
        ),
      };
    }

    case SET_SEARCH_PRODUCTS: {
      if (action.products && action.products.length === 0) {
        return {
          ...state,
          emptyList: true,
        };
      } else {
        return {
          ...state,
          emptyList: false,
          searchProducts: action.products.map(
            (p1) =>
              new Product(
                p1.id,
                p1.categoryName,
                p1.name,
                p1.originalPrice,
                p1.discountedPrice,
                p1.imageUrl,
                p1.isAvailable,
                p1.isExclusive,
                p1.isInWishlist,
                p1.filterId,
                p1.quantity,
                p1.unit,
                p1.seriesId,
                p1.averageRating
              )
          ),
        };
      }
    }

    case SET_WISHLIST_PRODUCTS: {
      if (action.products && action.products.length === 0) {
        return {
          ...state,
          emptyList: true,
        };
      } else {
        return {
          ...state,
          emptyList: false,
          wishlistProducts: action.products.map(
            (p1) =>
              new Product(
                p1.productId,
                "",
                p1.name,
                p1.originalPrice,
                p1.discountedPrice,
                p1.imageUrl,
                p1.isAvailable,
                "",
                "",
                "",
                "",
                "",
                "",
                p1.averageRating
              )
          ),
        };
      }
    }

    case RESET_PRODUCTS: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
