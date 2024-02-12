import { ILot, ILotCategory } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "./Model";

/**
 * Класс модели карточки
 */
class LotItem extends Model<ILot> {
    private _id: string;
    private _title: string;
    private _description: string;
    private _image: string;
    private _category: ILotCategory;
    private _price: number;
    private _isOrdered: boolean;

    /**
     * Базовый конструктор
     * @constructor
     * @param { ILot } item - считанный объект лота
     * @param { IEvents } events - объект брокера событий
     */
    constructor(
        item: ILot,
        events: IEvents
    ){
        super(item, events);
        this._isOrdered = false;
    }

    get id(){
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get title(){
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get description(){
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get image(){
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get category(){
        return this._category;
    }

    set category(value: ILotCategory) {
        this._category = value;
    }

    get price(){
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }

    get isOrdered(){
        return this._isOrdered;
    }

    set isOrdered(value: boolean){
        this._isOrdered = value;
    }
}

export { LotItem }