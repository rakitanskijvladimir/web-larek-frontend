import { IProduct } from "../../types";

// работа с добавлением товара в корзину заказа
export interface IBasketModel {
  basketProducts: IProduct[]
  addProductToBasket(data: IProduct): void;
  deleteProductToBasket(item: IProduct): void;
  getCounter: () => number;
  getCountSumProducts: () => number;
  clearBasketProducts(): void
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProduct[]; 

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IProduct[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  addProductToBasket(data: IProduct) {
      this._basketProducts.push(data)
  }

  deleteProductToBasket(item: IProduct) {
      const del = this._basketProducts.indexOf(item)
      if (del >= 0) {
          this._basketProducts.splice(del, 1)
      }
  }

  getCounter() {
      return this.basketProducts.length
  }

  getCountSumProducts() {
      let countSum = 0;
      this.basketProducts.forEach(item => {
          countSum = countSum + item.price;
      });
      return countSum;

  }
  
  clearBasketProducts() {
      this.basketProducts = []
    }


}