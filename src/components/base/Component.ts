import { IEvents } from './events';

/**
 * Базовый класс View
 */
export abstract class Component<T> {
	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	protected constructor(
		protected readonly container: HTMLElement,
		protected events: IEvents
	) {}

	/**
	 * Переключить класс
	 * @param { HTMLElement } element целевой объект
	 * @param { string } className имя класса
	 * @param { string } force true - работает как add, false - работает как remove
	 */
	toggleClass(element: HTMLElement, className: string, force?: boolean): void {
		element.classList.toggle(className, force);
	}

	/**
	 * Установить текстовое содержимое
	 * @param { HTMLElement } element целевой объект
	 * @param { unknown } value заполняемый текст
	 */
	protected setText(element: HTMLElement, value: unknown): void {
		if (element) {
			element.textContent = String(value);
		}
	}

	/**
	 * Сменить статус блокировки
	 * @param { HTMLElement } element целевой объект
	 * @param { boolean } state целевое состояние блокировки
	 */
	setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	/**
	 * Скрыть элемент
	 * @param { HTMLElement } element скрываемый элемент
	 */
	protected setHidden(element: HTMLElement): void {
		element.style.display = 'none';
	}

	/**
	 * Показать элемент
	 * @param { HTMLElement } element отображаемый элемент
	 */
	protected setVisible(element: HTMLElement): void {
		element.style.removeProperty('display');
	}

	/**
	 * Установить изображение с альтернативным текстом
	 * @param { HTMLElement } element объект изображения
	 * @param { string } src путь до картинки
	 * @param { string } alt альтернативный текст для картинки
	 */
	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt?: string
	): void {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	/**
	 * Вернуть корневой DOM-элемент
	 * @param { Partial<T> } data используемые данные для заполнения макета
	 * @returns { HTMLElement } заполненный template
	 */
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
