
// Интерфейс карточки 
export interface IProduct {  
	id: string;           
	description: string;  
	image: string;        
	title: string;        
	category: string;     
	price: number | null;        
}

// Интерфейс корзины
export interface IProductBasket { 
    items: string[];
	total: number;  
}

// Интерфейс формы отправки 
export interface IOrderRequest { 
    payment: PayForm;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;      
}
// Интерфейс завершенного результата
export interface IOrderResult {
	id: string;
	total: number;
}

export type PayForm = 'cash' | 'card';

export type TOrderRequest = Omit<IOrderRequest, 'items' | 'total'>

export type TOrderFirstForm = Pick<IOrderRequest, 'payment' | 'address'>;

export type TOrderSecondForm = Pick<IOrderRequest, 'email' | 'phone'>;























