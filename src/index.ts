
import './scss/styles.scss';

// Импорты компонентов и типов

import { cloneTemplate, createElement, ensureElement} from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/base/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
// import { AppState, CatalogChangeEvent } from './components/models/AppData';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Order } from './components/views/Order';
import { Basket } from './components/views/Basket';
import { CatalogItem } from './components/views/Card';
import { Success } from './components/views/Success';
import { IOrderForm } from './types';
import { LarekPresenter } from './components/base/Presenter';
import { LotItem } from './components/models/LotItem';
import { AppState } from './components/models/AppData';

// Создаём объект events и объект API
const api = new LarekAPI(CDN_URL, API_URL);



// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// // Объект Presenter
const presenter = new LarekPresenter(api);

// Мониторим события (для отладки)
presenter.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Объект Model
const appData = new AppState({}, presenter);

// Глобальные View-контейнеры
const page = new Page(document.body, presenter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), presenter);

// Обратные привязки
presenter.page = page;
presenter.modal = modal;
presenter.appData = appData;

// // Переиспользуемые части интерфейса
// const basket = new Basket(cloneTemplate(basketTemplate), events);
// const order = new Order(cloneTemplate(orderTemplate), events);

//Подвязываем события
// events.on<CatalogChangeEvent>('items:changed', () => {
//     page.catalog = appData.catalog.map(item => {
//         const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
//             onClick: () => events.emit('card:select', item)
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             description: item.description,
//         })
//     });

//     // page.c
// });

// // Отправлена форма заказа - сперва отправляем post запрос на сервер
// // затем обновляем 
// events.on('order:submit', () => {
//     api.postOrderLots(appData.order)
//     .then((result) => {
//         const success = new Success(cloneTemplate(successTemplate), {
//             onClick: () => {
//                 modal.close();
//                 appData.clearBasket();
//                 events.emit('larek:changed');
//             }
//         });

//         modal.render({
//             content: success.render({})
//         });
//     })
//     .catch(err => {
//         console.error(err);
//     });

// })

// // Изменилось состояние валидации формы
// events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
//     const { email, phone } = errors;
//     order.valid = !email && !phone;
//     order.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
// })

// // Изменилось одно из полей
// events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
//     appData.setOrderFiled(data.field, data.value);
// });

// // Открыли форму заказа
// events.on('order:open', () => {
//     modal.render({
//         content: order.render({
//             phone: '',
//             email: '',
//             valid: '',
//             errors: []
//         })
//     })
// });

// // Открыли корзину

// // Изменения в лоте, но лучше все пересчитать

// // Открыть лот

// // Изменили открытый лот

// // Блокируем прокрутку страницы при открытии модалки
// events.on('modal:open', () => {
//     page.locked = true;
// });

// // Разблокируем прокрутку страницы при закрытии модалки
// events.on('modal:close', () => {
//     page.locked = false;
// });

// Инициализируем первоначальную подгрузку лотов
// api
// .getLotList()
// .then((res) => {
//     appData.catalog = res;
// })
// .catch(err => {
//     console.log(err);
// });

api
.getLotList()
.then(res =>{
    const lot = new LotItem(res[0], presenter);
    console.log(lot);
});




// console.log(lot)