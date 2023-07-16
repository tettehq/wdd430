import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'emart-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  products: Product[] = [];

  term: string;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.productService.productChangedEvent.subscribe(
      (products: Product[]) => {
        this.products = products;
      }
    )
    this.subscription = this.productService.productListChangedEvent.subscribe(
      (productList: Product[]) => {
        this.products = productList;
      }
    )
  }

  search(value: string) {
    this.term = value
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
