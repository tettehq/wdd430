export class Product {
  constructor(
    public _id: string,
    public id: string,
    public name: string,
    public description: string,
    public imageUrl: string,
    public price: string,
    public inventory: string,
    public category: string
  ) {}
}
