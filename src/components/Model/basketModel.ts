import { IProduct } from '../../types';
import { IEvents } from '../base/events';

// работа с добавлением товара в корзину заказа
export interface IBasketModel {
	basketProducts: IProduct[];
	addProductToBasket(data: IProduct): void;
	deleteProductToBasket(item: IProduct): void;
	getCounter: () => number;
	getCountSumProducts: () => number;
	clearBasketProducts(): void;
	isProductInBasket(data: IProduct): boolean;
}

export class BasketModel implements IBasketModel {
	protected _basketProducts: IProduct[];

	constructor(protected events: IEvents, buttonElement?: HTMLButtonElement) {
		this._basketProducts = [];
	}

	set basketProducts(data: IProduct[]) {
		this._basketProducts = data;
	}

	get basketProducts() {
		return this._basketProducts;
	}

	addProductToBasket(data: IProduct) {
		// Проверка на наличие товара в корзине
		const existingProductIndex = this._basketProducts.findIndex(
			(item) => item.id === data.id
		);
		if (existingProductIndex === -1) {
			// Товар не найден, добавляем его в корзину
			this._basketProducts.push(data);
			this.events.trigger('card:addBasket');
		}
	}

	isProductInBasket(data: IProduct) {
		const existingProductIndex = this._basketProducts.findIndex(
			(item) => item.id === data.id
		);
		return !(existingProductIndex === -1)
	}


	deleteProductToBasket(item: IProduct) {
		const del = this._basketProducts.indexOf(item);
		if (del >= 0) {
			this._basketProducts.splice(del, 1);
		}
	}

	getCounter() {
		return this.basketProducts.length;
	}

	getCountSumProducts() {
		return this.basketProducts.reduce((countSum, item) => {
			return countSum + item.price;
		}, 0);
	}

	clearBasketProducts() {
		this.basketProducts = [];
	}
}
