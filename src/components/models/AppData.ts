import _ from "lodash";
import { FormErrors, IAppState, ILot, IOrder, CatalogChangeEvent, PaymentType} from "../../types";
import { Model } from "./Model";
import { IEvents } from "../base/events";
import { LotItem } from "./LotItem";

/**
 * Класс модели приложения
 */
class AppState extends Model<IAppState> {
    private _catalog: ILot[];
    private _loading: boolean;
    private _order: IOrder;
    private _preview: string | null;
    private _formErrors: FormErrors;

    constructor(
        data: Partial<IAppState>,
        events: IEvents
    ){
        super(data, events);
        this._formErrors = {};
    }

    set catalog(items: ILot[]){
        this._catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    get catalog(){
        return this._catalog;
    }

    get basket(){
        return this._catalog.filter(item => item.isOrdered);
    }

    // toggleOrderedLot(id: string, isIncluded: boolean): void {
    //     // if (isIncluded) {
    //     //     this.order.items = _.uniq([...this.order.items, id]);
    //     // } else {
    //     //     this.order.items = _.without(this.order.items, id);
    //     // }
    // }

    // clearBasket(): void {
    //     // this.order.items.forEach(id => {
    //     //     this.toggleOrderedLot(id, false);
    //     // });
    // }

    // getTotal(): number {
    //     return 0;
    //     // return this.order.items.reduce(
    //     //     (a, c) => a + this.catalog.find(it => it.id === c).price,
    //     //     0
    //     // );
    // }

    // isLotInBasket(item: ILot): boolean{
    //     return this.basket.includes(item);
    // }
    
    // setPreview(item: ILot){
    //     this.preview = item.id;
    //     this.emitChanges('preview:changed', item);
    // }

    // validateOrder(): boolean {
    //     const errors: typeof this.formErrors = {};
    //     if (this.order.payment === '') {
    //         errors.email = 'Необходимо выбрать способ оплаты';
    //     }
    //     if (!this.order.address) {
    //         errors.email = 'Необходимо указать адрес доставки';
    //     }
    //     if (!this.order.email) {
    //         errors.email = 'Необходимо указать email';
    //     }
    //     if (!this.order.phone) {
    //         errors.email = 'Необходимо указать телефон';
    //     }
    //     this.formErrors = errors;
    //     this.events.emit('formErrors:change', this.formErrors);
    //     return Object.keys(errors).length === 0;
    // }
}

export { AppState }