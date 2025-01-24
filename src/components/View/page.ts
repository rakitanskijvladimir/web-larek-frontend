import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

interface IPage {
  productListBasket(value: number): void;
}

export class Page implements IPage {
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;
  protected _basketCounter: HTMLElement;

  constructor(protected events: IEvents) {

    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');
    this._basketCounter = document.querySelector('.header__basket-counter');
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set productItem(item: HTMLElement) {
    this._catalog.append(item);
  }

  set locked(value: boolean) {
    if (value) {
        this._wrapper.classList.add('page__wrapper_locked');
    } else {
        this._wrapper.classList.remove('page__wrapper_locked');
    }
  }

  productListBasket(value: number) {
    this._basketCounter.textContent = String(value);
  }
}