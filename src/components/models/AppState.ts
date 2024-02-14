import _ from "lodash";
import { IAppState, ILot, IOrder, IOrderForm } from "../../types";
import { Model } from "./Model";
import { IEvents } from "../base/events";
import { LotItem } from "./LotItem";

/**
 * Класс модели приложения
 */
class AppState extends Model<IAppState> {
    private _catalog: ILot[];
    private _order: IOrder;
    private _preview: ILot;

    /**
     * Базовый конструктор
     * @constructor
     * @param { Partial<IAppState> } data используемые моделью данные
     * @param { IEvents } events объект брокера событий
     */
    constructor(
        data: Partial<IAppState>,
        events: IEvents
    ){
        super(data, events);
    }

    set catalog(items: ILot[]){
        this._catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    get catalog(): ILot[] {
        return this._catalog;
    }

    get basket(): ILot[] {
        return this._catalog.filter(item => item.isOrdered);
    }

    get order(): IOrder {
        return this._order;
    }

    get preview(): ILot {
        return this._preview;
    }

    set preview(value: ILot) {
        this._preview = value;
        this.emitChanges('preview:changed', this.preview);
    }

    /**
     * Проверяем что лот находится в каталоге
     * @param { ILot } item исследуемый лот
     * @returns признак наличия лота в корзине
     */
    isLotInBasket(item: ILot): boolean {
        return item.isOrdered;
    }

    /**
     * Очищаем корзину
     */
    clearBasket(): void {
        this.basket.forEach(lot => lot.removeFromBasket());
    }

    /**
     * Получить общую стоимость товаров в корзине
     * @returns стоимость корзины
     */
    getTotalAmount(): number {
        return this.basket.reduce(
            (a, c) => a + c.price,
            0
        );
    }

    /**
     * Получить количество товаров в корзине
     * @returns количество товаров в корзине
     */
    getBasketLength(): number {
        return this.basket.length;
    }
}

export { AppState }