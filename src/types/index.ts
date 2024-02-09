type LotCategory = 'soft' | 'hard' | 'other' | 'additional' | 'button';
type PaymentType = 'online' | 'offline' | '';

interface ILarek {
    category: LotCategory;
    isAvailable: boolean;
    price: number;
}

interface ILotItem {
    id: string;
    title: string;
    description: string;
    image: string;
}

type ILot = ILarek & ILotItem;

type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>;

interface IAppState {
    catalog: ILot[];
    basket: IBasketItem[];
    loading: boolean;
    order: IOrder | null;
    preview: string | null;    
}

interface IOrderDeliveryForm {
    payment: PaymentType;
    address: string;
}

interface IOrderContactsForm {
    email: string;
    phone: string;
}

type IOrderForm = IOrderDeliveryForm & IOrderContactsForm

interface IOrder extends IOrderForm{
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

interface IOrderResult {
    id: string
}

export { LotCategory, PaymentType, ILarek, ILotItem, ILot, IBasketItem, IAppState, IOrderDeliveryForm, IOrderContactsForm, IOrderForm, IOrder, IOrderResult }