import { Component, OnInit } from '@angular/core';
import { Cart } from '../cart.model';
import { CartService } from '../cart.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'emart-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit{
  cartItem: Cart;

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        this.cartItem = this.cartService.getProduct(id);
      }
    )
  }

  onDelete() {
    this.cartService.deleteProduct(this.cartItem);
    this.router.navigate(['cart']);
  }
}
