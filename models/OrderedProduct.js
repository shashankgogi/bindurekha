class OrderedProduct {
  constructor(
    id,
    productId,
    quantity,
    productImageURL,
    productName,
    colorCode,
    size,
    shortDescription,
    originalPrice,
    discountedPrice,
    categoryId,
    returnRequestStatus,
    isReviewAdded
  ) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.productImageURL = productImageURL;
    this.productName = productName;
    this.colorCode = colorCode;
    this.size = size;
    this.shortDescription = shortDescription;
    this.originalPrice = originalPrice;
    this.discountedPrice = discountedPrice;
    this.categoryId = categoryId;
    this.returnRequestStatus = returnRequestStatus;
    this.isReviewAdded = isReviewAdded;
  }
}

export default OrderedProduct;
