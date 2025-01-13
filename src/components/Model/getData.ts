import { ApiListResponse, Api } from '../base/api'
import { IOrderList, IOrderResult, IProduct } from '../../types';
import { IEvents } from "../base/events";

// получение данных о товарах с сервера
export interface IApiGetCards {
  cdn: string;
  items: IProduct[];
  getProduct: () => Promise<IProduct[]>;
  postOrderList: (order: IOrderList) => Promise<IOrderResult>;
}

export class ApiGetCards extends Api {
  cdn: string;
  items: IProduct[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // получаю массив товара с сервера
  getProduct(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // получаю ответ от сервера заказу
  postOrderList(order: IOrderList): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}

// данные полученные при выборе конкретного товара
export interface IApiChoiseCards {
  choiseCards: IProduct[];
  checkСard: IProduct;
  setPreview(item: IProduct): void;
}

export class ApiChoiseCards implements IApiChoiseCards {
  protected _choiseCards: IProduct[];
  checkСard: IProduct;

  constructor(protected events: IEvents) {
    this._choiseCards = []
  }

  set choiseCards(data: IProduct[]) {
    this._choiseCards = data;
    this.events.emit('getCards:receive');
  }

  get choiseCards() {
    return this._choiseCards;
  }

  setPreview(item: IProduct) {
    this.checkСard = item;
    this.events.emit('modalCard:open', item)
  }
}