import { createReducer, on } from '@ngrx/store';
import * as Actions from '../actions';
import { AppState } from 'src/app/types/app';
import { Product } from 'src/app/types/product';

export const mockProduct: Product = {
  id: 1,
  name: "Test Product",
  basePrice: 100,
  code: 3455,
  customTax: null,
  totalPrice: 121
}

export const initialState: AppState = {
  defaultTax: 21,
  addedProducts: Array.from({length: 20}).map((_, index) => {
    return {
      ...mockProduct,
      id: index + 1,
      code: index + 1
    };
  }),
  subTotal: 2000,
  subTotalWithTax: 2420,
  idCounter: 21
}

export const reducer = createReducer(
  initialState,
  on(
    Actions.addProduct,
    (state, { product }) => {
      const nextId = state.idCounter;
      const newProductWithId = {
        ...product,
        id: nextId
      };
      return {
        ...state,
        addedProducts: [
          ...state.addedProducts,
          newProductWithId
        ],
        idCounter: state.idCounter + 1
      };
    }
  ),
  on(
    Actions.calculateSubTotal,
    (state) => {
      const subTotal = state.addedProducts.reduce((acc, curr) => (acc + curr.basePrice), 0);
      return {
        ...state,
        subTotal
      };
    }
  ),
  on(
    Actions.calculateSubTotalWithTax,
    (state) => {
      const subTotalWithTax = state.addedProducts.reduce((acc, curr) => {
        const taxPercentage = curr.customTax ? curr.customTax : state.defaultTax;
        const taxedPrice = curr.basePrice * ((100 + taxPercentage) / 100)
        acc += taxedPrice;
        return acc;
      }, 0);
      return {
        ...state,
        subTotalWithTax
      };
    }
  ),
  on(
    Actions.removeProduct,
    (state, { id }) => {
      const filteredProductList = state.addedProducts.filter(p => p.id !== id);
      return {
        ...state,
        addedProducts: filteredProductList
      };
    }
  ),
  on(
    Actions.updateProduct,
    (state, { product }) => {
      const productList = [...state.addedProducts];
      const productIdx = productList.findIndex(p => p.id === product.id);
      const newProduct = {
        ...productList[productIdx],
        ...product
      };
      productList.splice(productIdx, 1, newProduct);
      return {
        ...state,
        addedProducts: productList
      };
    }
  ),
  on(
    Actions.setDefaultTax,
    (state, { defaultTax }) => {
      return {
        ...state,
        defaultTax
      };
    }
  )
)
