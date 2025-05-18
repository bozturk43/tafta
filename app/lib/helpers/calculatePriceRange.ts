import { Attribute, ProductAttribute } from "../types";

export function calculatePriceRange(
  allAttributes: Attribute[],
  productAttributes: ProductAttribute[],
  basePrice: number
): string {
  let totalExtra = 0;

  for (const { attributeId } of productAttributes) {
    const matchedAttribute = allAttributes.find(attr => attr.id === attributeId);
    if (matchedAttribute) {
      const maxExtra = Math.max(...matchedAttribute.options.map(opt => opt.extraPrice || 0));
      totalExtra += maxExtra;
    }
  }

  const totalPrice = basePrice + totalExtra;
  return `${basePrice} - ${totalPrice}`;
}
