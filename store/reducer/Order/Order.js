import {
  SET_ADDRESSES,
  ADD_ADDRESS,
  SET_ORDERS,
  SET_ORDER_DETAILS,
  RESET_ORDERS_DETAILS,
} from "../../action/Order/Order";
import Address from "../../../models/Address";
import Order from "../../../models/Order";
import OrderDetails from "../../../models/Order";
import ShippingDetails from "../../../models/ShippingDetails";
import OrderedProduct from "../../../models/OrderedProduct";

const initialState = {
  addresses: null,
  orders: null,
  orderDetails: null,
  emptyList: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESSES: {
      let addAddressObj = new Address(
        "0",
        "Empty",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      );
      let addressArr = [];

      if (action.addresses === null || action.addresses.length === 0) {
        addressArr.push(addAddressObj);
      } else {
        addressArr = action.addresses.map(
          (a1) =>
            new Address(
              a1.id,
              a1.name,
              a1.mobileNumber,
              a1.pincode,
              a1.address,
              a1.landmark,
              a1.city,
              a1.state,
              a1.countryName,
              a1.locality
            )
        );
        addressArr.push(addAddressObj);
      }

      return {
        addresses: addressArr,
      };
    }
    case SET_ORDERS: {
      if (
        (action.orders && action.orders.length === 0) ||
        action.orders == null
      ) {
        return {
          ...state,
          emptyList: true,
        };
      } else {
        return {
          ...state,
          orders: action.orders.map(
            (o1) =>
              new Order(
                o1.id,
                o1.orderNumber,
                o1.orderedDate,
                o1.deliveryDay,
                o1.deliveredDate,
                o1.refundedDate,
                o1.orderStatus,
                o1.createdDate,
                o1.city
              )
          ),
        };
      }
    }

    case SET_ORDER_DETAILS: {
      let order = action.orderDetails.order;
      let shippingDetails = action.orderDetails.shippingDetails;
      let product = action.orderDetails.product;

      return {
        ...state,
        orderDetails: {
          order: new OrderDetails(
            "0",
            order.orderNumber,
            order.orderedDate,
            order.deliveryDay,
            order.deliveredDate,
            order.refundedDate,
            order.deliveryStatus,
            order.orderTotal,
            order.address
          ),
          shippingDetails: shippingDetails
            ? new ShippingDetails(
                shippingDetails.shippingDate,
                shippingDetails.courierAgencyName,
                shippingDetails.websiteLink,
                shippingDetails.orderTrackingNumber
              )
            : null,
          products: product.map(
            (p1) =>
              new OrderedProduct(
                p1.id,
                p1.productId,
                p1.quantity,
                p1.productImageURL,
                p1.productName,
                p1.colorCode,
                p1.size,
                p1.shortDescription,
                p1.originalPrice,
                p1.discountedPrice,
                p1.categoryId,
                p1.returnRequestStatus,
                p1.isReviewAdded
              )
          ),
        },
      };
    }
    case RESET_ORDERS_DETAILS: {
      return {
        ...state,
        orderDetails: null,
      };
    }
    case ADD_ADDRESS: {
      //   return { addresses:state.addresses.concat(new Address()) };
    }
    default: {
      return state;
    }
  }
};
