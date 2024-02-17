import { Events, IFormErrors, ILot, IOrder, IPaymentType } from '../../types';
import { Model } from '../base/Model';

/**
 * Класс модели заказа
 */
class Order extends Model<IOrder> {
	protected _payment: IPaymentType = 'card';
	protected _address: string = '';
	protected _email: string = '';
	protected _phone: string = '';
	protected _items: ILot[] = [];
	protected _formErrors: IFormErrors = {};

	/**
	 * Проверка полей формы
	 * TODO: возможно стоит разделить на валидацию первой формы и на второй
	 */
	validateOrder(): void {
		this.validatePayment();
		this.validateAddress();
		this.validateEmail();
		this.validatePhone();

		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	/**
	 * Обнуляем поля заказа
	 */
	clearOrder(): void {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
	}

	set payment(value: IPaymentType) {
		this._payment = value;
		this.validateOrder();
	}

	get payment() {
		return this._payment;
	}

	/**
	 * Проверяем способ оплаты
	 */
	validatePayment(): void {
		if (!this._payment) {
			this._formErrors.payment = 'Необходимо выбрать способ оплаты';
		} else {
			this._formErrors.payment = '';
		}
	}

	set address(value: string) {
		this._address = value;
		this.validateOrder();
	}

	get address() {
		return this._address;
	}

	/**
	 * Проверяем адрес доставки
	 */
	validateAddress(): void {
		if (!this._address) {
			this._formErrors.address = 'Необходимо ввести адрес доставки';
		} else {
			this._formErrors.address = '';
		}
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	set email(value: string) {
		this._email = value.toLowerCase();
		this.validateOrder();
	}

	get email() {
		return this._email;
	}

	/**
	 * Проверяем почту
	 * TODO: тут желательно сделать нормальную проверку на почту, например через такое /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	 */
	validateEmail(): void {
		if (!this._email) {
			this._formErrors.email = 'Необходимо ввести почту';
		} else {
			this._formErrors.email = '';
		}
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	set phone(value: string) {
		this._phone = value;
		this.validateOrder();
	}

	get phone() {
		return this._phone;
	}

	/**
	 * Проверяем телефон
	 * TODO: тут желательно сделать нормальную проверку на телефон, например через такое /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
	 */
	validatePhone(): void {
		if (!this._phone) {
			this._formErrors.phone = 'Необходимо ввести телефон';
		} else {
			this._formErrors.phone = '';
		}
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	set items(value: ILot[]) {
		this._items = value;
	}

	get items() {
		return this._items;
	}

	/**
	 * Завершаем заказ
	 */
	postOrder(): void {
		this.clearOrder();
		this.emitChanges(Events.PLACE_ORDER);
	}
}

export { Order };
