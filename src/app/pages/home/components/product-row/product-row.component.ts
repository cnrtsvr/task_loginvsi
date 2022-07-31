import { Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { AppState } from "../../../../types/app";
import { Product } from "../../../../types/product";
import * as selectors from "../../../../store/selectors";

@Component({
  selector: "tr[task-product-row]",
  templateUrl: "./product-row.component.html",
  styleUrls: ["./product-row.component.scss"]
})
export class ProductRowComponent implements OnInit, OnChanges, OnDestroy {
  @Input() product?: Product;
  @Output() editSaved = new EventEmitter<Product>();
  @Output() editCancelled = new EventEmitter<void>();
  @Output() productRemoved = new EventEmitter<number>();

  isEditActive: boolean = false;

  productForm = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tax: new FormControl('', { nonNullable: true })
  });

  codeControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  nameControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  priceControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  taxControl = new FormControl('', { nonNullable: true });

  defaultTax$: Observable<number>;
  defaultTax: number;

  unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    this.defaultTax$ = this.store.select(selectors.selectDefaultTax);
    this.defaultTax$.pipe(takeUntil(this.unsubscribe$)).subscribe(defaultTax => {
      this.defaultTax = defaultTax;
    })
  }

  ngOnInit(): void {
    this.isEditActive = !this.product;
    this.setDefaultFormValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isEditActive = !changes["product"].currentValue;
    this.setDefaultFormValues();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  isFormValid(): boolean {
    return this.productForm.touched && this.productForm.valid;
  }

  getTaxPercentage(product: Product): number {
    return product.customTax !== null ? product.customTax : this.defaultTax;
  }

  getPriceWithTax(product: Product): number {
    const tax = this.getTaxPercentage(product);
    return product.basePrice * ((100 + tax) / 100);
  }

  setDefaultFormValues(): void {
    if (this.product) {
      this.productForm.setValue({
        code: this.product.code.toString(),
        name: this.product.name,
        price: this.product.basePrice.toString(),
        tax: this.product.customTax?.toString() ?? ''
      }, { emitEvent: false });
    } else {
      this.productForm.setValue({
        code: '',
        name: '',
        price: '',
        tax: ''
      }, { emitEvent: false });
    }
  }

  forceFormValidation(): void {
    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();
  }

  handleEditClicked = () => {
    this.setDefaultFormValues();
    this.forceFormValidation();
    this.isEditActive = true;
  }

  handleEditSaved = () => {
    if (!this.isFormValid()) {
      this.forceFormValidation();
      return;
    }
    const newProduct: Product =  {
      ...this.product,
      code: Number(this.productForm.controls.code.value),
      name: this.productForm.controls.name.value,
      basePrice: Number(this.productForm.controls.price.value),
      customTax: this.productForm.controls.tax.value
        ? Number(this.productForm.controls.tax.value)
        : null
    };
    this.resetControls();
    this.editSaved.emit(newProduct);
    this.isEditActive = false;
  }

  handleEditCancelled = () => {
    this.resetControls();
    this.editCancelled.emit();
    this.isEditActive = false;
  }

  handleRemoveClicked = () => {
    this.productRemoved.emit(this.product?.id)
  }

  resetControls() {
    this.productForm.reset();
  }
}