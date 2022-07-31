import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "src/app/types/product";

@Component({
  selector: "task-product-row",
  template: '',
  styleUrls: []
})
export class MockProductRowComponent {
  @Input() product?: Product;
  @Output() editSaved = new EventEmitter<Product>();
  @Output() editCancelled = new EventEmitter<void>();
  @Output() productRemoved = new EventEmitter<number>();
}