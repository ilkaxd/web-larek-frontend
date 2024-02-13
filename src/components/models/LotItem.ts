import { ILot, ILotCategory } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "./Model";

/**
 * Класс модели карточки
 */
class LotItem extends Model<ILot> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ILotCategory;
    price: number;
    isOrdered: boolean;
}

export { LotItem }