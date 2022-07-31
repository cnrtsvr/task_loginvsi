export interface Product {
    id?: number
    code: number
    name: string
    basePrice: number
    totalPrice?: number
    customTax: number | null
}