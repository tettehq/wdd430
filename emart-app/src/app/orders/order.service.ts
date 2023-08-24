import { Injectable, EventEmitter } from '@angular/core';
import { Order } from './order.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders: Order[] = [];
  orderChangedEvent = new EventEmitter<Order[]>();

  orderSelectedEvent = new EventEmitter<Order>();

  orderListChangedEvent = new Subject<any>();

  maxOrderId: number;

  localUrl: string = 'http://localhost:3000/orders-backend/';
  remoteUrl: string = 'https://tettehq.github.io/wdd430/emart-app/orders-backend';

  constructor(private http: HttpClient) {
    // this.orders = [];
    this.maxOrderId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    this.orders.forEach(
      (order: Order) => {
        const currentId = +order.id;
        if (currentId > maxId) {
          maxId = currentId
        }
      }
    )
    return maxId;
  }

  getOrders() {
    this.http.get<{message: string, orders: Order[]}>(this.remoteUrl).subscribe(
      (response: {message: string, orders: Order[]}) => {
        this.orders = response.orders;
        this.maxOrderId = this.getMaxId();
        this.orders.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.sortAndSend();
        console.log(this.orders);
      },
      (error: any) => {
        console.log('An error occurred '+ error);
      }
    )
    return this.orders.slice();
  }

  getOrder(id: string): Order {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id == id) {
        return this.orders[i]
      }
    }
    return null
  }

  addOrder(newOrder: Order) {
    if (!newOrder) {
      return;
    }

    newOrder.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, order: Order }>(this.remoteUrl,
      newOrder,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new product to products
          this.orders.push(responseData.order);
          this.sortAndSend()
        }
      );
    // this.orders.push(newOrder);
    // this.sortAndSend();
  }

  deleteOrder(order: Order) {
    if (!order) {
      return;
    }

    const pos = this.orders.findIndex(d => d.name === order.name);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.remoteUrl + order.id)
      .subscribe(
        (response: Response) => {
          this.orders.splice(pos, 1);
          this.sortAndSend();
        }
      );

      this.orders.splice(pos, 1);
      this.sortAndSend();
  }

  sortAndSend() {
    if (Array.isArray(this.orders)) {
      this.orders.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      this.orderListChangedEvent.next(this.orders.slice());
    }
  }

}
