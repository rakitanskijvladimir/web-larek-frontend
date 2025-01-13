import { IEvents } from '../base/events';
import { CheckErrors } from '../../types/index'

export interface IOrderModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  setAddress(field: string, value: string): void
  validateAddressPayment(): boolean;
  setEmailPhone(field: string, value: string): void
  validateEmailPhone(): boolean;
  getOrderProduct(): object;
}

export class OrderModel implements IOrderModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: CheckErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  // заполнение строки "address"
  setAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    if (this.validateAddressPayment()) {
      this.events.emit('order:ready', this.getOrderProduct());
    }
  }

  // валидация данных строки "address"
  validateAddressPayment() {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{10,}$/;
    const errors: typeof this.formErrors = {};

  if (!this.address) {
			errors.address = 'Укажите адрес';
		} else if (!regexp.test(this.address)) {
			errors.address = 'Адрес указан некорректно';
		} else if (!this.payment) {
      errors.payment = 'Выберите способ оплаты'
    }

    this.formErrors = errors;
    this.events.emit('checkErrors:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // заполнение строк "Почта" и "Телефон"
  setEmailPhone(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    }

    if (this.validateEmailPhone()) {
      this.events.emit('order:ready', this.getOrderProduct());
    }
  }

  // Валидация данных строк "Почта" и "Телефон"
  validateEmailPhone() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const errors: typeof this.formErrors = {};

    if (!this.email) {
			errors.email = 'Укажите email';
		} else if (!regexpEmail.test(this.email)) {
			errors.email = 'Email указан некорректно';
		}

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    if (!this.phone) {
			errors.phone = 'Укажите телефон';
		} else if (!regexpPhone.test(this.phone)) {
			errors.phone = 'Формат телефона указан некорректно';
		}

    this.formErrors = errors;
    this.events.emit('checkErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // получение итогового заказа
  getOrderProduct() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    }
  }
}