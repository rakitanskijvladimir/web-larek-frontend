import { IProduct } from "../../types";
import { IEvents } from "../base/events";

// данные полученные при выборе конкретного товара
export interface ICardsList {
    choiseCards: IProduct[];
    checkСard: IProduct;
    setPreview(item: IProduct): void;
  }
  
  export class CardsList implements ICardsList {
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