import { cloneTemplate, ensureElement } from "../../utils/utils";
import { AppState } from "../models/AppData";
import { Card } from "../views/Card";
import { LarekAPI } from "./LarekAPI";
import { Modal } from "../views/Modal";
import { Page } from "../views/Page";
import { EventEmitter } from "./events";
import { CatalogChangeEvent } from "../../types";
import { LotItem } from "../models/LotItem";

class LarekPresenter extends EventEmitter{
    // Объекты отображения
    private _page: Page;
    private _modal: Modal;

    // Объекты данных
    private _appData: AppState;


    constructor(protected api: LarekAPI){
        super();

        const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
        const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

        // Инициируем бизнес-логику

        // Изменилось содержание каталога - перерисовываем форму
        this.on<CatalogChangeEvent>('catalog:changed', () => {
            this._page.galery = this.appData.catalog.map((item) => {
                const card = new Card('card', cloneTemplate(cardCatalogTemplate),
                this,
                { onClick: () => this.emit('preview:changed', item) });

                return card.render({
                    category: item.category,
                    title: item.title,
                    image: item.image,
                    price: item.price
                });
            });
        });

        // Кликнули по лоту, изменили видимость модального окна
        this.on('preview:changed', (item: LotItem) => {
            // Открываем
            if (item){
                api
                .getLotItem(item.id)
                .then((res) => {
                    item.id = res.id;
                    item.category = res.category;
                    item.title = res.title;
                    item.description = res.description;
                    item.image = res.image;
                    item.price = res.price;

                    // Привязываем события
                    const card = new Card('card', cloneTemplate(cardPreviewTemplate), this, {
                        onClick: () => {
                            // Проверяем находится ли объект в корзине
                        }
                    })
    
                    // const actionText = this.appData.  .isAvailable ? 'Купить' : 'Удалить';

                    this.modal.render({
                        content: card.render({
                            category: item.category,
                            title: item.title,
                            description: item.description,
                            image: item.image,
                            price: item.price,
                            // button: actionText,  
                        })
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            }
            // Закрываем
            else {
                this.modal.close();
            }
        });
    }

    set page(value: Page){
        this._page = value;
    }

    set modal(value: Modal){
        this._modal = value;
    }

    get modal(){
        return this._modal;
    }

    set appData(value: AppState){
        this._appData = value;
    }

    get appData(){
        return this._appData;
    }

    /**
     * Изменились элементы каталога - нужно перерисовать галерею
    **/
    itemsChanged(){
        // page.catalog = appData.catalog.map(item => {
        //     const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
        //         onClick: () => events.emit('card:select', item)
        //     });
        //     return card.render({
        //         title: item.title,
        //         image: item.image,
        //         description: item.description,
        //     })
        // });
    }
}

export { LarekPresenter }