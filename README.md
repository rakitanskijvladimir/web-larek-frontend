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

Интерфейс со свойствами карточки

```
export interface IProduct {  
	id: string;           
	description: string;  
	image: string;        
	title: string;        
	category: string;     
	price: number | null;        
}
```

Интерфейс корзины с содержимым и ценой на товар

```
export interface IProductBasket { 
    items: string[];
	total: number;  
}
```

Интерфейс оформления заказа 

```
export interface IOrderRequest { 
    payment: PayForm;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;      
}
```

Интерфейс завершенного результата для отправки

```
export interface IOrderResult {
	id: string;
	total: number;
}
```

Тип способа оплаты 

```
export type PayForm = 'cash' | 'card';
```

Тип заказа для отправки на сервер

```
export type TOrderRequest = Omit<IOrderRequest, 'items' | 'total'>
```

Тип формы оплаты и контактов

```
export type TOrderFirstForm = Pick<IOrderRequest, 'payment' | 'address'>;
```

Тип формы контактов

```
export type TOrderSecondForm = Pick<IOrderRequest, 'email' | 'phone'>;
```

## Архитертура приложения

Код приложения разделен на слои которые отвечают парадигме MVP:\
-слой представления отвечает на отображение данных на странице\
-слой даннных, отвечает на хранение и изменение данных\
-слой презентер отвечает за связь представления и данные

### Базовый код

### Слой данных 
#### Класс IProduct 
Класс отвечает за хранение и логику работы с данными карточек полученных с сервера на основной странице сайта. Конструктор класса принимает брокер событий\
В полях класса хранятся следующие данные:
- id: string - содержит индивидуальный номер каждой карточки
- description: string - содержит описание товара
- image: string - содержит картинку товара
- title: string - содержит название(заголовок) карточки
- category: string - содержит категорию товара
- price: number - содержит цену товара

#### Класс IProductBasket
Класс отвечает за хранение и логику работы с данными товара в корзине.\
В полях класса хранятся следующие данные:
- items: string[] - массив карточек товара
- total: number - итоговая сумма заказа

Методы:
- addCard(itemId): void - добавляет товар в корзину
- deleteCard(itemId): void - удаляет товар из корзины

#### Класс IOrderRequest
Класс отвечает за хранение, проверку и отправку данных заполненных пользователем\
В полях класса хранятся следующие данные:
- phone: string - телефон пользователя
- email: string - email пользователя
- address: string - адрес пользователя

Методы:
- addPhone(): void - добавляет номер телефона пользователя
- addEmail(): void - добавляет email пользователя
- addAddress(): void - добавляет адрес доставки пользователя
- checkValidation(data: Record<typeof TOrderRequest, string>): boolean - проверяет данные пользователя на валидность 

### Слой отображения
Все классы отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Page
Отображает главную страницу.
- constructor(container: HTMLElement, events: IEvents) - принимает DOM-элемент на станице и брокер событий.
В полях класса хранятся следующие данные:
- _catalog: string - элемент отвечающий за перечень данных товара.
- _counter: number - элемент отвечающий за сумму выбранного товара.
- _basket: string - элемент отвечающий за наполнение корзины товаром.

#### Класс Product
Отображает карточку товара. 
- constructor(container: HTMLElement) - принимает DOM-элемент карточки.\
В полях класса хранятся следующие данные:
- _id: string - содержит индивидуальный номер каждой карточки
- _description: string - содержит описание товара
- _image: string - содержит картинку товара
- _title: string - содержит название(заголовок) карточки
- _category: string - содержит категорию товара
- _price: number - содержит цену товара 

Методы:
- setData(cardData: IProduct, id: string): void - заполняет атрибуты элементов карточки данными
- setDescription(cardData: IProduct, description: string): void - заполняет данные описание товара
- setImage(cardData: IProduct, image: string): void - заполняет данные картинку товара
- setTitle(cardData: IProduct, title: string): void - заполняет данные название(заголовок) карточки
- setCategory(cardData: IProduct, category: string): void - заполняет данные категорию товара
- setPrice(cardData: IProduct, price: number): void - заполняет данные цену товара

#### Класс ProductBasket
Отображает корзину.
- constructor(events: IEvents) - в конструктор класса передается DOM. Принимает брокер событий.\
В полях класса хранятся следующие данные:
- _id: string - содержит индивидуальный номер каждой карточки
- _title: string - содержит название (заголовок) карточки
- _price: number - содержит цену товара

Методы:
- setData(cardData: IProduct, id: string): void - заполняет атрибуты элементов карточки данными
- setTitle(cardData: IProduct, title: string): void - заполняет данные название(заголовок) карточки
- setPrice(cardData: IProduct, price: number): void - заполняет данные цену товара

#### Класс Modal
Отображает модальное окно. 
- constructor(selector: string, events: IEvents) - принимает контейнер с формой и брокер событий.\
В полях класса хранятся следующие данные:
- _modal: HTMLElement - элемент модального окна
- _events: IEvents - брокер событий

Методы:
- openModal.
- closeModal.

#### Класс OrderFirstForm
Отображает и реализует форму оплаты и контакта.
- constructor(container: HTMLElement, events: IEvents) - принимает контейнер с формой и брокер событий.\
В полях класса хранятся следующие данные:
- _payFormCash: string - кнопка для выбора оплаты при получении 
- _payFormCard: string - кнопка для выбора оплаты картой
- _address: string - поле для заполнения адреса 

Методы:
- addAddress(address: string) - добавляет значение поля адрес

#### Класс OrderSecondForm
Отображает и реализует форму контактов.
- constructor(container: HTMLElement, events: IEvents) - принимает контейнер с формой и брокер событий.\
В полях класса хранятся следующие данные:
- _email: string - поле для заполнения электронной почты       
- _phone: string - поле для заполнения телефона  

Методы:
- addEmail(email: string) - добавляет значение поля электронной почты
- addPhone(phone: string) - добавляет значение поля телефона

### Класс checkForm:
Отображает корректную реализация заполненных инпутов.

Методы:
- showInputError - показывает текст ошибки
- hideInputError - скрывает  текст ошибки

#### Класс Success
Отображает успешное оформление заказа. 
- constructor(container: HTMLElement, events: IEvents) - принимает контейнер с формой и брокер событий.\
В полях класса хранятся следующие данные:
- _price: number - содержит цену товара

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









