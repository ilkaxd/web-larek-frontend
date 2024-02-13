import { ILot, ILotCategory } from "../../types";
import { ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

class Card extends Component<ILot> {
    private _category: HTMLElement;
    private _title: HTMLElement;
    private _image?: HTMLImageElement;
    private _description?: HTMLElement;
    private _button?: HTMLButtonElement;
    private _price?: HTMLElement;

    private _categoryMap: Record<ILotCategory, string> = {
        'софт-скил': 'soft',
        'другое': 'other',
        'дополнительное': 'additional',
        'кнопка': 'button',
        'хард-скил': 'hard'
    } 

    constructor(
        protected blockName: string, container: HTMLElement,
        events: IEvents,
        actions?: ICardActions,
    ){
        super(container, events);

        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container)
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._price = container.querySelector(`.${blockName}__price`);

        if (actions?.onClick){
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: ILotCategory) {
        this.setText(this._category, value);

        this._category.className = "";
        const mainClass = `${this.blockName}__category`;
        const additionalClass = this._categoryMap[value];
        this._category.classList.add(mainClass, `${mainClass}_${additionalClass}`);
    }

    // set id(value: string) {
    //     this.container.dataset.id = value;
    // }

    // get id(): string {
    //     return this.container.dataset.id || '';
    // }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number){
        this.setText(this._price, value ? `${formatNumber(value)} синапсов` : "Бесценно");
    }
}

export type CatalogItemStatus = {
    // status: LotStatus,
    label: string
};

export class CatalogItem extends Card {
    protected _status: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
        super('card', container, events, actions);
        this._status = ensureElement<HTMLElement>(`.card__status`, container);
    }
}

export { Card }