import { createElement, ensureElement, formatNumber, formatSinaps } from "../../utils/utils";
import { Component } from "./Component";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

/**
 * View-класс корзины
 */
class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    /**
     * Базовый конструктор
     * @constructor
     * @param { HTMLElement } container родительский контейнер для элементы 
     * @param { IEvents } events брокер событий
     */
    constructor(container: HTMLElement, events: EventEmitter){
        super(container, events);

        // Используемые элементы на странице
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__action');

        // Прослушиваем событие запуска формы оформления заказа
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order_payment:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]){
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number){
        this.setText(this._total, formatSinaps(total));
    }
}

export { Basket }