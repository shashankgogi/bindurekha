class Product {
  constructor(
    id,
    categoryName,
    name,
    originalPrice,
    discountedPrice,
    imageUrl,
    isAvailable,
    isExclusive,
    isInWishlist,
    filterId,
    quantity,
    unit,
    seriesId,
    averageRating
  ) {
    this.id = id;
    this.categoryName = categoryName;
    this.name = name;
    this.originalPrice = originalPrice;
    this.discountedPrice = discountedPrice;
    this.imageUrl = imageUrl;
    this.isAvailable = isAvailable;
    this.isExclusive = isExclusive;
    this.isInWishlist = isInWishlist;
    this.filterId = filterId;
    this.quantity = quantity;
    this.unit = unit;
    this.seriesId = seriesId;
    this.averageRating = averageRating;
  }
}

export default Product;
