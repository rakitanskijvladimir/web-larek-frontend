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

# Данные и типы данных используемые в приложении

```
// Интерфейс запроса данных

interface IDataProduct {
	catalog: IProduct[];
	preview: string;
	basket: IProductBasket[];
	order: IOrderRequest;
	total: string | number;
	loading: boolean;
  }
  ```
```
// Интерфейс карточки

interface IProduct {  
	id: string;           
	description: string;  
	image: string;        
	title: string;        
	category: string;     
	price: number | null;        
}
```
```
// Интерфейс корзины

interface IProductBasket { 
    items: string[];
	total: number;  
}
```
```
// Интерфейс формы отправки

interface IOrderRequest { 
    payment: PayForm;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;      
}
```
```
// Интерфейс завершенного результата

interface IOrderResult {
	id: string;
	total: number;
}
```
```
type PayForm = 'cash' | 'card';

type TOrderRequest = Omit<IOrderRequest, 'items' | 'total'>

type TOrderFirstForm = Pick<IOrderRequest, 'payment' | 'address'>;

type TOrderSecondForm = Pick<IOrderRequest, 'email' | 'phone'>;
```



## Архитертура приложения

Код приложения разделен на слои которые отвечают парадигме MVP:\
-слой Product - отвечает за работу и хранение данных полученных с сервера и от пользователя\
-слой View - отвечает за отображение данных для работы с пользователем и работу с событиями\
-слой Presenter - отвечает за связь данных с отображением интерфейсов при срабатывании события.

### Базовые классы

#### Класс Api
Базовый класс для отправки и получения запросов\
constructor(baseUrl: string) - принимает url сервера, по которому происходят запросы\
Поля класса:
- _baseUrl - базовый адрес полученный с сервера.\

Методы:
- handleResponse(response: Response) - принимает ответ от сервера и обрабатывает его или отклоняет промис с возникшей ошибкой
- get(url: string ) - возвращает ответ от сервера
- post(url: string ) - принимает данные в виде объекта для отправки на сервер

#### Класс EventEmitter
Брокер событий, позволяющий отправлять события и подписываться на них. Класс используется для связи слоя Product и View.\
constructor() - инициализирует брокер событий\
Поля класса:
- _events - события

Методы:
- on(eventName: EventName): void - подписывает на событие с заданным именем.
- off(eventName: EventName): - отписывается от события.
- emit(eventName: string): - инициирует событие с данными.

### Слой Product (Компоненты данных)

#### Класс ApiProduct 
Класс отвечает за данные карточек полученные с сервера на основной странице сайта. 
constructor(baseUrl: string) - принимает, передает и сохраняет входящий url запроса\
Поля класса:
- items: string[] - массив карточек товара

Методы:
- getListProduct - получаем массив объектов(карточек) с сервера.

#### Класс DataProduct 
Класс отвечает за все основные группы данных страницы и методы работы с ними.\
constructor(events: IEvents) - принимает при создании брокер событий, работает со всеми данными на странице\
Поля класса:
- _catalog — данные списка товаров пришедших с сервера
- _preview — данные товара открытого в превью
- _basket — данные товаров для добавления в корзину
- _order — данные заказа, который отправляется на сервер
- _formErrors — данные ошибок валидации

Методы:
- setCatalog — установить данные в каталог
- setPreview — установить данные в превью
- setProductBasket — установить данные в корзину
- addOrder — добавить товар в заказ
- deleteOrder — удалить товар из заказа
- setTotal — установить сумму товаров в корзине
- getTotal — получить сумму товаров в корзине
- setPayment - установить способ оплаты
- setOrderField — установить поле заказа
- setContactsField — установить поле контактов
- deleteProductBasket — удалить данные товара из корзины
- validateOrder — провести валидацию данных заказа
- validateContacts — провести валидацию данных контактов

#### Класс SaveProduct
Класс отвечает за хранение, проверку и отправку данных заполненных пользователем\
Поля класса:
- payment: string - способ оплаты
- address: string - адрес пользователя
- phone: string - телефон пользователя
- email: string - email пользователя

Методы:
- setPayment(): void - меняет способ оплаты
- addAddress(): void - добавляет адрес доставки пользователя
- addPhone(): void - добавляет номер телефона пользователя
- addEmail(): void - добавляет email пользователя
- checkValidation(data: Record<typeof TOrderRequest, string>): boolean - проверяет данные пользователя на валидность 

### Слой View (Компоненты отображения)
Все классы отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Page
Отображает главную страницу.
constructor(container: HTMLElement, events: IEvents) - принимает DOM-элемент на станице и брокер событий.\
Поля класса:
- _wrapper: string - элемент отвечающий за оформление на странице.
- _catalog: string - элемент отвечающий за перечень данных товара.
- _counter: number - элемент отвечающий за сумму выбранного товара.
- _basket: string - элемент отвечающий за наполнение корзины товаром.

#### Класс Product
Отображает данные карточки товара. 
constructor(container: HTMLElement) - принимает DOM-элемент карточки.\
Поля класса:
- _category: string - элемент категории карточки
- _title: string - элемент заголовка карточки
- _image: string - элемент картинки карточки
- _price: number - элемент цены карточки

Сеттеры:
- id - принимает и задает id карточки
- category - меняет содержимое контейнера с категорией
- title - меняет название заголовка
- image - меняет изображение и альтернативный текст в карточке
- price - меняет содержимое контейнера с ценой

#### Класс ProductPreview
Отображает данные карточки товара при выборе.
constructor(container: HTMLElement) - принимает DOM-элемент карточки.\
Поля класса:
- _description - элемент описания карточки
- _button - элемент кнопки карточки

Сеттеры:
- description - меняет содержимое описания товара
- button - меняет текст на кнопке для оформления заказа

#### Класс Basket
Отображает данные карточки товара в корзине.
constructor(events: IEvents) - принимает брокер событий.\
Поля класса:
- _list: string — элемент выбранного товара
- _sum: number — элемент цены товара
- _button: string - элемент кнопки оформления заказа

Сеттеры:
- items - меняет содержимое товаров в корзине 
- sum - меняет значение суммы товаров

#### Класс Modal
Отображает модальное окно. 
constructor(selector: string, events: IEvents) - принимает контейнер с формой и брокер событий.\
Поля класса:
- _modal: HTMLElement - элемент модального окна
- _events: IEvents - брокер событий

Методы:
- openModal.
- closeModal.

#### Класс OrderFirstForm
Отображает и реализует форму оплаты и контакта.
constructor(container: HTMLElement, events: IEvents) - принимает контейнер с формой и брокер событий.\
Поля класса:
- _payFormCash: string - кнопка для выбора оплаты при получении 
- _payFormCard: string - кнопка для выбора оплаты картой
- _address: string - поле для заполнения адреса 

Методы:
- addAddress(address: string) - добавляет значение поля адрес

#### Класс OrderSecondForm
Отображает и реализует форму контактов.
constructor(container: HTMLElement, events: IEvents) - принимает контейнер с формой и брокер событий.\
Поля класса:
- _email: string - поле для заполнения электронной почты       
- _phone: string - поле для заполнения телефона  

Методы:
- addEmail(email: string) - добавляет значение поля электронной почты
- addPhone(phone: string) - добавляет значение поля телефона

#### Класс Success
Отображает успешное оформление заказа. 
constructor(container: HTMLElement, events: IEvents) - принимает контейнер с формой и брокер событий.\
Поля класса:
- _price: number - элемент суммы товара

### Слой коммуникаций
#### Класс AppApi
Принимет в конструктор экземпляр класса Api и представляет методы реализующие
взаимодействие с бэкендом сервера.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле
`index.ts`, выполняющий роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью событий и 
обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

"Список всех событий, которые могут генерироваться в системе"\
`cards:changed` - изменения массива карточек\
`order:open` - открытие модального окна с формой редактирования данных способа оплаты и адреса\
`contacts:open` - открытие модального окна с формой редактирования данных способа эл почты и телефона\
`card:button` - выбор способа оплаты\
`cash:button` - выбор способа оплаты\
`address:input` - изменение данных адреса в форме отправки заказа\
`email:input` - изменение данных электронной почты в форме отправки заказа\
`phone:input` - изменение данных телефона в форме отправки заказа\
