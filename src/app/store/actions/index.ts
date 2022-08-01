import { createAction, props } from '@ngrx/store';
import { Product } from '../../types/product';

enum Actions {
    SET_DEFAULT_TAX = "[APP] Set Default Tax",
    CALCULATE_SUB_TOTAL = "[APP] Calculate Subtotal",
    CALCULATE_SUB_TOTAL_WITH_TAX = "[APP] Calculate Subtotal With Tax",
    ADD_PRODUCT = "[APP] Add Product",
    REMOVE_PRODUCT = "[APP] Remove Product",
    UPDATE_PRODUCT = "[APP] Update Product",
    SET_TEST_DATA = "[TEST] Set Test Data",
    CLEAR_TEST_DATA = "[TEST] Clear Test Data"
}

export const setDefaultTax = createAction(
    Actions.SET_DEFAULT_TAX,
    props<{ defaultTax: number }>()
)

export const calculateSubTotal = createAction(
    Actions.CALCULATE_SUB_TOTAL
)

export const calculateSubTotalWithTax = createAction(
    Actions.CALCULATE_SUB_TOTAL_WITH_TAX
)

export const addProduct = createAction(
    Actions.ADD_PRODUCT,
    props<{ product: Product }>()
)

export const removeProduct = createAction(
    Actions.REMOVE_PRODUCT,
    props<{ id: number }>()
)

export const updateProduct = createAction(
    Actions.UPDATE_PRODUCT,
    props<{ product: Product }>()
)

export const setTestData = createAction(
    Actions.SET_TEST_DATA
)

export const clearTestData = createAction(
    Actions.CLEAR_TEST_DATA
)