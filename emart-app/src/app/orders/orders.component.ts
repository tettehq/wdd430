import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from './order.service';
import { Order } from './order.model';

@Component({
  selector: 'emart-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  orders: Order[];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrders();
    this.orderService.orderChangedEvent.subscribe(
      (orders: Order[]) => {
        this.orders = orders;
      }
    )

    this.subscription = this.orderService.orderListChangedEvent.subscribe(
      (orderItems: Order[]) => {
        this.orders = orderItems
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
