import { Component, OnInit } from '@angular/core';
import { Order } from '../order.model';
import { OrderService } from '../order.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'emart-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        this.order = this.orderService.getOrder(id);
        console.log(this.order)
      }
    )
  }

  onDelete() {
    this.orderService.deleteOrder(this.order);
    this.onCancel();
  }

  onCancel() {
    this.router.navigateByUrl('orders');
  }

}
