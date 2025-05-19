export interface Attribute {
    id: string,
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
    images?: string[]
}
export interface Producer {
    id: string;
    name: string;
    title: string;
    description: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    type?: string;
    generalImages: string[]; //sadece workshops sayfasında kullanılması için
}
export interface ProductAttribute {
    attributeId: string;
};
export interface CardItem {
    productId: string;
    name: string;
    image: string;
    basePrice: number;
    selectedAttributes: any[];
    totalPrice:number;
};