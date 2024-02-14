import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../base/events";


/**
 * View-класс модального окна
 */
class Modal extends Component<IModalData>{
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    /**
     * Базовый конструктор
     * @constructor
     * @param { HTMLElement } container - родительский контейнер для элементы 
     * @param { IEvents } events - брокер событий
     */
    constructor(container: HTMLElement, events: IEvents){
        super(container, events);

        // Используемые элементы на странице
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Подписываемся на клики для закрытия
        [this._closeButton, this.container].forEach(element => {
            element.addEventListener('click', () => {
                this.close();
                this.events.emit('modal:close');
            })
        });
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement){
        this._content.replaceChildren(value);
    }

    /**
     * Показываем модальное окно
     */
    open(): void {
        this.toggleClass(this.container, 'modal_active', true);
        this.events.emit('modal:open');
    }

    /**
     * Закрываем модальное окно
     */
    close(): void{
        this.toggleClass(this.container, 'modal_active', false);
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement{
        super.render(data);
        this.open();
        return this.container;
    }
}

export { Modal }