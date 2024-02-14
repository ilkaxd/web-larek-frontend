import { IFormErrors, ILot, IOrder, IOrderForm, IPaymentType } from "../../types";
import { Model } from "./Model";

/**
 * Класс модели заказа
 */
class Order extends Model<IOrder> {
    payment: IPaymentType = "";
    address: string = "";
    email: string = "";
    phone: string = "";
    items: ILot[] = [];
    formErrors: IFormErrors = {};

    /**
     * Проверка полей формы
     */
    validateOrder(): void {
        const errors: IFormErrors = {};
        // Простейшая проверка, введены ли значения
        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        
        if (!this.address) {
            errors.address = 'Необходимо ввести адрес доставки';
        }

        if (!this.email) {
            errors.email = 'Необходимо ввести e-mail';
        }

        if (!this.phone) {
            errors.phone = 'Необходимо ввести телефон';
        }

        this.formErrors = errors;
        this.emitChanges('formErrors:changed', this.formErrors);
    }

    /**
     * Обнуляем поля заказа
     */
    clearOrder(): void {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
    }

    /**
     * Завершаем заказ
     */
    postOrder(): void {
        this.clearOrder();
        this.emitChanges('order:post');
    }
}

export { Order }