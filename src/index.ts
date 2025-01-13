import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

import { IOrderList, IProduct } from './types';

import { EventEmitter } from './components/base/events';

import { ApiGetCards, ApiChoiseCards } from './components/Model/getData';
import { BasketModel } from './components/Model/basketModel';
import { OrderModel } from './components/Model/orderModel';


import { ProductView, ProductPreview } from './components/View/productData';
import { Basket, BasketItem } from './components/View/contentBasket';
import { OrderFirstForm, OrderSecondForm } from './components/View/fillForms';
import { Modal } from './components/View/Modal';
import { Success } from './components/View/Success';


const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiGetCards = new ApiGetCards(CDN_URL, API_URL);
const events = new EventEmitter();
const apiChoiseCards = new ApiChoiseCards(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();
const formModel = new OrderModel(events);
const firstForm = new OrderFirstForm(orderTemplate, events);
const secondForm = new OrderSecondForm(contactsTemplate, events);

// Вывожу карточки с товаром на главную страницу
events.on('getCards:receive', () => {
  apiChoiseCards.choiseCards.forEach(item => {
    const card = new ProductView(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

// Получаю данные карточки по которой кликнул
events.on('card:select', (item: IProduct) => { apiChoiseCards.setPreview(item) });

// Открываю окно с карточкой товара
events.on('modalCard:open', (item: IProduct) => {
  const cardPreview = new ProductPreview(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

// Добавляю карточку с товаром в корзину
events.on('card:addBasket', () => {
  basketModel.addProductToBasket(apiChoiseCards.checkСard); 
  basket.productListBasket(basketModel.getCounter()); 
  modal.close();
});

// Открываю окно с корзиной
events.on('basket:open', () => {
  basket.productSumBasket(basketModel.getCountSumProducts());  
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketDelete', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});

// Удаляю карточку из корзины
events.on('basket:basketDelete', (item: IProduct) => {
  basketModel.deleteProductToBasket(item);
  basket.productListBasket(basketModel.getCounter()); 
  basket.productSumBasket(basketModel.getCountSumProducts()); 
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketDelete', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
});

// Открываю модальное окно с формой для заполнения адреса и кнопки оплаты
events.on('order:open', () => {
  modal.content = firstForm.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id); 
});

// Валидация кнопки
events.on('order:paymentCheck', (button: HTMLButtonElement) => { formModel.payment = button.name }) 

// Отслеживаю изменения при заполнении
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setAddress(data.field, data.value);
});

// Валидация поля адреса и оплаты
events.on('checkErrors:address', (errors: Partial<IOrderList>) => {
  const { address, payment } = errors;
  firstForm.valid = !address && !payment;
  firstForm.checkErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

// Открываю модальное окно с формой для заполнения почты и телефона
events.on('contacts:open', () => {
  formModel.total = basketModel.getCountSumProducts();
  modal.content = secondForm.render();
  modal.render();
});

// Отслеживаю изменения при заполнении
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setEmailPhone(data.field, data.value);
});

// Валидация поля почты и телефона
events.on('checkErrors:change', (errors: Partial<IOrderList>) => {
  const { email, phone } = errors;
  secondForm.valid = !email && !phone;
  secondForm.checkErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Открываю модальное окно с успешным оформлением заказа
events.on('success:open', () => {
  apiGetCards.postOrderList(formModel.getOrderProduct())
    .then((data) => {
      console.log(data); 
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getCountSumProducts());
      basketModel.clearBasketProducts(); 
      basket.productListBasket(basketModel.getCounter()); 
      modal.render();
    })
    .catch(error => console.log(error));
});

// Закрытие окна после успешного оформления заказа
events.on('success:close', () => modal.close());

// Блокировка проктутки страницы
events.on('modal:open', () => {
  modal.locked = true;
});

// Разблокировка проктутки страницы
events.on('modal:close', () => {
  modal.locked = false;
});

// Получаю данные с сервера
apiGetCards.getProduct()
  .then(function (data: IProduct[]) {
    apiChoiseCards.choiseCards = data;
  })
  .catch(error => console.log(error))