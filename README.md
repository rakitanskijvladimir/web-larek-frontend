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


# Описание базовых классов, их предназначение и функции

абстрактный class viewComponent //
    будет отвечать за монтирование элементов в DOM и за обновление (удалили товар, надо обновить корзину) 
    Методы:
        abstract render(): HTMLElement для монтирования элемента
        update?(): void - для обновления элемента или компонентами
/**
* базовый метод для монтирования в DOM.
* @param parent -  элемент в который нужно дабавить компонент 
*/

mount(parent: HTMLElement): void

/**
* базовый метод для удаления из DOM.
* @param element - ссылка на элемент
*/

unmount(element: HTMLElement): void



class formPay // наследуется от viewComponent
Назначение: обеспечивет работу форм,
Зона ответственности: собирает информацию полей формы и отправляет данные на сервер.

Конструктор:
    onSubmit: функция которая вызовется при submit формы, с типом ({[string]: string})=>void

Поля класса:
    this.onSubmit хранит переданную в конструктор функцию ({[string]: string})=>void
    this.imputs хранит информацию о наполнении содержимым полей {[string]: string}

Методы класса:
    setInputValues - метод получает во входящие параметры объект события event и изменяет поле this.inputs
    onSubmit: ()=>{} метод вызывается при submit формы вызывает this.onSubmit и передает ей в параметры this.inputs
   

class basket // наследуется от viewComponent
Назначение: собирает, хранит выбранный товар 
Зона ответственности: отвечает за добавление, удаление и отображение выбранных товаров

Конструктор:
    this.products: поле в котором хранятся выбранные продукты, и инициализируется []

Методы класса:
    addProduct - метод добавления товара в хранилища  
    getProducts - метод подключения всех товаров в корзине
    removeProduct - метод удаления товара



# Описание компонентов, их функций и связей с другими компонентами

    компонент главная страница 
        // является основой для страницы создаваемого сайта, предназначена для ознакомления с товаром представленым на странице, возможностью выбрать товар и сделать запрос для покупки товара. 
        Состоит из шапки страницы (header) темно-синего цвета и основной части (content/main) синего цвета. 
    
    компонент шапка (header)
        в шапке указаны лейбл и логотип корзинки в виде кнопки. При клике на логотип открывается модальное окно для возможности выбрать и осуществить заказ.
        
    компонент основная часть (content/main)  
        в основной части страницы указаны 10 элементов
        // содержит список элементов (таблицу)
    
    компонент элемент (Item) квадратной формы с округленными углами, темно-синего цвета.
      содержит  данные: 
        компонент категория товара
        название товара - визуализирована в виде текста, предназначена для выбора товара пользователем.
        картинка товара для визуального ознакомления и представления товара.
        цена товара - визуализированна в виде текста их цифр.
    Метод:
        mount('basket': string) - получет параметры  индификатор template и отображает данные в том или ином виде.


    компонент категория товара // предназначен для ознакомления с конкретными данными на странице, имеет определенное количество значений, может обозначаться разными цветами, в зависимости от выбранного действия. Визуализирована в виде цветной кнопки, предназначенная для определения вида товара.
        

    компонент попап (модальное окно)  // всплывающий информационный блок
        -задний фон (overlay) - серый полупрозрачный фон который блоктрует доступы к основной странице
        -тело мод окна - условный квадрат с округлениями темно-синего цвета, в который мы можем передавать необходимую структуру
        
            

    компонент заказ оформлен // предназначен для ознакомления/уведомления пользователя с завершением операции
        -логотип
        -заголовок
        -полезная информация

    
    компонент кнопка // предназначена для отправки или совершения определенных действий (отправить, добавить, купить, закрыть), является самостоятельным компонентом которая разные вариации цветов, оттенков и размеров.

    компонент корзина // имеет список товарав со стоимостью и возможностью удаления товаров, кнопку офорить заказ и общую стоимость товара(ов)

