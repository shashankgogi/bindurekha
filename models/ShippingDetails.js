class ShippingDetails {
  constructor(
    shippingDate,
    courierAgencyName,
    websiteLink,
    orderTrackingNumber
  ) {
    this.shippingDate = shippingDate;
    this.courierAgencyName = courierAgencyName;
    this.websiteLink = websiteLink;
    this.orderTrackingNumber = orderTrackingNumber;
  }
}

export default ShippingDetails;
