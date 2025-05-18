export interface Attribute {
    id:string,
    name: string,
    options: AtrributeOption[],
    createdAt?: { seconds: number; nanoseconds: number } | Date;
    updatedAt?: { seconds: number; nanoseconds: number } | Date;
}
export interface AtrributeOption {
    extraPrice: number,
    value: string
}
export interface Product {
    id: string,
    name: string,
    producerId: string,
    description: string,
    createdAt: string,
    basePrice: number,
    attributes: ProductAttribute[]
}
export interface ProductAttribute {
  attributeId: string;
};