import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

import { IOrderList, IProduct } from './types';

import { EventEmitter } from './components/base/events';

import { ApiGetCards } from './components/Model/apiGetCards';
import { CardsList } from './components/Model/cardListModel';
import { BasketModel } from './components/Model/basketModel';
import { OrderModel } from './components/Model/orderModel';

import { ProductView, ProductPreview } from './components/View/productData';
import { Basket } from './components/View/basket';
import { BasketItem } from './components/View/basketItem';
import { OrderFirstForm } from './components/View/firstForm';
import { OrderSecondForm } from './components/View/secondForm';
import { Modal } from './components/View/modals';
import { Success } from './components/View/successOrder';
import { Page } from './components/View/page';



const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiGetCards = new ApiGetCards(CDN_URL, API_URL);
const events = new EventEmitter();
const apiChoiseCards = new CardsList(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel(events);
const formModel = new OrderModel(events);
const firstForm = new OrderFirstForm(orderTemplate, events);
const secondForm = new OrderSecondForm(contactsTemplate, events);
const page = new Page(events);
const success = new Success(successTemplate, events);

// Вывожу карточки с товаром на главную страницу
events.on( 'getCards:receive',() => {
  apiChoiseCards.choiseCards.forEach(item => {
    const card = new ProductView(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    const renderCard = card.renderCard(item)
    page.productItem = renderCard
  });
});

// Получаю данные карточки по которой кликнул
events.on('card:select', (item: IProduct) => { apiChoiseCards.setPreview(item) });

// Открываю окно с карточкой товара
events.on('modalCard:open', (item: IProduct) => {
  const cardPreview = new ProductPreview(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item, basketModel.isProductInBasket(item));
  modal.render();
});

// Добавляю карточку с товаром в корзину
events.on('card:addBasket', () => {
  basketModel.addProductToBasket(apiChoiseCards.checkСard);
  events.emit('basket:changed');
  modal.close();
});

// Открываю окно с корзиной
events.on('basket:open', () => {
  events.emit('basket:changed');
});

// Удаляю карточку из корзины
events.on('basket:basketDelete', (item: IProduct) => {
  basketModel.deleteProductToBasket(item);
  events.emit('basket:changed');
});

events.on('basket:changed', () => {
  page.productListBasket(basketModel.getCounter());
  basket.productSumBasket(basketModel.getCountSumProducts());
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    i = i + 1;
    return new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketDelete', item) }).render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});


// Открываю модальное окно с формой для заполнения адреса и кнопки оплаты
events.on('order:open', () => {
  modal.content = firstForm.render();
  modal.render();
});

// Валидация кнопки
events.on('order:paymentCheck', (button: HTMLButtonElement) => { formModel.setPayment(button.name) 
  firstForm.paymentSelection = button.name;
}) 

// Отслеживаю изменения при заполнении
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setInputs(data.field, data.value);
});

// Валидация всех полей
events.on('checkErrors:filds', (errors: Partial<IOrderList>) => {
  const { address, payment, email, phone } = errors;
  firstForm.valid = !address && !payment;
  firstForm.checkErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
  secondForm.valid = !email && !phone;
  secondForm.checkErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Открываю модальное окно с формой для заполнения почты и телефона
events.on('contacts:open', () => {
  modal.content = secondForm.render();
  modal.render();
});

// Отслеживаю изменения при заполнении
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setInputs(data.field, data.value);
});

// Открываю модальное окно с успешным оформлением заказа
events.on('success:open', () => {
  apiGetCards.postOrderList(formModel.getOrderProduct(), basketModel.getCountSumProducts(), basketModel.basketProducts.map(item => item.id))
    .then((data) => {
      modal.content = success.render(basketModel.getCountSumProducts());
      basketModel.clearBasketProducts(); 
      page.productListBasket(basketModel.getCounter()); 
      modal.render();
    })
    .catch(error => console.log(error));
});

// Закрытие окна после успешного оформления заказа
events.on('success:close', () => modal.close());

// Блокировка проктутки страницы
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокировка проктутки страницы
events.on('modal:close', () => {
  page.locked = false;
});

// Получаю данные с сервера
apiGetCards.getProduct()
  .then(function (data: IProduct[]) {
    apiChoiseCards.choiseCards = data;
  })
  .catch(error => console.log(error))