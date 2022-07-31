import { Product } from "./product"

export interface AppState {
    defaultTax: number
    addedProducts: Product[]
    subTotal: number
    subTotalWithTax: number
    idCounter: number
}