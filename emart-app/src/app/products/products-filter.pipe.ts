import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product.model';

@Pipe({
  name: 'productsFilter'
})
export class ProductsFilterPipe implements PipeTransform {

  transform(products: Product[], term: string): any {
    let filteredProducts: Product[] = [];
    if (term && term.length > 0) {
      filteredProducts = products.filter((product: Product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filteredProducts.length < 1) {
      return products;
    }
    return filteredProducts;
  }

}
