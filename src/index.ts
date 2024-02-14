
import './scss/styles.scss';

// Импорты компонентов и типов

import { cloneTemplate, createElement, ensureElement} from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/base/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { BasketItem, Card } from './components/views/Card';
import { Success } from './components/views/Success';
import { CatalogChangeEvent, ILot, IOrderForm } from './types';
import { LarekPresenter } from './components/base/Presenter';
import { LotItem } from './components/models/LotItem';
import { AppState } from './components/models/AppState';

// Создаём объект events и объект API
const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Мониторим события (для отладки)
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Объект Model
const appData = new AppState({}, events);

// Глобальные View-контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
// const deliveryForm = 
// const contactsForm = 


// Бизнес-логика

// Обновили доступные лоты
events.on<CatalogChangeEvent>('catalog:changed', () => {
    // Отрисовываем каждую карточку
    page.galery = appData.catalog.map(item => {
        const card = new Card(
            'card',
            cloneTemplate(cardCatalogTemplate),
            events,
            { onClick: () => events.emit('card:open', item)}
        );
        return card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            price: item.price
        })
    });
});

// Открыли корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render({})
    })
});

// Открыли модалку карточки
events.on('card:open', (item: ILot) => {
    // актуализируем информацию по лоту
    api
    .getLotItem(item.id)
    .then(res => {
        item.id = res.id;
        item.description = res.description;
        item.image = res.image;
        item.title = res.title;
        item.category = res.category;
        item.price = res.price;
    })
    .catch(err => console.log(err));
    // Отображаем результат
    const card = new Card(
        'card',
        cloneTemplate(cardPreviewTemplate),
        events,
        {
            onClick: () => {
                if (appData.isLotInBasket(item)){
                    item.removeFromBasket();
                } else {
                    item.placeInBasket();
                }
                events.emit('card:open', item);
            }
        }
    );

    modal.render({
        content: card.render({
            category: item.category,
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            button: item.isOrdered ? "Удалить" : "Купить"
        })
    });
});

// Любые изменения в любом из лотов
events.on('lot:changed', () => {
    page.counter = appData.getBasketLength();

    basket.items = appData.basket.map((item, index) => {
        const card = new BasketItem(cloneTemplate(cardBasketTemplate), events, {
            onClick: (event) => {
                item.removeFromBasket();
            }
        });
        return card.render({
            index: index,
            title: item.title,
            price: item.price
        })
    });

    basket.total = appData.getTotalAmount();
});

// Открываем первую форму
events.on('order_payment:open', () => {
    // При открытии первой формы, очищаем всё
    appData.order.clearOrder();

    // modal.render({
    //     content: 
    // })
});

// Изменилось поле адреса
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.order.set(data.field, data.value);
});

// Блокируем прокрутку страницы при открытии модалки
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модалки
events.on('modal:close', () => {
    page.locked = false;
});

// Инициализируем первоначальную подгрузку лотов
api
.getLotList()
.then((res) => {
    appData.catalog = res;
})
.catch(err => {
    console.log(err);
});