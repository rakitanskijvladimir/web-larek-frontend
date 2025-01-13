import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IChoiseProduct, IProduct } from "../../types";

export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  basketButton: HTMLButtonElement;
  basketCounter: HTMLElement;
  productListBasket(value: number): void;
  productSumBasket(sumAll: number): void;
  render(): HTMLElement;
}

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  basketButton: HTMLButtonElement;
  basketCounter: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.basketButton = document.querySelector('.header__basket');
    this.basketCounter = document.querySelector('.header__basket-counter');
    
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.basketButton.addEventListener('click', () => { this.events.emit('basket:open') });

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  productListBasket(value: number) {
    this.basketCounter.textContent = String(value);
  }
  
  productSumBasket(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}


export interface IBasketItem {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IProduct, item: number): HTMLElement;
}

export class BasketItem implements IBasketItem {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IChoiseProduct) {
    this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.index = this.basketItem.querySelector('.basket__item-index');
		this.title = this.basketItem.querySelector('.card__title');
		this.price = this.basketItem.querySelector('.card__price');
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
  }

	protected productPrice(value: number | null) {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

	render(data: IProduct, item: number) {
		this.index.textContent = String(item);
		this.title.textContent = data.title;
		this.price.textContent = this.productPrice(data.price);
		return this.basketItem;
	}
}