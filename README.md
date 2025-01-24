# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных используемые в приложении
```
// Интерфейс карточки полученной с сервера

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```
```
// Интерфейс выбранного товара по клику

export interface IChoiseProduct {
  onClick: (event: MouseEvent) => void;     
}
```
```
// интерфейс формы отправки

export interface IOrderList {
payment: string;
address: string;
phone: string;
email: string;
}
```
```
// Интерфейс завершенного результата

export interface IOrderResult {
  id: string;
  total: number;
}
```
```
// Проверка формы на ошибки
export type CheckErrors = Partial<Record<keyof IOrderList, string>>;
```


## Архитертура приложения

Код приложения разделен на слои которые отвечают парадигме MVP:\
-слой Model - отвечает за работу и хранение данных полученных с сервера и от пользователя\
-слой View - отвечает за отображение данных для работы с пользователем и работу с событиями\
-слой Presenter - отвечает за связь данных с отображением интерфейсов при срабатывании события.

## Базовые классы

### Класс Api
Базовый класс для отправки и получения запросов\
constructor(baseUrl: string) - принимает url сервера, по которому происходят запросы\
Поля класса:
- _baseUrl - базовый адрес полученный с сервера.\

Методы:
- handleResponse(response: Response) - принимает ответ от сервера и обрабатывает его или отклоняет промис с возникшей ошибкой
- get(url: string ) - возвращает ответ от сервера
- post(url: string ) - принимает данные в виде объекта для отправки на сервер

### Класс EventEmitter
Брокер событий, позволяющий отправлять события и подписываться на них. Класс используется для связи слоя Modal и View.\
constructor() - инициализирует брокер событий\
Поля класса:
- _events - события

Методы:
- on(eventName: EventName): void - подписывает на событие с заданным именем.
- off(eventName: EventName): - отписывается от события.
- emit(eventName: string): - инициирует событие с данными.

## Слой Model (Компоненты данных)

### Класс ApiGetCards
Наследуется от класса Api, отвечает за получение данных с сервера.\
constructor(cdn: string, baseUrl: string, options?: RequestInit)
Поля:
- cdn: string: URL для доступа к контенту (например, изображениям).
- items: IProduct[]: Массив продуктов.

Методы:
- getProduct(): Promise<IProduct[]>: Получает массив продуктов с сервера.
- postOrderList(order: IOrderList, sum: number, products: string[]): - - 
- Promise<IOrderResult>: Отправляет заказ на сервер и возвращает ответ.

### Класс CardsList
Класс отвечает за управление списком карточек продуктов.\
constructor(protected events: IEvents)
Поля:
- _choiseCards: IProduct[]: Список выбранных карточек.
- checkСard: IProduct: Выбранная карточка.

Методы:
- choiseCards: IProduct[]: Геттер и сеттер для списка карточек.
- setPreview(item: IProduct): void: Устанавливает предварительный просмотр выбранного продукта и вызывает событие.

### Класс basketModel 
Класс отвечает за хранение и работу с данными в корзине выбранных пользователем.\
constructor(protected events: IEvents)
Поля:
- _basketProducts: IProduct[]: Массив товаров в корзине.

Методы:
- addProductToBasket(data: IProduct): void: Добавляет товар в корзину.
- deleteProductToBasket(item: IProduct): void: Удаляет товар из корзины.
- getCounter(): number: Возвращает количество товаров в корзине.
- getCountSumProducts(): number: Возвращает общую сумму товаров в корзине.
- clearBasketProducts(): void: Очищает корзину.
- isProductInBasket(): boolean: Проверят наличие товара в корзине.

### Класс orderModel
Класс отвечает за управление данными формы заказа.\
constructor(protected events: IEvents)
Поля:
- payment: string: Способ оплаты.
- email: string: Email.
- phone: string: Телефон.
- address: string: Адрес.
- formErrors: CheckErrors: Ошибки валидации формы.

Методы:
- setInputs(field: string, value: string): void: Устанавливает значения полей формы и проверяет их на валидность.
- validateCheck(): boolean: Проверяет, заполнены ли все необходимые поля.
- getOrderProduct(): object: Возвращает данные заказа.

## Слой View (Компоненты отображения)

### Page
Класс отвечает за представление страницы приложения.\
constructor(protected events: IEvents)
Поля:
- _catalog: HTMLElement: Элемент каталога продуктов.
- _wrapper: HTMLElement: Обёртка для страницы.
- _basket: HTMLElement: Элемент корзины.
- _basketCounter: HTMLElement: Элемент для отображения количества товаров в корзине.

Методы:
- set productItem(item: HTMLElement): void: Добавляет новый товар в каталог.
- set locked(value: boolean): void: Блокирует (или разблокирует) возможность взаимодействия со страницей.
- productListBasket(value: number): void: Обновляет отображение количества товаров в корзине.

### ProductView
Класс для отображения карточек продуктов.\
constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IChoiseProduct)
Поля:
- _cardElement: HTMLElement: Элемент карточки продукта.
- _cardCategory: HTMLElement: Элемент с категорией продукта.
- _cardTitle: HTMLElement: Элемент с названием продукта.
- _cardImage: HTMLImageElement: Элемент с изображением продукта.
- _cardPrice: HTMLElement: Элемент с ценой продукта.
- _colors: Объект для хранения стилей категорий.

Методы :
- render(data: IProduct): HTMLElement: Отображает данные продукта и возвращает элемент карточки.

### ProductPreview (наследник ProductView)
Класс для отображения превью карточки продукта с дополнительными данными.\
constructor(template: HTMLTemplateElement, events: IEvents, actions?: IChoiseProduct)
Поля:
- description: HTMLElement: Элемент с описанием продукта.
- button: HTMLElement: Кнопка для добавления продукта в корзину.

Методы :
- render(data: IProduct): HTMLElement: Отображает данные продукта, включая подробное описание и кнопку.

### Basket
Класс для управления корзиной покупок.\
constructor(template: HTMLTemplateElement, protected events: IEvents)
Поля:
- basket: HTMLElement: Элемент корзины.
- title: HTMLElement: Заголовок корзины.
- basketList: HTMLElement: Список товаров в корзине.
- button: HTMLButtonElement: Кнопка оформления заказа.
- basketPrice: HTMLElement: Элемент отображения общей суммы.

Методы:
- set items(items: HTMLElement[]): void: Обновляет список товаров в корзине.
- productSumBasket(sumAll: number): void: Устанавливает общую сумму в корзине.
- render(): HTMLElement: Возвращает элемент корзины.

### BasketItem
Класс для представления одного товара в корзине.\
constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IChoiseProduct)
Поля:
- basketItem: HTMLElement: Элемент одного товара в корзине.
- index: HTMLElement: Индекс товара.
- title: HTMLElement: Название товара.
- price: HTMLElement: Цена товара.
- buttonDelete: HTMLButtonElement: Кнопка для удаления товара из корзины.

Методы:
- render(data: IProduct, item: number): HTMLElement: Отображает данные товара и возвращает элемент товара в корзине.

### OrderFirstForm и OrderSecondForm
Классы для управления формами заказа, одна для выбора платежа и адреса, другая для ввода контактной информации.\
constructor(template: HTMLTemplateElement, protected events: IEvents)
Поля:
- firstForm / secondForm: HTMLFormElement: Элемент формы.
- buttonAll: HTMLButtonElement[]: Массив кнопок.
- buttonSubmit: HTMLButtonElement: Кнопка отправки.
- checkErrors: HTMLElement: Элемент для отображения ошибок.

Методы :
- render(): HTMLElement: Возвращает элемент формы.

### Класс Modal
Класс для управления модальными окнами.\
constructor(modalContainer: HTMLElement, protected events: IEvents)
Поля:
- modalContainer: HTMLElement: Элемент контейнера для модального окна.
- closeButton: HTMLButtonElement: Кнопка для закрытия модального окна.
- _content: HTMLElement: Контент модального окна.

Методы:
- set content(value: HTMLElement): void: Устанавливает контент для отображения в модальном окне.
- open(): void: Открывает модальное окно.
- close(): void: Закрывает модальное окно.
- render(): HTMLElement: Возвращает элемент модального окна.

### Класс Success
Класс отображает успешное оформление заказа.\
constructor(template: HTMLTemplateElement, protected events: IEvents)

Поля:
- success: HTMLElement: Элемент успешного оформления.
- description: HTMLElement: Элемент для описания успешного оформления.
- button: HTMLButtonElement: Кнопка закрытия окна успеха.

Методы:
- render(total: number): HTMLElement: Отображает сообщение об успешном оформлении заказа.

## Слой коммуникаций
### Класс AppApi
Принимет в конструктор экземпляр класса Api и представляет методы реализующие
взаимодействие с бэкендом сервера.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле
`index.ts`, выполняющий роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью событий и 
обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

"Список всех событий, которые могут генерироваться в системе"\
`getCards:receive` - получение карточек с товаром\
`card:select` - изменения массива карточек\
`basket:open` - открытие модального окна с корзиной\
`basket:basketDelete` - удаление товара в корзине\
`order:open` - открытие модального окна для заполнения адреса и способа оплаты\
`order:paymentCheck` - проверка на валидность кнопки выбора оплаты\
`order:changeAddress` - изменение данных адреса в форме отправки заказа\
`checkErrors:filds` - валидация поля адреса\
`contacts:open` - открытие модального окна для заполнения почты и телефона\
`contacts:open` - открытие модального окна для заполнения почты и телефона\
`contacts:changeInput` - отслеживание изменений\
`checkErrors:change` - валидация полей почты и телефона\
`success:close` - закрытие модального окна при успешном завершении\
`modal:open` - блокировка прокрутки\
`modal:close` - разблокировка прокрутки\    

