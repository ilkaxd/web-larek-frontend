import _ from "lodash";
import { FormErrors, IAppState, IBasketItem, ILot, IOrder, LotCategory } from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
    catalog: LotItem[]
}

export class LotItem extends Model<ILot> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: LotCategory;
    isAvailable: boolean;
    price: number;
}

export class AppState extends Model<IAppState> {
    catalog: ILot[];
    basket: ILot[];
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

    toggleOrderedLot(id: string, isIncluded: boolean): void {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    clearBasket(): void {
        this.order.items.forEach(id => {
            this.toggleOrderedLot(id, false);
        });
    }

    getTotal(): number {
        return this.order.items.reduce(
            (a, c) => a + this.catalog.find(it => it.id === c).price,
            0
        );
    }

    setCatalog(items: ILot[]): void{
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    
    setPreview(item: ILot){
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateOrder(): boolean {
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