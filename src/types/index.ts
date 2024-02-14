// Model-интерфейсы

// Доступные категории карточек
type ILotCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Интерфейс карточки из Postman
interface ILotItem {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ILotCategory;
    price: number;
}

// Интерфейс отслеживания карточки
interface ILarek {
    isOrdered: boolean;
    placeInBasket:() => void;
    removeFromBasket:() => void;
}

// Интерфейс карточки в приложении
type ILot = ILotItem & ILarek;

// Доступные категории платежей
type IPaymentType = 'online' | 'offline' | '';

// Интерфейс формы оплатой и доставкой
interface IOrderDeliveryForm {
    payment: IPaymentType;
    address: string;
}

// Интерфейс формы с контактной информацией
interface IOrderContactsForm {
    email: string;
    phone: string;
}

// Полный интерфейс формы
type IOrderForm = IOrderDeliveryForm & IOrderContactsForm

// Интерфейс заказа
interface IOrder extends IOrderForm{
    items: ILot[];

    validateOrder(): void;
    clearOrder(): void;
    postOrder(): void;
}

export type IFormErrors = Partial<Record<keyof IOrderForm, string>>;


type CatalogChangeEvent = {
    catalog: ILot[]
}



type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>;

interface IAppState {  // Модель приложения
    catalog: ILot[];  // доступные лоты
    basket: ILot[];  // лоты в корзине
    order: IOrder;  // заказ
    preview: ILot;  // лот для модального окна
    isLotInBasket(item: ILot): boolean;  // проверка находится ли лот в корзине
    clearBasket(): void;  // очищаем корзину
    getTotalAmount(): number;  // получить стоимость корзины
    getBasketLength(): number;  // получить количество товаров в корзине
}

interface IOrderResult {
    id: string
}

// View-интерфейсы
/**
 * Интерфейс страницы
 */
interface IPage {
    counter: number;
    galery: HTMLElement[];
    locked: boolean;
}

/**
 * Интерфейс данных модального окна
 */
interface IModalData {
    content: HTMLElement;
}

export {
    ILotCategory, ILotItem, ILarek, ILot,
    IPaymentType, IOrderDeliveryForm, IOrderContactsForm, IOrderForm, IOrder,
    IBasketItem, IAppState, IOrderResult, CatalogChangeEvent,
    IPage, IModalData
}