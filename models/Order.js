class Order {
  constructor(
    id,
    orderNumber,
    orderedDate,
    deliveryDay,
    deliveredDate,
    refundedDate,
    orderStatus,
    createdDate,
    address
  ) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.orderedDate = orderedDate;
    this.deliveryDay = deliveryDay;
    this.deliveredDate = deliveredDate;
    this.refundedDate = refundedDate;
    this.orderStatus = orderStatus;
    this.createdDate = createdDate;
    this.address = address;
  }
}
export default Order;
