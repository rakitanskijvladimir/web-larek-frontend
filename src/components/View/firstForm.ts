import { IEvents } from '../base/events';

export interface IorderFirstForm {
	firstForm: HTMLFormElement;
	buttonAll: HTMLButtonElement[];
	paymentSelection: String;
	checkErrors: HTMLElement;
	render(): HTMLElement;
}

export class OrderFirstForm implements IorderFirstForm {
	firstForm: HTMLFormElement;
	buttonAll: HTMLButtonElement[];
	buttonSubmit: HTMLButtonElement;
	checkErrors: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.firstForm = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.buttonAll = Array.from(this.firstForm.querySelectorAll('.button_alt'));
		this.buttonSubmit = this.firstForm.querySelector('.order__button');
		this.checkErrors = this.firstForm.querySelector('.form__errors');

		this.buttonAll.forEach((item) => {
			item.addEventListener('click', () => {
				events.emit('order:paymentCheck', item);
			});
		});

		this.firstForm.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`order:changeAddress`, { field, value });
		});

		this.firstForm.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('contacts:open');
		});
	}

	set paymentSelection(paymentMethod: string) {
		this.buttonAll.forEach((item) => {
			item.classList.toggle('button_alt-active', item.name === paymentMethod); // обводка
		});
	}

	set valid(value: boolean) {
		this.buttonSubmit.disabled = !value;
	}

	render() {
		return this.firstForm;
	}
}
