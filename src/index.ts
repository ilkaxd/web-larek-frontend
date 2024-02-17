// Реализация Presenter

import './scss/styles.scss';

// Импорты компонентов и типов
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Card } from './components/views/Card';
import { Success } from './components/views/Success';
import { CatalogChangeEvent, Events, IFormErrors, ILot, IPaymentType } from './types';
import { AppState } from './components/models/AppState';
import { DeliveryForm } from './components/views/DeliveryForm';
import { ContactsForm } from './components/views/ContactsForm';
import { BasketItem } from './components/views/BasketItem';

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

// Объект Model
const appData = new AppState({}, events);

// Глобальные View-контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new DeliveryForm(cloneTemplate(deliveryTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Бизнес-логика

// Обновили доступные лоты
events.on<CatalogChangeEvent>(Events.LOAD_LOTS, () => {
	// Отрисовываем каждую карточку
	page.galery = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit(Events.OPEN_LOT, item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Открыли корзину
events.on(Events.OPEN_BASKET, () => {
	modal.render({
		content: basket.render({
			valid: appData.getBasketLength() > 0
		}),
	});
});

// Открыли модалку карточки
events.on(Events.OPEN_LOT, (item: ILot) => {
	// Отображаем результат
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			if (appData.isLotInBasket(item)) {
				item.removeFromBasket();
			} else {
				item.placeInBasket();
			}
			events.emit(Events.OPEN_LOT, item);
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.isOrdered ? 'Удалить' : 'Купить',
		}),
	});
});

// Любые изменения в любом из лотов
events.on(Events.CHANGE_LOT_IN_BASKET, () => {
	page.counter = appData.getBasketLength();

	basket.items = appData.basket.map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), events, {
			onClick: (event) => {
				item.removeFromBasket();  // TODO: может стоит вызывать event, а не метод
				events.emit(Events.OPEN_BASKET);
			},
		});
		return card.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getTotalAmount();
});

// Открываем первую форму
events.on(Events.OPEN_FIRST_ORDER_PART, () => {
	const order = appData.initOrder();
	modal.render({
		content: deliveryForm.render({
			payment: order.payment,
			address: order.address,
			valid: false,
			errors: [],
		}),
	});
});

// Изменили способ оплаты
events.on(Events.SELECT_PAYMENT, (data: { target: string }) => {
	appData.order.payment = data.target as IPaymentType;
});

// Изменился адрес доставки
events.on(Events.INPUT_ORDER_ADDRESS, (data: { value: string }) => {
	appData.order.address = data.value;
});

// Изменилась почта
events.on(Events.INPUT_ORDER_EMAIL, (data: { value: string }) => {
	appData.order.email = data.value;
});

// Изменился телефон
events.on(Events.INPUT_ORDER_PHONE, (data: { value: string }) => {
	appData.order.phone = data.value;
});

// Изменилось состояние валидации формы доставки
events.on(Events.VALIDATE_ORDER, (errors: Partial<IFormErrors>) => {
	// TODO: Лучше разнести
	const { payment, address, email, phone } = errors;
	deliveryForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Заполнили первую форму оплаты
events.on(Events.FINISH_FIRST_ORDER_PART, () => {
	events.emit(Events.OPEN_SECOND_ORDER_PART);
});

// Открываем вторую форму
events.on(Events.OPEN_SECOND_ORDER_PART, () => {
	const order = appData.order;
	modal.render({
		content: contactsForm.render({
			email: order.email,
			phone: order.phone,
			valid: false,
			errors: [],
		}),
	});
});

events.on(Events.FINISH_SECOND_ORDER_PART, () => {
	const order = appData.order;

	api
		.postOrderLots(
			// TODO: Лучше переделать
			{
				payment: order.payment,
				address: order.address,
				email: order.email,
				phone: order.phone,

				total: appData.getTotalAmount(),
				items: appData.getBasketIds(),
			}
		)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			// Очищаем корзину сразу
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

// TODO: лучше взять такой подход из "оно тебе надо" для отслеживания изменения полей
// events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
//     appData.order.set(data.field, data.value);
// });

// Блокируем прокрутку страницы при открытии модалки
events.on(Events.OPEN_MODAL, () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модалки
events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});

// Инициализируем первоначальную подгрузку лотов
api
	.getLotList()
	.then((res) => {
		appData.catalog = res;
	})
	.catch(console.error);
