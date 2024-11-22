

// Интерфейс API-клиента
interface Iclient {
    url: string;
    getUser: string;
    deleteUser: string;
}
type Tclient = Iclient[];

// Интерфейс модели данных
interface Iproduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
type Tproducts = Iproduct[];

// Интерфейс отображений
interface IUser {
    id: number;
    name: string;
}
type TUser = IUser[];

// Интерфейс базовых классов
interface IformPay {
    name: string;
    address: string;
    email: string;
    tel: number;
}
type TformPay = IformPay[];


interface Ibasket {
    name: string;
    cost: number;
    delete: boolean;
}
type Tbasket = Ibasket[];


interface Ipage {
    name: string;
}
type Tpage = Ipage[];









