import { IEvents } from "../base/events";
import { IChoiseProduct, IProduct } from "../../types";


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
    this.buttonDelete.addEventListener('click', () => this.events.emit('basket:basketDelete', data));
    	this.index.textContent = String(item);
    	this.title.textContent = data.title;
    	this.price.textContent = this.productPrice(data.price);
    	return this.basketItem;
    }
}