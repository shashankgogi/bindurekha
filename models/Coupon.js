class Coupon {
  constructor(id, errorMessage, code, discountPercentage, sumOfOriginalPrice) {
    this.id = id;
    this.code = code;
    this.discountPercentage = discountPercentage;
    this.sumOfOriginalPrice = sumOfOriginalPrice;
  }
}
export default Coupon;
