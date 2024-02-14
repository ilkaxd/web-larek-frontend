import { IPage } from "../../types";
import { ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../base/events";


/**
 * View-класс основной страницы
 */
class Page extends Component<IPage> {
    private _counter: HTMLElement;
    private _gallery: HTMLElement;
    private _wrapper: HTMLElement;
    private _basket: HTMLElement;

    /**
     * Базовый конструктор
     * @constructor
     * @param { HTMLElement } container родительский контейнер для элементы 
     * @param { IEvents } events брокер событий
     */
    constructor(container: HTMLElement, events: IEvents){
        super(container, events);

        // Используемые элементы на странице
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Прослушиваем событие открытия корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    /**
     * Устанавливаем количество лотов в корзине
     */
    set counter(value: number) {
        this.setText(this._counter, formatNumber(value));
    }

    /**
     * Обновляем список карточек
     */
    set galery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    /**
     * Обрабатываем блокировку страницы 
     */
    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value)
    }
}

export { Page }