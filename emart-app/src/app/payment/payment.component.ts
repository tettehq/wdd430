import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { Order } from '../orders/order.model';
import { OrderService } from '../orders/order.service';

@Component({
  selector: 'emart-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems: Cart[] = [];
  originalOrder: Order;
  order: Order;
  size: number;
  totalPrice: string;

  constructor(
    private cartService: CartService,
    public orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getProducts();
    this.size = this.cartItems.length
    this.totalPrice = this.cartService.getTotal();
    console.log(this.totalPrice)

    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        if (id === null || id === undefined) {
          return;
        }
        this.originalOrder = this.orderService.getOrder(id);

        if (this.originalOrder == null) {
          return;
        }
        this.order = this.originalOrder;
        console.log(this.order)
      }
    )
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newOrder = new Order(
      null,
      null,
      value.name,
      value.email,
      new Date().toLocaleString(),
      value.total,
      this.cartItems
    )

    this.orderService.addOrder(newOrder);
    this.router.navigate(['/orders']);
  }

  onCancel() {
    this.router.navigate(['cart']);
  }
}
