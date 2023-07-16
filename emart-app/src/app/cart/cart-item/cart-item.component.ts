import { Component, Input } from '@angular/core';
import { Cart } from '../cart.model';

@Component({
  selector: 'emart-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() cartItem: Cart;
}
