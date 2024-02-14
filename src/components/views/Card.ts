import { ILot, ILotCategory } from "../../types";
import { ensureElement, formatNumber, formatSinaps } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
	category: string;
	title: string;
	image: string;
	price: number;
	description: string;
	button?: string;
}

/**
 * View-класс карточки
 */
class Card extends Component<ICard> {
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

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number){
        this.setText(this._price, formatSinaps(value));
    }

    set button(value: string){
        this.setText(this._button, value);
    }
}

interface IBasketCard {
    index: number,
    title: string,
    price: number,
    delete:() => void;
}

/**
 * View-класс карточки в корзине
 */
class BasketItem extends Component<IBasketCard> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteBtn: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._deleteBtn = container.querySelector(`.card__button`);
        
		this._deleteBtn.addEventListener('click', (event: MouseEvent) => {
			// event.preventDefault();
			actions.onClick?.(event);
			return false;
		});
	}

    set index(value: number){
        this.setText(this._index, value + 1);
    }

    set title(value: string) {
		this.setText(this._title, value);
	}

    set price(value: number) {
		this.setText(
			this._price,
			formatSinaps(value)
		);
	}
}

export { BasketItem, Card}