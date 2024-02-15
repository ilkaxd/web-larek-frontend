import { IOrderDeliveryForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

/**
 * View-класс формы выбора способа оплаты и адреса доставки
 */
class DeliveryForm extends Form<IOrderDeliveryForm> {
    protected _paymentContainer: HTMLDivElement;
    protected _paymentButtons: HTMLButtonElement[];
    
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      
      // Используемые элементы на странице
      this._paymentContainer = ensureElement<HTMLDivElement>('.order__buttons', this.container);
      this._paymentButtons = Array.from(this._paymentContainer.querySelectorAll('.button_alt'));
    
      // Выбираем кнопку с типом оплаты
      this._paymentContainer.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        this.setClassPaymentMethod(target.name);
        events.emit('payment:changed', {target: target.name})
      })
    }
  
    setClassPaymentMethod(className: string): void {
      this._paymentButtons.forEach(btn => {
        if (btn.name === className) {
          this.toggleClass(btn, 'button_alt-active', true);
        } else {
          this.toggleClass(btn, 'button_alt-active', false);
        }
      })
    }
  
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export { DeliveryForm }