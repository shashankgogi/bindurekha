class TotalAmount {
  constructor(
    sumOfOriginalPrice,
    sumOfDiscountPrice,
    shippingCharges,
    gstCharges,
    coupon
  ) {
    this.sumOfOriginalPrice = sumOfOriginalPrice;
    this.sumOfDiscountPrice = sumOfDiscountPrice;
    this.shippingCharges = shippingCharges;
    this.gstCharges = gstCharges;
    this.coupon = coupon;
  }
}

export default TotalAmount;
