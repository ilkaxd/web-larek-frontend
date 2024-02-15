import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../base/events";

interface IFormState {
    valid: boolean;
    errors: string[];
}

/**
 * View-класс формы
 */
class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Используемые элементы на странице
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Прослушиваем события ввода в поле
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Прослушиваем событие нажатия кнопки закрытия формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string): void {
        const eventName = `${this.container.name}.${String(field)}:change`;
        this.events.emit(eventName, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}

export { Form }