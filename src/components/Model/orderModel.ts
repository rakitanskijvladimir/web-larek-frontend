import { IEvents } from '../base/events';
import { CheckErrors } from '../../types/index';

export interface IOrderModel {
	payment: string;
	email: string;
	phone: string;
	address: string;
	setInputs(field: string, value: string): void;
	validateCheck(): boolean;
	getOrderProduct(): object;
}

export class OrderModel implements IOrderModel {
	payment: string;
	email: string;
	phone: string;
	address: string;
	formErrors: CheckErrors = {};

	constructor(protected events: IEvents) {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
	}

	// заполнение строк ввода
	setInputs(field: string, value: string) {
		if (field === 'address') {
			this.address = value;
		}

		if (field === 'email') {
			this.email = value;
		}

		if (field === 'phone') {
			this.phone = value;
		}

		if (this.validateCheck()) {
			this.events.emit('order:ready', this.getOrderProduct());
		}
	}

	setPayment(payment: string) {
		this.payment = payment;
		if (this.validateCheck()) {
			this.events.emit('order:ready', this.getOrderProduct());
		}
	}


	// валидация строк ввода для отправки
	validateCheck() {
		const errors: typeof this.formErrors = {};

		if (!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.address) {
			errors.address = 'Укажите адрес';
		}

		if (!this.email) {
			errors.email = 'Укажите email';
		}

		if (!this.phone) {
			errors.phone = 'Укажите телефон';
		}

		this.formErrors = errors;
		this.events.emit('checkErrors:filds', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// получение итогового заказа
	getOrderProduct() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
		};
	}
}
