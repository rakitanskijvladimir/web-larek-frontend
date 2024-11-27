

// Интерфейс модели данных
interface IProduct { // описание объекта продукт, выводим для отображения на экране
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

interface IGetProductResponse { // ответ от сервера
	total: number;   // итого сколько пришло товаров
    items: IProduct[]; // массив товаров
}

interface IOrderBody { // параметры запроса postOrder для передачи в body
    payment: "online" | "offline",
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]; 
}

interface IPostOrderRequest { // ответ от сервера на запрос postOrder
    id: string,
    total: number
}


// Интерфейс API-клиента
interface IApiClient { // интерфэйс API клиента
    getProductList(): Promise<IProduct[]>
    getProductItem(id: string): Promise<IProduct>
    postOrder(order: IOrderBody): Promise<IPostOrderRequest>
}



// Интерфейс базовых классов
    interface IViewCompinent { // интерфэйс абстрактного класса
        render(): HTMLElement;
        update?(): void;
        mount(parent: HTMLElement): void;
        unmount(element: HTMLElement): void;
    }


// Интерфейс отображения
interface IProductView { // интер для отображение элемента на главной странице
    id: string
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

interface IProductModal extends IProductView { // наследуею от IProductView и добавляю метод
    onSubmit(id:string): void;
}

type TProductBasket = Pick<IProductView, 'price' | 'title' | 'id'> // оставляю из IProductView нужные поля



