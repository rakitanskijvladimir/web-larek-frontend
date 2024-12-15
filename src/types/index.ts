// Интерфейс ответа от сервера (карточки)
interface IGetProductResponse { // получаю ответ от сервера
	total: number;              
    items: IProduct[];          
}

// Интерфейс карточки 
interface IProduct {  // описание объекта продукт, выводим для отображения на экране
	id: string;           
	description: string;  
	image: string;        
	title: string;        
	category: string;     
	price: number;        
}

// Интерфейс корзина (модальное окно)
interface IProductBasket { // объект продукта в корзине выбранный пользователем
    id: string;     
    title: string;  
    price: number;  
}

// Интерфейс формы отправки (модальное окно)
interface IOrderBody { // параметры запроса postOrder для передачи в body
    payment?: boolean,      
    email?: string,         
    phone?: string,        
    address?: string,       
    total?: number,        
    items: string[];       
}

// Интерфейс для модели данных карточек
interface IProductData { // данные выбранной карточки
    cards: IProduct[];  
    preview: string | null  
    addCard(card: IProduct): void;
    deleteCard(cardId: string, payment: Function | null): void;
    // getCard(cardId: string): IProduct;
}

// Интерфейс для корзины (модальное окно)
interface IProductBasketData {
    getProductList(): TProductBasketList;
}

// Интерфейс для формы отправки (модальное окно) 
interface IOrderBodyData {
    onSubmit(cardId:string): void;
    checkValidation(data: Record<keyof TGetProductData, string>): boolean;
}


type TGetProductData = Pick<IGetProductResponse, 'total' | 'items'> 

type TProductItems = Pick<IProduct, 'id' | 'description' | 'image' | 'title' | 'category' | 'price'> 

type TProductBasketList = Pick<IProductBasket, 'id' | 'title' | 'price'> 

type TOrderBodyForm = Pick<IOrderBody, 'payment' | 'email' | 'phone' | 'address' | 'total' | 'items'> 