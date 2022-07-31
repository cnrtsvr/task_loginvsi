import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingComponent } from './billing.component';

@NgModule({
  declarations: [
    BillingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [BillingComponent]
})
export class BillingModule { }