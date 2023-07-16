import { Component, OnInit } from '@angular/core';
import { Cart } from '../cart.model';
import { NgForm } from '@angular/forms';
import { CartService } from '../cart.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'emart-cart-edit',
  templateUrl: './cart-edit.component.html',
  styleUrls: ['./cart-edit.component.css']
})
export class CartEditComponent implements OnInit {
  originalItem: Cart;
  cartItem: Cart;
  editMode: boolean = false;
  id: string;

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;
        if (id === null || id === undefined) {
          this.editMode = false;
          return;
        }
        this.originalItem = this.cartService.getProduct(id);

        if (this.originalItem === null) {
          return;
        }
        this.editMode = true;
        this.cartItem = JSON.parse(JSON.stringify(this.originalItem));

        // if (this.originalContact.group) {
        //   this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        //   console.log(this.groupContacts);
        //   console.log(this.mock)
        // }
      }
    )
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newCartItem = new Cart(
      null,
      value.id,
      value.name,
      value.description,
      value.imageUrl,
      value.price,
      value.quantity,
      value.category
    )

    if (this.editMode) {
      this.cartService.updateProduct(this.originalItem, newCartItem);
    } else {
      this.cartService.addProduct(newCartItem);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['cart']);
  }
}
