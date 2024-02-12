import { ILot, IOrder, PaymentType } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "./Model";

/**
 * Класс модели заказа
 */
class Order extends Model<IOrder> {
    private _payment: PaymentType;
    private _address: string;
    private _email: string;
    private _phone: string;
    private _items: ILot[];

    constructor(
        item: IOrder,
        events: IEvents
    ){
        super(item, events);
    }

    get payment(){
        return this._payment;
    }

    set payment(value: PaymentType){
        this._payment = value;
    }

    get address(){
        return this._address;
    }

    set address(value: string){
        this._address = value;
    }

    get email(){
        return this._email;
    }

    set email(value: string){
        this._email = value;
    }

    get phone(){
        return this._phone;
    }

    set phone(value: string){
        this._phone = value;
    }

    get items(){
        return this._items;
    }

    set items(value: ILot[]){
        this._items = value;
    }

    getTotal(): void {
        
    }
}

export { Order }