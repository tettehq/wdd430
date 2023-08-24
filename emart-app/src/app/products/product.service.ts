import { Injectable, EventEmitter } from '@angular/core';
import { Product } from './product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCKPRODUCTS } from '../../../MOCKPRODUCTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: Product[] = [];
  productChangedEvent = new EventEmitter<Product[]>();

  productSelectedEvent = new EventEmitter<Product>();

  productListChangedEvent = new Subject<any>();

  maxProductId: number;

  localUrl: string = 'http://localhost:3000/products-backend/';
  remoteUrl: string = 'https://tettehq.github.io/wdd430/emart-app/deploy/emart-app/products-backend';

  constructor(private http: HttpClient) {
    // this.products = MOCKPRODUCTS;
    this.maxProductId = this.getMaxId();

  }

  getProducts() {
    // return this.products.slice();
    this.http.get<{message: string, products: Product[]}>(this.remoteUrl).subscribe(
      (response: {message: string, products: Product[]}) => {
        this.products = response.products;
        this.maxProductId = this.getMaxId();
        this.products.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.productListChangedEvent.next(this.products.slice());
      },
      (error: any) => {
        console.log('An error occurred '+ error);
      }
    )
    return this.products.slice();
  }

  getProduct(id: string): Product {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == id) {
        return this.products[i]
      }
    }
    return null
  }

  deleteProduct(product: Product) {
    // if (!product) {
    //    return;
    // }
    // const pos = this.products.indexOf(product);
    // if (pos < 0) {
    //    return;
    // }
    // this.products.splice(pos, 1);
    // const productsList = this.products.slice();
    // this.productListChangedEvent.next(productsList);

    if (!product) {
      return;
    }

    const pos = this.products.findIndex(d => d.id === product.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.remoteUrl + product.id)
      .subscribe(
        (response: Response) => {
          this.products.splice(pos, 1);
          this.sortAndSend();
        }
      );
 }

 getMaxId(): number {
  let maxId = 0;
  this.products.forEach(
    (product: Product) => {
      const currentId = +product.id;
      if (currentId > maxId) {
        maxId = currentId
      }
    }
  )
  return maxId;
 }

 addProduct(newProduct: Product) {
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

  // make sure id of the new Product is empty
  newProduct.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, product: Product }>(this.remoteUrl,
    newProduct,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new product to products
        this.products.push(responseData.product);
        this.sortAndSend()
      }
    );
 }

 updateProduct(originalProduct: Product, newProduct: Product) {
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

  const pos = this.products.findIndex(d => d.id === originalProduct.id);

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
        this.products[pos] = newProduct;
        this.sortAndSend()
      }
    );
 }

 sortAndSend() {
  if (Array.isArray(this.products)) {
    this.products.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.productListChangedEvent.next(this.products.slice());
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
