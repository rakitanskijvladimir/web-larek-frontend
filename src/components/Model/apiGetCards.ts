import { ApiListResponse, Api } from '../base/api'
import { IOrderList, IOrderResult, IProduct } from '../../types';

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
  postOrderList(order: IOrderList, sum: number, products: string[]): Promise<IOrderResult> {
    return this.post(`/order`, {...order, items: products, total: sum }).then((data: IOrderResult) => data);
  }
}
