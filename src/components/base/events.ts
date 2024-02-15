/**
 * Доступные типы для именования событий
 */
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	/**
	 * Базовый конструктор
	 * @constructor
	 */
	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	/**
	 * Устанавливаем обработчик на событие
	 * @param { EventName } eventName идентификатор события
	 * @param callback вызываемая функция
	 */
	on<T extends object>(
		eventName: EventName,
		callback: (event: T) => void
	): void {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	/**
	 * Снимаем обработчик с события
	 * @param { EventName } eventName идентификатор события
	 * @param { Subscriber } callback вызываемая функция
	 */
	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	/**
	 * Инициируем событие с данными
	 * @param { string } eventName идентификатор события
	 * @param { T } data данные, передаваемые в вызываемый метод
	 */
	emit<T extends object>(eventName: string, data?: T): void {
		this._events.forEach((subscribers, name) => {
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	/**
	 * Добавляем callback ко всем существующим событиям
	 * @param callback вызываемое событие
	 */
	onAll(callback: (event: EmitterEvent) => void): void {
		this.on('*', callback);
	}

	/**
	 * Сбросить все обработчики
	 */
	offAll(): void {
		this._events = new Map<string, Set<Subscriber>>();
	}

	/**
	 * Сделать коллбек триггер, генерирующий событие при вызове
	 */
	trigger<T extends object>(eventName: string, context?: Partial<T>) {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}
