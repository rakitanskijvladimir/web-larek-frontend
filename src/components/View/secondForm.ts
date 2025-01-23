import { IEvents } from '../base/events';

export interface IorderSecondForm {
    secondForm: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    checkErrors: HTMLElement;
    render(): HTMLElement;
}

export class OrderSecondForm implements IorderSecondForm {
    secondForm: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    checkErrors: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.secondForm = template.content
            .querySelector('.form')
            .cloneNode(true) as HTMLFormElement;
        this.inputAll = Array.from(
            this.secondForm.querySelectorAll('.form__input')
        );
        this.buttonSubmit = this.secondForm.querySelector('.button');
        this.checkErrors = this.secondForm.querySelector('.form__errors');

        this.inputAll.forEach((item) => {
            item.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const field = target.name;
                const value = target.value;
                this.events.emit(`contacts:changeInput`, { field, value });
            });
        });

        this.secondForm.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('success:open');
        });
    }

    set valid(value: boolean) {
        this.buttonSubmit.disabled = !value;
    }

    render() {
        return this.secondForm;
    }
}
