import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from 'src/app/types/app';

const appStateFeature = createFeatureSelector<AppState>('app')

export const selectSubTotal = createSelector(
  appStateFeature,
  (state: AppState) => state.subTotal
)

export const selectSubTotalWithTax = createSelector(
  appStateFeature,
  (state: AppState) => state.subTotalWithTax
);

export const selectAddedProducts = createSelector(
  appStateFeature,
  (state: AppState) => state.addedProducts
)

export const selectDefaultTax = createSelector(
  appStateFeature,
  (state: AppState) => state.defaultTax
)