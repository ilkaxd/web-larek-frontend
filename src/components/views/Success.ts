import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../base/events";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

class Success extends Component<ISuccess> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions, events: IEvents){
        super(container, events);

        this._close = ensureElement<HTMLElement>('.order-success', this.container);

        if (actions?.onClick){
            this._close.addEventListener('click', actions.onClick);
        }
    }
}

export { Success }