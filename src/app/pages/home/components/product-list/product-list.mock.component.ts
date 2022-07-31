import { Component, Input } from "@angular/core";
import { Product } from "src/app/types/product";

@Component({
  selector: "task-product-list",
  template: '',
  styleUrls: []
})
export class MockProductListComponent {
  @Input() products: Product[];
}