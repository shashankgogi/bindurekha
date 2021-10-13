import { or } from "react-native-reanimated";

class Cart {
  constructor(
    productId,
    quantity,
    imageUrl,
    productName,
    size,
    color,
    shortDescription,
    originalPrice,
    discountedPrice,
    isAvailable,
    availableQuantity,
    id
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.imageUrl = imageUrl;
    this.productName = productName;
    this.size = size;
    this.color = color;
    this.shortDescription = shortDescription;
    this.originalPrice = originalPrice;
    this.discountedPrice = discountedPrice;
    this.isAvailable = isAvailable;
    this.availableQuantity = availableQuantity;
    this.id = id;
  }
}

export default Cart;
