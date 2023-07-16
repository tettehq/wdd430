import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductsComponent } from "./products/products.component";
import { ProductItemComponent } from "./products/product-item/product-item.component";
import { ProductDetailComponent } from "./products/product-detail/product-detail.component";
import { CartComponent } from "./cart/cart.component";
import { CartDetailComponent } from "./cart/cart-detail/cart-detail.component";
import { CartEditComponent } from "./cart/cart-edit/cart-edit.component";
import { OrdersComponent } from "./orders/orders.component";
import { PaymentComponent } from "./payment/payment.component";
import { OrderDetailComponent } from "./orders/order-detail/order-detail.component";



const appRoutes: Routes = [
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: 'products', component: ProductsComponent, children: [
    {path: ':id', component: ProductDetailComponent}
  ]},
  {path: 'orders', component: OrdersComponent, children: [
    {path: ':id', component: OrderDetailComponent}
  ]},
  {path: 'cart', component: CartComponent, children: [
    {path: ':id', component: CartDetailComponent},
    {path: ':id/edit', component: CartEditComponent}
  ]},
  {path: 'payment', component: PaymentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
