export interface Attribute {
    name:string,
    options:{extraPrice:number,value:string}[],
}
export interface Product{
    id:string,
    name:string,
    producerId:string,
    description:string,
    createdAt:string,
    basePrice:number,
    attributes:{attributeId:string}[]
}