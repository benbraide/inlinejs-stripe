import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripeField, IStripePaymentDetails } from "../types";

export class StripePaymentMenthodElement extends CustomElement implements IStripeField{
    @Property({ type: 'object', checkStoredObject: true })
    public value: stripe.elements.Element | string = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    public WaitReady(){
        return Promise.resolve();
    }

    public ToggleFocus(focused: boolean){}

    public Reset(){}

    public AddDetails(details: IStripePaymentDetails){
        this.value && (details.method = this.value);
    }
}

export function StripePaymentMenthodElementCompact(){
    RegisterCustomElement(StripePaymentMenthodElement, 'stripe-payment-method');
}
