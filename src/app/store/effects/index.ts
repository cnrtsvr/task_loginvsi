import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import * as actions from 'src/app/store/actions'

@Injectable()
export class AppEffects {
  calculateSubTotal$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          actions.addProduct,
          actions.updateProduct,
          actions.removeProduct,
          actions.setDefaultTax,
          actions.setTestData,
          actions.clearTestData
        ),
        map(actions.calculateSubTotal)
      )
    }
  )

  calculateSubTotalWithTax$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          actions.addProduct,
          actions.updateProduct,
          actions.removeProduct,
          actions.setDefaultTax,
          actions.setTestData,
          actions.clearTestData
        ),
        map(actions.calculateSubTotalWithTax)
      )
    }
  )

  constructor(private actions$: Actions) {}
}
