
// Интерфейс карточки полученной с сервера
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс выбранного товара по клику
export interface IChoiseProduct {
  onClick: (event: MouseEvent) => void;     
}

// интерфейс формы отправки
export interface IOrderList {
payment: string;
address: string;
phone: string;
email: string;
}

// Интерфейс завершенного результата
export interface IOrderResult {
  id: string;
  total: number;
}

// Проверка формы на ошибки
export type CheckErrors = Partial<Record<keyof IOrderList, string>>;

