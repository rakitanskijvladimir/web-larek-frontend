
import { createElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export interface IBasket {
	basket: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;
	basketItem: HTMLElement;
	index: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	productSumBasket(sumAll: number): void;
	render(): HTMLElement;
}

export class Basket implements IBasket {
	basket: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;
	basketItem: HTMLElement;
	index: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.basket = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.title = this.basket.querySelector('.modal__title');
		this.basketList = this.basket.querySelector('.basket__list');
		this.button = this.basket.querySelector('.basket__button');
		this.basketPrice = this.basket.querySelector('.basket__price');

		this.button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.button.setAttribute('disabled', 'disabled');
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	productSumBasket(sumAll: number) {
		this.basketPrice.textContent = String(sumAll + ' синапсов');
	}

	render() {
		this.title.textContent = 'Корзина';
		return this.basket;
	}
}
