import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { PathConstants } from "../../app-routing.module";
import * as selectors from "../../store/selectors"
import { AppState } from "../../types/app";
import { Product } from "../../types/product";

@Component({
  selector: "task-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.scss"]
})
export class BillingComponent implements OnDestroy {
  addedProducts$: Observable<Product[]>;
  subTotal$: Observable<number>;
  subTotalWithTax$: Observable<number>;
  defaultTax$: Observable<number>;

  addedProducts: Product[];
  subTotal: number;
  subTotalWithTax: number;
  defaultTax: number;

  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.addedProducts$ = this.store.select(selectors.selectAddedProducts);
    this.subTotal$ = this.store.select(selectors.selectSubTotal);
    this.subTotalWithTax$ = this.store.select(selectors.selectSubTotalWithTax);
    this.defaultTax$ = this.store.select(selectors.selectDefaultTax);

    this.addedProducts$.pipe(takeUntil(this.unsubscribe$)).subscribe(addedProducts => {
      this.addedProducts = addedProducts;
    });
    this.subTotal$.pipe(takeUntil(this.unsubscribe$)).subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.subTotalWithTax$.pipe(takeUntil(this.unsubscribe$)).subscribe(subTotalWithTax => {
      this.subTotalWithTax = subTotalWithTax;
    });
    this.defaultTax$.pipe(takeUntil(this.unsubscribe$)).subscribe(defaultTax => {
      this.defaultTax = defaultTax;
    });
  }

  getEffectiveTax(product: Product): number {
    const effTax = product.customTax !== null ? product.customTax : this.defaultTax;
    return effTax / 100;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  handleClickBack = () => {
    this.router.navigate(['/', PathConstants.Home]);
  }
}