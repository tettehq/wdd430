import { Injectable, EventEmitter } from '@angular/core';
import { Cart } from './cart.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCKCART } from '../../../MOCKCART';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartContents: Cart[] = [];
  cartChangedEvent = new EventEmitter<Cart[]>();

  cartSelectedEvent = new EventEmitter<Cart>();

  cartListChangedEvent = new Subject<any>();

  maxCartContentId: number;

  localUrl: string = 'http://localhost:3000/cart-backend/';
  remoteUrl: string = 'https://tettehq.github.io/wdd430/emart-app/deploy/emart-app/cart-backend';

  constructor(private http: HttpClient) {
    // this.cartContents = MOCKCART;
    this.maxCartContentId = this.getMaxId();

  }

  getProducts() {
    // return this.products.slice();
    this.http.get<{message: string, cartList: Cart[]}>(this.remoteUrl).subscribe(
      (response: {message: string, cartList: Cart[]}) => {
        this.cartContents = response.cartList;
        this.maxCartContentId = this.getMaxId();
        this.cartContents.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.sortAndSend()
      },
      (error: any) => {
        console.log('An error occurred '+ error);
      }
    )
    return this.cartContents.slice();
  }

  getTotal() {
    let total: number = 0;
    this.cartContents.forEach(
      (item) => {
        total += parseFloat(item.price) * parseFloat(item.quantity);
      }
    )
    return total.toFixed(2).toString();
  }

  getProduct(id: string): Cart {
    for (let i = 0; i < this.cartContents.length; i++) {
      if (this.cartContents[i].id == id) {
        return this.cartContents[i]
      }
    }
    return null
  }

  deleteProduct(product: Cart) {
    // this.cartContents.splice(pos, 1);
    // const cartList = this.cartContents.slice();
    // this.sortAndSend();

    if (!product) {
      this.http.delete(this.remoteUrl + null)
      .subscribe(
        (response: Response) => {
          this.cartContents = [];
          this.sortAndSend();
        }
      );
      return;
    }

    const pos = this.cartContents.findIndex(d => d.id === product.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.remoteUrl + product.id)
      .subscribe(
        (response: Response) => {
          this.cartContents.splice(pos, 1);
          this.sortAndSend();
        }
      );
 }

 getMaxId(): number {
  let maxId = 0;
  this.cartContents.forEach(
    (product: Cart) => {
      const currentId = +product.id;
      if (currentId > maxId) {
        maxId = currentId
      }
    }
  )
  return maxId;
 }

 addProduct(newProduct: Cart) {
  // if (newProduct === undefined || newProduct === null)
  //   return
  // }
  // this.maxProductId++;
  // newProduct.id = `${this.maxProductId}`;
  // this.products.push(newProduct);
  // const productsList = this.products.slice();
  // this.productListChangedEvent.next(this.storeProducts());

  if (!newProduct) {
    return;
  }

  this.cartContents = this.getProducts();

  for (let i = 0; i < this.cartContents.length; i++) {
    if (this.cartContents[i].name == newProduct.name) {
      let newQuantity = +this.cartContents[i].quantity;
      newQuantity++;
      console.log(newQuantity)
      newProduct.quantity = newQuantity.toString();
      this.updateProduct(this.cartContents[i], newProduct);

      return
    }
    this.sortAndSend()
  }

  const newQuantity = 1;
  newProduct.quantity = `${newQuantity}`;

  // make sure id of the new Product is empty
  newProduct.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, product: Cart }>(this.remoteUrl,
    newProduct,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new product to products
        this.cartContents.push(responseData.product);
        this.sortAndSend();
      }
    );

    const newId = this.getMaxId() + 1;
    newProduct.id = newId.toString();
    this.cartContents.push(newProduct)
 }

 updateProduct(originalProduct: Cart, newProduct: Cart) {
  // if (originalProduct === undefined || newProduct === undefined) {
  //   return
  // }

  // const pos = this.products.indexOf(originalProduct);
  // if (pos < 0) {
  //   return
  // }

  // newProduct.id = originalProduct.id;
  // this.products[pos] = newProduct;
  // const productsList = this.products.slice();

  if (!originalProduct || !newProduct) {
    return;
  }

  const pos = this.cartContents.findIndex(d => d.id === originalProduct.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Product to the id of the old Product
  newProduct.id = originalProduct.id;
  newProduct._id = originalProduct._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put(this.remoteUrl + originalProduct.id,
    newProduct, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.cartContents[pos] = newProduct;
        this.sortAndSend()
      }
    );
 }

 sortAndSend() {
  if (Array.isArray(this.cartContents)) {
    this.cartContents.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.cartListChangedEvent.next(
      {list: this.cartContents.slice(),
        total: this.getTotal()
      }
      );
  }
}

//  storeProducts() {
//   const data = JSON.stringify(this.products);
//   return this.http.put(
//     this.remoteUrl,
//     data,
//     {
//       headers: new HttpHeaders({'Content-Type': 'application/json'})
//     }).subscribe(
//       () => {
//         this.productListChangedEvent.next(this.products.slice());
//       }
//     )
//  }
}
