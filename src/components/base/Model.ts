import { IEvents } from "./events";

export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}

/*Базовый класс модели
*/
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }
}