import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CartService } from 'src/app/cart/cart.service';
import { Cart } from 'src/app/cart/cart.model';

@Component({
  selector: 'cms-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit{
  product: Product;
  cartItem: Cart;
  nativeWindow: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,) {
    }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        this.product = this.productService.getProduct(id);
      }
    )
  }

  onAdd() {
    this.cartItem = new Cart(
      null,
      null,
      this.product.name,
      this.product.description,
      this.product.imageUrl,
      this.product.price,
      null,
      this.product.category
    )

    this.cartService.addProduct(this.cartItem);
    this.router.navigate(['/products'])
  }

  onDelete() {
    this.cartService.deleteProduct(this.cartItem);
    this.router.navigate(['products']);
  }

}
