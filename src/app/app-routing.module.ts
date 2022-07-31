import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './pages/billing/billing.component';
import { HomeComponent } from './pages/home/home.component';

export enum PathConstants {
  Billing = "billing",
  Home = "home"
};

export const routes: Routes = [
  {
    path: PathConstants.Billing,
    component: BillingComponent
  },
  {
    path: PathConstants.Home,
    component: HomeComponent
  },
  {
    path: "**",
    redirectTo: `/${PathConstants.Home}`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
