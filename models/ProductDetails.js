class ProductDetails {
  constructor(
    product,
    weight,
    height,
    width,
    description,
    length,
    brand,
    unitName,
    materialType,
    includedAccesories,
    precautions,
    imageUrls,
    colorList,
    sizeList,
    productWebLink
  ) {
    this.product = product;
    this.weight = weight;
    this.height = height;
    this.width = width;
    this.description = description;
    this.length = length;
    this.brand = brand;
    this.unitName = unitName;
    this.materialType = materialType;
    this.includedAccesories = includedAccesories;
    this.precautions = precautions;
    this.imageUrls = imageUrls;
    this.colorList = colorList;
    this.sizeList = sizeList;
    this.productWebLink = productWebLink;
  }
}

export default ProductDetails;
