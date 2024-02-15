export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

/**
 * Поддерживаемые методы у API
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Базовый класс API
 */
export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	/**
	 * Базовый конструктор
     * @constructor
	 * @param { string } baseUrl используемый домен сервера
	 * @param { RequestInit } options параметры запроса
	 */
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	/**
	 * Обрабатываем ответ сервера
	 * @param { Response } response ответ сервера
	 * @returns { Promise<object> } json или сообщение об ошибке
	 */
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	/**
	 * Реализация метода GET
	 * @param { string } uri целевой endpoint
	 * @returns { Promise<object> } обработанный ответ сервера
	 */
	get(uri: string): Promise<object> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	/**
	 * Реализация метода POST
	 * @param { string } uri целевой endpoint
	 * @param { object } data объект, передаваемый в теле запроса
	 * @param { ApiPostMethods } method используемый метод
	 * @returns { Promise<object> } обработанный ответ сервера
	 */
	post(
		uri: string,
		data: object,
		method: ApiPostMethods = 'POST'
	): Promise<object> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
