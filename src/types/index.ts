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
}

// Интерфейс карточки в приложении
type ILot = ILarek & ILotItem;

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
    items: ILot[]
}

type CatalogChangeEvent = {
    catalog: ILot[]
}



type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>;

interface IAppState {
    catalog: ILot[];
    loading: boolean;
    order: IOrder | null;
    preview: string | null;

    get basket(): IBasketItem[];    
}




export type FormErrors = Partial<Record<keyof IOrder, string>>;

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