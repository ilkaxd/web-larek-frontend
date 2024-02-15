// Model-интерфейсы

/**
 * Доступные категории карточек
 */ 
type ILotCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

/**
 * Интерфейс лота из Postman
 * @property { string } id - идентификатор лота
 * @property { string } title - заголовок лота
 * @property { string } description - описание лота
 * @property { string } image - полный путь до файла картинки лота
 * @property { ILotCategory } category - категория лота
 * @property { number } price - цена лота
 */
interface ILotItem {
    id: string;  // идентификатор лота
    title: string;  // заголовок лота
    description: string;  // описание лота
    image: string;  // полный путь до файла картинки лота
    category: ILotCategory;  // категория лота
    price: number;  // цена лота
}

/**
 * Интерфейс отслеживания карточки
 * @property { boolean } isOrdered - признак включения в заказ
 * @method placeInBasket - добавляем лот в корзину
 * @method removeFromBasket - удаляем лот из корзины
 */
interface ILarek {
    isOrdered: boolean;  // признак включения в заказ
    placeInBasket:() => void;  // добавляем лот в корзину
    removeFromBasket:() => void;  // удаляем лот из корзины
}

/**
 * Интерфейс карточки в приложении
 */
type ILot = ILotItem & ILarek;


// type IPaymentType = 'online' | 'offline' | ''; // вариант из postman
/**
 * Доступные категории платежей
 * TODO: лучше сделать аналогичные data-атрибуты в index.html, сейчас подгружается из классов
 */
type IPaymentType = 'card' | 'cash' | '';  // лучше добавить атрибут в index.html

/**
 * Интерфейс формы оплатой и доставкой
 * @property { IPaymentType } payment - способ оплаты
 * @property { string } address - адрес доставки
 */
interface IOrderDeliveryForm {
    payment: IPaymentType;  // способ оплаты
    address: string;  // адрес доставки
}

/**
 * Интерфейс формы с контактной информацией
 * @property { string } email - почта для связи
 * @property { string } phone - телефон для связи
 */
interface IOrderContactsForm {
    email: string;  // почта для связи
    phone: string;  // телефон для связи
}

/**
 * Полный интерфейс формы
 */
type IOrderForm = IOrderDeliveryForm & IOrderContactsForm

/**
 * Интерфейс API
 * @property { string[] } items - индексы покупаемых лотов
 * @property { number } total - общая стоимость заказа
 */
interface IOrderAPI extends IOrderForm {
    items: string[];  // индексы покупаемых лотов
    total: number;  // общая стоимость заказа
}

/**
 * Полный интерфейс формы
 * @property { ILot[] } items - объекты лотов в корзине
 * @method validateOrder - проверка полей формы
 * @method clearOrder - обнуляем поля заказа
 * @method validatePayment - проверяем способ оплаты
 * @method validateAddress - проверяем адрес доставки
 * @method validateEmail - проверяем почту
 * @method validatePhone - проверяем телефон
 * @method postOrder - завершаем заказ
*/
interface IOrder extends IOrderForm{
    items: ILot[];  // объекты лотов в корзине
    validateOrder(): void;  // проверка полей формы
    clearOrder(): void;  // обнуляем поля заказа
    validatePayment(): void;  // проверяем способ оплаты
    validateAddress(): void;  // проверяем адрес доставки
    validateEmail(): void;  // проверяем почту
    validatePhone(): void;  // проверяем телефон
    postOrder(): void;  // завершаем заказ
}

export type IFormErrors = Partial<Record<keyof IOrderForm, string>>;


type CatalogChangeEvent = {
    catalog: ILot[]
}



type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>;

/**
 * Интерфейс модели всего приложения
 * @property {ILot[]} catalog - список доступных лотов
 * @property {ILot[]} basket - список лотов в корзине
 * @property {IOrder} order - объект заказа
 * @property {ILot} preview - лот для модального окна
 * @method isLotInBasket - проверяем, что лот находится в каталоге
 * @method clearBasket - очищаем корзину
 * @method getTotalAmount - получить общую стоимость товаров в корзин
 * @method getBasketIds - получить список индексов в корзине
 * @method getBasketLength - получить количество товаров в корзине
 * @method initOrder - инициализируем объект заказа
 */
interface IAppState {  // Модель приложения
    catalog: ILot[];  // доступные лоты
    basket: ILot[];  // лоты в корзине
    order: IOrder;  // заказ
    preview: ILot;  // лот для модального окна
    isLotInBasket(item: ILot): boolean;  // проверка находится ли лот в корзине
    clearBasket(): void;  // очищаем корзину
    getTotalAmount(): number;  // получить стоимость корзины
    getBasketIds(): number;  // получить список индексов в корзине
    getBasketLength(): number;  // получить количество товаров в корзине
    initOrder(): IOrder;  // инициализируем объект заказа
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
    IBasketItem, IAppState, CatalogChangeEvent,
    IPage, IModalData,
    IOrderAPI
}