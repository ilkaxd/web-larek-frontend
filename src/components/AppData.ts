import _ from "lodash";
import { FormErrors, IAppState, ILot, IOrder, LotCategory } from "../types";
import { Model } from "./base/Model";

export class LotItem extends Model<ILot> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: LotCategory;
    datetime: string;
    price: number;
}

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: LotItem[];
    loading: boolean;
    order: IOrder = {
        payment: '',
        address: '',
        email: "",
        phone: "",
        items: [],
    }
    preview: string | null;
    formErrors: FormErrors = {}

    toggleOrderedLot(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedLot(id, false);
        });
    }

    getTotal() {
        return this.order.items.reduce(
            (a, c) => a + this.catalog.find(it => it.id === c).price,
            0
        );
    }

    setCatalog(items: ILot[]){
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    
    setPreview(item: LotItem){
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (this.order.payment === '') {
            errors.email = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.email = 'Необходимо указать адрес доставки';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.email = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}