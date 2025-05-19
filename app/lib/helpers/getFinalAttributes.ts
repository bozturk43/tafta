type AttributeOption = {
  value: string;
  extraPrice: number;
};

type Attribute = {
  id: string;
  name: string;
  options: AttributeOption[];
  updatedAt?: any;
};

type ProductAttributeRef = {
  attributeId: string;
};

export function getFinalAttributes(
  productAttributes: ProductAttributeRef[],
  allAttributes: Attribute[]
): Attribute[] {

    console.log(productAttributes);
    console.log(allAttributes);
  const attributeMap = new Map(allAttributes.map(attr => [attr.id, attr]));

  return productAttributes
    .map(({ attributeId }) => attributeMap.get(attributeId))
    .filter((attr): attr is Attribute => attr !== undefined);
}
