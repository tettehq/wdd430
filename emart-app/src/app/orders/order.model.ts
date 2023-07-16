import { Cart } from "../cart/cart.model";

export class Order {
  constructor(
    public _id: string,
    public id: string,
    public name: string,
    public email: string,
    public time: string,
    public total: string,
    public items: Cart[],
  ) {}
}
