import { SET_CART_ITEMS, SET_TOTAL_AMOUNT } from "../../action/cart/Cart";

import Cart from "../../../models/Cart";
import TotalAmount from "../../../models/TotalAmount";
import Coupon from "../../../models/Coupon";
import Color from "../../../models/Color";
import Size from "../../../models/Size";

const initialState = {
  cartItems: null,
  totalAmount: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_ITEMS: {
      if (action.cartItems === null) {
        return initialState;
      }

      return {
        ...state,
        cartItems: action.cartItems.map(
          (c1) =>
            new Cart(
              c1.productId,
              c1.quantity,
              c1.imageUrl,
              c1.productName,
              c1.size,
              c1.color,
              c1.shortDescription,
              c1.originalPrice,
              c1.discountedPrice,
              c1.isAvailable,
              c1.availableQuantity,
              c1.id
            )
        ),
      };
    }

    case SET_TOTAL_AMOUNT: {
      const couponObj = null;
      if (action.totalAmt.coupon != null) {
        couponObj = new Coupon(
          action.totalAmt.coupon.id,
          action.totalAmt.coupon.errorMessage,
          action.totalAmt.coupon.code,
          action.totalAmt.coupon.discountPercentage,
          action.totalAmt.coupon.sumOfOriginalPrice
        );
      }

      return {
        ...state,
        totalAmount: new TotalAmount(
          action.totalAmt.sumOfOriginalPrice,
          action.totalAmt.sumOfDiscountPrice,
          action.totalAmt.shippingCharges,
          action.totalAmt.gstCharges,
          couponObj ? couponObj : ""
        ),
      };
    }
    default: {
      return state;
    }
  }
};
