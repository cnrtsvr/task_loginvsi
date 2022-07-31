import { Component, Input, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../types/app";
import { Product } from "../../../../types/product";
import * as actions from "../../../../store/actions";
import * as selectors from "../../../../store/selectors";
import { Observable, Subject, takeUntil } from "rxjs";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "task-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"]
})
export class ProductListComponent implements OnDestroy {
  @Input() products: Product[];

  subTotal$: Observable<number>;
  subTotalWithTax$: Observable<number>;
  defaultTax$: Observable<number>;

  subTotal: number;
  subTotalWithTax: number;
  defaultTax: number;

  unsubscribe$ = new Subject<void>()

  isEditTaxActive = false;
  taxControl = new FormControl('', { nonNullable: true, validators: Validators.required })

  constructor(private store: Store<AppState>) {
    this.subTotal$ = this.store.select(selectors.selectSubTotal);
    this.subTotalWithTax$ = this.store.select(selectors.selectSubTotalWithTax);
    this.defaultTax$ = this.store.select(selectors.selectDefaultTax);

    this.subTotal$.pipe(takeUntil(this.unsubscribe$)).subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.subTotalWithTax$.pipe(takeUntil(this.unsubscribe$)).subscribe(subTotalWithTax => {
      this.subTotalWithTax = subTotalWithTax;
    });
    this.defaultTax$.pipe(takeUntil(this.unsubscribe$)).subscribe(defaultTax => {
      this.defaultTax = defaultTax;
    })
  }

  isAddingProduct: boolean = false;

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  handleAddButtonClick = (): void => {
    this.isAddingProduct = true;
  }

  handleEditTaxClick = () => {
    this.taxControl.setValue(this.defaultTax.toString());
    this.isEditTaxActive = true;
  }

  handleSaveDefaultTax = () => {
    this.store.dispatch(actions.setDefaultTax({ defaultTax: Number(this.taxControl.value) }));
    this.isEditTaxActive = false;
    this.taxControl.reset();
  }

  handleCancelEditTax = () => {
    this.isEditTaxActive = false;
    this.taxControl.reset();
  }

  handleNewProductAdded = (product: Product) => {
    this.store.dispatch(actions.addProduct({ product }));
    this.isAddingProduct = false;
  }

  handleNewProductCancelled = () => {
    this.isAddingProduct = false;
  }

  handleProductEdited = (product: Product) => {
    this.store.dispatch(actions.updateProduct({ product }));
  }

  handleProductRemoved = (id: number) => {
    this.store.dispatch(actions.removeProduct({ id }))
  }
}