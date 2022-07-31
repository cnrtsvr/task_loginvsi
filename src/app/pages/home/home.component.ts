import { Component, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { AppState } from "../../types/app";
import { Product } from "../../types/product";
import * as selectors from "../../store/selectors"
import { Router } from "@angular/router";
import { PathConstants } from "../../app-routing.module";

@Component({
  selector: "task-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnDestroy {
  addedProducts$: Observable<Product[]>

  addedProducts: Product[];

  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.addedProducts$ = this.store.select(selectors.selectAddedProducts);
    this.addedProducts$.pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
      this.addedProducts = products;
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  handleContinue = () => {
    this.router.navigate(["/", PathConstants.Billing]);
  }
}