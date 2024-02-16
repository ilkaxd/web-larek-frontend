import { ILot, ILotCategory } from '../../types';
import { Model } from '../base/Model';

/**
 * Класс модели лота
 */
class LotItem extends Model<ILot> {
	id: string;
	title: string;
	description: string;
	image: string;
	category: ILotCategory;
	price: number;
	isOrdered: boolean;

	/**
	 * Добавляем лот в корзину
	 */
	placeInBasket(): void {
		this.isOrdered = true;
		this.emitChanges('lot:changed', { isOrdered: this.isOrdered });
	}

	/**
	 * Удаляем лот из корзины
	 */
	removeFromBasket() {
		this.isOrdered = false;
		this.emitChanges('lot:changed', { isOrdered: this.isOrdered });
	}
}

export { LotItem };
