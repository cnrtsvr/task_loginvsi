import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductRowComponent } from './components/product-row/product-row.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProductListComponent,
    ProductRowComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }