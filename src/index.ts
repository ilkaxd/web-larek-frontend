
import './scss/styles.scss';

// Импорты компонентов и типов

import { cloneTemplate, createElement, ensureElement} from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { Modal } from './components/views/Modal';
import { Order } from './components/Order';
import { Basket } from './components/views/Basket';
import { CatalogItem } from './components/Card';
import { Success } from './components/views/Success';
import { IOrderForm } from './types';

// Создаём объект events и объект API
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Мониторим события (для отладки)
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Бизнес логика, поймали событие - сделали что нужно 
// Изменились элементы каталога - нужно перерисовать галерею
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
        })
    });

    // page.c
});

// Отправлена форма заказа - сперва отправляем post запрос на сервер
// затем обновляем 
events.on('order:submit', () => {
    api.postOrderLots(appData.order)
    .then((result) => {
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
                appData.clearBasket();
                events.emit('larek:changed');
            }
        });

        modal.render({
            content: success.render({})
        });
    })
    .catch(err => {
        console.error(err);
    });

})

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    order.valid = !email && !phone;
    order.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderFiled(data.field, data.value);
});

// Открыли форму заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            phone: '',
            email: '',
            valid: '',
            errors: []
        })
    })
});

// Открыли корзину

// Изменения в лоте, но лучше все пересчитать

// Открыть лот

// Изменили открытый лот

// Блокируем прокрутку страницы при открытии модалки
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модалки
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getLotList()
.then(appData.setCatalog.bind(appData))
.catch(err => {
    console.log(err);
});