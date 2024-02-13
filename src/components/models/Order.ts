import { ILot, IOrder, IPaymentType } from "../../types";
import { Model } from "./Model";

/**
 * Класс модели заказа
 */
class Order extends Model<IOrder> {
    payment: IPaymentType;
    address: string;
    email: string;
    phone: string;
}

export { Order }