import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart } from '../cart.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'emart-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  cartItems: Cart[] = [];

  term: string;

  total: string;

  disabled: boolean = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getProducts();
    this.total = this.cartService.getTotal();
    if (this.cartItems.length >= 1) {
      this.disabled = !this.disabled;
    }
    this.cartService.cartChangedEvent.subscribe(
      (cartItems: Cart[]) => {
        this.cartItems = cartItems;
      }
    )
    this.subscription = this.cartService.cartListChangedEvent.subscribe(
      (response: any) => {
        this.cartItems = response.list;
        this.total = response.total;
      }
    )
  }

  onEmpty() {
    this.cartService.deleteProduct(null);
    this.disabled = !this.disabled;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
